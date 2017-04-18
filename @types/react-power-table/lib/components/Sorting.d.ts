/// <reference types="react" />
import * as React from 'react';
import { Column, GridProps, ReactClass } from "../ReactPowerTable";
export interface SortSettings {
    Column: string;
    Ascending: boolean;
}
export interface SortableColumn<T> extends Column<T> {
    sortable?: boolean;
    sortExpression?: ((row: T) => any) | string;
    sortKey?: string;
    sortAscComponent?: JSX.Element;
    sortDescComponent?: JSX.Element;
}
export interface InternalSortingProps<T> {
    columns: (SortableColumn<T> | string)[];
    sorting: SortSettings & {
        onSortChanging?: (sort: SortSettings) => void;
        onSortChanged?: (sort: SortSettings) => void;
    };
}
export declare function withInternalSorting<TRow, T extends GridProps<TRow>>(WrappedComponent: ReactClass<T>): React.ComponentClass<T & InternalSortingProps<TRow>>;
export interface ExternalSortingProps {
    sorting: SortSettings & {
        changeSort: (sort: SortSettings) => void;
    };
}
export declare function withSorting<TRow, T extends GridProps<TRow>>(WrappedComponent: ReactClass<T>): React.ComponentClass<T & ExternalSortingProps>;
