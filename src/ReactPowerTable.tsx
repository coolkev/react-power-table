/** @module react-power-table */
import * as React from 'react';
import { getColumnCore } from './Column';
import { debuglog, shallowEqual, makePure } from './utils';

function applyWrapper(wrapper: StaticOrDynamicProps<ValueComponentProps, JSX.Element>, valueProps: ValueComponentProps, valueElement: any) {

    const wrapperElement = typeof (wrapper) === 'function' ? wrapper(valueProps) : wrapper;

    return wrapperElement && React.cloneElement(wrapperElement, null, valueElement) || valueElement;
}

function getValueProps<TRow, TExtraProps>(row: TRow, column: StrictColumn<TRow, any, TExtraProps>, extraProps: TExtraProps) {
    const { valueProps, formatter, field, includeExtraCellProps } = column;
    const value = field(row);

    const formattedValue = formatter ? formatter(value, row) : value;

    const initialValueProps = { ...(includeExtraCellProps && extraProps as any), row, column, value, children: formattedValue };

    return valueProps ? valueProps(initialValueProps) : initialValueProps;

}

// export function ReactPowerTable2<TRow = {}, TExtraProps = {}>() {
//     return ReactPowerTable as any as React.ComponentClass<PowerTableProps<TRow, TExtraProps>>;
// }
// export type ReactPowerTable2<TRow = {}, TExtraProps = {}> = React.ComponentClass<PowerTableProps<TRow, TExtraProps>>;

/** @internal */
export class ReactPowerTable<TRow = {}, TExtraProps = {}> extends React.Component<PowerTableProps<TRow, TExtraProps>, never> {

    static displayName = 'ReactPowerTable';

    static defaultProps: Partial<PowerTableProps> = {
        tableComponent: (props) => <table {...props} />,
        headComponent: ({ children }) => <thead children={children} />,
        headRowComponent: ({ children, }) => <tr children={children} />,
        thComponent: ({ children, htmlAttributes }) => <th children={children} {...htmlAttributes} />,
        thInnerComponent: (props) => {
            const { column, children, ...attributes } = props;
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
            const { columns, row, tdComponent, pureTdComponent, defaultValueComponent, extraCellProps, rowComponent: RowComponent, rowHtmlAttributes } = props;
            const cells = columns.map(c => {
                const { tdAttributes, valueComponent, key, wrapper } = c;
                const valueProps = getValueProps(row, c, extraCellProps);

                const tdHtmlAttributes = typeof (tdAttributes) === 'function' ? tdAttributes(valueProps) : tdAttributes;

                const ValueComponent = valueComponent || defaultValueComponent;
                const valueElement = ValueComponent ? <ValueComponent {...valueProps} /> : valueProps.children;

                const children = wrapper ? applyWrapper(wrapper, valueProps, valueElement) : valueElement;

                const TdComponent = c.pure === false ? tdComponent : pureTdComponent;

                return <TdComponent key={key} {...valueProps} htmlAttributes={tdHtmlAttributes}>{children}</TdComponent>;
            });

            const rowProps = { ...extraCellProps as any, row, columns } as RowComponentProps;
            const actualRowHtmlAttributes = rowHtmlAttributes && (typeof (rowHtmlAttributes) === 'function' ? rowHtmlAttributes(rowProps) : rowHtmlAttributes);
            return <RowComponent {...rowProps} children={cells} htmlAttributes={actualRowHtmlAttributes} />;
        },
        tdComponent: ({ children, htmlAttributes, value }) => {
            debuglog('tdComponent render', value);
            return <td children={children} {...htmlAttributes} />;
        }
    };

    private columns: Array<StrictColumn<TRow, {}, TExtraProps>>;
    private visibleColumns: Array<StrictColumn<TRow, {}, TExtraProps>>;

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

    private transformColumns(columns: Array<Column<TRow, {}, TExtraProps> | string>): Array<StrictColumn<TRow, {}, TExtraProps>> {
        debuglog('Sorting.transformColumns', columns);

        if (this.columns && this.props.columns) {
            //reuse the same column if it hasn't changed from the original
            return columns.map((c, i) => shallowEqual(c, this.props.columns[i]) ? this.columns[i] : this.transformColumn(c));
        }

        return columns.map((c) => this.transformColumn(c));
    }

