import { parserAround } from './ParserAround';
import { IPaginationMeta, IPaginationParams, TPaginationData } from './interfaces';

export async function offsetPaginator(params: IPaginationParams): Promise<TPaginationData> {
	const model = params.instance[params.entity];
	const offset = Number(params.offset ?? 0);

	const [count, data]: [number, object[]] = await params.instance.$transaction([
		model.count({
			where: params.where,
		}),
		model.findMany({
			take: params.per_page,
			skip: offset,
			where: params.where,
			orderBy:
				typeof params.orderBy === 'string'
					? {
							[params.orderBy]: params.orderDirection,
					  }
					: params.orderBy,
			...(params.select && { select: params.select }),
			...(params.include && { include: params.include }),
		}),
	]);

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
