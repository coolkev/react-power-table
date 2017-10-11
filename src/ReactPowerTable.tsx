/** @module react-power-table */
import * as React from 'react';
import { transformColumn } from './Column';
import { debuglog, makePure, shallowEqual } from './utils';

export const DataRowBuilderComponent: React.SFC<DataRowBuilderProps<any>> = (props) => {

    const { row, columns, rowComponent: RowComponent, children, rowProps, ...extraCellProps } = props;

    debuglog('DataRowComponent render', props);
    const cells = columns.map((col) => {

        const value = col.field(row);
        const formattedValue = col.formatter ? col.formatter(value, row) : value;

        const { includeExtraCellProps, tdComponent: TdComponent, cellComponent } = col;

        const rowValueProps: CellProps = includeExtraCellProps ? { row, column: col, children: formattedValue, value, ...extraCellProps } : { row, column: col, children: formattedValue, value };

        const tdProps = col.tdProps(rowValueProps);

        const valueComponentProps = col.cellComponentProps ? col.cellComponentProps(rowValueProps) : rowValueProps;

        return <TdComponent key={col.key} cellProps={tdProps} valueComponent={cellComponent} {...valueComponentProps} />;

    });

    return (
        <RowComponent columns={columns} row={row} extraProps={extraCellProps}>
            {cells}
        </RowComponent>
    );

};
DataRowBuilderComponent.displayName = 'DataRowBuilderComponent';

export const DataRowBuilderPureComponent = makePure(DataRowBuilderComponent);

export const HeaderRowBuilderComponent: React.ComponentType<HeaderRowBuilderProps> = (props) => {

    const { columns, tableHeaderRowComponent: TableHeadRow, extraCellProps } = props;

    debuglog('HeaderRowComponent render', props);

    const header = columns.map((c) => {
        const TableHeadCell = c.thComponent;
        const TableHeaderCellValueComponent = c.headerComponent;

        return <TableHeadCell key={c.key} column={c} extraProps={extraCellProps} {...c.thProps}><TableHeaderCellValueComponent column={c} extraProps={extraCellProps} /></TableHeadCell>;

    });

    return <TableHeadRow>{header}</TableHeadRow>;

};

HeaderRowBuilderComponent.displayName = 'HeaderRowBuilderComponent';
export const HeaderRowBuilderPureComponent = makePure(HeaderRowBuilderComponent, { deeperCompareProps: 'extraCellProps' });

/**
 * Primary table component
 */
export class ReactPowerTable extends React.Component<GridProps<any>, never> {

    static displayName = 'ReactPowerTable';

    static defaultProps: Partial<GridProps<any>> = {
        tableComponent: (props) => <table {...props} />,
        tableHeaderComponent: (props) => <thead {...props} />,
        tableHeaderRowComponent: (props) => <tr {...props} />,
        tableHeaderCellComponent: (props) => {
            const { children, column, extraProps, ...rest } = props;
            debuglog('defaultProps tableHeaderCellComponent render', props);
            return <th {...rest}>{children}</th>;
        },
        tableHeaderCellValueComponent: (props) => {
            //const { children, column, extraProps, ...rest } = props;
            debuglog('defaultProps tableHeaderCellValueComponent render', props);
            //debuglog('defaultProps thComponent render', props);
            return <span>{props.column.headerText}</span>;
        },
        tableBodyComponent: (props) => <tbody>{props.children}</tbody>,
        tableRowComponent: (props) => {
            const { row, columns, extraProps, ...rest } = props;
            return <tr{...rest} />;
        },
        defaultTdComponent: ((props) => {
            debuglog('tableCellComponent render', props);
            const { valueComponent: ValueComponent, cellProps, ...rest } = props;

            return <td{...cellProps}><ValueComponent {...rest} /></td>;
        }),
        defaultCellComponent: ((props) => {
            debuglog('tableCellValueComponent render', props);
            return <div>{props.children}</div>;
        }),
        //dataRowBuilder: DataRowBuilderPureComponent,
        headerRowBuilder: HeaderRowBuilderComponent
    };

    //private originalColumns: Array<Column | string>;
    private columns: Array<StrictColumn<any>>;
    private visibleColumns: Array<StrictColumn<any>>;

    private getRowKey: (row: any) => string | number;

    constructor(props: GridProps<any>) {
        super(props);
        debuglog('constructor', props);

        this.transformProps(props);

    }

    componentWillReceiveProps(nextProps: GridProps<any>) {
        debuglog('componentWillReceiveProps', nextProps);

        this.transformProps(nextProps, this.props);

    }

    // shouldComponentUpdate(nextProps: GridProps<any>) {

