import * as React from 'react';
import { NumericInput } from './components/NumericInput';
import { Column } from "./Types";
import { debuglog, getComponentDisplayName, numberWithCommas } from './utils';

const linkStyle = { textDecoration: 'none' };
const disabledStyle = { ...linkStyle, color: 'silver', cursor: 'default' };

/** @internal */
interface InternalPagingState {
    /** 1-based index of current page */
    currentPage: number;
    pageSize: number;

    pageRows: any[];
}

export interface InternalPagingProps {
    /** 1-based index of current page */
    currentPage: number;
    pageSize: number;
    pageSizes?: ReadonlyArray<number>;

}
export interface PagingProps extends InternalPagingProps {
    totalRowCount: number;
    gotoPage(pagenum: number, pagesize?: number): void;
}

export interface InternalPagingGridProps<TColumn> extends PagingGridProps<TColumn> {
    rows: ReadonlyArray<any>;

}

export interface PagingGridProps<TColumn> {
    columns: ReadonlyArray<TColumn>;

    footerComponent?: React.ComponentType<React.HTMLProps<HTMLTableSectionElement>>;
    footerProps?: (props: any) => any;

}

const TableFooterComponent = ({ columnCount = 0, pagingProps = null as PagingProps }) => (
    <tfoot>
        <tr>
            <td colSpan={columnCount}>
                <Paging {...pagingProps} />
            </td>
        </tr>
    </tfoot>
);

export function withInternalPaging<TColumn extends Column, T extends InternalPagingGridProps<TColumn>>(WrappedComponent: React.ComponentType<T>): React.ComponentClass<T & { paging?: Partial<InternalPagingProps> }> {

    if (WrappedComponent.displayName && WrappedComponent.displayName.match(/^WithInternalSorting|WithSorting/)) {
        console.error('Warning: You are applying sorting after paging which will cause the sorting to only affect the current page. You should probably apply sorting first then paging');
    }

    return class extends React.Component<T & { paging?: Partial<InternalPagingProps> }, InternalPagingState> {

        static readonly displayName = `WithInternalPaging(${getComponentDisplayName(WrappedComponent)})`;
        //static defaultProps: Partial<T & { paging?: Partial<InternalPagingProps> }> = WrappedComponent.defaultProps as any;
        static defaultProps: Partial<T & { paging?: Partial<InternalPagingProps> }> = { ...WrappedComponent.defaultProps as any, footerComponent: TableFooterComponent };

        constructor(props: T & { paging: Partial<InternalPagingProps> }) {
            super(props);

            const currentPage = props.paging && props.paging.currentPage || 1;
            const pageSize = props.paging && props.paging.pageSize || 20;
            const skip = (currentPage - 1) * pageSize;

            this.state = { currentPage, pageSize, pageRows: props.rows.slice(skip, skip + pageSize) };

            this.gotoPage = this.gotoPage.bind(this);

            //this.renderFooter = this.renderFooter.bind(this);
            this.getFooterProps = this.getFooterProps.bind(this);

        }

        componentWillReceiveProps(nextProps: Readonly<T & { paging: Partial<InternalPagingProps> }>) {

            debuglog('Paging componentWillReceiveProps', nextProps);
            const currentPage = nextProps.paging && nextProps.paging.currentPage || 1;
            const pageSize = nextProps.paging && nextProps.paging.pageSize || this.state.pageSize;
            const skip = (currentPage - 1) * pageSize;

            if (nextProps.paging && nextProps.paging.currentPage && (nextProps.paging.currentPage !== this.state.currentPage)) {

                debuglog('Paging setting state currentPage to ' + nextProps.paging.currentPage);

                this.setState({ currentPage: nextProps.paging.currentPage, pageRows: nextProps.rows.slice(skip, skip + pageSize) });
            }
            if (nextProps.paging && nextProps.paging.pageSize && (nextProps.paging.pageSize !== this.state.pageSize)) {
                debuglog('Paging setting state pageSize to ' + nextProps.paging.pageSize);
                this.setState({ pageSize: nextProps.paging.pageSize, pageRows: nextProps.rows.slice(skip, skip + pageSize) });
            }
            if (nextProps.rows && (nextProps.rows !== this.props.rows)) {
                debuglog('Paging setting state because rows changed, resetting currentPage to 1');
                const skip2 = (currentPage - 1) * pageSize;
                this.setState({ pageRows: nextProps.rows.slice(skip2, skip2 + pageSize), currentPage: 1 });
            }

        }

        private gotoPage(currentPage: number, pageSize?: number) {

            const actualPageSize = pageSize || this.state.pageSize;
            const skip = (currentPage - 1) * actualPageSize;
            const pageRows = this.props.rows.slice(skip, skip + actualPageSize);

            if (pageSize) {
                this.setState({
                    currentPage,
                    pageSize,
                    pageRows
                });
            } else {
                this.setState({
                    currentPage,
                    pageRows
                });
            }

        }

        getFooterProps() {
            const { paging, rows } = this.props;
            const { currentPage, pageSize } = this.state;

            const pageSizes = paging && paging.pageSizes;
            const columnCount = this.props.columns.filter((m) => m.visible !== false).length;
            const pagingProps = { currentPage, pageSize, pageSizes, gotoPage: this.gotoPage, totalRowCount: rows.length };

            return { columnCount, pagingProps };
        }
        // renderFooter() {
        //     const { paging, rows } = this.props;
        //     const { currentPage, pageSize } = this.state;

        //     const pageSizes = paging && paging.pageSizes;
        //     const columnCount = this.props.columns.filter((m) => m.visible !== false).length;
        //     const pagingProps = { currentPage, pageSize, pageSizes, gotoPage: this.gotoPage, totalRowCount: rows.length };

        //     return <TableFooterComponent columnCount={columnCount} pagingProps={pagingProps} />;
        // }
        render() {

            const { paging, rows, footerComponent, ...extra } = this.props as InternalPagingGridProps<TColumn> & { paging: Partial<InternalPagingProps> };
            const { pageRows } = this.state;

            return <WrappedComponent rows={pageRows} {...extra as any} footerComponent={footerComponent} footerProps={this.getFooterProps} />;
        }
    };
}

