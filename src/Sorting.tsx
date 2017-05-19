/**
 * @module react-power-table
 */ /** */

import * as React from 'react';
//import { Paging, PagingProps } from './components/Paging';
import { sortArray, getComponentDisplayName, makePure, debuglog, shallowEqual } from './utils';
import { getExpression, getColumnCore } from "./Column";
import { InternalPagingProps } from "./Paging";
import { Column, HeaderComponentProps, GridProps, ReactPowerTable } from "./ReactPowerTable";



export interface SortSettings {

    column: string;
    descending?: boolean;

}

export interface SortableColumn<TRow = any, TValue = any> extends Column<TRow, TValue> {

    sortable?: boolean;
    sortExpression?: ((row: TRow) => any) | string;
    sortKey?: string;

}

/** @internal */
export interface InternalSortingState<T> {
    sortedRows?: T[];
    currentSort?: SortSettings;
}


export interface InternalSortingProps<TRow = any> {

    columns: (SortableColumn<TRow> | string)[];
    //tableHeaderCellComponent?: React.ComponentClass<HeaderComponentProps<TRow>> | React.StatelessComponent<HeaderComponentProps<TRow>>;

    sorting: SortSettings & {

        onSortChanging?: (sort: SortSettings) => void;
        onSortChanged?: (sort: SortSettings) => void;

    };
}

function transformColumn<T>(options: SortableColumn<T> | string) {


    const col: SortableColumn = typeof (options) == 'string' ? { fieldName: options, key: options } : { ...options };

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

    const { cellProps } = col;
    if (col.textAlign == 'right' || (cellProps && typeof (cellProps) != 'function' && cellProps.style && cellProps.style.textAlign == 'right')) {

        //this is needed to pad right-aligned cells so they line up with header text right side and don't appear under the sort icon
        const CellComponent = col.cellComponent || ReactPowerTable.defaultProps.tableCellValueComponent
        const cellComponentProps = col.cellComponentProps || (props => ({ column: props.column, value: props.value }));

        col.cellComponent = props => <SortableCellComponentWrapper><CellComponent {...cellComponentProps(props) } /></SortableCellComponentWrapper>
    }
    return col;
}

function getSortableHeaderCell(OriginalHeaderCell: React.ComponentClass<HeaderComponentProps> | React.StatelessComponent<HeaderComponentProps>, getCurrentSort: () => SortSettings, changeSort: (sort: SortSettings) => void) {

    const headerCell: React.StatelessComponent<HeaderComponentProps> = (p) => {

        const { ref, children, ...extra } = p;
        const col = extra.column as SortableColumn;
        const currentSort = getCurrentSort();
        const sorting = col.sortKey == currentSort.column;
        const sortAsc = sorting && !currentSort.descending;

        if (!col.sortable) {
            return <OriginalHeaderCell {...extra} children={children} />;
        }

        return <SortableHeaderComponent {...extra} sorting={sorting} sortAsc={sortAsc} thComponent={OriginalHeaderCell} onChangeSort={changeSort} />
    };

    return headerCell;
}