    //     const equal = shallowEqual(this.props, nextProps, 'extraCellProps');

    //     if (equal) {
    //         const equal2 = shallowEqual(this.props.extraCellProps, nextProps.extraCellProps);

    //         if (!equal2) {
    //             debuglog('shouldComponentUpdate returned true because extraCellProps changed', this.props.extraCellProps, nextProps.extraCellProps);
    //             return true;
    //         }
    //     }
    //     // if (result) {
    //     //     const fields = distinct(Object.keys(this.props).concat(Object.keys(nextProps)));
    //     //     for (const f of fields) {

    //     //         const v1 = this.props[f];
    //     //         const v2 = nextProps[f];

    //     //         if (Array.isArray(v1) || Array.isArray(v2)) {
    //     //             if (v1.length !== v2.length) {
    //     //                 debuglog('returned true arrays different length field: ' + f, v1, v2);
    //     //             }
    //     //             for (let x = 0; x < v1.length; x++) {
    //     //                 if (!shallowEqual(v1[x], v2[x])) {
    //     //                     debuglog('returned true array values changed field: ' + f, v1[x], v2[x]);

    //     //                 }
    //     //             }

    //     //         } else {
    //     //             const result2 = shallowEqual(v1, v2);

    //     //             if (!result2) {
    //     //                 debuglog('returned true ' + f + ' changed', v1, v2);
    //     //             }
    //     //         }
    //     //     }

    //     // }

    //     return !equal;
    // }
    private transformColumns(columns: Array<Column<any> | string>): Array<StrictColumn<any>> {
        debuglog('Sorting.transformColumns', columns);

        if (this.columns && this.props.columns) {
            //reuse the same column if it hasn't changed from the original
            return columns.map((c, i) => shallowEqual(c, this.props.columns[i]) ? this.columns[i] : this.transformColumn(c));
        }

        return columns.map((c) => this.transformColumn(c));
    }

    private transformColumn(column: Column | string): StrictColumn {

        const col = transformColumn(column);

        return {
            tdComponent: col.pure !== false ? makePure(this.props.defaultTdComponent) : this.props.defaultTdComponent,
            cellComponent: col.pure !== false ? makePure(this.props.defaultCellComponent) : this.props.defaultCellComponent,
            includeExtraCellProps: this.props.alwaysIncludeExtraCellProps,
            thComponent: this.props.tableHeaderCellComponent,
            headerComponent: this.props.tableHeaderCellValueComponent,
            ...col
        };

    }

    transformProps(newProps: GridProps<any>, oldProps?: GridProps<any>) {

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
    // const FgRed = "\x1b[31m";
    // const FgGreen = "\x1b[32m";
    // const Reset = "\x1b[0m";

    // if (changes.length > 0) {
    //     console.log(FgRed + 'ReactPowerTable.transformProps has changes' + Reset, changes);
    // }
    // else {
    //     console.log(FgGreen + 'ReactPowerTable.transformProps does not have any changes' + Reset);

    // }

    render() {

        const { rows,
            dataRowBuilder,
            headerRowBuilder: HeaderRowBuilder,
            tableComponent: Table,
            tableHeaderComponent: TableHead,
            tableHeaderRowComponent,
            tableBodyComponent: TableBody,
            tableRowComponent,
            tableFooterComponent: TableFoot,
            tableClassName,
            tableProps,
            extraCellProps,
            rowProps
    } = this.props;

        const columns = this.columns;

        debuglog('ReactPowerTable.render()', this.props);

        const allColumnsPure = columns.every(c => c.pure !== false);

        const DataRowBuilder = dataRowBuilder || (allColumnsPure ? DataRowBuilderPureComponent : DataRowBuilderComponent);

        const dataRows = rows.map((row) => {
            const key = this.getRowKey(row);
            const actualRowProps = rowProps && (typeof (rowProps) === 'function' ? rowProps({ row, columns, extraProps: extraCellProps, ...extraCellProps }) : rowProps);
            debuglog('DataRow map');

            return (
                <DataRowBuilder key={key} columns={columns} row={row} rowComponent={tableRowComponent} {...extraCellProps} rowProps={actualRowProps} />
            );

        });

        const combinedTableProps = tableClassName ? { ...tableProps, className: tableClassName } : tableProps;

        const headerRow = (
            <HeaderRowBuilder
                columns={columns}
                extraCellProps={extraCellProps}
                tableHeaderRowComponent={tableHeaderRowComponent}

            />
        );

        return (
            <Table {...combinedTableProps }>
                <TableHead>
                    {headerRow}
                </TableHead>

                {TableBody ? <TableBody>{dataRows}</TableBody> : dataRows}

                {TableFoot && <TableFoot />}
            </Table >
        );

    }

}

export interface GridProps<T = {}, TExtraProps = {}> {
    /**
     * Columns to display in table
     */
    columns: Array<Column<T, any, TExtraProps> | string>;

