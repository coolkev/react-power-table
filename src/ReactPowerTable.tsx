/** @module react-power-table */
import { WhiteSpaceProperty } from 'csstype';
import * as React from 'react';
import { getColumnCore } from './Column';
import { CellProps, Column, InternalColumn, PowerTableProps, RowComponentProps, StaticOrDynamicProps, TdComponentType } from './Types';
import { debuglog, makePure, shallowEqual } from './utils';

function applyWrapper(wrapper: StaticOrDynamicProps<CellProps, JSX.Element>, valueProps: CellProps, valueElement: any) {

    const wrapperElement = typeof (wrapper) === 'function' ? wrapper(valueProps) : wrapper;

    return wrapperElement && React.cloneElement(wrapperElement, null, valueElement) || valueElement;
}

function getCellProps<TRow, TExtraProps>(row: TRow, internalColumn: InternalColumn<TRow, TExtraProps>, extraProps: TExtraProps): CellProps<TRow, TExtraProps> {
    const { field, includeExtraCellProps, column } = internalColumn;
    const { transformCellProps, formatter } = column;
    const value = field(row);

    let formattedValue = formatter ? formatter(value, row) : value;

    if (formattedValue === undefined) {
        formattedValue = null;
    }

    const initialValueProps: CellProps<TRow, TExtraProps> = { ...(includeExtraCellProps && extraProps as any), row, column, value, formattedValue };

    return transformCellProps ? transformCellProps(initialValueProps) : initialValueProps;

}

function mergeAttributes(...attributes: Array<React.HTMLProps<any>>) {

    return attributes.reduce((prev, current) => {
        if (prev.style || current.style) {
            return { ...prev, ...current, style: { ...prev.style, ...current.style } };

        }
        return { ...prev, ...current };
    }, {});
}
// export function ReactPowerTable2<TRow = {}, TExtraProps = {}>() {
//     return ReactPowerTable as any as React.ComponentClass<PowerTableProps<TRow, TExtraProps>>;
// }
// export type ReactPowerTable2<TRow = {}, TExtraProps = {}> = React.ComponentClass<PowerTableProps<TRow, TExtraProps>>;

export interface ReactPowerTable<TRow = {}, TExtraProps = {}> extends React.ComponentClass<PowerTableProps<TRow, TExtraProps>> {

}

export class ReactPowerTable<TRow = {}, TExtraProps = {}> extends React.Component<PowerTableProps<TRow, TExtraProps>, never> {

    static displayName = 'ReactPowerTable';

    static defaultProps: Partial<PowerTableProps> = {
        tableComponent: (props) => <table {...props} />,
        headComponent: ({ children }) => <thead children={children} />,
        headRowComponent: ({ children, }) => <tr children={children} />,
        thComponent: ({ children, htmlAttributes }) => <th children={children} {...htmlAttributes} />,
        thInnerComponentProps: p => p,
        thInnerComponent: (props) => {
            const { column, children, extraCellProps, ...attributes } = props;
            return <div {...attributes}>{children}</div>;
        },

        bodyComponent: ({ children }) => {

            return <tbody children={children} />;
        },
        rowComponent: ({ children, htmlAttributes }) => {
            debuglog('rowComponent render');
            return <tr children={children} {...htmlAttributes} />;
        },
        rowBuilder: (props) => {
            debuglog('rowBuilder render');
            const { columns, row, tdComponent, pureTdComponent, extraCellProps, rowComponent: RowComponent, rowHtmlAttributes } = props;
            const cells = columns.map(c => {
                const { key, column, tdAttributes, valueComponent: ValueComponent } = c;
                const { wrapper, pure } = column;
                const cellProps = getCellProps<{}, {}>(row, c, extraCellProps);

                const valueElement = ValueComponent ? <ValueComponent {...cellProps} children={cellProps.formattedValue} /> : cellProps.formattedValue;

                const children = wrapper ? applyWrapper(wrapper, cellProps, valueElement) : valueElement;

                const TdComponent = pure === false ? tdComponent : pureTdComponent;

                return <TdComponent key={key} tdAttributes={tdAttributes} {...cellProps}>{children}</TdComponent>;
            });

            const rowProps = { ...extraCellProps as any, row, columns } as RowComponentProps;
            const actualRowHtmlAttributes = rowHtmlAttributes && (typeof (rowHtmlAttributes) === 'function' ? rowHtmlAttributes(rowProps) : rowHtmlAttributes);
            return <RowComponent {...rowProps} children={cells} htmlAttributes={actualRowHtmlAttributes} />;
        },
        tdComponent: (props) => {
            const { column, children, tdAttributes, value } = props;
            debuglog('tdComponent render', value);
            const tdHtmlAttributes = tdAttributes(props);

            return <td children={children} {...tdHtmlAttributes} />;
        }
    };

