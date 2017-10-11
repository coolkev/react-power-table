/** @module react-power-table */
import * as React from 'react';
import { getColumnCore } from './Column';
import { debuglog, shallowEqual } from './utils';

export class ReactPowerTable<TRow = {}, TExtraProps = {}> extends React.Component<PowerTableProps<TRow, TExtraProps>, never> {

    static displayName = 'ReactPowerTable';

    static defaultProps: Partial<PowerTableProps> = {
        tableComponent: (props) => <table {...props} />,
        headComponent: ({ children }) => <thead children={children} />,
        headRowComponent: ({ children, }) => <tr children={children} />,
        headCellComponent: (props) => {
            const { column, children, ...rest } = props;
            //const attributes = column.headCellAttributes;
            //debuglog('defaultProps tableHeaderCellComponent render', props);
            return <th children={children} {...rest} />;
        },

        bodyComponent: ({ children }) => {

            return <tbody children={children} />;
        },
        rowComponent: (props) => {
            const { children, htmlAttributes } = props;

            return <tr children={children} {...htmlAttributes} />;
        },
        // cellWrapper: ((props) => {
        //     debuglog('cellWrapper render', props);
        //     const { row, column, value, ...rest } = props;
        //     return <td {...rest} />;
        // }),
        // cellComponent: ((props) => {
        //     debuglog('tableCellComponent render', props);
        //     const { children, htmlAttributes } = props;
        //     return <td children={children} {...htmlAttributes} />;
        // }),
        tdComponent: ({ children, htmlAttributes }) => <td children={children} {...htmlAttributes} />,

        // valueComponent: ((props) => {
        //     debuglog('tableCellValueComponent render', props);
        //     return <div>{props.children}</div>;
        // }),
        //dataRowBuilder: DataRowBuilderPureComponent,
        //headerRowBuilder: HeaderRowBuilderComponent
    };

    //private originalColumns: Array<Column | string>;
    private columns: Array<StrictColumn<TRow, {}, TExtraProps>>;
    private visibleColumns: Array<StrictColumn<TRow>>;

    private getRowKey: (row: TRow) => string | number;

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

