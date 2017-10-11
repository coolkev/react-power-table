
import * as React from 'react';
import { getColumnCore, getExpression } from './Column';
import { Column, GridProps } from './ReactPowerTable';
import { debuglog, getComponentDisplayName, shallowEqual, sortArray } from './utils';

export interface SortSettings {

    column: string;
    descending?: boolean;

}

export interface SortableColumn<TRow = any, TValue = any, TFormattedValue = TValue> extends Column<TRow, TValue, TFormattedValue> {

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

    columns: Array<SortableColumn<TRow> | string>;
    sorting: SortSettings & {

        onSortChanging?: (sort: SortSettings) => void;
        onSortChanged?: (sort: SortSettings) => void;

    };
}

function shouldTransformColumns<TRow, T extends GridProps<TRow>>(currentProps: T & InternalSortingProps<TRow>, nextProps: Readonly<T & InternalSortingProps<TRow>>) {
    return !shallowEqual(nextProps.columns, currentProps.columns) || nextProps.tableHeaderCellComponent !== currentProps.tableHeaderCellComponent || nextProps.defaultCellComponent !== currentProps.defaultCellComponent;
}

function transformColumn<T>(options: SortableColumn<T> | string, gridProps: GridProps<T>, getCurrentSort: () => SortSettings, changeSort: (sort: SortSettings) => void) {

    const col: SortableColumn = typeof (options) === 'string' ? { fieldName: options, key: options } : { ...options };

    col.sortable = col.sortable || col.sortable === undefined;

    if (!col.sortable) {

        return col;

    }

    if (typeof col.sortExpression === 'function') {
        col.sortKey = getExpression(col.sortExpression);
        col.sortExpression = col.sortExpression;
    } else if (typeof (col.sortExpression) === 'string') {
        const sortField = col.sortExpression;
        col.sortExpression = (row) => row[sortField];
        col.sortKey = sortField;

    } else {
        const core = getColumnCore(options);

        col.sortKey = core.key.toString();
        col.sortExpression = core.field;
    }

    const { tdProps } = col;
    if (col.textAlign === 'right' || (tdProps && typeof (tdProps) !== 'function' && tdProps.style && tdProps.style.textAlign === 'right')) {

        //this is needed to pad right-aligned cells so they line up with header text right side and don't appear under the sort icon
        const CellComponent = col.cellComponent || gridProps.defaultCellComponent;
        const cellComponentProps = col.cellComponentProps || ((props) => props);

        col.cellComponent = (props) => <SortableCellComponentWrapper><CellComponent {...cellComponentProps(props) } /></SortableCellComponentWrapper>;
    }

    const OriginalHeaderComponent = col.thComponent || gridProps.tableHeaderCellComponent;

    const divSortingStyle: React.CSSProperties = { paddingRight: 15, position: 'relative' };

    const divDefaultSortingTyle = col.textAlign === 'right' || (col.thProps && col.thProps.style && col.thProps.style.textAlign === 'right') ? { paddingRight: 15 } : null;

    const onClick = () => {
        const currentSort = getCurrentSort();
        const sorting = col.sortKey === currentSort.column;

        changeSort({ column: col.sortKey, descending: sorting && !currentSort.descending });
    };

    col.thComponent = props => {
        const { ref, children, ...extra } = props;
        const currentSort = getCurrentSort();
        const sorting = col.sortKey === currentSort.column;
        const sortAsc = sorting && !currentSort.descending;

        let divStyle: React.CSSProperties;
        let sortComponent: JSX.Element;

        if (sorting) {
            divStyle = divSortingStyle;
            sortComponent = sortAsc ? defaultSortAscComponent : defaultSortDescComponent;

        } else {
            divStyle = divDefaultSortingTyle;
        }

        debuglog('SortableHeaderComponent render');

        return <OriginalHeaderComponent {...extra } onClick={onClick} style={{ cursor: 'pointer', ...extra.style }} ><div style={divStyle}>{children}{sortComponent && ' '}{sortComponent}</div></OriginalHeaderComponent>;
    };
    col.thComponent.displayName = 'SortableHeaderComponentWrapper';
    return col;
}

