/**
 * @module react-power-table
 */ /** */

import * as React from 'react';
//import { Paging, PagingProps } from './components/Paging';
import { sortArray, getComponentDisplayName, makePure, debuglog, shallowEqual } from './utils';
import { defaultCellComponent, getExpression, getColumnCore } from "./Column";
import { InternalPagingProps } from "./Paging";
import { Column, HeaderComponentProps, GridProps } from "./ReactPowerTable";



export interface SortSettings {

    column: string;
    //Ascending?: boolean;
    descending?: boolean;

}

export interface SortableColumn<TRow = any, TValue = any> extends Column<TRow, TValue> {

    sortable?: boolean;
    sortExpression?: ((row: TRow) => any) | string;
    sortKey?: string;

    //sortAscComponent?: JSX.Element;
    //sortDescComponent?: JSX.Element;



}
/** @internal */
export interface InternalSortingState<T> {
    sortedRows?: T[];
    currentSort?: SortSettings;
}


export interface InternalSortingProps<TRow = any> {

    columns: (SortableColumn<TRow> | string)[];

    sorting: SortSettings & {

        onSortChanging?: (sort: SortSettings) => void;
        onSortChanged?: (sort: SortSettings) => void;

    };
}

interface SortableHeaderComponentProps<T> extends HeaderComponentProps {

    sorting: boolean;
    sortAsc?: boolean;
}

const sortableHeaderComponent = makePure((props: SortableHeaderComponentProps<any>) => {

    //const col = props.column;

    //console.log('sortableHeaderComponent render', props);

    if (props.sorting) {

        const sortComponent = props.sortAsc ? defaultSortAscComponent : defaultSortDescComponent;

        return <div style={{ paddingRight: 15, position: 'relative' }}>{props.headerText} {sortComponent}</div>;

    }
    const divStyle = props.headerCellProps.style && props.headerCellProps.style.textAlign == 'right' ? { paddingRight: 15 } : null;

    return <div style={divStyle}>{props.headerText}</div>;

});

function transformColumn<T>(options: SortableColumn<T> | string, changeSort: (sort: SortSettings) => void, getCurrentSort: () => SortSettings) {


    const col : SortableColumn = typeof (options) == 'string' ? { field: options, key: options } : { ...options };

    col.sortable = col.sortable || col.sortable == undefined;

    if (!col.sortable) {

        return col;

    }


    if (typeof col.sortExpression === 'function') {
        col.sortKey = getExpression(col.sortExpression);
        col.sortExpression = col.sortExpression;
    }
    else if (typeof (col.sortExpression) === "string") {
        const sortField = col.sortExpression;
        col.sortExpression = row => row[sortField];
        col.sortKey = sortField;

    }
    else {
        const core = getColumnCore(options);

        col.sortKey = core.key.toString();
        col.sortExpression = core.field;
    }

    const headerProps = {
        ...col.headerCellProps, onClick: () => {
            const sorting = getCurrentSort();

            changeSort({ column: col.sortKey, descending: sorting.column == col.sortKey && !sorting.descending });
        }
    };

    headerProps.style = { ...headerProps.style, cursor: 'pointer' };
    col.headerCellProps = headerProps;

    const originalHeaderComponentPropsProvider = col.headerComponentPropsProvider;

    col.headerComponentPropsProvider = () => {

        const originalProps = originalHeaderComponentPropsProvider && originalHeaderComponentPropsProvider();
        const currentSort = getCurrentSort();
        const sorting = col.sortKey == currentSort.column;
        const sortAsc = sorting && !currentSort.descending;

        return { ...originalProps, sorting, sortAsc };
    }

    col.headerComponent = sortableHeaderComponent;

    const { cellProps } = col;
    if (col.textAlign == 'right' || (cellProps && typeof (cellProps) != 'function' && cellProps.style && cellProps.style.textAlign == 'right')) {

        //this is needed to pad right-aligned cells so they line up with header text right side and don't appear under the sort icon
        const CellComponent = col.cellComponent || defaultCellComponent
        const cellComponentProps = col.cellComponentProps || (props => ({ column: props.column, value: props.value }));

        col.cellComponent = props => <SortableCellComponentWrapper><CellComponent {...cellComponentProps(props) } /></SortableCellComponentWrapper>
    }

    return col;
}

function transformColumns(columns: Column<any>[], changeSort: (sort: SortSettings) => void, getCurrentSort: () => SortSettings, _prevColumns?: Column<any>[]): SortableColumn<any>[] {
    debuglog('Sorting.transformColumns', columns);

    return columns.map(c => transformColumn(c, changeSort, getCurrentSort));
}

