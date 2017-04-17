import * as React from 'react';
import { NumericInput } from './NumericInput';
import { numberWithCommas, getComponentDisplayName, debuglog } from '../utils';


const linkStyle = { textDecoration: 'none' };
const disabledStyle = { ...linkStyle, color: 'silver', cursor: 'default' };

 
interface InternalPagingState {
    currentPage: number;
    pageSize: number;
}




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




export function withInternalPaging<T extends InternalPagingGridProps>(WrappedComponent: ReactClass<T>): React.ComponentClass<T & { paging?: Partial<InternalPagingProps> }> {

    if (WrappedComponent.displayName && WrappedComponent.displayName.match(/^WithInternalSorting|WithSorting/)) {
        console.error('Warning: You are applying sorting after paging which will cause the sorting to only affect the current page. You should probably apply sorting first then paging');
    }

    return class extends React.Component<T & { paging?: Partial<InternalPagingProps> }, InternalPagingState> {

        static readonly displayName = `WithInternalPaging(${getComponentDisplayName(WrappedComponent)})`;

        constructor(props: T & { paging: Partial<InternalPagingProps> }) {
            super(props);

            //log('withInternalPaging constructor', props);

            this.state = { currentPage: props.paging && props.paging.currentPage || 1, pageSize: props.paging && props.paging.pageSize || 20 };

            this.gotoPage = this.gotoPage.bind(this);


        }


        componentWillReceiveProps(nextProps: T & { paging: Partial<InternalPagingProps> }) {

            debuglog('Paging componentWillReceiveProps', nextProps);
            
            if (nextProps.paging && nextProps.paging.currentPage && (nextProps.paging.currentPage!=this.state.currentPage)) {
            
                debuglog('Paging setting state currentPage to ' + nextProps.paging.currentPage);
                
                this.setState({ currentPage: nextProps.paging.currentPage });
            }
            if (nextProps.paging && nextProps.paging.pageSize && (nextProps.paging.pageSize!= this.state.pageSize)) {
                debuglog('Paging setting state pageSize to ' + nextProps.paging.pageSize);
                this.setState({ pageSize: nextProps.paging.pageSize });
            }

        }


        private gotoPage(currentPage: number, pageSize?: number) {

            if (pageSize) {
                this.setState({
                    currentPage,
                    pageSize
                });
            }
            else {
                this.setState({
                    currentPage
                });
            }


        }

        render() {

            const { paging, rows, ...extra } = this.props as InternalPagingGridProps & { paging: Partial<InternalPagingProps> };
            const { currentPage, pageSize } = this.state;
            const skip = (currentPage - 1) * pageSize;
            const pageRows = rows.slice(skip, skip + pageSize);
            const pageSizes = paging && paging.pageSizes;
            const columnCount = this.props.columns.length;
            const pagingProps = { currentPage: currentPage, pageSize: pageSize, pageSizes: pageSizes, gotoPage: this.gotoPage, totalRowCount: rows.length };

            debuglog('Paging render() currentPage is '+ currentPage );
            
            //return <PagingComponent rows={pageRows} {...extra} paging={{ currentPage: currentPage, pageSize: pageSize, pageSizes: pageSizes, gotoPage: this.gotoPage, totalRowCount: rows.length }} />
            return <WrappedComponent rows={pageRows} {...extra} footerComponent={() => <tfoot>
                <tr>
                    <td colSpan={columnCount}>
                        <Paging {...pagingProps} />
                    </td>
                </tr>
            </tfoot>} />;
        }
    }
}



export function withPaging<T extends PagingGridProps>(WrappedComponent: ReactClass<T>): React.StatelessComponent<T & { paging: PagingProps }> {

    const WithPaging: React.StatelessComponent<T & { paging: PagingProps }> = props => {


        const { paging, ...extra } = props as PagingGridProps & { paging: PagingProps };
        const columnCount = props.columns.length;
        //const pagingProps = { ...paging };

        return <WrappedComponent {...extra} footerComponent={() => <tfoot>
            <tr>
                <td colSpan={columnCount}>
                    <Paging {...paging} />
                </td>
            </tr>
        </tfoot>} />;
    };

    WithPaging.displayName = `WithPaging(${getComponentDisplayName(WrappedComponent)})`;

    return WithPaging;

}



export class Paging extends React.PureComponent<PagingProps, never> {

    gotoPage(page: number) {
        if (page >= 1 && page <= this.pageCount && page != this.props.currentPage) {
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

        if (pageSizes.indexOf(pageSize) == -1) {
            pageSizes = [...pageSizes, pageSize];
            pageSizes.sort((a, b) => b - a);
        }
        const pageCount = this.pageCount;


        const currentPage = props.currentPage;

        const backStyle = currentPage == 1 ? disabledStyle : linkStyle;
        const forwardStyle = currentPage == pageCount ? disabledStyle : linkStyle;

        if (typeof (props.totalRowCount) === 'undefined') {
            return null;
        }


        const rowCount = numberWithCommas(props.totalRowCount) + ' Records';

        return <table width="100%" className="form-inline">
            <tbody>
                <tr>
                    <td width="33%" style={{ fontWeight: 'bold' }}>{rowCount}</td>
                    <td width="34%" style={{ textAlign: 'center' }}>
                        <a href="#" className="glyphicon glyphicon-fast-backward" style={backStyle} onClick={e => { e.preventDefault(); this.gotoPage(1) }}></a>
                        &nbsp;
                    <a href="#" className="glyphicon glyphicon-backward" style={backStyle} onClick={e => { e.preventDefault(); this.gotoPage(currentPage - 1) }}></a>
                        &nbsp;

                    <span>Page
                    &nbsp;
                        <NumericInput className="form-control input-sm" style={{ width: 60 }} initialValue={currentPage} onValueChange={v => this.gotoPage(v)} />
                            &nbsp;
                        of {numberWithCommas(pageCount)}</span>
                        &nbsp;

                    <a href="#" className="glyphicon glyphicon-forward" style={forwardStyle} onClick={e => { e.preventDefault(); this.gotoPage(currentPage + 1) }}></a>
                        &nbsp;
                    <a href="#" className="glyphicon glyphicon-fast-forward" style={forwardStyle} onClick={e => { e.preventDefault(); this.gotoPage(pageCount) }}></a>


                    </td>
                    <td width="33%" style={{ textAlign: 'right' }}>Show:
                       <select className="form-control input-sm" style={{ width: 80 }} value={pageSize} onChange={e => props.gotoPage(1, parseInt(e.currentTarget.value))}>
                            {pageSizes.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>;

    }
}
