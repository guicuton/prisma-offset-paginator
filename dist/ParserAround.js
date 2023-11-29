"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parserAround = void 0;
function parserAround(currentPageIndex, bottom) {
    const start = currentPageIndex - Math.ceil(bottom / 2);
    const end = currentPageIndex + bottom - 1;
    return [start < 0 ? 0 : start, end];
}
exports.parserAround = parserAround;
//# sourceMappingURL=ParserAround.js.map