    private columns: Array<InternalColumn<TRow, TExtraProps>>;
    private visibleInternalColumns: Array<InternalColumn<TRow, TExtraProps>>;
    private visibleOriginalColumns: Array<Column<TRow, TExtraProps>>;

    private getRowKey: (row: TRow) => string | number;

    private pureTdComponent: TdComponentType<TRow, TExtraProps>;

    constructor(props: PowerTableProps<TRow, TExtraProps>) {
        super(props);
        debuglog('constructor', props);

        this.transformProps(props);
        this.getRowKey = this.getRowKey.bind(this);

    }

    componentWillReceiveProps(nextProps: PowerTableProps<TRow, TExtraProps>) {
        debuglog('componentWillReceiveProps', nextProps);

        this.transformProps(nextProps, this.props);

    }

    private transformColumns(columns: Array<Column<TRow, TExtraProps>>): Array<InternalColumn<TRow, TExtraProps>> {
        debuglog('Sorting.transformColumns', columns);

        if (this.columns && this.props.columns) {
            //reuse the same column if it hasn't changed from the original
            return columns.map((c, i) => shallowEqual(c, this.props.columns[i]) ? this.columns[i] : this.transformColumn(c));
        }

        return columns.map((c) => this.transformColumn(c));
    }

    private transformColumn(options: Column<TRow, TExtraProps>): InternalColumn<TRow, TExtraProps> {

        debuglog('transformColumn', options);

        const col = typeof options === 'string' ? { field: options } as Column<TRow, TExtraProps> : options;

        const { cssClass, maxWidth, width, headerCssClass, textAlign, tdAttributes, thAttributes, } = col;

        const sharedStyle: React.CSSProperties = {};

        if (width !== undefined) {
            sharedStyle.width = width;
        }

        if (maxWidth !== undefined) {
            sharedStyle.maxWidth = maxWidth;
        }

        if (textAlign !== undefined) {
            sharedStyle.textAlign = textAlign;
        }
        const actualThAttributes = { ...thAttributes, style: { textAlign: textAlign || 'left', whiteSpace: 'nowrap' as WhiteSpaceProperty, ...(thAttributes && thAttributes.style), ...sharedStyle }, ...(headerCssClass && { className: headerCssClass }) };

        const tdAttributesStatic: React.TdHTMLAttributes<HTMLTableDataCellElement> = typeof (tdAttributes) === 'function' ? sharedStyle && { style: sharedStyle } : { ...tdAttributes, style: { ...(tdAttributes && tdAttributes.style), ...sharedStyle } };
        const tdAttributesFunc = typeof (tdAttributes) === 'function' ? tdAttributes : undefined;

        let actualTdAttributes: ((props: CellProps<TRow, TExtraProps>) => React.TdHTMLAttributes<HTMLTableDataCellElement>);

        if (typeof cssClass === 'function') {
            actualTdAttributes = tdAttributesFunc ? ((row) => mergeAttributes(tdAttributesStatic, tdAttributesFunc(row), { className: cssClass(row) })) : ((row) => ({ ...tdAttributesStatic, className: cssClass(row) }));
        } else if (typeof (cssClass) === 'string') {
            tdAttributesStatic.className = cssClass;
            actualTdAttributes = tdAttributesFunc ? (row) => mergeAttributes(tdAttributesStatic, tdAttributesFunc(row)) : () => tdAttributesStatic;
        } else {
            actualTdAttributes = tdAttributesFunc ? (row) => mergeAttributes(tdAttributesStatic, tdAttributesFunc(row)) : () => tdAttributesStatic;
        }

        const core = getColumnCore(options);

        const internalColumn: InternalColumn<TRow, TExtraProps> = {
            ...core,
            includeExtraCellProps: col.includeExtraCellProps !== undefined && col.includeExtraCellProps !== null ? col.includeExtraCellProps : this.props.alwaysIncludeExtraCellProps,
            headerComponent: col.headerComponent || this.props.thInnerComponent,
            headerComponentProps: col.headerComponentProps || this.props.thInnerComponentProps,
            valueComponent: col.valueComponent || this.props.valueComponent,
            tdAttributes: actualTdAttributes,
            thAttributes: actualThAttributes,
            visible: col.visible !== false,
            column: col
        };

        return internalColumn;

    }