export function withInternalSorting<TRow, T extends GridProps<TRow>>(WrappedComponent: React.ComponentType<T>): React.ComponentClass<T & InternalSortingProps<TRow>> {

    return class extends React.Component<T & InternalSortingProps<TRow>, InternalSortingState<TRow>> {

        static readonly displayName = `WithInternalSorting(${getComponentDisplayName(WrappedComponent)})`;

        static defaultProps: Partial<T & InternalSortingProps<TRow>> = WrappedComponent.defaultProps as any;

        private columns: Array<SortableColumn<TRow>>;

        constructor(props: T & InternalSortingProps<TRow>) {
            super(props);

            const { sorting } = props;

            this.changeSort = this.changeSort.bind(this);

            this.columns = this.transformColumns(props);

            const sortedRows = this.performSort(props.rows, sorting);

            this.state = {
                sortedRows, currentSort: { column: sorting.column, descending: sorting.descending },
            };

        }
        componentWillReceiveProps(nextProps: Readonly<T & InternalSortingProps<TRow>>) {
            console.log('Sorting.componentWillReceiveProps', nextProps);

            if (shouldTransformColumns(this.props, nextProps)) {
                this.columns = this.transformColumns(nextProps);

            }
            if (this.props.sorting.column !== nextProps.sorting.column || this.props.sorting.descending !== nextProps.sorting.descending) {

                const newSort: SortSettings = { column: nextProps.sorting.column, descending: nextProps.sorting.descending };
                const sortedRows = this.performSort(nextProps.rows, newSort);

                this.setState({ currentSort: newSort, sortedRows });
            } else if (this.props.rows !== nextProps.rows) {

                this.setState((prev) => ({
                    sortedRows: this.performSort(nextProps.rows, prev.currentSort),
                }));
            }

        }

        private transformColumns(gridProps: Readonly<T>): Array<SortableColumn<TRow>> {
            const { columns } = gridProps;
            debuglog('Sorting.transformColumns', columns);

            if (this.columns && this.props.columns) {
                //reuse the same column if it hasn't changed from the original
                return columns.map((c, i) => shallowEqual(c, this.props.columns[i]) ? this.columns[i] : transformColumn(c, gridProps, () => this.state.currentSort, this.changeSort));

            }
            return columns.map((c) => transformColumn(c, gridProps, () => this.state.currentSort, this.changeSort));
        }

        private performSort(rows: TRow[], sort: SortSettings) {

            const sortCol = this.columns.find((m) => m.sortKey === sort.column);

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

            this.setState((prev) => ({
                sortedRows: this.performSort(prev.sortedRows, sort),
                currentSort: sort,
            }), callback);

        }

        render() {
            //console.log('Sorting.render');

            const { sorting, columns, rows, ...extra } = this.props as GridProps<TRow> & InternalSortingProps<T>;

            const { sortedRows } = this.state;

            return <WrappedComponent {...extra} columns={this.columns} rows={sortedRows} />;

        }

    };
}

export interface ExternalSortingProps {

    columns: Array<SortableColumn | string>;

    sorting: SortSettings & {

        changeSort: (sort: SortSettings) => void;

    };
}

export function withSorting<TRow, T extends GridProps<TRow>>(WrappedComponent: React.ComponentType<T>): React.ComponentClass<T & ExternalSortingProps> {

    return class extends React.Component<T & ExternalSortingProps, never> {

        static defaultProps: Partial<T & ExternalSortingProps> = WrappedComponent.defaultProps as any;
        static readonly displayName = `WithSorting(${getComponentDisplayName(WrappedComponent)})`;

        private columns: Array<SortableColumn<TRow>>;

        constructor(props: T & ExternalSortingProps) {
            super(props);

            this.columns = this.transformColumns(props);

        }

        componentWillReceiveProps(nextProps: Readonly<T & ExternalSortingProps>) {

            if (shouldTransformColumns(this.props, nextProps)) {
                this.columns = this.transformColumns(nextProps);
            }
        }

        private transformColumns(gridProps: Readonly<T>): Array<SortableColumn<TRow>> {
            const { columns } = gridProps;
            debuglog('Sorting.transformColumns', columns);

            if (this.columns && this.props.columns) {
                //reuse the same column if it hasn't changed from the original
                return columns.map((c, i) => c === this.props.columns[i] ? this.columns[i] : transformColumn(c, gridProps, () => this.props.sorting, this.props.sorting.changeSort));

            }
            return columns.map((c) => transformColumn(c, gridProps, () => this.props.sorting, this.props.sorting.changeSort));
        }

        render() {
            const { sorting, ...extra } = this.props as GridProps<TRow> & ExternalSortingProps;

            return <WrappedComponent {...extra} columns={this.columns} />;
        }
    };
}

const sortableCellComponentWrapperStyle = { marginRight: 15 };
const SortableCellComponentWrapper: React.StatelessComponent = (props) => {
    return <div style={sortableCellComponentWrapperStyle}>{props.children}</div>;
};
const defaultSortAscProps: React.CSSProperties = {
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderBottom: '5px solid gray',
    position: 'absolute',
    top: 'calc(50% - 3px)',
    marginLeft: 5,
};

const defaultSortAscComponent = <span className="sort-asc" style={defaultSortAscProps} />;

const defaultSortDescProps: React.CSSProperties = {
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '5px solid gray',
    position: 'absolute',
    top: 'calc(50% - 3px)',
    marginLeft: 5,
};

const defaultSortDescComponent = <span className="sort-desc" style={defaultSortDescProps} />;