export function withInternalSorting<TRow, T extends GridProps<TRow>>(WrappedComponent: React.ComponentClass<T>): React.ComponentClass<T & InternalSortingProps<TRow>>;
export function withInternalSorting<TRow, T extends GridProps<TRow>>(WrappedComponent: React.StatelessComponent<T>): React.ComponentClass<T & InternalSortingProps<TRow>>;
export function withInternalSorting<TRow, T extends GridProps<TRow>>(WrappedComponent: React.ComponentClass<GridProps<TRow>> | React.StatelessComponent<GridProps<TRow>>): React.ComponentClass<T & InternalSortingProps<TRow>> {


    const WrappedPagingComponent = WrappedComponent.displayName && WrappedComponent.displayName.match(/^WithInternalPaging/) && WrappedComponent as React.ComponentClass<GridProps<TRow> & { paging?: Partial<InternalPagingProps> }>;

    return class extends React.Component<T & InternalSortingProps<TRow>, InternalSortingState<TRow>> {

        static readonly displayName = `WithInternalSorting(${getComponentDisplayName(WrappedComponent)})`;

        // static defaultProps: Partial<T & InternalSortingProps<TRow>> = {
        //     tableHeaderCellComponent: props => {
        //         const { children, column, ...rest } = props;
        //         debuglog('defaultProps thComponent render', props);
        //         return <th {...rest}>{children}</th>;
        //     }
        // } as any;
        static defaultProps: Partial<T & InternalSortingProps<TRow>> = WrappedComponent.defaultProps as any;

        //private components: GridComponents<TRow>;
        private headerCell: React.StatelessComponent<HeaderComponentProps>;
        private sortChangedSinceLastRender: boolean;

        constructor(props: T & InternalSortingProps<TRow>) {
            super(props);
            //console.log('Sorting constructor', props.columns[0]);

            const { sorting } = props;

            this.changeSort = this.changeSort.bind(this);

            this.columns = this.transformColumns(props.columns);
            this.originalColumns = props.columns;

            //console.log('Sorting this.columns set');
            const sortedRows = this.performSort(props.rows, sorting);

            this.state = {
                sortedRows, currentSort: { column: sorting.column, descending: sorting.descending }
            };

            this.headerCell = getSortableHeaderCell(props.tableHeaderCellComponent, () => this.state.currentSort, this.changeSort);

            //this.components = transformComponents(props.components, () => this.state.currentSort, this.changeSort);
            //const OriginalHeaderCell = props.tableHeaderCellComponent;


        }

        private columns: SortableColumn<TRow>[];
        private originalColumns: (SortableColumn<TRow> | string)[];

        componentWillReceiveProps(nextProps: T & InternalSortingProps<T>) {
            //console.log('Sorting.componentWillReceiveProps');
            //console.log('Sorting componentWillReceiveProps', nextProps.columns[0]);

            //const changes: string[] = [];
            if (!shallowEqual(nextProps.columns, this.props.columns)) {
                //changes.push('columns changed');
                this.columns = this.transformColumns(nextProps.columns);
                this.originalColumns = nextProps.columns;

            }
            if (nextProps.tableHeaderCellComponent != this.props.tableHeaderCellComponent) {
                //changes.push('tableHeaderCellComponent changed');
                //this.components = transformComponents(nextProps.components, () => this.state.currentSort, this.changeSort);
                this.headerCell = getSortableHeaderCell(nextProps.tableHeaderCellComponent, () => this.state.currentSort, this.changeSort);
            }
            if (this.props.sorting.column != nextProps.sorting.column || this.props.sorting.descending != nextProps.sorting.descending) {
                //changes.push('sorting changed');

                const newSort: SortSettings = { column: nextProps.sorting.column, descending: nextProps.sorting.descending };
                const sortedRows = this.performSort(nextProps.rows, newSort);

                this.setState({ currentSort: newSort, sortedRows });
            }
            else if (this.props.rows != nextProps.rows) {
                //changes.push('rows changed');

                this.setState(prev => ({
                    sortedRows: this.performSort(nextProps.rows, prev.currentSort)
                }));
            }

            // const FgRed = "\x1b[31m";
            // const FgGreen = "\x1b[32m";
            // const Reset = "\x1b[0m";

            // if (changes.length > 0) {
            //     console.log(FgRed + 'Sorting.componentWillReceiveProps has changes' + Reset, changes);
            // }
            // else {
            //     console.log(FgGreen + 'Sorting.componentWillReceiveProps does not have any changes' + Reset);

            // }

        }

        private transformColumns(columns: SortableColumn<any>[]): SortableColumn<any>[] {
            debuglog('Sorting.transformColumns', columns);

            if (this.columns && this.originalColumns) {
                //reuse the same column if it hasn't changed from the original
                return columns.map((c, i) => shallowEqual(c, this.originalColumns[i]) ? this.columns[i] : transformColumn(c));

            }
            return columns.map((c) => transformColumn(c));
        }

        // componentWillMount() {
        //     debuglog('Sort.componentWillMount')

        // }

        // componentDidMount() {
        //     debuglog('Sort.componentDidMount')

        // }

        // componentWillUnmount() {
        //     debuglog('Sort.componentWillUnmount')
        // }
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
            //console.log('Sorting.render');

            const { sorting, columns, rows, ...extra } = this.props as GridProps<TRow> & InternalSortingProps<T>;

            const { sortedRows } = this.state;


            if (this.sortChangedSinceLastRender) {

                this.sortChangedSinceLastRender = false;

                debuglog('sortChangedSinceLastRender');
                if (WrappedPagingComponent) {

                    debuglog('sortChangedSinceLastRender wrapped with paging component, so setting currentPage to 1');
                    const { paging } = extra as any;
                    const pagingProps = { ...paging, currentPage: 1 };

                    return <WrappedPagingComponent {...extra} columns={this.columns} paging={pagingProps} rows={sortedRows} tableHeaderCellComponent={this.headerCell} />;

                }
            }

            return <WrappedComponent {...extra} columns={this.columns} rows={sortedRows} tableHeaderCellComponent={this.headerCell} />;

        }

    }
}