    transformProps(newProps: PowerTableProps<TRow, TExtraProps>, oldProps?: PowerTableProps<TRow, TExtraProps>) {

        debuglog('transformProps', { newProps, oldProps });

        if (!oldProps || !shallowEqual(newProps.columns, oldProps.columns)) {
            debuglog('transforming columns', newProps.columns);

            this.columns = this.transformColumns(newProps.columns);
            this.visibleInternalColumns = this.columns.filter((m) => m.visible !== false);
        }

        if (!oldProps || newProps.keyColumn !== oldProps.keyColumn) {

            debuglog('transforming getRowKey');

            this.getRowKey = typeof newProps.keyColumn === 'function' ? newProps.keyColumn : (row) => row[newProps.keyColumn as keyof TRow] as any;
        }

        if (!oldProps || newProps.tdComponent !== oldProps.tdComponent) {
            this.pureTdComponent = makePure(newProps.tdComponent, { componentName: 'pureTdComponent', exclude: ['children', 'row'] });
        }
    }
    render() {

        const {
            rows,
            headComponent: HeadComponent,
            headRowComponent: HeadRow,
            tableComponent: Table,
            bodyComponent: BodyComponent,
            rowComponent,
            rowBuilder: RowBuilder,
            thComponent: HeadCellComponent,
            tdComponent,
            footerComponent: TableFoot,
            footerProps,
            tableClassName,
            tableProps,
            extraCellProps,
            rowHtmlAttributes
        } = this.props;

        const internalColumns = this.visibleInternalColumns;
        const originalColumns = this.visibleOriginalColumns;

        debuglog('ReactPowerTable.render()', this.props);

        const combinedTableProps = tableClassName ? { ...tableProps, className: tableClassName } : tableProps;

        const headerCells = internalColumns.map(c => {
            const { column, thAttributes, headerText, headerComponent: HeaderComponent, headerComponentProps } = c;

            const thCellProps = headerComponentProps({ column, extraCellProps, children: headerText });

            return <HeadCellComponent {...extraCellProps} column={column} key={c.key} htmlAttributes={thAttributes}><HeaderComponent {...thCellProps} /></HeadCellComponent>;
        });

        const rowBuilderProps = { columns: internalColumns, rowComponent, extraCellProps, tdComponent, pureTdComponent: this.pureTdComponent };
        const dataRows = rows.map(row => {

            const rowProps = { ...extraCellProps as any, row, internalColumns } as RowComponentProps<TRow, TExtraProps>;
            const actualRowHtmlAttributes = rowHtmlAttributes && (typeof (rowHtmlAttributes) === 'function' ? rowHtmlAttributes(rowProps) : rowHtmlAttributes);

            return <RowBuilder key={this.getRowKey(row)} row={row} rowHtmlAttributes={actualRowHtmlAttributes} {...rowBuilderProps} />;
        });

        const body = BodyComponent && <BodyComponent rows={rows} columns={originalColumns} {...extraCellProps}>{dataRows}</BodyComponent> || dataRows;

        const actualFooterProps = TableFoot && footerProps && footerProps({ internalColumns, ...extraCellProps as any });

        return (
            <Table {...combinedTableProps}>
                <HeadComponent columns={originalColumns} {...extraCellProps}>
                    <HeadRow columns={originalColumns} {...extraCellProps}>
                        {headerCells}
                    </HeadRow>
                </HeadComponent>

                {body}

                {TableFoot && <TableFoot {...actualFooterProps} />}
            </Table >
        );

    }

}

export function typedTable<TRow, TExtraProps = {}>() {
    return ReactPowerTable as any as React.ComponentClass<PowerTableProps<TRow, TExtraProps>>;
}

