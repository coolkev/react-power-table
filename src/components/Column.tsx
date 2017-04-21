import * as React from 'react';
import { makePure, getColumnCore, debuglog } from "../utils";
import { HeaderComponentProps, CellProps, Column, GridProps, TransformedColumn } from "../ReactPowerTable";


export const defaultHeaderComponent = makePure((props: HeaderComponentProps<any>) => <div>{props.column.headerText}</div>);
export const defaultCellComponent = makePure((props: CellProps<any>) => {
    debuglog('Render cellComponent column: ' + props.column.key + ' value: ' + props.value);
    return <span>{props.value}</span>;
});


export function transformColumn<T>(options: Column<T> | string, gridProps: GridProps<T>): TransformedColumn<T> {

    debuglog('transformColumn', options);

    if (typeof options === 'string') {
        options = { field: options } as Column<T>;
    }

    //const { key, field } = getKeyAndField(options);
    const core = getColumnCore(options);
    const { cellProps, headerProps } = getCellAndHeaderProps(options);


    const result: TransformedColumn<T> = {
        __transformed: true,
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