    private transformColumn(options: Column<TRow, any, TExtraProps> | string): StrictColumn<TRow, any, TExtraProps> {

        debuglog('transformColumn', options);

        const col = typeof options === 'string' ? { fieldName: options } as Column<TRow, {}, TExtraProps> : options;

        const { cssClass, maxWidth, width, headerCssClass, textAlign, tdAttributes, thAttributes, } = col;

        const sharedStyle = { width, maxWidth, textAlign };

        const actualThAttributes = { ...thAttributes, style: { textAlign: 'left', whiteSpace: 'nowrap', ...(thAttributes && thAttributes.style), ...sharedStyle }, ...(headerCssClass && { className: headerCssClass }) };

        const tdAttributesStatic: React.TdHTMLAttributes<HTMLTableDataCellElement> = typeof (tdAttributes) === 'function' ? { style: sharedStyle } : { ...tdAttributes, style: { ...(tdAttributes && tdAttributes.style), ...sharedStyle } };
        const tdAttributesFunc = typeof (tdAttributes) === 'function' ? tdAttributes : undefined;

        let actualTdAttributes: ((props: ValueComponentProps<TRow, TExtraProps>) => React.TdHTMLAttributes<HTMLTableDataCellElement>);

        if (typeof cssClass === 'function') {
            actualTdAttributes = tdAttributesFunc ? (row) => ({ ...tdAttributesStatic, ...tdAttributesFunc(row), className: cssClass(row) }) : (row) => ({ ...tdAttributesStatic, className: cssClass(row) });
        } else if (typeof (cssClass) === 'string') {
            tdAttributesStatic.className = cssClass;
            actualTdAttributes = tdAttributesFunc ? (row) => ({ ...tdAttributesStatic, ...tdAttributesFunc(row) }) : () => tdAttributesStatic;
        } else {
            actualTdAttributes = tdAttributesFunc ? (row) => ({ ...tdAttributesStatic, ...tdAttributesFunc(row) }) : () => tdAttributesStatic;
        }

        const core = getColumnCore(options);

        return {
            includeExtraCellProps: this.props.alwaysIncludeExtraCellProps,
            headerComponent: this.props.thInnerComponent,
            ...col,
            ...core,
            tdAttributes: actualTdAttributes,
            thAttributes: actualThAttributes,
        } as StrictColumn<TRow, {}, TExtraProps>;

    }

    transformProps(newProps: PowerTableProps<TRow, TExtraProps>, oldProps?: PowerTableProps<TRow, TExtraProps>) {

        debuglog('transformProps', { newProps, oldProps });

        if (!oldProps || !shallowEqual(newProps.columns, oldProps.columns)) {
            debuglog('transforming columns', newProps.columns);

            this.columns = this.transformColumns(newProps.columns);
            this.visibleColumns = this.columns.filter((m) => m.visible !== false);
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
            tableClassName,
            tableProps,
            extraCellProps,
            rowHtmlAttributes
        } = this.props;

        const columns = this.visibleColumns;

        debuglog('ReactPowerTable.render()', this.props);

        const combinedTableProps = tableClassName ? { ...tableProps, className: tableClassName } : tableProps;

        const headerCells = columns.map(c => {
            const { headerComponent: HeaderComponent, thAttributes, headerText } = c;
            return <HeadCellComponent column={c} key={c.key} htmlAttributes={thAttributes}><HeaderComponent column={c} >{headerText}</HeaderComponent></HeadCellComponent>;
        });

        const rowBuilderProps = { columns, rowComponent, extraCellProps, tdComponent, pureTdComponent: this.pureTdComponent, defaultValueComponent: this.props.valueComponent };
        const dataRows = rows.map(row => {

            const rowProps = { ...extraCellProps as any, row, columns } as RowComponentProps<TRow, TExtraProps>;
            const actualRowHtmlAttributes = rowHtmlAttributes && (typeof (rowHtmlAttributes) === 'function' ? rowHtmlAttributes(rowProps) : rowHtmlAttributes);

            return <RowBuilder key={this.getRowKey(row)} row={row} rowHtmlAttributes={actualRowHtmlAttributes} {...rowBuilderProps} />;
        });

        const body = BodyComponent && <BodyComponent rows={rows} columns={columns}>{dataRows}</BodyComponent> || dataRows;

        return (
            <Table {...combinedTableProps }>
                <HeadComponent columns={columns} {...extraCellProps}>
                    <HeadRow columns={columns} {...extraCellProps}>
                        {headerCells}
                    </HeadRow>
                </HeadComponent>

                {body}

                {TableFoot && <TableFoot />}
            </Table >
        );

    }

}

