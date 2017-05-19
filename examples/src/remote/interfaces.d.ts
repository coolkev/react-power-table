// THIS CODE IS GENERATED AUTOMATICALLY
// ANY MANUAL EDITS TO THIS FILE MAY GET OVERWRITTEN

export interface QueryResult {
    results: any[];
    totalResults: number;
    offset: number;
}

export interface AppliedFilterDTO {
    columnKey: string;
    operationKey: string;
    value: string;
}
export interface SortSettings {
    column: string;
    descending?: boolean;
}
export interface QueryDTO {
    filters: AppliedFilterDTO[],
    sort: SortSettings;

    paging: {
        currentPage: number;
        pageSize: number;
        returnTotalCount?: boolean;
    }
}
export interface QueryOptions {
    columnKey: string;
    matchText: string;
    take: number;
    ids: number[];

}
export interface SelectOption<T extends string | number> {
    label: string;
    value: T;
}

export interface DisplayValue<T> {
    display: string;
    value: T;
}
