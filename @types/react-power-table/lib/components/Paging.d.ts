/// <reference types="react" />
import * as React from 'react';
import { ReactClass } from "../ReactPowerTable";
export interface InternalPagingProps {
    currentPage: number;
    pageSize: number;
    pageSizes?: number[];
}
export interface PagingProps extends InternalPagingProps {
    totalRowCount: number;
    gotoPage(pagenum: number, pagesize?: number): void;
}
export interface InternalPagingGridProps extends PagingGridProps {
    rows: any[];
}
export interface PagingGridProps {
    columns: any[];
    footerComponent?: ReactClass<never>;
}
export declare function withInternalPaging<T extends InternalPagingGridProps>(WrappedComponent: ReactClass<T>): React.ComponentClass<T & {
    paging?: Partial<InternalPagingProps>;
}>;
export declare function withPaging<T extends PagingGridProps>(WrappedComponent: ReactClass<T>): React.StatelessComponent<T & {
    paging: PagingProps;
}>;
export declare class Paging extends React.PureComponent<PagingProps, never> {
    gotoPage(page: number): void;
    readonly pageCount: number;
    render(): JSX.Element;
}
