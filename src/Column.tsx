import * as React from 'react';
import { Column, StrictColumn, CellComponentProps } from './ReactPowerTable';
import { debuglog } from './utils';

/** @internal */
// export const defaultCellComponent = makePure((props: CellProps<any>) => {
//     debuglog('Render cellComponent column: ' + props.column.key + ' value: ' + props.value);
//     return <div>{props.value}</div>;
// });
// defaultCellComponent.displayName = 'defaultCellComponent';

/** @internal */
export function transformColumn<TRow, TExtraProps>(options: Column<TRow, {}, TExtraProps> | string): StrictColumn<TRow, {}, TExtraProps> {

    debuglog('transformColumn', options);

    const col = typeof options === 'string' ? { fieldName: options } as Column<TRow, {}, TExtraProps> : options;

    //const { cellHtmlAttributes, headCellHtmlAttributes } = getCellAndHeaderProps(col);

    const { cssClass, maxWidth, width, headerCssClass, textAlign, cellHtmlAttributes, headCellHtmlAttributes } = col;

    const headerProps = { style: { textAlign: 'left', whiteSpace: 'nowrap', ...(headCellHtmlAttributes && headCellHtmlAttributes.style) }, ...headCellHtmlAttributes };

    const cellStaticProps: React.HTMLProps<HTMLTableDataCellElement> = typeof (cellHtmlAttributes) === 'function' ? {} : { ...cellHtmlAttributes };
    const cellPropsFunc = typeof (cellHtmlAttributes) === 'function' ? cellHtmlAttributes : undefined;

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

    const result = {
        ...col,
        ...core,
        tdHtmlAttributes,
        headCellHtmlAttributes
    } as StrictColumn<TRow, {}, TExtraProps>;

    return result;
}

// function getCellAndHeaderProps(options: Column<any>) {

//     const { cssClass, maxWidth, width, headerCssClass, textAlign, cellHtmlAttributes, headCellHtmlAttributes } = options;

//     const headerProps = { style: { textAlign: 'left', whiteSpace: 'nowrap', ...(headCellHtmlAttributes && headCellHtmlAttributes.style) }, ...headCellHtmlAttributes };

//     const cellStaticProps: React.HTMLProps<HTMLTableDataCellElement> = typeof (cellHtmlAttributes) === 'function' ? {} : { ...cellHtmlAttributes };
//     const cellPropsFunc = typeof (cellHtmlAttributes) === 'function' ? cellHtmlAttributes : undefined;

//     //var cssClassFunc: (row: T) => string;

//     if (width) {
//         cellStaticProps.style = { ...cellStaticProps.style, width };
//         headerProps.style = { ...headerProps.style, width };

//     }

//     if (maxWidth) {
//         cellStaticProps.style = { ...cellStaticProps.style, maxWidth };
//         headerProps.style = { ...headerProps.style, maxWidth };

//     }

//     if (textAlign) {
//         cellStaticProps.style = { ...cellStaticProps.style, textAlign };
//         headerProps.style = { ...headerProps.style, textAlign };
//     }

//     let actualCellAttributes: ((props: CellComponentProps<any>) => React.HTMLProps<HTMLTableDataCellElement>);

//     if (typeof cssClass === 'function') {
//         actualCellAttributes = cellPropsFunc ? (row) => ({ ...cellStaticProps, ...cellPropsFunc(row), className: cssClass(row) }) : (row) => ({ ...cellStaticProps, className: cssClass(row) });
//     } else if (typeof (cssClass) === 'string') {
//         cellStaticProps.className = cssClass;
//         actualCellAttributes = cellPropsFunc ? (row) => ({ ...cellStaticProps, ...cellPropsFunc(row) }) : () => cellStaticProps;
//     } else {
//         actualCellAttributes = cellPropsFunc ? (row) => ({ ...cellStaticProps, ...cellPropsFunc(row) }) : () => cellStaticProps;
//     }
//     if (headerCssClass) {
//         headerProps.className = headerCssClass;
//     }

//     debuglog('getCellAndHeaderProps', options);
//     return { cellHtmlAttributes: actualCellAttributes, headCellHtmlAttributes: headerProps };

// }

export interface ColumnCore<T> {
    key: string | number;
    field: (row: T) => any;
    fieldName: string;
    headerText: string;
}

export function getColumnCore<T, TExtraProps>(col: Column<T, {}, TExtraProps> | string): ColumnCore<T> {

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