export function typedTable<TRow = {}, TExtraProps = {}>() {
    return ReactPowerTable as any as React.ComponentClass<PowerTableProps<TRow, TExtraProps>>;
}

export interface PowerTableProps<TRow = {}, TExtraProps = {}> {
    /**
     * Columns to display in table
     */
    columns: Array<Column<TRow, any, TExtraProps> | string>;

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

    /** Customize the <tbody> tag. children are passed to props and must be rendered  */
    bodyComponent?: BodyComponentType<TRow, TExtraProps>;

    /** Customize the <tr> tag that appears in <thead>. children are passed to props and must be rendered  */
    rowComponent?: RowComponentType<TRow, TExtraProps>;

    rowBuilder?: RowBuilderComponentType<TRow, TExtraProps>;

    rowHtmlAttributes?: StaticOrDynamicProps<RowComponentProps<TRow, TExtraProps>, React.HTMLProps<HTMLTableRowElement>>;

    footerComponent?: React.ComponentType<React.HTMLProps<HTMLTableSectionElement>>;

    /** Customize the <td> tag that appears in <tbody> > <tr>. children are passed to props and must be rendered
     * table cell can also be customize per column using Column.cellProps, Column.cellComponent and Column.cellComponentProps
     */
    tdComponent?: TdComponentType<TRow, TExtraProps>;

    /** Customize the html that appears in <tbody> > <tr> > <td>. children are passed to props and must be rendered
     * value can also be customize per column using Column.valueComponent
     */
    valueComponent?: React.ComponentType<ValueComponentProps<TRow, TExtraProps>>;

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

export interface StrictColumn<TRow = {}, TValue = any, TExtraProps = {}> {

    key?: string | number;

    field?: ((row: TRow) => TValue);
    fieldName?: string;

    headerText?: string;
    visible?: boolean;

    includeExtraCellProps?: boolean;

    /** Customize the html attributes set in the th element
     * formerly headerCellProps
     */
    thAttributes?: React.ThHTMLAttributes<HTMLTableHeaderCellElement>;

    /** Component that is rendered inside header th for this column */
    headerComponent?: HeadCellInnerComponentType<TRow, TExtraProps>;

    /** Customize the html attributes set in the td element
     * formerly cellProps
     */
    tdAttributes?: StaticOrDynamicProps<ValueComponentProps<TRow, TExtraProps, TValue>, React.TdHTMLAttributes<HTMLTableDataCellElement>>;

    formatter?: (value: any, row?: TRow) => any;

    /** Component that is rendered inside td for this column for every row
     * If not specified, it will use the valueComponent set on the Table
     * and if that is not specified, it will just render the value for this cell directly inside the <td>
     * formerly cellComponent
     */
    valueComponent?: React.ComponentType<ValueComponentProps<TRow, TExtraProps, TValue>>;
    //valueComponent?: React.ComponentClass<ValueComponentProps<TRow, TExtraProps, TValue>> | ((props: ValueComponentProps<TRow, TExtraProps, TValue>) => React.ReactNode);

    /** Customize the props passed to cellComponent for this column
     * use this instead of referencing arbitratry/external state directly inside valueComponent
     * formerlly cellComponentProps
     */
    valueProps?: (props: ValueComponentProps<TRow, TExtraProps>) => ValueComponentProps<TRow, TExtraProps, TValue>;

