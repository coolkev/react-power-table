
import * as React from 'react';
import { getColumnCore, getExpression } from './Column';
import { Column, PowerTableProps, RowComponentType, RowComponentProps } from './ReactPowerTable';
import { debuglog, getComponentDisplayName, shallowEqual, sortArray } from './utils';

export interface SortSettings {

    column: string;
    descending?: boolean;

}

export interface SortableColumn<TRow = {}, TValue = {}, TExtraProps = {}> extends Column<TRow, TValue, TExtraProps> {

    sortable?: boolean;
    sortExpression?: ((row: TRow) => any) | string;
    sortKey?: string;

}

/** @internal */
export interface InternalSortingState<T> {
    sortedRows?: T[];
    currentSort?: SortSettings;
}

export interface InternalSortingProps<TRow = {}> {

    columns: Array<SortableColumn<TRow> | string>;
    sorting: SortSettings & {

        onSortChanging?: (sort: SortSettings) => void;
        onSortChanged?: (sort: SortSettings) => void;

    };
}

function shouldTransformColumns<TRow, T extends PowerTableProps<TRow>>(currentProps: T & InternalSortingProps<TRow>, nextProps: Readonly<T & InternalSortingProps<TRow>>) {
    return !shallowEqual(nextProps.columns, currentProps.columns) || nextProps.headCellComponent !== currentProps.headCellComponent || nextProps.cellComponent !== currentProps.cellComponent;
}

function transformColumn<T>(options: SortableColumn<T> | string, tableProps: PowerTableProps<T>, getCurrentSort: () => SortSettings, changeSort: (sort: SortSettings) => void) {

    const col: SortableColumn<T> = typeof (options) === 'string' ? { fieldName: options, key: options } : { ...options };

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

    const { cellHtmlAttributes } = col;
    if (col.textAlign === 'right' || (cellHtmlAttributes && typeof (cellHtmlAttributes) !== 'function' && cellHtmlAttributes.style && cellHtmlAttributes.style.textAlign === 'right')) {

        //this is needed to pad right-aligned cells so they line up with header text right side and don't appear under the sort icon
        //const ValueComponent = col.valueComponent || tableProps.valueComponent;
        //const cellComponentProps = col.ce || ((props) => props);

        //cellComponentProps(props)
        //col.valueComponent = (props) => <SortableCellComponentWrapper><ValueComponent {...(props) } /></SortableCellComponentWrapper>;
        if (typeof (cellHtmlAttributes) === 'function') {
            col.tdAttributes = props => {
                const attribs = cellHtmlAttributes(props);
                return { ...attribs, style: { ...attribs && attribs.style, paddingRight: 15 } };
            };

        } else {
            col.tdAttributes = { ...cellHtmlAttributes, style: { ...cellHtmlAttributes && cellHtmlAttributes.style, paddingRight: 15 } };
        }
    }

    const OriginalHeadCellComponent = col.headCellComponent || tableProps.headCellComponent;

    const divSortingStyle: React.CSSProperties = { paddingRight: 15, position: 'relative' };

    const divDefaultSortingTyle = col.textAlign === 'right' || (col.headCellHtmlAttributes && col.headCellHtmlAttributes.style && col.headCellHtmlAttributes.style.textAlign === 'right') ? { paddingRight: 15 } : null;

    const onClick = () => {
        const currentSort = getCurrentSort();
        const sorting = col.sortKey === currentSort.column;

        changeSort({ column: col.sortKey, descending: sorting && !currentSort.descending });
    };

    col.headCellComponent = props => {
        const { children, ...extra } = props;
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

        return <OriginalHeadCellComponent {...extra } onClick={onClick} style={{ cursor: 'pointer', ...extra.style }} ><div style={divStyle}>{children}{sortComponent && ' '}{sortComponent}</div></OriginalHeadCellComponent>;
    };
    col.headCellComponent.displayName = 'SortableHeaderComponentWrapper';
    return col;
}