    private transformColumn(options: Column<TRow, {}, TExtraProps> | string): StrictColumn<TRow, {}, TExtraProps> {

        debuglog('transformColumn', options);

        const col = typeof options === 'string' ? { fieldName: options } as Column<TRow, {}, TExtraProps> : options;

        //const { cellHtmlAttributes, headCellHtmlAttributes } = getCellAndHeaderProps(col);

        //const valueOptions = {};

        const { cssClass, maxWidth, width, headerCssClass, textAlign, tdAttributes, headCellHtmlAttributes } = col;

        const headerProps = { style: { textAlign: 'left', whiteSpace: 'nowrap', ...(headCellHtmlAttributes && headCellHtmlAttributes.style) }, ...headCellHtmlAttributes };

        const cellStaticProps: React.HTMLProps<HTMLTableDataCellElement> = typeof (tdAttributes) === 'function' ? {} : { ...tdAttributes };
        const cellPropsFunc = typeof (tdAttributes) === 'function' ? tdAttributes : undefined;

        //var cssClassFunc: (row: T) => string;

        if (width) {
            cellStaticProps.style = { ...cellStaticProps.style, width };
            headerProps.style = { ...headerProps.style, width };

        }

        if (maxWidth) {
            cellStaticProps.style = { ...cellStaticProps.style, maxWidth };
            headerProps.style = { ...headerProps.style, maxWidth };

        }

        if (textAlign) {
            cellStaticProps.style = { ...cellStaticProps.style, textAlign };
            headerProps.style = { ...headerProps.style, textAlign };
        }

        let actualCellAttributes: ((props: CellComponentProps<TRow, TExtraProps>) => React.HTMLProps<HTMLTableDataCellElement>);

        if (typeof cssClass === 'function') {
            actualCellAttributes = cellPropsFunc ? (row) => ({ ...cellStaticProps, ...cellPropsFunc(row), className: cssClass(row) }) : (row) => ({ ...cellStaticProps, className: cssClass(row) });
        } else if (typeof (cssClass) === 'string') {
            cellStaticProps.className = cssClass;
            actualCellAttributes = cellPropsFunc ? (row) => ({ ...cellStaticProps, ...cellPropsFunc(row) }) : () => cellStaticProps;
        } else {
            actualCellAttributes = cellPropsFunc ? (row) => ({ ...cellStaticProps, ...cellPropsFunc(row) }) : () => cellStaticProps;
        }
        if (headerCssClass) {
            headerProps.className = headerCssClass;
        }

        const core = getColumnCore(options);

        return {
            includeExtraCellProps: this.props.alwaysIncludeExtraCellProps,
            value: { ...this.props.value, ...col.value },
            cell: { ...this.props.cell, ...col.cell },
            ...col,
            ...core,
            tdAttributes,
            headCellHtmlAttributes
        } as StrictColumn<TRow, {}, TExtraProps>;

        //const col = transformColumn(column);

        // if (!col.value) {
        //     col.value
        // }
        // if (!col.valueComponent) {
        //     col.valueComponent = makePure(this.props.valueComponent);

        //     if (!col.cellComponent) {
        //         col.cellComponent = makePure(this.props.cellComponent, { exclude: 'children' as any });
        //     }
        // }

        // if (!col.cellComponent) {
        //     col.cellComponent = this.props.cellComponent;
        // }

        // return {
        //     includeExtraCellProps: this.props.alwaysIncludeExtraCellProps,
        //     headCellComponent: this.props.headCellComponent,
        //     ...col
        // };

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

            this.getRowKey = typeof newProps.keyColumn === 'function' ? newProps.keyColumn : (row) => row[newProps.keyColumn as string];
        }

    }
    render() {

        const {
            rows,
            //dataRowBuilder,
            headComponent: HeadComponent,
            headRowComponent: HeadRow,
            //headCellComponent: HeadCellComponent,
            tableComponent: Table,
            bodyComponent: BodyComponent,
            rowComponent: RowComponent,
            //tableHeaderComponent: TableHead,
            //tableHeaderRowComponent,
            //tableBodyComponent: TableBody,
            //tableRowComponent,
            tableFooterComponent: TableFoot,
            tableClassName,
            tableProps,
            extraCellProps,
            rowHtmlAttributes
        } = this.props;

        const columns = this.columns;

        debuglog('ReactPowerTable.render()', this.props);

        const combinedTableProps = tableClassName ? { ...tableProps, className: tableClassName } : tableProps;

        const headerCells = columns.map(c => {
            const { headCellComponent: HeadCellComponent, headCellHtmlAttributes } = c;
            return <HeadCellComponent column={c} key={c.key} {...headCellHtmlAttributes}><span>{c.headerText}</span></HeadCellComponent>;
        });

        const dataRows = rows.map(row => {
            const cells = columns.map(c => {
                const { tdComponent: CellComponent, key, field, value: valueOptions, formatter, cellHtmlAttributes } = c;
                const value = field(row);
                const ValueComponent = valueOptions.component;

                const formattedValue = formatter ? formatter(value, row) : value;

                const cellComponentProps = { ...(c.includeExtraCellProps ? extraCellProps : undefined) as any, row, column: c, value } as CellComponentProps<TRow, TExtraProps>;
                const htmlAttributes = cellHtmlAttributes(cellComponentProps);
                return <CellComponent key={key} {...cellComponentProps} htmlAttributes={htmlAttributes}><ValueComponent {...cellComponentProps} children={formattedValue} /></CellComponent>;
            });

            const rowProps = { ...extraCellProps as any, row, columns } as RowComponentProps<TRow, TExtraProps>;
            const actualRowHtmlAttributes = rowHtmlAttributes && (typeof (rowHtmlAttributes) === 'function' ? rowHtmlAttributes(rowProps) : rowHtmlAttributes);
            return <RowComponent key={this.getRowKey(row)} {...rowProps} children={cells} htmlAttributes={actualRowHtmlAttributes} />;
        });

        return (
            <Table {...combinedTableProps }>
                <HeadComponent columns={columns}>
                    <HeadRow columns={columns}>
                        {headerCells}
                    </HeadRow>
                </HeadComponent>

                <BodyComponent rows={rows} columns={columns}>
                    {dataRows}
                </BodyComponent>

                {TableFoot && <TableFoot />}
            </Table >
        );

    }

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
    //rowProps?: React.HTMLProps<HTMLTableRowElement> | ((row: T) => React.HTMLProps<HTMLTableRowElement>);

    loading?: boolean;

    //dataRowBuilder?: React.ComponentType<DataRowBuilderProps<T>>;
    //components?: GridComponents<T>

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
    headCellComponent?: HeadCellComponentType<TRow, TExtraProps>;

    /** Customize the component tag that renders in <thead> > <tr> > <th>.
     */
    //tableHeaderCellValueComponent?: React.ComponentType<HeaderComponentProps<T>>;

    /** Customize the <tbody> tag. children are passed to props and must be rendered  */
    bodyComponent?: BodyComponentType<TRow, TExtraProps>;

    /** Customize the <tr> tag that appears in <thead>. children are passed to props and must be rendered  */
    rowComponent?: RowComponentType<TRow, TExtraProps>;

    rowHtmlAttributes?: StaticOrDynamicProps<RowComponentProps<TRow>, React.HTMLProps<HTMLTableRowElement>>;
    /** Customize the <td> tag that appears in <tbody> > <tr>. children are passed to props and must be rendered
     * table cell can also be customize per column using Column.cellProps, Column.cellComponent and Column.cellComponentProps
     */
    cell?: CellOptions<TRow, TExtraProps>;

    //cellComponent?: CellComponentType<TRow, TExtraProps>;

    //cellWrapper?: CellWrapperType<T, TExtraProps>;

    /** Customize the html that appears in <tbody> > <tr> > <td>. children are passed to props and must be rendered
     * value can also be customize per column using Column.valueComponent
     */
    //valueComponent?: ValueComponentType<T, TExtraProps>;
    value?: ValueOptions<TRow, TExtraProps>;

    tableFooterComponent?: React.ComponentType<React.HTMLProps<HTMLTableSectionElement>>;

    extraCellProps?: TExtraProps;
    /**
     * Set to true to pass the extraCellProps into the cellComponentProps of each row
     * default: false
     */
    alwaysIncludeExtraCellProps?: boolean;
}

