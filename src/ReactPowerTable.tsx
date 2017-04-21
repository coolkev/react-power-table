import * as React from 'react';
import { debuglog, shallowEqual, makePure } from './utils';
import { transformColumn } from "./components/Column";

export type T = {};

export class ReactPowerTable extends React.Component<GridProps<T>, never> {

    private columns: TransformedColumn<T>[];
    private getRowProps: (row: T) => React.HTMLProps<HTMLTableRowElement>;
    private getRowKey: (row: T) => string | number;

    static defaultProps: Partial<GridProps<T>> = {

    };

    constructor(props: GridProps<T>) {
        super(props);
        debuglog('constructor', props);

        this.transformProps(props);
    }

    componentWillReceiveProps(nextProps: GridProps<T>) {
        debuglog('componentWillReceiveProps', nextProps);

        this.transformProps(nextProps, this.props);

    }

    shouldComponentUpdate(nextProps: GridProps<T>) {

        const result = !shallowEqual(this.props, nextProps);
        debuglog('shouldComponentUpdate returned ' + result);

        return result;
    }

    transformProps(newProps: GridProps<T>, oldProps?: GridProps<T>) {

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

    columns: TransformedColumn<T>[];

}

class HeaderRow extends React.Component<HeaderRowProps<T>, never> {
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

                const headerComponentProps = c.headerComponentPropsProvider && c.headerComponentPropsProvider({ column: c }) || { column: c };
                return <th key={c.key} {...headerProps }><HeaderComponent {...headerComponentProps} />

                </th>
            })}
        </tr>
    }
}

class DataRow extends React.PureComponent<DataRowProps<T>, never> {

    constructor(props: DataRowProps<T>) {
        super(props);
        debuglog('DataRowComponent constructor');
    }
    public render() {

        const { row, columns, rowProps, ...extra } = this.props;
        debuglog('DataRowComponent render', this.props);


        return <tr {...rowProps}>
            {columns.map(col => {
                const CellComponent = col.cellComponent as ReactClass<CellProps<T>>;

                const value = col.formatter ? col.formatter(col.field(row), row) : col.field(row);
                const rowValueProps: CellProps<T> = { row: row, column: col, value: value, ...extra };

                const cellProps = col.cellProps(rowValueProps);

                const cellComponentProps = col.cellComponentProps(rowValueProps);

                return <td key={col.key} {...cellProps }><CellComponent {...cellComponentProps} /></td>
            })}
        </tr>;

    }
}
//const DataRow = makePure((props: DataRowProps<T>) => <DataRowInternal {...props}/>);


export type ReactClass<T> = React.ComponentClass<T> | React.StatelessComponent<T>



export interface GridProps<T> {
    columns: (Column<T> | string)[];
    keyColumn: string | ((row: T) => (string | number));
    rows: T[];
    rowProps?: React.HTMLProps<HTMLTableRowElement> | ((row: T) => React.HTMLProps<HTMLTableRowElement>);

    loading?: boolean;
    tableProps?: React.HTMLAttributes<HTMLTableElement>;
    rowComponentProps?: (props: DataRowProps<T>) => DataRowProps<T>;
    footerComponent?: ReactClass<never>;

    //headerRowComponent?: ReactClass<HeaderRowProps<T>>;
    defaultHeaderComponent?: ReactClass<HeaderComponentProps<T>>;
}


export interface TransformedColumn<T> extends BaseColumn<T> {
    field: ((row: T) => any);

    cellProps?: ((props: CellProps<T>) => React.HTMLProps<HTMLTableDataCellElement>);

    __transformed: boolean;
}




export interface HeaderComponentProps<T> {
    column: TransformedColumn<T>;
}



export interface DataRowProps<T> {

    columns: TransformedColumn<T>[];
    row: T;
    rowProps: React.HTMLProps<HTMLTableRowElement>;
}




export interface BaseColumn<T> {
    key: string | number;
    formatter: (value: any, row?: T) => string;
    headerText: string;
    cellComponent?: ReactClass<CellProps<T>>;
    cellComponentProps?: (props: CellProps<T>) => any;
    headerComponent?: ReactClass<HeaderComponentProps<T>>;
    headerComponentPropsProvider?: (props: HeaderComponentProps<T>) => HeaderComponentProps<T>;

    headerCellProps?: React.HTMLProps<HTMLTableHeaderCellElement>;


}


export interface Column<T> extends Partial<BaseColumn<T>> {
    field?: ((row: T) => any) | string;
    headerText?: string;
    cellProps?: React.HTMLProps<HTMLTableDataCellElement> | ((props: CellProps<T>) => React.HTMLProps<HTMLTableDataCellElement>);

    headerCssClass?: string;
    //cellProps?: React.HTMLProps<HTMLTableDataCellElement> | ((props: CellProps<T>) => React.HTMLProps<HTMLTableDataCellElement>);
    cssClass?: ((props: CellProps<T>) => string) | string;
    width?: number;
    maxWidth?: number;
    textAlign?: string;
}

export interface CellProps<T> {
    row: T;
    value: any;
    column: TransformedColumn<T>;

}