export function withInternalSorting<TRow, T extends PowerTableProps<TRow>>(WrappedComponent: React.ComponentType<T>): React.ComponentClass<T & InternalSortingProps<TRow>> {

    return class extends React.Component<T & InternalSortingProps<TRow>, InternalSortingState<TRow>> {

        static readonly displayName = `WithInternalSorting(${getComponentDisplayName(WrappedComponent)})`;

        static defaultProps = WrappedComponent.defaultProps as any as Partial<T & InternalSortingProps<TRow>>;

        private columns: Array<SortableColumn<TRow>>;
        private rowComponent: RowComponentType<TRow>;

        private currentlySorting: boolean;

        constructor(props: T & InternalSortingProps<TRow>) {
            super(props);

            const { sorting } = props;

            this.changeSort = this.changeSort.bind(this);

            this.columns = this.transformColumns(props);

            const sortedRows = this.performSort(props.rows, sorting);

            this.state = {
                sortedRows, currentSort: { column: sorting.column, descending: sorting.descending },
            };

            const OriginalRowComponent = props.rowComponent;

            const currentlySorting = () => this.currentlySorting;
            this.rowComponent = class extends React.Component<RowComponentProps<TRow> & { htmlAttributes: React.HTMLAttributes<HTMLTableRowElement> }> {

                shouldComponentUpdate(_nextProps: RowComponentProps<TRow> & { htmlAttributes: React.HTMLAttributes<HTMLTableRowElement> }) {
                    return !currentlySorting();
                }
                render() {

                    return <OriginalRowComponent {...this.props} />;
                }
            };
        }
        componentWillReceiveProps(nextProps: Readonly<T & InternalSortingProps<TRow>>) {
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

        private transformColumns(props: Readonly<T>): Array<SortableColumn<TRow>> {
            const { columns } = props;
            debuglog('Sorting.transformColumns', columns);

            if (this.columns && this.props.columns) {
                //reuse the same column if it hasn't changed from the original
                return columns.map((c, i) => shallowEqual(c, this.props.columns[i]) ? this.columns[i] : transformColumn(c, props, () => this.state.currentSort, this.changeSort));

            }
            return columns.map((c) => transformColumn(c, props, () => this.state.currentSort, this.changeSort));
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

            this.currentlySorting = true;

            this.setState((prev) => ({
                sortedRows: this.performSort(prev.sortedRows, sort),
                currentSort: sort,
            }), () => {
                this.currentlySorting = false;

                console.log('Sorting changeSort setState callback');

                if (callback) {
                    callback();
                }

            });

        }

        render() {
            console.log('Sorting.render');

            const { sorting, columns, rows, ...extra } = this.props as PowerTableProps<TRow> & InternalSortingProps<T>;

            const { sortedRows } = this.state;

            return <WrappedComponent {...extra} columns={this.columns} rows={sortedRows} rowComponent={this.rowComponent} />;

        }

    };
}

export interface ExternalSortingProps {

    columns: Array<SortableColumn | string>;

    sorting: SortSettings & {

        changeSort: (sort: SortSettings) => void;

    };
}

export function withSorting<TRow, T extends PowerTableProps<TRow>>(WrappedComponent: React.ComponentType<T>): React.ComponentClass<T & ExternalSortingProps> {

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

        private transformColumns(props: Readonly<T>): Array<SortableColumn<TRow>> {
            const { columns } = props;
            debuglog('Sorting.transformColumns', columns);

            if (this.columns && this.props.columns) {
                //reuse the same column if it hasn't changed from the original
                return columns.map((c, i) => c === this.props.columns[i] ? this.columns[i] : transformColumn(c, props, () => this.props.sorting, this.props.sorting.changeSort));

            }
            return columns.map((c) => transformColumn(c, props, () => this.props.sorting, this.props.sorting.changeSort));
        }

        render() {
            const { sorting, ...extra } = this.props as PowerTableProps<TRow> & ExternalSortingProps;

            return <WrappedComponent {...extra} columns={this.columns} />;
        }
    };
}
// const sortableCellComponentWrapperStyle = { marginRight: 15 };
// const SortableCellComponentWrapper: React.StatelessComponent = (props) => {
//     return <div style={sortableCellComponentWrapperStyle}>{props.children}</div>;
// };

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
