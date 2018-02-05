﻿/** @module react-power-table */
import * as React from 'react';
import { getColumnCore } from './Column';
import { debuglog, shallowEqual, makePure } from './utils';

function applyWrapper(wrapper: StaticOrDynamicProps<CellProps, JSX.Element>, valueProps: CellProps, valueElement: any) {

    const wrapperElement = typeof (wrapper) === 'function' ? wrapper(valueProps) : wrapper;

    return wrapperElement && React.cloneElement(wrapperElement, null, valueElement) || valueElement;
}

function getCellProps<TRow, TExtraProps>(row: TRow, internalColumn: InternalColumn<TRow, any, TExtraProps>, extraProps: TExtraProps): CellProps<TRow, TExtraProps> {
    const { field, includeExtraCellProps, column } = internalColumn;
    const { transformCellProps, formatter } = column;
    const value = field(row);

    const formattedValue = formatter ? formatter(value, row) : value;

    const initialValueProps: CellProps<TRow, TExtraProps> = { ...(includeExtraCellProps && extraProps as any), row, column, value, formattedValue };

    return transformCellProps ? transformCellProps(initialValueProps) : initialValueProps;

}

function mergeAttributes(...attributes: Array<React.HTMLProps<any>>) {

    return attributes.reduce((prev, current) => {
        if (prev.style || current.style) {
            return { ...prev, ...current, style: { ...prev.style, ...current.style } };

        }
        return { ...prev, ...current };
    }, {});
}
// export function ReactPowerTable2<TRow = {}, TExtraProps = {}>() {
//     return ReactPowerTable as any as React.ComponentClass<PowerTableProps<TRow, TExtraProps>>;
// }
// export type ReactPowerTable2<TRow = {}, TExtraProps = {}> = React.ComponentClass<PowerTableProps<TRow, TExtraProps>>;

export interface ReactPowerTable<TRow = {}, TExtraProps = {}> extends React.ComponentClass<PowerTableProps<TRow, TExtraProps>> {

}

export class ReactPowerTable<TRow = {}, TExtraProps = {}> extends React.Component<PowerTableProps<TRow, TExtraProps>, never> {

    static displayName = 'ReactPowerTable';

    static defaultProps: Partial<PowerTableProps> = {
        tableComponent: (props) => <table {...props} />,
        headComponent: ({ children }) => <thead children={children} />,
        headRowComponent: ({ children, }) => <tr children={children} />,
        thComponent: ({ children, htmlAttributes }) => <th children={children} {...htmlAttributes} />,
        thInnerComponentProps: p => p,
        thInnerComponent: (props) => {
            const { column, children, extraCellProps, ...attributes } = props;
            return <div {...attributes}>{children}</div>;
        },

        bodyComponent: ({ children }) => {

            return <tbody children={children} />;
        },
        rowComponent: ({ children, htmlAttributes }) => {
            debuglog('rowComponent render');
            return <tr children={children} {...htmlAttributes} />;
        },
        rowBuilder: (props) => {
            debuglog('rowBuilder render');
            const { columns, row, tdComponent, pureTdComponent, extraCellProps, rowComponent: RowComponent, rowHtmlAttributes } = props;
            const cells = columns.map(c => {
                const { key, column, tdAttributes, valueComponent: ValueComponent } = c;
                const { wrapper, pure } = column;
                const cellProps = getCellProps<{}, {}>(row, c, extraCellProps);

                const valueElement = ValueComponent ? <ValueComponent {...cellProps} children={cellProps.formattedValue} /> : cellProps.formattedValue;

                const children = wrapper ? applyWrapper(wrapper, cellProps, valueElement) : valueElement;

                const TdComponent = pure === false ? tdComponent : pureTdComponent;

                return <TdComponent key={key} tdAttributes={tdAttributes} {...cellProps}>{children}</TdComponent>;
            });

            const rowProps = { ...extraCellProps as any, row, columns } as RowComponentProps;
            const actualRowHtmlAttributes = rowHtmlAttributes && (typeof (rowHtmlAttributes) === 'function' ? rowHtmlAttributes(rowProps) : rowHtmlAttributes);
            return <RowComponent {...rowProps} children={cells} htmlAttributes={actualRowHtmlAttributes} />;
        },
        tdComponent: (props) => {
            const { column, children, tdAttributes, value } = props;
            debuglog('tdComponent render', value);
            const tdHtmlAttributes = tdAttributes(props);

            return <td children={children} {...tdHtmlAttributes} />;
        }
    };

