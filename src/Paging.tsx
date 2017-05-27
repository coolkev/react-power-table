import * as React from 'react';
import { NumericInput } from './components/NumericInput';
import { debuglog, getComponentDisplayName, numberWithCommas } from './utils';

const linkStyle = { textDecoration: 'none' };
const disabledStyle = { ...linkStyle, color: 'silver', cursor: 'default' };

/** @internal */
interface InternalPagingState {
    /** 1-based index of current page */
    currentPage: number;
    pageSize: number;
}

export interface InternalPagingProps {
    /** 1-based index of current page */
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

    tableFooterComponent?: React.ComponentClass<React.HTMLProps<HTMLTableSectionElement>> | React.StatelessComponent<React.HTMLProps<HTMLTableSectionElement>>;

    //footerComponent?: React.ComponentClass<any> | React.StatelessComponent<any>;
    // components?: {
    //     foot?: React.ComponentClass<never> | React.StatelessComponent<never>;
    // }
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

export function withInternalPaging<T extends InternalPagingGridProps>(WrappedComponent: React.ComponentClass<T>): React.ComponentClass<T & { paging?: Partial<InternalPagingProps> }>;
export function withInternalPaging<T extends InternalPagingGridProps>(WrappedComponent: React.StatelessComponent<T>): React.ComponentClass<T & { paging?: Partial<InternalPagingProps> }>;
export function withInternalPaging<T extends InternalPagingGridProps>(WrappedComponent: React.ComponentClass<InternalPagingGridProps> | React.StatelessComponent<InternalPagingGridProps>): React.ComponentClass<T & { paging?: Partial<InternalPagingProps> }> {

    if (WrappedComponent.displayName && WrappedComponent.displayName.match(/^WithInternalSorting|WithSorting/)) {
        console.error('Warning: You are applying sorting after paging which will cause the sorting to only affect the current page. You should probably apply sorting first then paging');
    }

    return class extends React.Component<T & { paging?: Partial<InternalPagingProps> }, InternalPagingState> {

        static readonly displayName = `WithInternalPaging(${getComponentDisplayName(WrappedComponent)})`;
        static defaultProps: Partial<T & { paging?: Partial<InternalPagingProps> }> = WrappedComponent.defaultProps as any;

        constructor(props: T & { paging: Partial<InternalPagingProps> }) {
            super(props);

            //log('withInternalPaging constructor', props);

            this.state = { currentPage: props.paging && props.paging.currentPage || 1, pageSize: props.paging && props.paging.pageSize || 20 };

            this.gotoPage = this.gotoPage.bind(this);

            this.renderFooter = this.renderFooter.bind(this);

        }

        componentWillReceiveProps(nextProps: Readonly<T & { paging: Partial<InternalPagingProps> }>) {

            debuglog('Paging componentWillReceiveProps', nextProps);

            if (nextProps.paging && nextProps.paging.currentPage && (nextProps.paging.currentPage !== this.state.currentPage)) {

                debuglog('Paging setting state currentPage to ' + nextProps.paging.currentPage);

                this.setState({ currentPage: nextProps.paging.currentPage });
            }
            if (nextProps.paging && nextProps.paging.pageSize && (nextProps.paging.pageSize !== this.state.pageSize)) {
                debuglog('Paging setting state pageSize to ' + nextProps.paging.pageSize);
                this.setState({ pageSize: nextProps.paging.pageSize });
            }

        }

        private gotoPage(currentPage: number, pageSize?: number) {

            if (pageSize) {
                this.setState({
                    currentPage,
                    pageSize,
                });
            } else {
                this.setState({
                    currentPage,
                });
            }

        }

        renderFooter() {
            const { paging, rows } = this.props;
            const { currentPage, pageSize } = this.state;

            const pageSizes = paging && paging.pageSizes;
            const columnCount = this.props.columns.filter((m) => m.visible !== false).length;
            const pagingProps = { currentPage, pageSize, pageSizes, gotoPage: this.gotoPage, totalRowCount: rows.length };

            return <TableFooterComponent columnCount={columnCount} pagingProps={pagingProps} />;
        }
        render() {

            const { paging, rows, ...extra } = this.props as InternalPagingGridProps & { paging: Partial<InternalPagingProps> };
            const { currentPage, pageSize } = this.state;
            const skip = (currentPage - 1) * pageSize;
            const pageRows = rows.slice(skip, skip + pageSize);

            debuglog('Paging render() currentPage is ' + currentPage);

            /*const components = { ...extra.components, foot: () => <tfoot>
                <tr>
                    <td colSpan={columnCount}>
                        <Paging {...pagingProps} />
                    </td>
                </tr>
            </tfoot> };*/

            //return <PagingComponent rows={pageRows} {...extra} paging={{ currentPage: currentPage, pageSize: pageSize, pageSizes: pageSizes, gotoPage: this.gotoPage, totalRowCount: rows.length }} />
            return <WrappedComponent rows={pageRows} {...extra} tableFooterComponent={this.renderFooter} />;
        }
    };
}

export function withPaging<T extends PagingGridProps>(WrappedComponent: React.ComponentClass<T>): React.ComponentClass<T & { paging: PagingProps }>;
export function withPaging<T extends PagingGridProps>(WrappedComponent: React.StatelessComponent<T>): React.ComponentClass<T & { paging: PagingProps }>;
export function withPaging<T extends PagingGridProps>(WrappedComponent: React.StatelessComponent<PagingGridProps> | React.ComponentClass<PagingGridProps>): React.ComponentClass<T & { paging: PagingProps }> {

    return class extends React.Component<T & { paging: PagingProps }, never> {

        static readonly displayName = `WithPaging(${getComponentDisplayName(WrappedComponent)})`;
        static defaultProps: Partial<T & { paging: PagingProps }> = WrappedComponent.defaultProps as any;

        constructor(props: T & { paging: PagingProps }) {
            super(props);

            this.renderFooter = this.renderFooter.bind(this);

        }

        renderFooter() {

            const pagingProps = this.props.paging;
            const columnCount = this.props.columns.filter((m) => m.visible !== false).length;

            return <TableFooterComponent columnCount={columnCount} pagingProps={pagingProps} />;
        }
        render() {

            const { paging, ...extra } = this.props as PagingGridProps & { paging: PagingProps };

            return <WrappedComponent {...extra} tableFooterComponent={this.renderFooter} />;

        }
    };

    // const WithPaging: React.StatelessComponent<T & { paging: PagingProps }> = props => {

    //     const { paging, ...extra } = props as PagingGridProps & { paging: PagingProps };
    //     const columnCount = props.columns.filter(m => m.visible !== false).length;
    //     //const pagingProps = { ...paging };

    //     return <WrappedComponent {...extra} tableFooterComponent={() => <TableFooterComponent columnCount={columnCount} pagingProps={paging} />} />;
    // };

    // WithPaging.displayName = `WithPaging(${getComponentDisplayName(WrappedComponent)})`;
    // WithPaging.defaultProps = WrappedComponent.defaultProps as any;

    // return WithPaging;

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

        let pageSizes = props.pageSizes || [10, 20, 50, 100, 500];
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
            <table width="100%" className="form-inline">
                <tbody>
                    <tr>
                        <td width="33%" style={{ fontWeight: 'bold' }}>{rowCount}</td>
                        <td width="34%" style={{ textAlign: 'center' }}>
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
                        <td width="33%" style={{ textAlign: 'right' }}>Show:&nbsp;
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
