import { parserAround } from './ParserAround';
import { IPaginationMeta, IPaginationParams, TPaginationData } from './interfaces';

export async function offsetPaginator(params: IPaginationParams): Promise<TPaginationData> {
	const offset = Number(params.offset ?? 0);

	const { count, data } = await params.instance.$transaction(async (repository) => {
		let count = 0;

		if (params.distinct) {
			const repositoryPromiseCount = await repository[params.entity].groupBy({
				by: params.distinct,
				where: params.where,
			});

			count = repositoryPromiseCount.length;
		} else {
			count = await repository[params.entity].count({ where: params.where });
		}

		const repositoryPromiseData = await repository[params.entity].findMany({
			take: params.per_page,
			skip: offset,
			where: params.where,
			orderBy:
				typeof params.orderBy === 'string'
					? {
							[params.orderBy]: params.orderDirection,
					  }
					: params.orderBy,
			...(params.distinct && { distinct: params.distinct }),
			...(params.select && { select: params.select }),
			...(params.include && { include: params.include }),
		});

		return {
			count,
			data: repositoryPromiseData,
		};
	});

	if (data.length === 0) return;

	const totalOfPages = Math.ceil(count / params.per_page);
	let around: IPaginationMeta[] = [];
	let first: IPaginationMeta;
	let last: IPaginationMeta;
	let previous: IPaginationMeta;
	let next: IPaginationMeta;

	for (let page = 1; page <= totalOfPages; page++) {
		around.push({
			page: page,
			offset: page === 1 ? 0 : params.per_page * (page - 1),
			isCurrent: offset / params.per_page + 1 === page ? true : false,
		});
	}

	const currentPageIndex = around.findIndex((item) => item.isCurrent);

	if (currentPageIndex > 0) {
		previous = around[currentPageIndex - 1];
	}

	if (around[around.length - 1].isCurrent === false) {
		next = around[currentPageIndex + 1];
	}

	if (around.length > params.bottom) {
		[first] = around;
		[last] = around.slice(-1);

		const slicerAround = parserAround(currentPageIndex, params.bottom);
		around = around.slice(...slicerAround);
	}

	return {
		data,
		meta: {
			totalOfPages,
			first,
			last,
			previous,
			around,
			next,
			count,
		},
	};
}