export function withPaging<TColumn extends Column, T extends PagingGridProps<TColumn>>(WrappedComponent: React.ComponentType<T>): React.ComponentClass<T & { paging: PagingProps }> {

    return class extends React.Component<T & { paging: PagingProps }, never> {

        static readonly displayName = `WithPaging(${getComponentDisplayName(WrappedComponent)})`;
        static defaultProps: Partial<T & { paging: PagingProps }> = { ...WrappedComponent.defaultProps as any, footerComponent: TableFooterComponent };

        constructor(props: T & { paging: PagingProps }) {
            super(props);

            this.getFooterProps = this.getFooterProps.bind(this);

        }

        // renderFooter() {

        //     const { paging, columns, footerComponent } = this.props;

        //     const columnCount = columns.filter((m) => m.visible !== false).length;

        //     const Footer: any = footerComponent ? footerComponent : TableFooterComponent;

        //     return <Footer columnCount={columnCount} pagingProps={paging} />;
        // }

        getFooterProps() {
            const { paging, columns, footerComponent } = this.props;
            //const { currentPage, pageSize } = this.state;

            const pageSizes = paging && paging.pageSizes;
            const columnCount = this.props.columns.filter((m) => m.visible !== false).length;
            //const pagingProps = { currentPage, pageSize, pageSizes, gotoPage: this.gotoPage, totalRowCount: rows.length };

            return { columnCount, pagingProps: paging };
        }
        render() {

            const { paging, footerComponent, ...extra } = this.props as PagingGridProps<TColumn> & { paging: PagingProps };

            return <WrappedComponent {...extra as any} footerComponent={footerComponent} footerProps={this.getFooterProps} />;

        }
    };

}

export class Paging extends React.PureComponent<PagingProps, never> {

    constructor(props: PagingProps) {
        super(props);

        this.gotoPage = this.gotoPage.bind(this);
    }

    gotoPage(page: number) {
        if (page >= 1 && page <= this.pageCount && page !== this.props.currentPage) {
            this.props.gotoPage(page);
        }
    }

    get pageCount() {
        const pageSize = this.props.pageSize || 20;

        return Math.ceil(this.props.totalRowCount / pageSize);
    }

    render() {

        const props = this.props;

        let pageSizes = props.pageSizes ? [...props.pageSizes] : [10, 20, 50, 100, 500];
        const pageSize = props.pageSize || 20;

        if (pageSizes.indexOf(pageSize) === -1) {
            pageSizes = [...pageSizes, pageSize];
            pageSizes.sort((a, b) => b - a);
        }
        const pageCount = this.pageCount;

        const currentPage = props.currentPage;

        const backStyle = currentPage === 1 ? disabledStyle : linkStyle;
        const forwardStyle = currentPage === pageCount ? disabledStyle : linkStyle;

        if (typeof (props.totalRowCount) === 'undefined') {
            return null;
        }

        const rowCount = numberWithCommas(props.totalRowCount) + ' Records';
        /* tslint:disable:jsx-no-lambda */
        return (
            <table style={{ width: '100%' }} className="form-inline">
                <tbody>
                    <tr>
                        <td style={{ width: '33%', fontWeight: 'bold' }}>{rowCount}</td>
                        <td style={{ width: '34%', textAlign: 'center' }}>
                            <a href="#" className="glyphicon glyphicon-fast-backward" style={backStyle} onClick={(e) => { e.preventDefault(); this.gotoPage(1); }} />
                            &nbsp;
                    <a href="#" className="glyphicon glyphicon-backward" style={backStyle} onClick={(e) => { e.preventDefault(); this.gotoPage(currentPage - 1); }} />
                            &nbsp;

                    <span>Page
                                    &nbsp;
                        <NumericInput className="form-control input-sm" style={{ width: 60 }} initialValue={currentPage} onValueChange={this.gotoPage} />
                                &nbsp;
                        of {numberWithCommas(pageCount)}</span>
                            &nbsp;

                    <a href="#" className="glyphicon glyphicon-forward" style={forwardStyle} onClick={(e) => { e.preventDefault(); this.gotoPage(currentPage + 1); }} />
                            &nbsp;
                    <a href="#" className="glyphicon glyphicon-fast-forward" style={forwardStyle} onClick={(e) => { e.preventDefault(); this.gotoPage(pageCount); }} />

                        </td>
                        <td style={{ width: '33%', textAlign: 'right' }}>Show:&nbsp;
                       <select className="form-control input-sm" style={{ width: 80 }} value={pageSize} onChange={(e) => props.gotoPage(1, parseInt(e.currentTarget.value, 10))}>
                                {pageSizes.map((m) => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
        );

    }
}
