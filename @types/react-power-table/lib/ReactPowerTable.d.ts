/// <reference types="react" />
import * as React from 'react';
export declare class ReactPowerTable extends React.Component<GridProps<T>, never> {
    private columns;
    private getRowProps;
    private getRowKey;
    static defaultProps: Partial<GridProps<T>>;
    constructor(props: GridProps<T>);
    componentWillReceiveProps(nextProps: GridProps<T>): void;
    shouldComponentUpdate(nextProps: GridProps<T>): boolean;
    transformProps(newProps: GridProps<T>, oldProps?: GridProps<T>): void;
    render(): JSX.Element;
}
export declare type ReactClass<T> = React.ComponentClass<T> | React.StatelessComponent<T>;
export declare type T = any;
export interface GridProps<T> {
    columns: (Column<T> | string)[];
    keyColumn: string | ((row: T) => (string | number));
    rows: T[];
    rowProps?: React.HTMLProps<HTMLTableRowElement> | ((row: T) => React.HTMLProps<HTMLTableRowElement>);
    loading?: boolean;
    tableProps?: React.HTMLAttributes<HTMLTableElement>;
    rowComponentProps?: (props: DataRowProps<T>) => DataRowProps<T>;
    footerComponent?: ReactClass<never>;
    defaultHeaderComponent?: ReactClass<HeaderComponentProps<T>>;
}
export interface TransformedColumn<T> extends BaseColumn<T> {
    field: ((row: T) => any);
    cellProps?: ((props: CellProps<T>) => React.HTMLProps<HTMLTableDataCellElement>);
    __transformed: boolean;
}
export interface HeaderComponentProps<T> {
    column: TransformedColumn<T>;
}
export interface DataRowProps<T> {
    columns: TransformedColumn<T>[];
    row: T;
    rowProps: React.HTMLProps<HTMLTableRowElement>;
}
export interface BaseColumn<T> {
    key: string | number;
    formatter: (value: any, row?: T) => string;
    headerText: string;
    cellComponent?: ReactClass<CellProps<T>>;
    cellComponentProps?: (props: CellProps<T>) => any;
    headerComponent?: ReactClass<HeaderComponentProps<T>>;
    headerComponentPropsProvider?: (props: HeaderComponentProps<T>) => HeaderComponentProps<T>;
    headerCellProps?: React.HTMLProps<HTMLTableHeaderCellElement>;
}
export interface Column<T> extends Partial<BaseColumn<T>> {
    field?: ((row: T) => any) | string;
    headerText?: string;
    cellProps?: React.HTMLProps<HTMLTableDataCellElement> | ((props: CellProps<T>) => React.HTMLProps<HTMLTableDataCellElement>);
    headerCssClass?: string;
    cssClass?: ((props: CellProps<T>) => string) | string;
    width?: number;
    maxWidth?: number;
    textAlign?: string;
}
export interface CellProps<T> {
    row: T;
    value: any;
    column: TransformedColumn<T>;
}
