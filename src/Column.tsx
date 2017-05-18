﻿import * as React from 'react';
import { makePure, debuglog } from "./utils";
import { CellProps, Column, StrictColumn } from "./ReactPowerTable";



/** @internal */
export const defaultCellComponent = makePure((props: CellProps<any>) => {
    debuglog('Render cellComponent column: ' + props.column.key + ' value: ' + props.value);
    return <div>{props.value}</div>;
});

/** @internal */
export function transformColumn<T>(options: Column<T> | string): StrictColumn<T> {

    debuglog('transformColumn', options);

    if (typeof options === 'string') {
        options = { fieldName: options } as Column<T>;
    }

    const core = getColumnCore(options);
    const { cellProps, headerProps } = getCellAndHeaderProps(options);


    const result: StrictColumn<T> = {
        //__transformed: true,
        ...options,
        ...core,
        cellProps: cellProps,
        headerCellProps: headerProps,
        headerComponent: options.headerComponent,
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

    return result;
}




function getCellAndHeaderProps(options: Column<any>) {

    const cssClass = options.cssClass;

    const headerProps = { style: { textAlign: 'left', whiteSpace: 'nowrap', ...(options.headerCellProps && options.headerCellProps.style) }, ...options.headerCellProps };
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

    if (typeof (col) == 'string') {
        return {
            key: col,
            field: row => row[col],
            fieldName: col,
            headerText: col,

        };
    }


    const { field, fieldName, key } = col;

    if (typeof field === 'function') {
        const actualFieldName = fieldName || getExpression(field);
        return {
            key: key || actualFieldName,
            field: field,
            fieldName: actualFieldName,
            headerText: col.headerText || actualFieldName
        };
    }
    if (fieldName) {
        return {
            key: key || fieldName,
            field: row => row[fieldName],
            fieldName: fieldName,
            headerText: col.headerText || fieldName

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

export function columnsChanged(newColumns: (string | Column)[], prevColumns: Column[], compareKeys: string[]) {

    if ((!newColumns && prevColumns) || (newColumns && !prevColumns) || newColumns.length != prevColumns.length) {
        return true;
    }

    //const keys = ['key', 'fieldName', 'headerText'];

    for (let i = 0; i < prevColumns.length; i++) {
        const prevCol = prevColumns[i];
        const newCol = getColumnCore(newColumns[i]);

        for (let key of compareKeys) {
            if (prevCol[key] !== newCol[key]) {
                return true;
            }
        }

        //if (!shallowEqual(newCol, {key:prevCol.key,field: prevCol.field, fieldName: prevCol.fieldName, headerText: prevCol.headerText}))
    }

    return false;
}
