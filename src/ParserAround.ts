export function parserAround(currentPageIndex: number, bottom: number): number[] {
	const start = currentPageIndex - Math.ceil(bottom / 2);
	const end = currentPageIndex + bottom - 1;

	return [start < 0 ? 0 : start, end];
}
