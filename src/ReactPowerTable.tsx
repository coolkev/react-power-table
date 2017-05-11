/**
 * @module react-power-table
 */ /** */

import * as React from 'react';
import { debuglog, shallowEqual, makePure } from './utils';
import { transformColumn } from "./Column";


function omitChildren(obj: React.HTMLProps<any>) {

    if (obj && obj.children) {

        const { children, ...rest } = obj;
        return rest;
    }
    return obj;
}

const x: React.HTMLProps<any> = {};
const y = omitChildren(x);
type HTMLPropsWithoutChildren = typeof y;



const DataRowComponent = makePure((props: DataRowProps<any> & { trComponent: React.ComponentClass<DataRowProps<any>> | React.StatelessComponent<DataRowProps<any>> }) => {


    const { row, columns, trComponent, ...actualProps } = props;

    debuglog('DataRowComponent render', props);

    const TrComponent = props.trComponent;

    return <TrComponent columns={columns} row={row}>
        {columns.map(col => {
            const CellComponent = col.cellComponent as React.ComponentClass<CellProps<any>> | React.StatelessComponent<CellProps<any>>;

            const value = col.field(row);
            const formattedValue = col.formatter ? col.formatter(col.field(row), row) : col.field(row);
            const rowValueProps: CellProps = { row: row, column: col, value: formattedValue, rawValue: value };

            const cellProps = col.cellProps(rowValueProps);

            const cellComponentProps = col.cellComponentProps(rowValueProps);
            //const { children, ...actualCellProps } = cellProps || { children: undefined };

            return <td key={col.key} {...cellProps}><CellComponent {...cellComponentProps} /></td>
        })}
    </TrComponent>;


});



/**
 * Primary table component
 */
export class ReactPowerTable extends React.Component<GridProps<any>, never> {

    private columns: StrictColumn<any>[];
    private getRowKey: (row: any) => string | number;

    static defaultProps: Partial<GridProps<any>> = {

        components: {
            table: {
                component: props => <table {...props}></table>
            },
            head: {
                theadComponent: props => <thead {...props}></thead>,
                trComponent: props => <tr {...props}></tr>,
                thComponent: props => {
                    const { children, column, ...rest } = props;
                    debuglog('defaultProps thComponent render', props);
                    return <th {...rest}>{children}</th>;
                }
            },
            body: {
                tbodyComponent: props => <tbody>{props.children}</tbody>,
                trComponent: props => <tr>{props.children}</tr>
            }
        }
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

            this.columns = newProps.columns.map(c => transformColumn(c));
        }

        if (!oldProps || newProps.keyColumn != oldProps.keyColumn) {
            debuglog('transforming getRowKey');
            this.getRowKey = typeof newProps.keyColumn == 'function' ? newProps.keyColumn : (row) => row[newProps.keyColumn as string];
        }


    }



    render() {

        const { rows, components } = this.props;

        const columns = this.columns;
        const defaultComponents = ReactPowerTable.defaultProps.components;

        const actualComponents = { ...defaultComponents, ...components };
        const head = { ...defaultComponents.head, ...actualComponents.head };
        const body = { ...defaultComponents.body, ...actualComponents.body };

        debuglog('ReactPowerTable.render()', this.props);

        const dataRows = rows.map((row) => {
            //const rowProps = this.getRowProps(row);
            const key = this.getRowKey(row);

            debuglog('DataRow map');

            return <DataRowComponent trComponent={body.trComponent} key={key} columns={columns} row={row} />;

        });


        const BodyComponent = body.tbodyComponent;

        const Table = actualComponents.table.component;
        const tableProps = actualComponents.table.props;
        const Head = head.theadComponent;
        const HeadTr = head.trComponent;
        const Body = body.tbodyComponent;

        const HeadTh = head.thComponent;
        const Foot = actualComponents.foot;


        return <Table {...tableProps }>
            <Head>
                <HeadTr>
                    {columns.map(c => <HeadTh key={c.key} column={c} {...c.headerCellProps}><HeaderComponent column={c} /></HeadTh>)}
                </HeadTr>
            </Head>

            {Body ? <Body>{dataRows}</Body> : dataRows}

            {Foot && <Foot />}
        </Table >;

    }
}
const HeaderComponent = makePure((props: HeaderComponentProps) => {
    //debuglog('defaultHeaderComponent render ' + props.column.headerText);
    return <div>{props.column.headerText}</div>
});

export interface GridProps<T = any> {
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
    //rowProps?: React.HTMLProps<HTMLTableRowElement> | ((row: T) => React.HTMLProps<HTMLTableRowElement>);

    loading?: boolean;

    components?: GridComponents<T>
}

export interface GridComponents<T = any> {
    table?: {
        component?: React.ComponentClass<React.HTMLProps<HTMLTableElement>> | React.StatelessComponent<React.HTMLProps<HTMLTableElement>>;
        props?: HTMLPropsWithoutChildren;
    }
    head?: {
        theadComponent?: React.ComponentClass<never> | React.StatelessComponent<never>;
        trComponent?: React.ComponentClass<never> | React.StatelessComponent<never>;
        thComponent?: React.ComponentClass<HeaderComponentProps<T>> | React.StatelessComponent<HeaderComponentProps<T>>;
    }

    body?: {
        tbodyComponent?: React.ComponentClass<never> | React.StatelessComponent<never>;
        trComponent?: React.ComponentClass<DataRowProps<T>> | React.StatelessComponent<DataRowProps<T>>;
    }

    foot?: React.ComponentClass<never> | React.StatelessComponent<never>;
}



export interface StrictColumn<TRow = any, TValue = any> {

    key: string | number;

    field: ((row: TRow) => TValue);
    fieldName: string;

    headerText: string;

    cellProps?: ((props: CellProps<TRow, TValue>) => HTMLPropsWithoutChildren);

    formatter: (value: any, row?: TRow) => string;
    cellComponent?: React.ComponentClass<CellProps<TRow>> | React.StatelessComponent<CellProps<TRow>>;
    cellComponentProps?: (props: CellProps<TRow>) => any;

    headerCellProps?: HTMLPropsWithoutChildren;

}




export interface HeaderComponentProps<T = any> extends HTMLPropsWithoutChildren {
    column: StrictColumn<T>;

}



export interface DataRowProps<T> {

    columns: StrictColumn<T>[];
    row: T;
}




export interface Column<TRow = any, TValue = any> {
    key?: string | number;
    formatter?: (value: TValue, row?: TRow) => string;
    cellComponent?: React.ComponentClass<CellProps<TRow, TValue>> | React.StatelessComponent<CellProps<TRow, TValue>>;
    cellComponentProps?: (props: CellProps<TRow, TValue>) => any;
    headerComponent?: React.ComponentClass<HeaderComponentProps> | React.StatelessComponent<HeaderComponentProps>;

    headerCellProps?: HTMLPropsWithoutChildren;


    field?: ((row: TRow) => TValue) | string;
    headerText?: string;
    cellProps?: HTMLPropsWithoutChildren | ((props: CellProps<TRow, TValue>) => HTMLPropsWithoutChildren);

    headerCssClass?: string;
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

