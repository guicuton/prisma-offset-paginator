"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offsetPaginator = void 0;
const ParserAround_1 = require("./ParserAround");
async function offsetPaginator(params) {
    var _a;
    const model = params.instance[params.entity];
    const offset = Number((_a = params.offset) !== null && _a !== void 0 ? _a : 0);
    const [count, data] = await params.instance.$transaction([
        model.count({
            where: params.where,
        }),
        model.findMany(Object.assign(Object.assign({ take: params.per_page, skip: offset, where: params.where, orderBy: {
                [params.orderBy]: params.orderDirection,
            } }, (params.select && { select: params.select })), (params.include && { include: params.include }))),
    ]);
    if (data.length === 0)
        return;
    const totalOfPages = Math.ceil(count / params.per_page);
    let around = [];
    let first;
    let last;
    let previous;
    let next;
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
    if (last.isCurrent === false) {
        next = around[currentPageIndex + 1];
    }
    if (around.length > params.bottom) {
        [first] = around;
        [last] = around.slice(-1);
        const slicerAround = (0, ParserAround_1.parserAround)(currentPageIndex, params.bottom);
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
exports.offsetPaginator = offsetPaginator;
//# sourceMappingURL=OffsetPaginator.js.map