    private columns: Array<InternalColumn<TRow, TExtraProps>>;
    private visibleInternalColumns: Array<InternalColumn<TRow, TExtraProps>>;
    private visibleOriginalColumns: Array<Column<TRow, TExtraProps>>;

    private getRowKey: (row: TRow) => string | number;

    private pureTdComponent: TdComponentType<TRow, TExtraProps>;

    constructor(props: PowerTableProps<TRow, TExtraProps>) {
        super(props);
        debuglog('constructor', props);

        this.transformProps(props);
        this.getRowKey = this.getRowKey.bind(this);

    }

    componentWillReceiveProps(nextProps: PowerTableProps<TRow, TExtraProps>) {
        debuglog('componentWillReceiveProps', nextProps);

        this.transformProps(nextProps, this.props);

    }

    private transformColumns(columns: Array<Column<TRow, TExtraProps> | string>): Array<InternalColumn<TRow, TExtraProps>> {
        debuglog('Sorting.transformColumns', columns);

        if (this.columns && this.props.columns) {
            //reuse the same column if it hasn't changed from the original
            return columns.map((c, i) => shallowEqual(c, this.props.columns[i]) ? this.columns[i] : this.transformColumn(c));
        }

        return columns.map((c) => this.transformColumn(c));
    }

    private transformColumn(options: Column<TRow, TExtraProps> | string): InternalColumn<TRow, TExtraProps> {

        debuglog('transformColumn', options);

        const col = typeof options === 'string' ? { field: options } as Column<TRow, TExtraProps> : options;

        const { cssClass, maxWidth, width, headerCssClass, textAlign, tdAttributes, thAttributes, } = col;

        const sharedStyle: React.CSSProperties = {};

        if (width !== undefined) {
            sharedStyle.width = width;
        }

        if (maxWidth !== undefined) {
            sharedStyle.maxWidth = maxWidth;
        }

        if (textAlign !== undefined) {
            sharedStyle.textAlign = textAlign;
        }
        const actualThAttributes = { ...thAttributes, style: { textAlign: 'left', whiteSpace: 'nowrap', ...(thAttributes && thAttributes.style), ...sharedStyle }, ...(headerCssClass && { className: headerCssClass }) };

        const tdAttributesStatic: React.TdHTMLAttributes<HTMLTableDataCellElement> = typeof (tdAttributes) === 'function' ? sharedStyle && { style: sharedStyle } : { ...tdAttributes, style: { ...(tdAttributes && tdAttributes.style), ...sharedStyle } };
        const tdAttributesFunc = typeof (tdAttributes) === 'function' ? tdAttributes : undefined;

        let actualTdAttributes: ((props: CellProps<TRow, TExtraProps>) => React.TdHTMLAttributes<HTMLTableDataCellElement>);

        if (typeof cssClass === 'function') {
            actualTdAttributes = tdAttributesFunc ? ((row) => mergeAttributes(tdAttributesStatic, tdAttributesFunc(row), { className: cssClass(row) })) : ((row) => ({ ...tdAttributesStatic, className: cssClass(row) }));
        } else if (typeof (cssClass) === 'string') {
            tdAttributesStatic.className = cssClass;
            actualTdAttributes = tdAttributesFunc ? (row) => mergeAttributes(tdAttributesStatic, tdAttributesFunc(row)) : () => tdAttributesStatic;
        } else {
            actualTdAttributes = tdAttributesFunc ? (row) => mergeAttributes(tdAttributesStatic, tdAttributesFunc(row)) : () => tdAttributesStatic;
        }

        const core = getColumnCore(options);

        const internalColumn: InternalColumn<TRow, TExtraProps> = {
            ...core,
            includeExtraCellProps: col.includeExtraCellProps !== undefined && col.includeExtraCellProps !== null ? col.includeExtraCellProps : this.props.alwaysIncludeExtraCellProps,
            headerComponent: col.headerComponent || this.props.thInnerComponent,
            headerComponentProps: col.headerComponentProps || this.props.thInnerComponentProps,
            valueComponent: col.valueComponent || this.props.valueComponent,
            tdAttributes: actualTdAttributes,
            thAttributes: actualThAttributes,
            visible: col.visible !== false,
            column: col
        };

        return internalColumn;

    }