    /**
     * Field name or function to provide unique key for each column
     */
    keyColumn: string | ((row: T) => (string | number));

    /**
     * Rows to display in table
     */
    rows: T[];
    //rowProps?: React.HTMLProps<HTMLTableRowElement> | ((row: T) => React.HTMLProps<HTMLTableRowElement>);

    loading?: boolean;

    headerRowBuilder?: React.ComponentType<HeaderRowBuilderProps<T>>;

    dataRowBuilder?: React.ComponentType<DataRowBuilderProps<T>>;
    //components?: GridComponents<T>

    /** Customize the <table> tag. children are passed to props and must be rendered  */
    tableComponent?: React.ComponentType<React.HTMLProps<HTMLTableElement>>;

    /** Inject custom props into the tableComponent  */
    tableProps?: React.HTMLProps<HTMLTableElement>;
    tableClassName?: string;

    /** Customize the <thead> tag. children are passed to props and must be rendered  */
    tableHeaderComponent?: React.ComponentType<React.HTMLProps<HTMLTableSectionElement>>;

    /** Customize the <tr> tag that appears in <thead>. children are passed to props and must be rendered  */
    tableHeaderRowComponent?: React.ComponentType<React.HTMLProps<HTMLTableRowElement>>;

    /** Customize the <th> tag that appears in <thead> > <tr>. children are passed to props and must be rendered
     * header cell can also be customize per column using Column.headerCellProps
     */
    tableHeaderCellComponent?: React.ComponentType<HeaderComponentProps<T> & React.HTMLProps<HTMLTableHeaderCellElement>>;

    /** Customize the component tag that renders in <thead> > <tr> > <th>.
     */
    tableHeaderCellValueComponent?: React.ComponentType<HeaderComponentProps<T>>;

    /** Customize the <tbody> tag. children are passed to props and must be rendered  */
    tableBodyComponent?: React.ComponentType<React.HTMLProps<HTMLTableSectionElement>>;

    /** Customize the <tr> tag that appears in <thead>. children are passed to props and must be rendered  */
    tableRowComponent?: React.ComponentType<TableRowComponentProps<T>> | React.SFC<TableRowComponentProps<T>>;

    rowProps?: StaticOrDynamicProps<TableRowComponentProps<T>, React.HTMLProps<HTMLTableRowElement>>;
    /** Customize the <td> tag that appears in <tbody> > <tr>. children are passed to props and must be rendered
     * table cell can also be customize per column using Column.cellProps, Column.cellComponent and Column.cellComponentProps  *
     */
    defaultTdComponent?: React.ComponentType<TdComponentProps<T, TExtraProps>>;

    /** This is the default cell value component that will be used if column specific cellComponent is not provided
     */
    defaultCellComponent?: React.ComponentType<CellProps<T>>;

    tableFooterComponent?: React.ComponentType<React.HTMLProps<HTMLTableSectionElement>>;

    extraCellProps?: TExtraProps;
    /**
     * Set to true to pass the extraCellProps into the cellComponentProps of each row
     * default: false
     */
    alwaysIncludeExtraCellProps?: boolean;
}

export interface StrictColumn<TRow = {}, TValue = {}, TExtraProps = {}> {

    key: string | number;

    field: ((row: TRow) => TValue);
    fieldName: string;

    headerText: string;

    tdComponent?: React.ComponentType<CellProps<TRow, TValue, TExtraProps>>;
    tdProps: DynamicProps<CellProps<TRow, TValue, TExtraProps>, React.TdHTMLAttributes<HTMLTableDataCellElement>>;

    formatter: (value: any, row?: TRow) => any;
    cellComponent?: React.ComponentType<Partial<CellProps<TRow, TValue, TExtraProps>>>;
    cellComponentProps: (props: CellProps<TRow, TValue, TExtraProps>) => any;
    headerComponent?: React.ComponentType<HeaderComponentProps<TRow>>;
    thComponent?: React.ComponentType<HeaderComponentProps<TRow> & React.ThHTMLAttributes<HTMLTableHeaderCellElement>>;

    //thProps: React.HTMLProps<HTMLTableHeaderCellElement>;
    thProps: React.ThHTMLAttributes<HTMLTableHeaderCellElement>;

    pure?: boolean;
    visible?: boolean;

