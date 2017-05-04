/**
 * @module react-power-table
 */ /** */

import * as React from 'react';
import { debuglog, shallowEqual, makePure } from './utils';
import { transformColumn } from "./Column";


//export type ReactClass<T> = React.ComponentClass<T> | React.StatelessComponent<T>

/**
 * Primary table component
 */
export class ReactPowerTable extends React.Component<GridProps<any>, never> {

    private columns: StrictColumn<any>[];
    private getRowProps: (row: any) => React.HTMLProps<HTMLTableRowElement>;
    private getRowKey: (row: any) => string | number;

    static defaultProps: Partial<GridProps<any>> = {

    };

    constructor(props: GridProps<any>) {
        super(props);
        debuglog('constructor', props);

        this.transformProps(props);
    }

    componentWillReceiveProps(nextProps: GridProps<any>) {
        debuglog('componentWillReceiveProps', nextProps);

        this.transformProps(nextProps, this.props);

    }

    shouldComponentUpdate(nextProps: GridProps<any>) {

        const result = !shallowEqual(this.props, nextProps);
        debuglog('shouldComponentUpdate returned ' + result);

        return result;
    }

    transformProps(newProps: GridProps<any>, oldProps?: GridProps<any>) {

        debuglog('transformProps', { newProps, oldProps });

        if (!oldProps || !shallowEqual(newProps.columns, oldProps.columns)) {
            debuglog('transforming columns', newProps.columns);

            this.columns = newProps.columns.map(c => transformColumn(c, newProps));
        }

        if (!oldProps || newProps.rowProps != oldProps.rowProps) {
            debuglog('transforming getRowProps');
            this.getRowProps = typeof newProps.rowProps == 'function' ? newProps.rowProps : () => newProps.rowProps;
        }

        if (!oldProps || newProps.keyColumn != oldProps.keyColumn) {
            debuglog('transforming getRowKey');
            this.getRowKey = typeof newProps.keyColumn == 'function' ? newProps.keyColumn : (row) => row[newProps.keyColumn as string];
        }


    }



    render() {

        const { tableProps, footerComponent, rows } = this.props;

        const columns = this.columns;
        //const HeaderRowComponent = headerRowComponent || HeaderRow;
        const FooterComponent = footerComponent;

        return <table {...tableProps}>
            <thead>
                <HeaderRow columns={columns} />
            </thead>
            <tbody>
                {rows.map((row) => {
                    const rowProps = this.getRowProps(row);
                    const key = this.getRowKey(row);

                    debuglog('DataRow map');
                    return <DataRow key={key} columns={columns} rowProps={rowProps} row={row} />
                })}
            </tbody>

            {FooterComponent && <FooterComponent />}
        </table>;
    }
}


interface HeaderRowProps<T> {

    columns: StrictColumn<T>[];

}

class HeaderRow extends React.Component<HeaderRowProps<any>, never> {
    constructor(props: any) {
        super(props);
        debuglog('HeaderRowComponent constructor');
    }
    public render() {


        const { columns } = this.props;

        debuglog('HeaderRowComponent render', this.props);

        return <tr>
            {columns.map(c => {

                const headerProps = { ...c.headerCellProps };

                headerProps.style = { textAlign: 'left', whiteSpace: 'nowrap', ...headerProps.style };

                const HeaderComponent = c.headerComponent;

                const headerComponentProps = c.headerComponentPropsProvider();
                return <th key={c.key} {...headerProps }><HeaderComponent {...headerComponentProps} />

                </th>
            })}
        </tr>
    }
}

class DataRow extends React.PureComponent<DataRowProps<any>, never> {