    transformProps(newProps: PowerTableProps<TRow, TExtraProps>, oldProps?: PowerTableProps<TRow, TExtraProps>) {

        debuglog('transformProps', { newProps, oldProps });

        if (!oldProps || !shallowEqual(newProps.columns, oldProps.columns)) {
            debuglog('transforming columns', newProps.columns);

            this.columns = this.transformColumns(newProps.columns);
            this.visibleInternalColumns = this.columns.filter((m) => m.visible !== false);
        }

        if (!oldProps || newProps.keyColumn !== oldProps.keyColumn) {

            debuglog('transforming getRowKey');

            this.getRowKey = typeof newProps.keyColumn === 'function' ? newProps.keyColumn : (row) => row[newProps.keyColumn as keyof TRow] as any;
        }

        if (!oldProps || newProps.tdComponent !== oldProps.tdComponent) {
            this.pureTdComponent = makePure(newProps.tdComponent, { componentName: 'pureTdComponent', exclude: ['children', 'row'] });
        }
    }
    render() {

        const {
            rows,
            headComponent: HeadComponent,
            headRowComponent: HeadRow,
            tableComponent: Table,
            bodyComponent: BodyComponent,
            rowComponent,
            rowBuilder: RowBuilder,
            thComponent: HeadCellComponent,
            tdComponent,
            footerComponent: TableFoot,
            footerProps,
            tableClassName,
            tableProps,
            extraCellProps,
            rowHtmlAttributes
        } = this.props;

        const internalColumns = this.visibleInternalColumns;
        const originalColumns = this.visibleOriginalColumns;

        debuglog('ReactPowerTable.render()', this.props);

        const combinedTableProps = tableClassName ? { ...tableProps, className: tableClassName } : tableProps;

        const headerCells = internalColumns.map(c => {
            const { column, thAttributes, headerText, headerComponent: HeaderComponent, headerComponentProps } = c;

            const thCellProps = headerComponentProps({ column, extraCellProps, children: headerText });
            return <HeadCellComponent column={column} key={c.key} htmlAttributes={thAttributes}><HeaderComponent {...thCellProps} /></HeadCellComponent>;
        });

        const rowBuilderProps = { columns: internalColumns, rowComponent, extraCellProps, tdComponent, pureTdComponent: this.pureTdComponent };
        const dataRows = rows.map(row => {

            const rowProps = { ...extraCellProps as any, row, internalColumns } as RowComponentProps<TRow, TExtraProps>;
            const actualRowHtmlAttributes = rowHtmlAttributes && (typeof (rowHtmlAttributes) === 'function' ? rowHtmlAttributes(rowProps) : rowHtmlAttributes);

            return <RowBuilder key={this.getRowKey(row)} row={row} rowHtmlAttributes={actualRowHtmlAttributes} {...rowBuilderProps} />;
        });

        const body = BodyComponent && <BodyComponent rows={rows} columns={originalColumns}>{dataRows}</BodyComponent> || dataRows;

        const actualFooterProps = TableFoot && footerProps && footerProps({ internalColumns, ...extraCellProps as any });

        return (
            <Table {...combinedTableProps}>
                <HeadComponent columns={originalColumns} {...extraCellProps}>
                    <HeadRow columns={originalColumns} {...extraCellProps}>
                        {headerCells}
                    </HeadRow>
                </HeadComponent>

                {body}

                {TableFoot && <TableFoot {...actualFooterProps} />}
            </Table >
        );

    }

}

export function typedTable<TRow, TExtraProps = {}>() {
    return ReactPowerTable as any as React.ComponentClass<PowerTableProps<TRow, TExtraProps>>;
}

