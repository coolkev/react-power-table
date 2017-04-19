/// <reference types="react" />
import * as React from 'react';
import shallowEqual from 'fbjs/lib/shallowEqual';
import { FilterDefinition } from "./filters/DataTypes/DataType";
import { Column } from "./ReactPowerTable";
export declare type GlobalDate = Date;
export declare const GlobalDate: DateConstructor;
export declare function numberWithCommas(x: any): any;
export { shallowEqual };
export declare const debuglog: (message?: any, ...optionalParams: any[]) => void;
export interface ColumnCore<T> {
    key: string | number;
    field: (row: T) => any;
    fieldName: string;
}
export declare function getColumnCore<T>(col: Column<T> | string): ColumnCore<T>;
export declare function getExpression(func: Function): string;
export declare function getComponentDisplayName(WrappedComponent: React.ComponentClass<any> | React.StatelessComponent<any>): any;
export declare function makePure<T>(factory: React.StatelessComponent<T>): React.ComponentClass<T>;
export interface SortArrayOptions {
    descending?: boolean;
    caseInsensitive?: boolean;
}
export declare function sortArray<T, TKey>(array: T[], property: string, options?: SortArrayOptions): T[];
export declare function sortArray<T, TKey>(array: T[], expression: (item: T) => TKey, options?: SortArrayOptions): T[];
export declare function sortArray<T, TKey>(array: T[], expressionOrProperty: string | ((item: T) => TKey), options?: SortArrayOptions): T[];
export declare function serializeFilters(filters: AppliedFilter<any>[]): string;
export declare function deSerializeFilters(filters: string, availableFilters: KeyedMap<FilterDefinition<any>>): AppliedFilter<any>[];
export declare function groupBy<T, TKey>(items: T[], keyGen: (item: T, index?: number) => TKey): Group<T, TKey>[];
export interface Group<T, TKey> {
    key: TKey;
    items: T[];
}
export declare function createKeyedMap<T, TObj extends ObjectMap<T>>(map: TObj): KeyedMap<T> & TObj;
export declare function createKeyedMap<T, TObj extends Keyed<T>[]>(array: Keyed<T>[]): KeyedMap<T>;
export declare function createKeyedMap<T, TObj extends Keyed<T>[]>(array: T[], keyField: (row: T) => string): KeyedMap<T>;
export declare function createKeyedMap<T, TObj>(map: KeyedMap<T>): KeyedMap<T>;
export declare class Lazy<T> {
    private _value;
    private func;
    constructor(func: () => T);
    readonly value: T;
}
