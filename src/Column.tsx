import * as React from 'react';
import { makePure, debuglog } from "./utils";
import { HeaderComponentProps, CellProps, Column, GridProps, StrictColumn } from "./ReactPowerTable";


const defaultHeaderComponent = makePure((props: HeaderComponentProps) => <div>{props.headerText}</div>);
/** @internal */
export const defaultCellComponent = makePure((props: CellProps<any>) => {
    debuglog('Render cellComponent column: ' + props.column.key + ' value: ' + props.value);
    return <div>{props.value}</div>;
});

/** @internal */
export function transformColumn<T>(options: Column<T> | string, gridProps: GridProps<T>): StrictColumn<T> {

    debuglog('transformColumn', options);

    if (typeof options === 'string') {
        options = { field: options } as Column<T>;
    }

    //const { key, field } = getKeyAndField(options);
    const core = getColumnCore(options);
    const { cellProps, headerProps } = getCellAndHeaderProps(options);


    const result: StrictColumn<T> = {
        //__transformed: true,
        ...options,
        ...core,
        cellProps: cellProps,
        headerCellProps: headerProps,
        formatter: options.formatter || null
    };

    if (options.cellComponent) {
        result.cellComponent = options.cellComponent;
        result.cellComponentProps = options.cellComponentProps || (props => props);

    }
    else {

        result.cellComponent = defaultCellComponent;
        result.cellComponentProps = options.cellComponentProps || (props => ({ column: props.column, value: props.value }));

    }


    result.headerComponent = options.headerComponent || gridProps.defaultHeaderComponent || defaultHeaderComponent;
    //result.headerComponentPropsProvider = options.headerComponentPropsProvider || (()=> ({headerText:result.headerText, key: result.key , headerCellProps: result.headerCellProps}));

    const originalHeaderComponentPropsProvider = options.headerComponentPropsProvider;

    result.headerComponentPropsProvider = () => {

        const originalProps = originalHeaderComponentPropsProvider && originalHeaderComponentPropsProvider();
        
        return { ...originalProps, headerText:result.headerText, key: result.key , headerCellProps: result.headerCellProps };
    }

    return result;
}




function getCellAndHeaderProps(options: Column<any>) {

    const cssClass = options.cssClass;

    const headerProps = { ...options.headerCellProps };
    let cellProps: ((props: CellProps<any>) => React.HTMLProps<HTMLTableDataCellElement>);

    const cellStaticProps: React.HTMLProps<HTMLTableDataCellElement> = typeof (options.cellProps) === 'function' ? {} : { ...options.cellProps };
    const cellPropsFunc = typeof (options.cellProps) === 'function' ? options.cellProps : () => null;


    //var cssClassFunc: (row: T) => string;

    if (options.width) {
        cellStaticProps.style = { ...cellStaticProps.style, width: options.width };
        headerProps.style = { ...headerProps.style, width: options.width };

    }

    if (options.maxWidth) {
        cellStaticProps.style = { ...cellStaticProps.style, maxWidth: options.maxWidth };
        headerProps.style = { ...headerProps.style, maxWidth: options.maxWidth };

    }

    if (typeof cssClass === 'function') {
        cellProps = row => ({ ...cellStaticProps, ...cellPropsFunc(row), className: cssClass(row) });

    }
    else if (typeof (cssClass) === "string") {
        cellStaticProps.className = cssClass;
        cellProps = row => ({ ...cellStaticProps, ...cellPropsFunc(row) });
    }
    else {
        cellProps = row => ({ ...cellStaticProps, ...cellPropsFunc(row) });
    }
    if (options.headerCssClass) {
        headerProps.className = options.headerCssClass;
    }

    if (options.textAlign) {
        cellStaticProps.style = { ...cellStaticProps.style, textAlign: options.textAlign };
        headerProps.style = { ...headerProps.style, textAlign: options.textAlign };
    }

    debuglog('getCellAndHeaderProps', options);
    return { cellProps, headerProps };

}


export interface ColumnCore<T> {
    key: string | number;
    field: (row: T) => any;
    fieldName: string;
    headerText: string;
}

export function getColumnCore<T>(col: Column<T> | string): ColumnCore<T> {

    //let fieldName: string;
    //let field: (row) => any;

    if (typeof (col) == 'string') {
        return {
            key: col,
            field: row => row[col],
            fieldName: col,
            headerText: col,
        
        };
    }

    const { field, key } = col;
    if (typeof field === 'function') {
        const fieldName = getExpression(field);
        return {
            key: key || fieldName,
            field: field,
            fieldName: fieldName,
            headerText: col.headerText || fieldName
        };
    }
    if (typeof (field) === "string") {
        return {
            key: key || field,
            field: row => row[field],
            fieldName: field,
            headerText: col.headerText || field

        };
    }

    if (!key) {
        throw new Error('Must specify value for "key" if field is not used')
    }
    //    field = _row => null;

    return {
        key: key,
        field: _row => null,
        fieldName: null,
        headerText: col.headerText
        
    };

}
/** @internal */
export function getExpression(func: Function): string {

    const expr = func.toString();

    let myregexp = /(?:return|\w+ => ).*\.(\w+);?/;
    let match = myregexp.exec(expr);
    if (match != null) {
        return match[1];
    }
    return null;
}