export interface PowerTableProps<TRow = {}, TExtraProps = {}> {
    /**
     * Columns to display in table
     */
    columns: Array<Column<TRow, TExtraProps> | string>;

    /**
     * Field name or function to provide unique key for each column
     */
    keyColumn: string | ((row: TRow) => (string | number));

    /**
     * Rows to display in table
     */
    rows: TRow[];

    /** Customize the <table> tag. children are passed to props and must be rendered  */
    tableComponent?: React.ComponentType<React.HTMLProps<HTMLTableElement>>;

    /** Inject custom props into the tableComponent  */
    tableProps?: React.HTMLProps<HTMLTableElement>;
    tableClassName?: string;

    /** Customize the <thead> tag. children are passed to props and must be rendered  */
    headComponent?: HeadComponentType<TRow, TExtraProps>;

    /** Customize the <tr> tag that appears in <thead>. children are passed to props and must be rendered  */
    headRowComponent?: HeadRowComponentType<TRow, TExtraProps>;

    /** Customize the <th> tag that appears in <thead> > <tr>. children are passed to props and must be rendered
     * header cell can also be customize per column using Column.headerCellProps
     */
    thComponent?: HeadCellComponentType<TRow, TExtraProps>;

    /** Default Component that is rendered inside header th for each column */
    thInnerComponent?: HeadCellInnerComponentType<TRow, TExtraProps>;

    thInnerComponentProps?: (props: HeadCellInnerComponentProps<TRow, TExtraProps>) => HeadCellInnerComponentProps<TRow, TExtraProps>;

    /** Customize the <tbody> tag. children are passed to props and must be rendered  */
    bodyComponent?: BodyComponentType<TRow, TExtraProps>;

    /** Customize the <tr> tag that appears in <thead>. children are passed to props and must be rendered  */
    rowComponent?: RowComponentType<TRow, TExtraProps>;

    rowBuilder?: RowBuilderComponentType<TRow, TExtraProps>;

    rowHtmlAttributes?: StaticOrDynamicProps<RowComponentProps<TRow, TExtraProps>, React.HTMLProps<HTMLTableRowElement>>;

    footerComponent?: React.ComponentType<React.HTMLProps<HTMLTableSectionElement>>;

    footerProps?: (props: ColumnsAndExtraProps<TRow, TExtraProps>) => ColumnsAndExtraProps<TRow, TExtraProps>;

    /** Customize the <td> tag that appears in <tbody> > <tr>. children are passed to props and must be rendered
     * table cell can also be customize per column using Column.cellProps, Column.cellComponent and Column.cellComponentProps
     */
    tdComponent?: TdComponentType<TRow, TExtraProps>;

    /** Customize the html that appears in <tbody> > <tr> > <td>. children are passed to props and must be rendered
     * value can also be customize per column using Column.valueComponent
     */
    valueComponent?: React.ComponentType<CellProps<TRow, TExtraProps>>;

    //valueProps?: DynamicProps<ValueComponentProps<TRow, TExtraProps>>;

    /**
     * Optional properties to pass down to valueProps for each column that has includeExtraCellProps set to true
     * or use alwaysIncludeExtraCellProps to always include these props
     */
    extraCellProps?: TExtraProps;
    /**
     * Set to true to pass the extraCellProps into the cellComponentProps of each row
     * default: false
     */
    alwaysIncludeExtraCellProps?: boolean;
}

export type StaticOrDynamicProps<TIn, TOut> = TOut | ((props: TIn) => TOut);
export type DynamicProps<TIn, TOut = TIn> = ((props: TIn) => TOut);

// export interface StrictColumn<TRow = {}, TExtraProps = {}, TValue = any, TFormattedValue = TValue> extends ColumnBase<TRow, TExtraProps, TValue, TFormattedValue> {

//     key: string | number;

//     field: ((row: TRow) => TValue);
//     fieldName: string;
//     includeExtraCellProps?: boolean;

// }

export interface InternalColumn<TRow = {}, TExtraProps = {}, TValue = any, TFormattedValue = TValue> {

    key: string | number;

    field: ((row: TRow) => TValue);
    fieldName: string;