    /** Specify an element for which each valueComponent (or raw value) will be injected
     * examples:
     *    { field: c => c.name, wrapper: <b/> }
     *    { field: c => c.name, wrapper: v=> v.active ? <b/> : <span style={{textDecoration: 'line-through'}}/> }
     *    { field: c => c.name, wrapper: v=> <a href={'customer-detail/' + v.row.CustomerId}/> }
     */
    wrapper?: StaticOrDynamicProps<ValueComponentProps<TRow, TExtraProps, TValue>, JSX.Element>;

    /** Columns are pure by default, meaning they will not be re-rendered unless their props change */
    pure?: boolean;
}

export interface Column<TRow = {}, TValue = any, TExtraProps = {}> extends StrictColumn<TRow, TValue, TExtraProps> {

    /** Shortcut for setting the thAttributes.className attribute */
    headerCssClass?: string;

    /** Shortcut for setting the tdAttributes.className attribute - can be a static string, or a function that will be called for each row for this column */
    cssClass?: ((props: ValueComponentProps<TRow, TExtraProps, TValue>) => string) | string;

    /** Shortcut for setting the thAttributes.style.width and tdAttributes.style.width */
    width?: number;

    /** Shortcut for setting the thAttributes.style.maxWidth and tdAttributes.style.maxWidth */
    maxWidth?: number;

    /** Shortcut for setting the thAttributes.style.textAlign and tdAttributes.style.textAlign */
    textAlign?: string;

}

export type ColumnsAndExtraProps<TRow = {}, TExtraProps = {}> = TExtraProps & {
    columns: Array<StrictColumn<TRow, {}, TExtraProps>>;

};

export type HeadComponentType<T = {}, TExtraProps = {}> = React.ComponentType<ColumnsAndExtraProps<T, TExtraProps>>;

export type HeadRowComponentType<T = {}, TExtraProps = {}> = React.ComponentType<ColumnsAndExtraProps<T, TExtraProps>>;

export type HeadCellComponentProps<T = {}, TExtraProps = {}> = TExtraProps & {
    column: StrictColumn<T, {}, TExtraProps>;
    htmlAttributes: React.ThHTMLAttributes<HTMLTableHeaderCellElement>
};
export type HeadCellComponentType<T = {}, TExtraProps = {}> = React.ComponentType<HeadCellComponentProps<T, TExtraProps>>;

export type HeadCellInnerComponentProps<T = {}, TExtraProps = {}> = React.HTMLAttributes<HTMLDivElement> & {
    column: StrictColumn<T, {}, TExtraProps>;
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
    columns: Array<StrictColumn<TRow, {}, TExtraProps>>;

    rowComponent: RowComponentType<TRow, TExtraProps>;
    rowHtmlAttributes: React.HTMLProps<HTMLTableRowElement>;

    /** Customize the <td> tag that appears in <tbody> > <tr>. children are passed to props and must be rendered
     * table cell can also be customize per column using Column.cellProps, Column.cellComponent and Column.cellComponentProps
     */
    tdComponent: TdComponentType<TRow, TExtraProps>;

    pureTdComponent: TdComponentType<TRow, TExtraProps>;

    /** Customize the html that appears in <tbody> > <tr> > <td>. children are passed to props and must be rendered
     * value can also be customize per column using Column.valueComponent
     */
    defaultValueComponent: React.ComponentType<ValueComponentProps<TRow, TExtraProps>>;

    /**
     * Optional properties to pass down to valueProps for each column that has includeExtraCellProps set to true
     * or use alwaysIncludeExtraCellProps to always include these props
     */
    extraCellProps: TExtraProps;
}

export type RowBuilderComponentType<T = {}, TExtraProps = {}> = React.ComponentType<RowBuilderComponentProps<T, TExtraProps>>;

export type TdComponentProps<T = {}, TExtraProps = {}> = ValueComponentProps<T, TExtraProps> & { htmlAttributes: React.TdHTMLAttributes<HTMLTableDataCellElement> };
export type TdComponentType<T = {}, TExtraProps = {}> = React.ComponentType<TdComponentProps<T, TExtraProps>>;
export type ValueComponentProps<T = {}, TExtraProps = {}, TValue = any> = TExtraProps & {

    row: T;
    column: StrictColumn<T, {}, TExtraProps>;
    value: TValue;

    children?: React.ReactNode;
};