    includeExtraCellProps?: boolean;

}

export type StaticOrDynamicProps<TIn, TOut> = TOut | ((props: TIn) => TOut);
export type DynamicProps<TIn, TOut> = ((props: TIn) => TOut);

export interface Column<TRow = {}, TValue = {}, TExtraProps = {}> {
    key?: string | number;
    formatter?: (value: TValue, row?: TRow) => any;
    cellComponent?: React.ComponentType<CellProps<TRow, TValue, TExtraProps>>;
    cellComponentProps?: (props: CellProps<TRow, TValue, TExtraProps>) => CellProps<TRow, TValue, TExtraProps>;
    tdComponent?: React.ComponentType<CellProps<TRow, TValue, TExtraProps>>;
    tdProps?: StaticOrDynamicProps<CellProps<TRow, TValue, TExtraProps>, React.TdHTMLAttributes<HTMLTableDataCellElement>>;

    headerComponent?: React.ComponentType<HeaderComponentProps<TRow>>;
    thComponent?: React.ComponentType<HeaderComponentProps<TRow> & React.HTMLProps<HTMLTableHeaderCellElement>>;

    thProps?: React.ThHTMLAttributes<HTMLTableHeaderCellElement>;

    field?: ((row: TRow) => TValue);
    fieldName?: string;
    headerText?: string;
    //cellProps?: React.HTMLProps<HTMLTableCellElement> | ((props: CellProps<TRow, TValue, TExtraProps>) => React.HTMLProps<HTMLTableCellElement>);

    headerCssClass?: string;
    cssClass?: ((props: CellProps<TRow, TValue, TExtraProps>) => string) | string;
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
    pure?: boolean;

    /**
     * Set to true to pass the extraCellProps into the cellComponentProps of each row
     * default: TableProps.alwaysIncludeExtraCellProps
     */
    includeExtraCellProps?: boolean;
}

export type CellProps<TRow = {}, TValue = {}, TExtraProps = {}> = {
    row: TRow;
    column: StrictColumn<TRow, TValue, TExtraProps>;

    value: TValue;

    children: React.ReactChild;
    //extraProps?: TExtraProps;

} & TExtraProps;

//ReactPowerTable.defaultProps.tableHeaderCellComponent.displayName = 'tableHeaderCellComponent';

export type TdComponentProps<T = {}, TExtraProps = {}> = CellProps<T, any, TExtraProps> & {
    cellProps: React.HTMLProps<HTMLTableCellElement>;
    valueComponent: React.ComponentType<Partial<CellProps<T, any, TExtraProps>>>;

};

export interface TableRowComponentProps<T = {}, TExtraProps = {}> {
    columns: Array<StrictColumn<T>>;
    row: T;

    //rowProps: StaticOrDynamicProps<TableRowComponentProps<T>, React.HTMLProps<HTMLTableRowElement>>;
    extraProps: TExtraProps;

}

export interface DataRowBuilderProps<T = {}> {
    columns: StrictColumn[];
    row: T;
    rowComponent: React.ComponentType<TableRowComponentProps<any>>;
    //extraCellProps: any;

    rowProps: React.HTMLAttributes<HTMLTableRowElement>;

    //alwaysIncludeExtraCellProps: boolean;
    //cells: DataRowCellProps[];
}
export interface HeaderRowBuilderProps<T = {}> {

    columns: Array<StrictColumn<T>>;
    tableHeaderRowComponent: React.ComponentType<React.Props<HTMLTableRowElement>>;
    extraCellProps: any;
}

export interface HeaderComponentProps<T = {}, TExtraProps = {}> {
    column: StrictColumn<T>;