    headerText: string;
    column: Column<TRow, TExtraProps, TValue, TFormattedValue>;
    includeExtraCellProps: boolean;

    tdAttributes: DynamicProps<CellProps<TRow, TExtraProps, TValue>, React.TdHTMLAttributes<HTMLTableDataCellElement>>;
    thAttributes: React.ThHTMLAttributes<HTMLTableHeaderCellElement>;

    headerComponent: HeadCellInnerComponentType<TRow, TExtraProps>;
    headerComponentProps: DynamicProps<HeadCellInnerComponentProps<TRow, TExtraProps>>;
    valueComponent: React.ComponentType<CellProps<TRow, TExtraProps, TValue>>;

    visible: boolean;

}
export interface Column<TRow = {}, TExtraProps = {}, TValue = any, TFormattedValue = TValue> {

    key?: string | number;

    field?: string | ((row: TRow) => TValue);

    /** Shortcut for setting the thAttributes.className attribute */
    headerCssClass?: string;

    /** Shortcut for setting the tdAttributes.className attribute - can be a static string, or a function that will be called for each row for this column */
    cssClass?: ((props: CellProps<TRow, TExtraProps, TValue, TFormattedValue>) => string) | string;

    /** Shortcut for setting the thAttributes.style.width and tdAttributes.style.width */
    width?: number;

    /** Shortcut for setting the thAttributes.style.maxWidth and tdAttributes.style.maxWidth */
    maxWidth?: number;

    /** Shortcut for setting the thAttributes.style.textAlign and tdAttributes.style.textAlign */
    textAlign?: string;

    headerText?: string;
    visible?: boolean;

    includeExtraCellProps?: boolean;

    /** Customize the html attributes set in the th element
     * formerly headerCellProps
     */
    thAttributes?: React.ThHTMLAttributes<HTMLTableHeaderCellElement>;

    /** Component that is rendered inside header th for this column */
    headerComponent?: HeadCellInnerComponentType<TRow, TExtraProps>;

    /** Customize the props that are passed to the headerComponent */
    headerComponentProps?: (props: HeadCellInnerComponentProps<TRow, TExtraProps>) => HeadCellInnerComponentProps<TRow, TExtraProps>;

    /** Customize the html attributes set in the td element
     * formerly cellProps
     */
    tdAttributes?: StaticOrDynamicProps<CellProps<TRow, TExtraProps, TValue, TFormattedValue>, React.TdHTMLAttributes<HTMLTableDataCellElement>>;

    formatter?: (value: TValue, row?: TRow) => TFormattedValue;

    /** Component that is rendered inside td for this column for every row
     * If not specified, it will use the valueComponent set on the Table
     * and if that is not specified, it will just render the value for this cell directly inside the <td>
     * formerly cellComponent
     */
    valueComponent?: React.ComponentType<CellProps<TRow, TExtraProps, TValue, TFormattedValue>>;
    //valueComponent?: React.ComponentClass<ValueComponentProps<TRow, TExtraProps, TValue>> | ((props: ValueComponentProps<TRow, TExtraProps, TValue>) => React.ReactNode);

    /** Customize the props passed to cellComponent for this column
     * use this instead of referencing arbitratry/external state directly inside valueComponent
     * formerlly cellComponentProps
     */
    transformCellProps?: (props: CellProps<TRow, TExtraProps, TValue, TFormattedValue>) => CellProps<TRow, TExtraProps, TValue, TFormattedValue>;

    /** Specify an element for which each valueComponent (or raw value) will be injected
     * examples:
     *    { field: c => c.name, wrapper: <b/> }
     *    { field: c => c.name, wrapper: v=> v.active ? <b/> : <span style={{textDecoration: 'line-through'}}/> }
     *    { field: c => c.name, wrapper: v=> <a href={'customer-detail/' + v.row.CustomerId}/> }
     */
    wrapper?: StaticOrDynamicProps<CellProps<TRow, TExtraProps, TValue, TFormattedValue>, JSX.Element>;

    /** Columns are pure by default, meaning they will not be re-rendered unless their props change */
    pure?: boolean;
}

export type ColumnsAndExtraProps<TRow = {}, TExtraProps = {}> = TExtraProps & {
    columns: Array<Column<TRow, TExtraProps>>;

};

