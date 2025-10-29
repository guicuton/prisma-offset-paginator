export interface IPaginationParams {
    instance: any;
    entity: string;
    per_page: number;
    bottom: number;
    offset?: number;
    orderBy: string | object;
    orderDirection: 'asc' | 'desc';
    where?: any;
    distinct?: string[];
    select?: any;
    include?: any;
}
export interface IPaginationMeta {
    page: number;
    offset: number;
    isCurrent: boolean;
}
export interface TPaginationData {
    data: any;
    meta: {
        count: number;
        totalOfPages: number;
        first: IPaginationMeta;
        last: IPaginationMeta;
        previous: IPaginationMeta;
        around: IPaginationMeta[];
        next: IPaginationMeta;
    };
}
