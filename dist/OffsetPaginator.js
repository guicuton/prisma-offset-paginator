"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offsetPaginator = void 0;
const ParserAround_1 = require("./ParserAround");
async function offsetPaginator(params) {
    const model = params.instance[params.entity];
    const offset = Number(params.offset ?? 0);
    const [count, data] = await params.instance.$transaction([
        model.count({
            where: params.where,
        }),
        model.findMany({
            take: params.per_page,
            skip: offset,
            where: params.where,
            orderBy: {
                [params.orderBy]: params.orderDirection,
            },
            ...(params.select && { select: params.select }),
            ...(params.include && { include: params.include }),
        }),
    ]);
    if (data.length === 0)
        return;
    const totalOfPages = Math.ceil(count / params.per_page);
    let around = [];
    let first;
    let last;
    for (let page = 1; page <= totalOfPages; page++) {
        around.push({
            page: page,
            offset: page === 1 ? 0 : params.per_page * (page - 1),
            isCurrent: offset / params.per_page + 1 === page ? true : false,
        });
    }
    if (around.length > params.bottom) {
        const currentPageIndex = around.findIndex((item) => item.isCurrent);
        [first] = around;
        [last] = around.slice(-1);
        const slicerAround = (0, ParserAround_1.parserAround)(currentPageIndex, params.bottom);
        around = around.slice(...slicerAround);
    }
    return {
        meta: {
            totalOfPages,
            first,
            last,
            around,
            count,
        },
        data,
    };
}
exports.offsetPaginator = offsetPaginator;
//# sourceMappingURL=OffsetPaginator.js.map