export type StaticOrDynamicProps<TIn, TOut> = TOut | ((props: TIn) => TOut);
export type DynamicProps<TIn, TOut> = ((props: TIn) => TOut);

export interface StrictColumn<TRow = {}, TValue = {}, TExtraProps = {}> {

    key: string | number;

    field: ((row: TRow) => TValue);
    fieldName: string;

    headerText: string;

    formatter: (value: any, row?: TRow) => any;

    headCellComponent: HeadCellComponentType<TRow, TExtraProps>;
    headCellHtmlAttributes: React.ThHTMLAttributes<HTMLTableHeaderCellElement>;

    tdComponent: CellComponentType<TRow, TExtraProps>;
    tdHtmlAttributes: DynamicProps<CellComponentProps<TRow, TExtraProps>, React.TdHTMLAttributes<HTMLTableDataCellElement>>;

    //valueComponent: ValueComponentType<TRow, TExtraProps>;

    visible?: boolean;

    includeExtraCellProps?: boolean;

    value?: ValueOptions<TRow, TExtraProps>;
}

export interface Column<TRow = {}, TValue = {}, TExtraProps = {}> {
    key?: string | number;
    formatter?: (value: TValue, row?: TRow) => any;

    headCellComponent?: HeadCellComponentType<TRow, TExtraProps>;
    headCellHtmlAttributes?: React.ThHTMLAttributes<HTMLTableHeaderCellElement>;

    //tdComponent?: CellComponentType<TRow, TExtraProps>;
    tdAttributes?: StaticOrDynamicProps<CellComponentProps<TRow, TExtraProps>, React.TdHTMLAttributes<HTMLTableDataCellElement>>;

    valueComponent?: ValueComponentType<TRow, TExtraProps>;

    valueProps?: ValueComponentProps<TRow, TExtraProps>;

    field?: ((row: TRow) => TValue);
    fieldName?: string;
    headerText?: string;

    headerCssClass?: string;
    cssClass?: ((props: CellComponentProps<TRow, TExtraProps>) => string) | string;
    width?: number;
    maxWidth?: number;
    textAlign?: string;

    /**
     * default: true
     */
    visible?: boolean;

    /**
     * Set to false if you are using a custom cellComponent and relying on state or other data not passed into the cellProps
     * default: true
     */
    //pure?: boolean;

    /**
     * Set to true to pass the extraCellProps into the cellComponentProps of each row
     * default: TableProps.alwaysIncludeExtraCellProps
     */
    includeExtraCellProps?: boolean;

    //cell?: CellOptions<TRow, TExtraProps>;

    //value?: ValueOptions<TRow, TExtraProps>;

}