export function withInternalSorting<TRow, T extends GridProps<TRow>>(WrappedComponent: React.ComponentClass<T>): React.ComponentClass<T & InternalSortingProps<TRow>>;
export function withInternalSorting<TRow, T extends GridProps<TRow>>(WrappedComponent: React.StatelessComponent<T>): React.ComponentClass<T & InternalSortingProps<TRow>>;
export function withInternalSorting<TRow, T extends GridProps<TRow>>(WrappedComponent: React.ComponentClass<GridProps<TRow>> | React.StatelessComponent<GridProps<TRow>>): React.ComponentClass<T & InternalSortingProps<TRow>> {


    const WrappedPagingComponent = WrappedComponent.displayName && WrappedComponent.displayName.match(/^WithInternalPaging/) && WrappedComponent as React.ComponentClass<GridProps<TRow> & { paging?: Partial<InternalPagingProps> }>;

    return class extends React.Component<T & InternalSortingProps<TRow>, InternalSortingState<TRow>> {

        static readonly displayName = `WithInternalSorting(${getComponentDisplayName(WrappedComponent)})`;

        private sortChangedSinceLastRender: boolean;

        constructor(props: T & InternalSortingProps<TRow>) {
            super(props);

            const { sorting } = props;
            //const { ...currentSort } = sorting;

            this.changeSort = this.changeSort.bind(this);

            this.columns = transformColumns(props.columns, this.changeSort, () => this.state.currentSort);

            const sortedRows = this.performSort(props.rows, sorting);

            this.state = {
                sortedRows, currentSort: { column: sorting.column, descending: sorting.descending }
            };

        }

        private columns: SortableColumn<TRow>[];

        componentWillReceiveProps(nextProps: T & InternalSortingProps<T>) {

            if (!shallowEqual(nextProps.columns, this.props.columns)) {
                this.columns = transformColumns(nextProps.columns, this.changeSort, () => this.state.currentSort, this.props.columns);
            }

            if (this.props.sorting.column != nextProps.sorting.column || this.props.sorting.descending != nextProps.sorting.descending) {

                const newSort: SortSettings = { column: nextProps.sorting.column, descending: nextProps.sorting.descending };
                const sortedRows = this.performSort(nextProps.rows, newSort);

                this.setState({ currentSort: newSort, sortedRows });
            }
            else if (this.props.rows != nextProps.rows) {

                this.setState(prev => ({
                    sortedRows: this.performSort(nextProps.rows, prev.currentSort)
                }));
            }

        }
        componentWillMount() {
            console.log('Sort.componentWillMount')

        }
        
        componentDidMount() {
            console.log('Sort.componentDidMount')

        }
        
        componentWillUnmount() {
            console.log('Sort.componentWillUnmount')
        }
        private performSort(rows: TRow[], sort: SortSettings) {

            const sortCol = this.columns.find(m => m.sortKey == sort.column);

            if (!sortCol) {
                throw new Error('Could not find a column with sortKey=' + sort.column);
            }

            return sortArray(rows, sortCol.sortExpression, { descending: sort.descending, caseInsensitive: true });
        }
        private changeSort(sort: SortSettings) {

            const { onSortChanging, onSortChanged } = this.props.sorting;

            if (onSortChanging) {
                onSortChanging(sort);
            }


            const callback = onSortChanged && (() => onSortChanged(sort));
            debuglog('changeSort', sort);

            this.sortChangedSinceLastRender = true;

            this.setState(prev => ({
                sortedRows: this.performSort(prev.sortedRows, sort),
                currentSort: sort
            }), callback);


        }

        render() {
            console.log('Sort.render')

            const { sorting, columns, rows, ...extra } = this.props as GridProps<TRow> & InternalSortingProps<T>;

            const { sortedRows } = this.state;

            if (this.sortChangedSinceLastRender) {

                this.sortChangedSinceLastRender = false;

                debuglog('sortChangedSinceLastRender');
                if (WrappedPagingComponent) {

                    debuglog('sortChangedSinceLastRender wrapped with paging component, so setting currentPage to 1');
                    const { paging } = extra as any;
                    const pagingProps = { ...paging, currentPage: 1 };

                    return <WrappedPagingComponent {...extra} columns={this.columns} paging={pagingProps} rows={sortedRows} />;

                }
            }

            return <WrappedComponent {...extra} columns={this.columns} rows={sortedRows} />;

        }

    }
}
export interface ExternalSortingProps {

    sorting: SortSettings & {

        changeSort: (sort: SortSettings) => void;

    };
}

export function withSorting<TRow, T extends GridProps<TRow>>(WrappedComponent: React.ComponentClass<T>): React.ComponentClass<T & ExternalSortingProps>;
export function withSorting<TRow, T extends GridProps<TRow>>(WrappedComponent: React.StatelessComponent<T>): React.ComponentClass<T & ExternalSortingProps>;
export function withSorting<TRow, T extends GridProps<TRow>>(WrappedComponent: React.ComponentClass<GridProps<TRow>> | React.StatelessComponent<GridProps<TRow>>): React.ComponentClass<T & ExternalSortingProps> {



    return class extends React.Component<T & ExternalSortingProps, never> {

        static readonly displayName = `WithSorting(${getComponentDisplayName(WrappedComponent)})`;

        constructor(props: T & ExternalSortingProps) {
            super(props);

            //this.transformColumns(props);
            this.columns = transformColumns(props.columns, this.props.sorting.changeSort, () => this.props.sorting);
        }

        componentWillReceiveProps(nextProps: T & ExternalSortingProps) {

            if (!shallowEqual(nextProps.columns, this.props.columns)) {
                //this.transformColumns(nextProps);
                this.columns = transformColumns(nextProps.columns, this.props.sorting.changeSort, () => this.props.sorting, this.props.columns);
            }

        }

        // private transformColumns(props: T & ExternalSortingProps) {

        //     this.columns = props.columns.map(c => transformColumn(c, this.props.sorting.changeSort, () =>  this.props.sorting));

        // }
        private columns: SortableColumn<TRow>[];

        render() {
            const { sorting, ...extra } = this.props as GridProps<TRow> & ExternalSortingProps;

            return <WrappedComponent {...extra} columns={this.columns} />;
        }
    }
}


const sortableCellComponentWrapperStyle = { marginRight: 15 };
const SortableCellComponentWrapper: React.StatelessComponent<never> = props => {
    return <div style={sortableCellComponentWrapperStyle}>{props.children}</div>
}
const defaultSortAscComponent = <span className="sort-asc" style={{
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderBottom: '5px solid gray',
    position: 'absolute',
    top: 'calc(50% - 3px)',
    marginLeft: 5
}}></span>;


const defaultSortDescComponent = <span className="sort-desc" style={{
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '5px solid gray',
    position: 'absolute',
    top: 'calc(50% - 3px)',
    marginLeft: 5
}}></span>;

