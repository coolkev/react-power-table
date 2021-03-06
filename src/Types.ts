import { TextAlignProperty } from 'csstype';
export interface PowerTableProps<TRow = {}, TExtraProps = {}> {
    /**
     * Columns to display in table
     */
    columns: Array<Column<TRow, TExtraProps>>;
    /**
     * Field name or function to provide unique key for each column
     */
    keyColumn: string | ((row: TRow) => (string | number));
    /**
     * Rows to display in table
     */
    rows: ReadonlyArray<TRow>;
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
    footerComponent?: React.ComponentType<ColumnsAndExtraProps<TRow, TExtraProps> & React.HTMLProps<HTMLTableSectionElement>>;
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
    textAlign?: TextAlignProperty;
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
    column: Column<T, TExtraProps>;
    htmlAttributes: React.ThHTMLAttributes<HTMLTableHeaderCellElement>;
};
export type HeadCellComponentType<T = {}, TExtraProps = {}> = React.ComponentType<HeadCellComponentProps<T, TExtraProps>>;
export type HeadCellInnerComponentProps<T = {}, TExtraProps = {}> = React.HTMLAttributes<HTMLDivElement> & {
    column: Column<T, TExtraProps>;
    extraCellProps?: TExtraProps;
};
export type HeadCellInnerComponentType<T = {}, TExtraProps = {}> = React.ComponentType<HeadCellInnerComponentProps<T, TExtraProps>>;
export type BodyComponentProps<T = {}, TExtraProps = {}> = ColumnsAndExtraProps<T, TExtraProps> & {
    rows: ReadonlyArray<T>;
};
export type BodyComponentType<T = {}, TExtraProps = {}> = React.ComponentType<BodyComponentProps<T, TExtraProps>>;
export type RowComponentProps<T = {}, TExtraProps = {}> = ColumnsAndExtraProps<T, TExtraProps> & {
    row: T;
};
export type RowComponentType<T = {}, TExtraProps = {}> = React.ComponentType<RowComponentProps<T, TExtraProps> & {
    htmlAttributes: React.HTMLAttributes<HTMLTableRowElement>;
}>;
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
};
