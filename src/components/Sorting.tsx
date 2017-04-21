import * as React from 'react';
//import { Paging, PagingProps } from './components/Paging';
import { sortArray, getExpression, getComponentDisplayName, getColumnCore, makePure, debuglog, shallowEqual } from '../utils';
import { defaultCellComponent } from "./Column";
import { InternalPagingProps } from "./Paging";
import { Column, HeaderComponentProps, TransformedColumn, T, GridProps, ReactClass } from "../ReactPowerTable";






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

interface InternalSortingState<T> {
    sortedRows?: T[];
    currentSort?: SortSettings;
}

export interface InternalSortingProps<T> {

    columns: (SortableColumn<T> | string)[];

    sorting: SortSettings & {

        onSortChanging?: (sort: SortSettings) => void;
        onSortChanged?: (sort: SortSettings) => void;

    };
}

interface SortableHeaderComponentProps<T> extends HeaderComponentProps<T> {
    column: SortableColumn<T> & TransformedColumn<T>;
    sorting: boolean;
    sortAsc?: boolean;
}

const sortableHeaderComponent = makePure((props: SortableHeaderComponentProps<T>) => {

    const col = props.column;

    //console.log('sortableHeaderComponent render', props);

    if (props.sorting) {

        const sortComponent = props.sortAsc ? col.sortAscComponent || defaultSortAscComponent : col.sortDescComponent || defaultSortDescComponent;

        return <div style={{ paddingRight: 15, position: 'relative' }}>{col.headerText} {sortComponent}</div>;

    }
    const divStyle = col.headerCellProps.style && col.headerCellProps.style.textAlign == 'right' ? { paddingRight: 15 } : null;

    return <div style={divStyle}>{col.headerText}</div>;

});

function transformColumn(options: SortableColumn<T> | string, changeSort: (sort: SortSettings) => void, getCurrentSort: () => SortSettings) {


    const col = typeof (options) == 'string' ? { field: options } : { ...options };

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

            changeSort({ Column: col.sortKey, Ascending: sorting.Column != col.sortKey || !sorting.Ascending });
        }
    };

    headerProps.style = { ...headerProps.style, cursor: 'pointer' };
    col.headerCellProps = headerProps;

    col.headerComponentPropsProvider = props => {
        const currentSort = getCurrentSort();
        const sorting = col.sortKey == currentSort.Column;
        const sortAsc = sorting && currentSort.Ascending;

        return { ...props, sorting, sortAsc };
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

export function withInternalSorting<TRow, T extends GridProps<TRow>>(WrappedComponent: ReactClass<T>): React.ComponentClass<T & InternalSortingProps<TRow>> {


    const WrappedPagingComponent = WrappedComponent.displayName && WrappedComponent.displayName.match(/^WithInternalPaging/) && WrappedComponent as React.ComponentClass<T & { paging?: Partial<InternalPagingProps> }>;

    return class extends React.Component<T & InternalSortingProps<T>, InternalSortingState<TRow>> {

        static readonly displayName = `WithInternalSorting(${getComponentDisplayName(WrappedComponent)})`;

        private sortChangedSinceLastRender: boolean;

        constructor(props: T & InternalSortingProps<T>) {
            super(props);

            const { sorting } = props;
            //const { ...currentSort } = sorting;

            this.changeSort = this.changeSort.bind(this);

            this.columns = transformColumns(props.columns, this.changeSort, () => this.state.currentSort);

            const sortedRows = this.performSort(props.rows, sorting);

            this.state = {
                sortedRows, currentSort: { Column: sorting.Column, Ascending: sorting.Ascending }
            };

        }

        private columns: SortableColumn<TRow>[];

        componentWillReceiveProps(nextProps: T & InternalSortingProps<T>) {

            if (!shallowEqual(nextProps.columns, this.props.columns)) {
                this.columns = transformColumns(nextProps.columns, this.changeSort, () => this.state.currentSort, this.props.columns);
            }

            if (this.props.sorting.Column != nextProps.sorting.Column || this.props.sorting.Ascending != nextProps.sorting.Ascending) {

                const newSort = { Column: nextProps.sorting.Column, Ascending: nextProps.sorting.Ascending };
                const sortedRows = this.performSort(nextProps.rows, newSort);

                this.setState({ currentSort: newSort, sortedRows });
            }
            else if (this.props.rows != nextProps.rows) {

                this.setState(prev => ({
                    sortedRows: this.performSort(nextProps.rows, prev.currentSort)
                }));
            }

        }
        private performSort(rows: TRow[], sort: SortSettings) {

            const sortCol = this.columns.find(m => m.sortKey == sort.Column);

            if (!sortCol) {
                throw new Error('Could not find a column with sortKey=' + sort.Column);
            }

            return sortArray(rows, sortCol.sortExpression, { descending: !sort.Ascending, caseInsensitive: true });
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

export function withSorting<TRow, T extends GridProps<TRow>>(WrappedComponent: ReactClass<T>): React.ComponentClass<T & ExternalSortingProps> {


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
const defaultSortAscComponent = <span className="sort-asc2" style={{
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