export type HeadComponentType<T = {}, TExtraProps = {}> = React.ComponentType<ColumnsAndExtraProps<T, TExtraProps>>;

export type HeadRowComponentType<T = {}, TExtraProps = {}> = React.ComponentType<ColumnsAndExtraProps<T, TExtraProps>>;

export type HeadCellComponentProps<T = {}, TExtraProps = {}> = TExtraProps & {
    column: Column<T, {}, TExtraProps>;
    htmlAttributes: React.ThHTMLAttributes<HTMLTableHeaderCellElement>
};
export type HeadCellComponentType<T = {}, TExtraProps = {}> = React.ComponentType<HeadCellComponentProps<T, TExtraProps>>;

export type HeadCellInnerComponentProps<T = {}, TExtraProps = {}> = React.HTMLAttributes<HTMLDivElement> & {
    column: Column<T, {}, TExtraProps>;
    extraCellProps?: TExtraProps;
};
export type HeadCellInnerComponentType<T = {}, TExtraProps = {}> = React.ComponentType<HeadCellInnerComponentProps<T, TExtraProps>>;

export type BodyComponentProps<T = {}, TExtraProps = {}> = ColumnsAndExtraProps<T, TExtraProps> & {
    rows: T[];
};
export type BodyComponentType<T = {}, TExtraProps = {}> = React.ComponentType<BodyComponentProps<T, TExtraProps>>;

export type RowComponentProps<T = {}, TExtraProps = {}> = ColumnsAndExtraProps<T, TExtraProps> & {
    row: T;
};
export type RowComponentType<T = {}, TExtraProps = {}> = React.ComponentType<RowComponentProps<T, TExtraProps> & { htmlAttributes: React.HTMLAttributes<HTMLTableRowElement> }>;

export interface RowBuilderComponentProps<TRow = {}, TExtraProps = {}> {
    row: TRow;
    columns: Array<InternalColumn<TRow, TExtraProps>>;

    rowComponent: RowComponentType<TRow, TExtraProps>;
    rowHtmlAttributes: StaticOrDynamicProps<RowComponentProps<TRow, TExtraProps>, React.HTMLProps<HTMLTableRowElement>>;

    /** Customize the <td> tag that appears in <tbody> > <tr>. children are passed to props and must be rendered
     * table cell can also be customize per column using Column.cellProps, Column.cellComponent and Column.cellComponentProps
     */
    tdComponent: TdComponentType<TRow, TExtraProps>;

    pureTdComponent: TdComponentType<TRow, TExtraProps>;

    /** Customize the html that appears in <tbody> > <tr> > <td>. children are passed to props and must be rendered
     * value can also be customize per column using Column.valueComponent
     */
    //defaultValueComponent: React.ComponentType<CellProps<TRow, TExtraProps>>;

    /**
     * Optional properties to pass down to valueProps for each column that has includeExtraCellProps set to true
     * or use alwaysIncludeExtraCellProps to always include these props
     */
    extraCellProps: TExtraProps;
}

export type RowBuilderComponentType<T = {}, TExtraProps = {}> = React.ComponentType<RowBuilderComponentProps<T, TExtraProps>>;

export type TdComponentProps<TRow = {}, TExtraProps = {}, TValue = any, TFormattedValue = TValue> = CellProps<TRow, TExtraProps, TValue, TFormattedValue> & {
    //htmlAttributes: React.TdHTMLAttributes<HTMLTableDataCellElement>
    tdAttributes: DynamicProps<CellProps<TRow, TExtraProps, TValue>, React.TdHTMLAttributes<HTMLTableDataCellElement>>;
};
export type TdComponentType<T = {}, TExtraProps = {}> = React.ComponentType<TdComponentProps<T, TExtraProps>>;
export type CellProps<TRow = {}, TExtraProps = {}, TValue = any, TFormattedValue = TValue> = TExtraProps & {

    row: TRow;
    column: Column<TRow, TExtraProps, TValue, TFormattedValue>;
    value: TValue;
    formattedValue: TFormattedValue;

    //children?: React.ReactNode;
};