export interface ValueOptions<TRow = {}, TExtraProps = {}> {
    component?: ValueComponentType<TRow, TExtraProps>;
    props?: (props: ValueComponentProps<TRow, TExtraProps>) => ValueComponentProps<TRow, TExtraProps>;
    htmlAttributes?: StaticOrDynamicProps<ValueComponentProps<TRow, TExtraProps>, React.HTMLAttributes<HTMLDivElement>>;

}

export interface CellOptions<TRow = {}, TExtraProps = {}> {
    component?: CellComponentType<TRow, TExtraProps>;
    props?: (props: CellComponentProps<TRow, TExtraProps>) => CellComponentProps<TRow, TExtraProps>;
    htmlAttributes?: StaticOrDynamicProps<CellComponentProps<TRow, TExtraProps>, React.TdHTMLAttributes<HTMLTableDataCellElement>>;

}
export type HeadComponentProps<T = {}, TExtraProps = {}> = TExtraProps & {
    columns: Array<StrictColumn<T, {}, TExtraProps>>;

    //rowComponent: React.ComponentType<HeadRowComponentProps<T, TExtraProps>>;
};
//} & React.HTMLAttributes<HTMLTableSectionElement>;
export type HeadComponentType<T = {}, TExtraProps = {}> = React.ComponentType<HeadComponentProps<T, TExtraProps>>;

export type HeadRowComponentProps<T = {}, TExtraProps = {}> = TExtraProps & {
    columns: Array<StrictColumn<T, {}, TExtraProps>>;
};
//} & React.HTMLAttributes<HTMLTableRowElement>;
export type HeadRowComponentType<T = {}, TExtraProps = {}> = React.ComponentType<HeadRowComponentProps<T, TExtraProps>>;

export type HeadCellComponentProps<T = {}, TExtraProps = {}> = TExtraProps & {
    column: StrictColumn<T, {}, TExtraProps>;
    //};
} & React.ThHTMLAttributes<HTMLTableHeaderCellElement>;
export type HeadCellComponentType<T = {}, TExtraProps = {}> = React.ComponentType<HeadCellComponentProps<T, TExtraProps>>;

export type BodyComponentProps<T = {}, TExtraProps = {}> = TExtraProps & {
    rows: T[];
    columns: Array<StrictColumn<T, {}, TExtraProps>>;

    //rowComponent: React.ComponentType<RowComponentProps<T, TExtraProps>>;

    //rowKeyFunc: (row: T) => string | number;
} & React.HTMLAttributes<HTMLTableSectionElement>;
export type BodyComponentType<T = {}, TExtraProps = {}> = React.ComponentType<BodyComponentProps<T, TExtraProps>>;

export type RowComponentProps<T = {}, TExtraProps = {}> = TExtraProps & {
    row: T;
    columns: Array<StrictColumn<T, {}, TExtraProps>>;

};
export type RowComponentType<T = {}, TExtraProps = {}> = React.ComponentType<RowComponentProps<T, TExtraProps> & { htmlAttributes: React.HTMLAttributes<HTMLTableRowElement> }>;

export type CellComponentProps<T = {}, TExtraProps = {}> = TExtraProps & {

    row: T;
    column: StrictColumn<T, {}, TExtraProps>;

    value: any;

    //valueComponent: ValueComponentType<T, TExtraProps>;
};
//} & React.TdHTMLAttributes<HTMLTableCellElement>;
export type CellComponentType<T = {}, TExtraProps = {}> = React.ComponentType<CellComponentProps<T, TExtraProps> & { htmlAttributes: React.TdHTMLAttributes<HTMLTableCellElement> }>;

// export type CellWrapperProps<T = {}, TExtraProps = {}> = TExtraProps & {
//     row: T;
//     column: StrictColumn<T, {}, TExtraProps>;

//     value: any;

// } & React.TdHTMLAttributes<HTMLTableCellElement>;
// export type CellWrapperType<T = {}, TExtraProps = {}> = React.ComponentType<CellWrapperProps<T, TExtraProps>>;

export type ValueComponentProps<T = {}, TExtraProps = {}, TValue = {}> = TExtraProps & {

    row: T;
    column: StrictColumn<T, {}, TExtraProps>;
    value: TValue;

    children: any;
};
export type ValueComponentType<T = {}, TExtraProps = {}> = React.ComponentType<ValueComponentProps<T, TExtraProps>>;
