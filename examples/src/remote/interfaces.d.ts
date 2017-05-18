//export { DataTypes, Column } from '../../../src/';

export interface QueryResult {
    results: any[];
    totalResultCount: number;
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