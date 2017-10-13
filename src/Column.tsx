import { Column, } from './ReactPowerTable';

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
