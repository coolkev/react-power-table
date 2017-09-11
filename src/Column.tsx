import * as React from 'react';
import { CellProps, Column, StrictColumn } from './ReactPowerTable';
import { debuglog, makePure } from './utils';

/** @internal */
// export const defaultCellComponent = makePure((props: CellProps<any>) => {
//     debuglog('Render cellComponent column: ' + props.column.key + ' value: ' + props.value);
//     return <div>{props.value}</div>;
// });
// defaultCellComponent.displayName = 'defaultCellComponent';

/** @internal */
export function transformColumn<T>(options: Column<T> | string): StrictColumn<T> {

    debuglog('transformColumn', options);

    const col = typeof options === 'string' ? { fieldName: options } as Column<T> : options;

    const core = getColumnCore(options);
    const { cellProps, headerProps } = getCellAndHeaderProps(col);

    const result = {
        ...col,
        ...core,
        cellProps,
        headerCellProps: headerProps,
        headerComponent: col.headerComponent,
        formatter: col.formatter || null,
    } as StrictColumn<T>;

    if (col.cellComponent) {
        result.cellComponent = col.cellComponent;
        result.cellComponentProps = col.cellComponentProps || ((props) => props);

    } else {

        //result.cellComponent = defaultCellComponent;
        result.cellComponentProps = col.cellComponentProps || ((props) => ({ column: props.column, value: props.value }));

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
        cellProps = (row) => ({ ...cellStaticProps, ...cellPropsFunc(row), className: cssClass(row) });

    } else if (typeof (cssClass) === 'string') {
        cellStaticProps.className = cssClass;
        cellProps = (row) => ({ ...cellStaticProps, ...cellPropsFunc(row) });
    } else {
        cellProps = (row) => ({ ...cellStaticProps, ...cellPropsFunc(row) });
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

    if (typeof (col) === 'string') {
        return {
            key: col,
            field: (row) => row[col],
            fieldName: col,
            headerText: col,

        };
    }

    const { field, fieldName, key } = col;

    if (typeof field === 'function') {
        const actualFieldName = fieldName || getExpression(field);
        return {
            key: key || actualFieldName,
            field,
            fieldName: actualFieldName,
            headerText: col.headerText || actualFieldName,
        };
    }
    if (fieldName) {
        return {
            key: key || fieldName,
            field: (row) => row[fieldName],
            fieldName,
            headerText: col.headerText || fieldName,

        };
    }

    if (!key) {
        throw new Error('Must specify value for "key" if field is not used');
    }
    //    field = _row => null;

    return {
        key,
        field: (_row) => null,
        fieldName: null,
        headerText: col.headerText,

    };

}
/** @internal */
export function getExpression(func: (row: any) => any): string {

    const expr = func.toString();

    const myregexp = /(?:return|\w+ => ).*\.(\w+);?/;
    const match = myregexp.exec(expr);
    if (match != null) {
        return match[1];
    }
    return null;
}

// export function columnsChanged(newColumns: (string | Column)[], prevColumns: (string | Column)[]) {

//     if ((!newColumns && prevColumns) || (newColumns && !prevColumns) || newColumns.length != prevColumns.length) {
//         return true;
//     }

//     //const keys = ['key', 'fieldName', 'headerText'];

//     const changed: number[] = [];
//     //let result = false;

//     for (let i = 0; i < prevColumns.length; i++) {
//         const prevCol = prevColumns[i];
//         const newCol = newColumns[i];

//         if (prevCol != newCol) {
//             //console.log('column changed: ' + (prevColumns[i] as any).key)
//             //return true;
//             changed.push(i);
//         }
//     }

//     if (changed.length > 0) {

//         if (changed.length == prevColumns.length) {

//             throw new Error('all columns changed - this means you are probably doing something wrong');
//             //console.warn('all columns changed - this means you are probably doing something wrong');
//         }
//         // else {
//         //     changed.forEach(i => console.log('column changed: ' + (prevColumns[i] as any).key));
//         // }

//         return true;
//     }
//     return false;
// }