interface SortableHeaderComponentProps extends HeaderComponentProps<any> {

    sorting: boolean;
    sortAsc?: boolean;

    thComponent: React.ComponentClass<HeaderComponentProps<any>> | React.StatelessComponent<HeaderComponentProps<any>>;

    onChangeSort(sort: SortSettings): void;
}


const SortableHeaderComponent = makePure((props: SortableHeaderComponentProps) => {


    const { thComponent, column, sorting, sortAsc, onChangeSort, ...rest } = props;
    const col = column as SortableColumn;
    const OriginalThComponent = thComponent;

    const handleClick = () => {

        onChangeSort({ column: col.sortKey, descending: sorting && sortAsc });
    };

    let divStyle: React.CSSProperties;
    let sortComponent: JSX.Element;

    if (sorting) {


        sortComponent = sortAsc ? defaultSortAscComponent : defaultSortDescComponent;
        divStyle = { paddingRight: 15, position: 'relative' };

    }
    else {
        divStyle = props.column.headerCellProps.style && props.column.headerCellProps.style.textAlign == 'right' ? { paddingRight: 15 } : null;
    }

    const thStyle = { cursor: 'pointer', ...rest.style };

    return <OriginalThComponent column={column} {...rest} style={thStyle} onClick={handleClick}><div style={divStyle}>{props.column.headerText}{sortComponent && ' '}{sortComponent}</div></OriginalThComponent>;



});
SortableHeaderComponent.displayName = 'SortableHeaderComponent';


export interface ExternalSortingProps {

    columns: (SortableColumn | string)[];

    sorting: SortSettings & {

        changeSort: (sort: SortSettings) => void;

    };
}

export function withSorting<TRow, T extends GridProps<TRow>>(WrappedComponent: React.ComponentClass<T>): React.ComponentClass<T & ExternalSortingProps>;
export function withSorting<TRow, T extends GridProps<TRow>>(WrappedComponent: React.StatelessComponent<T>): React.ComponentClass<T & ExternalSortingProps>;
export function withSorting<TRow, T extends GridProps<TRow>>(WrappedComponent: React.ComponentClass<GridProps<TRow>> | React.StatelessComponent<GridProps<TRow>>): React.ComponentClass<T & ExternalSortingProps> {



    return class extends React.Component<T & ExternalSortingProps, never> {


        private headerCell: React.StatelessComponent<HeaderComponentProps>;

        static readonly displayName = `WithSorting(${getComponentDisplayName(WrappedComponent)})`;
        static defaultProps: Partial<T & ExternalSortingProps> = WrappedComponent.defaultProps as any;

        constructor(props: T & ExternalSortingProps) {
            super(props);

            this.columns = this.transformColumns(props.columns);
            this.originalColumns = props.columns;
            this.headerCell = getSortableHeaderCell(props.tableHeaderCellComponent, () => this.props.sorting, this.props.sorting.changeSort);

        }

        componentWillReceiveProps(nextProps: T & ExternalSortingProps) {

            if (!shallowEqual(nextProps.columns, this.props.columns)) {
                //changes.push('columns changed');
                this.columns = this.transformColumns(nextProps.columns);
                this.originalColumns = nextProps.columns;

            }
            if (nextProps.tableHeaderCellComponent != this.props.tableHeaderCellComponent) {
                this.headerCell = getSortableHeaderCell(nextProps.tableHeaderCellComponent, () => this.props.sorting, this.props.sorting.changeSort);
            }
        }

        private transformColumns(columns: SortableColumn<any>[]): SortableColumn<any>[] {
            debuglog('Sorting.transformColumns', columns);

            if (this.columns && this.originalColumns) {
                //reuse the same column if it hasn't changed from the original
                return columns.map((c, i) => c==this.originalColumns[i] ? this.columns[i] : transformColumn(c));

            }
            return columns.map((c) => transformColumn(c));
        }

        private columns: SortableColumn<TRow>[];
        private originalColumns: (SortableColumn<TRow> | string)[];


        render() {
            const { sorting, tableHeaderCellComponent, ...extra } = this.props as GridProps<TRow> & ExternalSortingProps;

            return <WrappedComponent {...extra} columns={this.columns} tableHeaderCellComponent={this.headerCell} />;
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