    extraProps: TExtraProps;
}

export type HeadComponentProps<T = {}, TExtraProps = {}> = TExtraProps & {
    columns: Array<StrictColumn<T, {}, TExtraProps>>;

    rowComponent: React.ComponentType<HeadRowComponentProps<T, TExtraProps>>;
};
export type HeadComponentType<T = {}, TExtraProps = {}> = React.ComponentType<HeadComponentProps<T, TExtraProps>>;

export type HeadRowComponentProps<T = {}, TExtraProps = {}> = TExtraProps & {
    columns: Array<StrictColumn<T, {}, TExtraProps>>;

};
export type HeadRowComponentType<T = {}, TExtraProps = {}> = React.ComponentType<HeadRowComponentProps<T, TExtraProps>>;

export type HeadCellComponentProps<T = {}, TExtraProps = {}> = TExtraProps & {
    column: StrictColumn<T, {}, TExtraProps>;

};
export type HeadCellComponentType<T = {}, TExtraProps = {}> = React.ComponentType<HeadCellComponentProps<T, TExtraProps>>;

export type BodyComponentProps<T = {}, TExtraProps = {}> = TExtraProps & {
    rows: T[];
    columns: Array<StrictColumn<T, {}, TExtraProps>>;

    rowComponent: React.ComponentType<HeadRowComponentProps<T, TExtraProps>>;
};
export type BodyComponentType<T = {}, TExtraProps = {}> = React.ComponentType<BodyComponentProps<T, TExtraProps>>;

export type RowComponentProps<T = {}, TExtraProps = {}> = TExtraProps & {
    row: T;
    columns: Array<StrictColumn<T, {}, TExtraProps>>;

};
export type RowComponentType<T = {}, TExtraProps = {}> = React.ComponentType<RowComponentProps<T, TExtraProps>>;

export type CellComponentProps<T = {}, TExtraProps = {}> = TExtraProps & {

    row: T;
    column: StrictColumn<T, {}, TExtraProps>;

    valueComponent: ValueComponentType<T, TExtraProps>;
};
export type CellComponentType<T = {}, TExtraProps = {}> = React.ComponentType<CellComponentProps<T, TExtraProps>>;

export type ValueComponentProps<T = {}, TExtraProps = {}> = TExtraProps & {

    row: T;
    column: StrictColumn<T, {}, TExtraProps>;

};
export type ValueComponentType<T = {}, TExtraProps = {}> = React.ComponentType<ValueComponentProps<T, TExtraProps>>;

export interface PowerTableProps<T = {}, TExtraProps = {}> {
    /**
     * Columns to display in table
     */
    columns: Array<Column<T, any, TExtraProps> | string>;

    /**
     * Field name or function to provide unique key for each column
     */
    keyColumn: string | ((row: T) => (string | number));

    /**
     * Rows to display in table
     */
    rows: T[];
    //rowProps?: React.HTMLProps<HTMLTableRowElement> | ((row: T) => React.HTMLProps<HTMLTableRowElement>);

    loading?: boolean;

    dataRowBuilder?: React.ComponentType<DataRowBuilderProps<T>>;
    //components?: GridComponents<T>

    /** Customize the <table> tag. children are passed to props and must be rendered  */
    tableComponent?: React.ComponentType<React.HTMLProps<HTMLTableElement>>;

    /** Inject custom props into the tableComponent  */
    tableProps?: React.HTMLProps<HTMLTableElement>;
    tableClassName?: string;

    /** Customize the <thead> tag. children are passed to props and must be rendered  */
    headComponent?: HeadComponentType<T, TExtraProps>;

    /** Customize the <tr> tag that appears in <thead>. children are passed to props and must be rendered  */
    headRowComponent?: HeadRowComponentType<T, TExtraProps>;

    /** Customize the <th> tag that appears in <thead> > <tr>. children are passed to props and must be rendered
     * header cell can also be customize per column using Column.headerCellProps
     */
    headCellComponent?: HeadCellComponentType<T, TExtraProps>;

    /** Customize the component tag that renders in <thead> > <tr> > <th>.
     */
    //tableHeaderCellValueComponent?: React.ComponentType<HeaderComponentProps<T>>;

    /** Customize the <tbody> tag. children are passed to props and must be rendered  */
    bodyComponent?: BodyComponentType<T, TExtraProps>;

    /** Customize the <tr> tag that appears in <thead>. children are passed to props and must be rendered  */
    rowComponent?: RowComponentType<T, TExtraProps>;

    rowProps?: StaticOrDynamicProps<TableRowComponentProps<T>, React.HTMLProps<HTMLTableRowElement>>;
    /** Customize the <td> tag that appears in <tbody> > <tr>. children are passed to props and must be rendered
     * table cell can also be customize per column using Column.cellProps, Column.cellComponent and Column.cellComponentProps
     */
    cellComponent?: CellComponentType<T, TExtraProps>;

    /** Customize the html that appears in <tbody> > <tr> > <td>. children are passed to props and must be rendered
     * value can also be customize per column using Column.valueComponent
     */
    valueComponent?: ValueComponentType<T, TExtraProps>;

    //defaultTdComponent?: React.ComponentType<TdComponentProps<T, TExtraProps>>;

    /** This is the default cell value component that will be used if column specific cellComponent is not provided
     */
    //defaultCellComponent?: React.ComponentType<CellProps<T>>;

    tableFooterComponent?: React.ComponentType<React.HTMLProps<HTMLTableSectionElement>>;

    extraCellProps?: TExtraProps;
    /**
     * Set to true to pass the extraCellProps into the cellComponentProps of each row
     * default: false
     */
    alwaysIncludeExtraCellProps?: boolean;
}