    constructor(props: DataRowProps<any>) {
        super(props);
        debuglog('DataRowComponent constructor');
    }
    public render() {

        const { row, columns, rowProps, ...extra } = this.props;
        debuglog('DataRowComponent render', this.props);


        return <tr {...rowProps}>
            {columns.map(col => {
                const CellComponent = col.cellComponent as React.ComponentClass<CellProps<any>> | React.StatelessComponent<CellProps<any>>;

                const value = col.field(row);
                const formattedValue = col.formatter ? col.formatter(col.field(row), row) : col.field(row);
                const rowValueProps: CellProps = { row: row, column: col, value: formattedValue, rawValue: value, ...extra };

                const cellProps = col.cellProps(rowValueProps);

                const cellComponentProps = col.cellComponentProps(rowValueProps);

                return <td key={col.key} {...cellProps }><CellComponent {...cellComponentProps} /></td>
            })}
        </tr>;

    }
}
//const DataRow = makePure((props: DataRowProps<T>) => <DataRowInternal {...props}/>);





export interface GridProps<T> {
    /**
     * Columns to display in table
     */
    columns: (Column<T> | string)[];

    /**
     * Field name or function to provide unique key for each column
     */
    keyColumn: string | ((row: T) => (string | number));

    /**
     * Rows to display in table
     */
    rows: T[];
    rowProps?: React.HTMLProps<HTMLTableRowElement> | ((row: T) => React.HTMLProps<HTMLTableRowElement>);

    loading?: boolean;
    tableProps?: React.HTMLAttributes<HTMLTableElement>;
    rowComponentProps?: (props: DataRowProps<T>) => DataRowProps<T>;
    footerComponent?: React.ComponentClass<any> | React.StatelessComponent<any>;

    //headerRowComponent?: ReactClass<HeaderRowProps<T>>;
    defaultHeaderComponent?: React.ComponentClass<HeaderComponentProps> | React.StatelessComponent<HeaderComponentProps>;
}


export interface StrictColumn<TRow = any, TValue = any> {

    key: string | number;
   
    field: ((row: TRow) => TValue);
    fieldName: string;

    headerText: string;

    cellProps?: ((props: CellProps<TRow, TValue>) => React.HTMLProps<HTMLTableDataCellElement>);

    formatter: (value: any, row?: TRow) => string;
    cellComponent?: React.ComponentClass<CellProps<TRow>> | React.StatelessComponent<CellProps<TRow>>;
    cellComponentProps?: (props: CellProps<TRow>) => any;
    headerComponent?: React.ComponentClass<HeaderComponentProps> | React.StatelessComponent<HeaderComponentProps>;
    headerComponentPropsProvider?: () => HeaderComponentProps;

    headerCellProps?: React.HTMLProps<HTMLTableHeaderCellElement>;

}




export interface HeaderComponentProps {
    //column: StrictColumn<T>;
    key: string | number;
    headerText: string;
    headerCellProps: React.HTMLProps<HTMLTableHeaderCellElement>;
    
}



export interface DataRowProps<T> {

    columns: StrictColumn<T>[];
    row: T;
    rowProps: React.HTMLProps<HTMLTableRowElement>;
}




export interface Column<TRow = any, TValue = any> {
    key?: string | number;
    formatter?: (value: TValue, row?: TRow) => string;
    cellComponent?: React.ComponentClass<CellProps<TRow,TValue>> | React.StatelessComponent<CellProps<TRow,TValue>>;
    cellComponentProps?: (props: CellProps<TRow,TValue>) => any;
    headerComponent?: React.ComponentClass<HeaderComponentProps> | React.StatelessComponent<HeaderComponentProps>;
    headerComponentPropsProvider?: () => HeaderComponentProps;

    headerCellProps?: React.HTMLProps<HTMLTableHeaderCellElement>;


    field?: ((row: TRow) => TValue) | string;
    headerText?: string;
    cellProps?: React.HTMLProps<HTMLTableDataCellElement> | ((props: CellProps<TRow>) => React.HTMLProps<HTMLTableDataCellElement>);

    headerCssClass?: string;
    //cellProps?: React.HTMLProps<HTMLTableDataCellElement> | ((props: CellProps<T>) => React.HTMLProps<HTMLTableDataCellElement>);
    cssClass?: ((props: CellProps<TRow>) => string) | string;
    width?: number;
    maxWidth?: number;
    textAlign?: string;
}

export interface CellProps<TRow = any, TValue = any> {
    row: TRow;
    column: Column<TRow>;

    value: TValue | string;
    rawValue: TValue | string;

}

