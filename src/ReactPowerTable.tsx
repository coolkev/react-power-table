/**
 * @module react-power-table
 */ /** */

import * as React from 'react';
import { debuglog, shallowEqual, makePure } from './utils';
import { transformColumn } from "./Column";


// function omitChildren(obj: React.HTMLProps<any>) {

//     if (obj && obj.children) {

//         const { children, ...rest } = obj;
//         return rest;
//     }
//     return obj;
// }

export interface DataRowComponentProps<T> extends TableRowComponentProps<T> {

    rowComponent: React.ComponentClass<TableRowComponentProps<any>> | React.StatelessComponent<TableRowComponentProps<any>>;
    tdComponent: React.ComponentClass<HTMLPropsWithoutChildren<HTMLTableCellElement>> | React.StatelessComponent<HTMLPropsWithoutChildren<HTMLTableCellElement>>
    tableCellValueComponent: React.ComponentClass<CellProps<T>> | React.StatelessComponent<CellProps<T>>
}


const DataRowComponent = makePure((props: DataRowComponentProps<any>) => {


    const { row, columns, rowComponent: RowComponent, tdComponent: TdComponent, tableCellValueComponent } = props;

    debuglog('DataRowComponent render', props);
    //console.log('DataRowComponent render', row);

    //const RowComponent = props.rowComponent;
    //const TdComponent = props.tdComponent;

    return <RowComponent columns={columns} row={row}>
        {columns.filter(m => m.visible !== false).map(col => {

            const CellComponent = col.cellComponent || tableCellValueComponent;

            const value = col.field(row);
            const formattedValue = col.formatter ? col.formatter(col.field(row), row) : col.field(row);
            const rowValueProps: CellProps = { row: row, column: col, value: formattedValue, rawValue: value };

            const cellProps = col.cellProps(rowValueProps);

            const cellComponentProps = col.cellComponentProps(rowValueProps);
            //const { children, ...actualCellProps } = cellProps || { children: undefined };

            return <TdComponent key={col.key} {...cellProps}><CellComponent {...cellComponentProps} /></TdComponent>

        })}
    </RowComponent>;


});
DataRowComponent.displayName = 'DataRowComponent';

/**
 * Primary table component
 */
export class ReactPowerTable extends React.Component<GridProps<any>, never> {

    private originalColumns: (Column | string)[];
    private columns: StrictColumn<any>[];
    private getRowKey: (row: any) => string | number;

    static displayName = 'ReactPowerTable';

    static defaultProps: Partial<GridProps<any>> = {
        tableComponent: props => <table {...props}></table>,
        tableHeaderComponent: props => <thead {...props}></thead>,
        tableHeaderRowComponent: props => <tr {...props}></tr>,
        tableHeaderCellComponent: props => {
            const { children, column, ...rest } = props;
            debuglog('defaultProps thComponent render', props);
            return <th {...rest}>{children}</th>;
        },
        tableBodyComponent: props => <tbody>{props.children}</tbody>,
        tableRowComponent: props => {
            const { row, columns, ...rest } = props;
            return <tr{...rest}></tr>;
        },
        tableCellComponent: props => <td{...props}></td>,
        tableCellValueComponent: props => <div>{props.value}</div>

    };
    constructor(props: GridProps<any>) {
        super(props);
        debuglog('constructor', props);

        //this.transformProps(props);

        this.columns = props.columns.map(c => transformColumn(c));
        this.originalColumns = props.columns;
        this.getRowKey = typeof props.keyColumn == 'function' ? props.keyColumn : (row) => row[props.keyColumn as string];

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

    private transformColumns(columns: Column<any>[]): StrictColumn<any>[] {
        debuglog('Sorting.transformColumns', columns);

        if (this.columns && this.originalColumns) {
            //reuse the same column if it hasn't changed from the original
            return columns.map((c, i) => shallowEqual(c, this.originalColumns[i]) ? this.columns[i] : transformColumn(c));
        }

        return columns.map((c) => transformColumn(c));
    }

    transformProps(newProps: GridProps<any>, oldProps?: GridProps<any>) {

        debuglog('transformProps', { newProps, oldProps });
        //const changes: string[] = [];

        if (!oldProps || !shallowEqual(newProps.columns, oldProps.columns)) {
            //changes.push('columns changed');
            debuglog('transforming columns', newProps.columns);


            this.columns = this.transformColumns(newProps.columns);
            this.originalColumns = newProps.columns;
        }

        if (!oldProps || newProps.keyColumn != oldProps.keyColumn) {
            //changes.push('keyColumn changed');

            debuglog('transforming getRowKey');
            //console.log('ReactPowerTable.getRowKey Changed');

            this.getRowKey = typeof newProps.keyColumn == 'function' ? newProps.keyColumn : (row) => row[newProps.keyColumn as string];
        }
        // const FgRed = "\x1b[31m";
        // const FgGreen = "\x1b[32m";
        // const Reset = "\x1b[0m";

        // if (changes.length > 0) {
        //     console.log(FgRed + 'ReactPowerTable.transformProps has changes' + Reset, changes);
        // }
        // else {
        //     console.log(FgGreen + 'ReactPowerTable.transformProps does not have any changes' + Reset);

        // }

    }



    render() {

        const { rows,
            tableComponent: Table,
            tableHeaderComponent: TableHead,
            tableHeaderRowComponent: TableHeadRow,
            tableHeaderCellComponent: TableHeadCell,
            tableBodyComponent: TableBody,
            tableRowComponent,
            tableCellComponent,
            tableCellValueComponent,
            tableFooterComponent: TableFoot,
            tableClassName,
            tableProps

    } = this.props;

        const columns = this.columns;

        debuglog('ReactPowerTable.render()', this.props);

        const dataRows = rows.map((row) => {
            //const rowProps = this.getRowProps(row);
            const key = this.getRowKey(row);

            debuglog('DataRow map');

            return <DataRowComponent rowComponent={tableRowComponent} tdComponent={tableCellComponent} tableCellValueComponent={tableCellValueComponent} key={key} columns={columns} row={row} />;

        });


        const combinedTableProps = tableClassName ? { ...tableProps, className: tableClassName } : tableProps;

        return <Table {...combinedTableProps }>
            <TableHead>
                <TableHeadRow>
                    {columns.filter(m => m.visible !== false).map(c => <TableHeadCell key={c.key} column={c} {...c.headerCellProps}><HeaderComponent column={c} /></TableHeadCell>)}
                </TableHeadRow>
            </TableHead>

            {TableBody ? <TableBody>{dataRows}</TableBody> : dataRows}

            {TableFoot && <TableFoot />}
        </Table >;

    }
}
const HeaderComponent = makePure((props: HeaderComponentProps<any>) => {
    //debuglog('defaultHeaderComponent render ' + props.column.headerText);
    return <div>{props.column.headerText}</div>
});
HeaderComponent.displayName = 'HeaderComponent';

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

    //components?: GridComponents<T>

    /** Customize the <table> tag. children are passed to props and must be rendered  */
    tableComponent?: React.ComponentClass<React.HTMLProps<HTMLTableElement>> | React.StatelessComponent<React.HTMLProps<HTMLTableElement>>;

    /** Inject custom props into the tableComponent  */
    tableProps?: HTMLPropsWithoutChildren<HTMLTableElement>;
    tableClassName?: string;

    /** Customize the <thead> tag. children are passed to props and must be rendered  */
    tableHeaderComponent?: React.ComponentClass<React.HTMLProps<HTMLTableSectionElement>> | React.StatelessComponent<React.HTMLProps<HTMLTableSectionElement>>;

    /** Customize the <tr> tag that appears in <thead>. children are passed to props and must be rendered  */
    tableHeaderRowComponent?: React.ComponentClass<React.HTMLProps<HTMLTableRowElement>> | React.StatelessComponent<React.HTMLProps<HTMLTableRowElement>>;

    /** Customize the <th> tag that appears in <thead> > <tr>. children are passed to props and must be rendered
     * header cell can also be customize per column using Column.headerCellProps
     */
    tableHeaderCellComponent?: React.ComponentClass<HeaderComponentProps<T>> | React.StatelessComponent<HeaderComponentProps<T>>;

    /** Customize the <tbody> tag. children are passed to props and must be rendered  */
    tableBodyComponent?: React.ComponentClass<React.HTMLProps<HTMLTableSectionElement>> | React.StatelessComponent<React.HTMLProps<HTMLTableSectionElement>>;

    /** Customize the <tbody> tag. children are passed to props and must be rendered  */
    /** Customize the <tr> tag that appears in <thead>. children are passed to props and must be rendered  */
    tableRowComponent?: React.ComponentClass<TableRowComponentProps> | React.StatelessComponent<TableRowComponentProps>;

    /** Customize the <td> tag that appears in <tbody> > <tr>. children are passed to props and must be rendered
     * table cell can also be customize per column using Column.cellProps, Column.cellComponent and Column.cellComponentProps  *
    */
    tableCellComponent?: React.ComponentClass<React.HTMLProps<HTMLTableCellElement>> | React.StatelessComponent<React.HTMLProps<HTMLTableCellElement>>;

    /** This is the default cell value component that will be used if a column specific cellComponent
    */
    tableCellValueComponent?: React.ComponentClass<CellProps<T>> | React.StatelessComponent<CellProps<T>>;


    tableFooterComponent?: React.ComponentClass<React.HTMLProps<HTMLTableSectionElement>> | React.StatelessComponent<React.HTMLProps<HTMLTableSectionElement>>;

}

export interface TableRowComponentProps<T =any> extends React.HTMLProps<HTMLTableRowElement> {
    columns: StrictColumn<T>[];
    row: T;
}

export interface StrictColumn<TRow = any, TValue = any> {

    key: string | number;

    field: ((row: TRow) => TValue);
    fieldName: string;

    headerText: string;

    cellProps?: ((props: CellProps<TRow, TValue>) => HTMLPropsWithoutChildren<HTMLTableCellElement>);

    formatter: (value: any, row?: TRow) => string;
    cellComponent?: React.ComponentClass<CellProps<TRow>> | React.StatelessComponent<CellProps<TRow>>;
    cellComponentProps?: (props: CellProps<TRow>) => any;

    headerCellProps?: HTMLPropsWithoutChildren<HTMLTableHeaderCellElement>;

    visible?: boolean;
}


export interface Column<TRow = any, TValue = any> {
    key?: string | number;
    formatter?: (value: TValue, row?: TRow) => string;
    cellComponent?: React.ComponentClass<CellProps<TRow, TValue>> | React.StatelessComponent<CellProps<TRow, TValue>>;
    cellComponentProps?: (props: CellProps<TRow, TValue>) => any;
    headerComponent?: React.ComponentClass<HeaderComponentProps<HTMLTableHeaderCellElement>> | React.StatelessComponent<HeaderComponentProps<HTMLTableHeaderCellElement>>;

    headerCellProps?: HTMLPropsWithoutChildren<HTMLTableHeaderCellElement>;


    field?: ((row: TRow) => TValue);
    fieldName?: string;
    headerText?: string;
    cellProps?: HTMLPropsWithoutChildren<HTMLTableCellElement> | ((props: CellProps<TRow, TValue>) => HTMLPropsWithoutChildren<HTMLTableCellElement>);

    headerCssClass?: string;
    cssClass?: ((props: CellProps<TRow>) => string) | string;
    width?: number;
    maxWidth?: number;
    textAlign?: string;

    /**
     * default: true
     */
    visible?: boolean;

}



export interface HeaderComponentProps<T = any> extends HTMLPropsWithoutChildren<HTMLTableHeaderCellElement> {
    column: StrictColumn<T>;

}


export interface CellProps<TRow = any, TValue = any> {
    row: TRow;
    column: Column<TRow>;

    value: TValue;
    rawValue: TValue;

}


// These interfaces should be the same as 
// https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/react/index.d.ts
// except the children property has been commented out
export interface HTMLPropsWithoutChildren<T> extends HTMLAttributesWithoutChildren<T>, React.ClassAttributes<T> {
}

export interface DOMAttributesWithoutChildren<T> {
    //children?: React.ReactNode;
    dangerouslySetInnerHTML?: {
        __html: string;
    };

    // Clipboard Events
    onCopy?: React.ClipboardEventHandler<T>;
    onCopyCapture?: React.ClipboardEventHandler<T>;
    onCut?: React.ClipboardEventHandler<T>;
    onCutCapture?: React.ClipboardEventHandler<T>;
    onPaste?: React.ClipboardEventHandler<T>;
    onPasteCapture?: React.ClipboardEventHandler<T>;

    // Composition Events
    onCompositionEnd?: React.CompositionEventHandler<T>;
    onCompositionEndCapture?: React.CompositionEventHandler<T>;
    onCompositionStart?: React.CompositionEventHandler<T>;
    onCompositionStartCapture?: React.CompositionEventHandler<T>;
    onCompositionUpdate?: React.CompositionEventHandler<T>;
    onCompositionUpdateCapture?: React.CompositionEventHandler<T>;

    // Focus Events
    onFocus?: React.FocusEventHandler<T>;
    onFocusCapture?: React.FocusEventHandler<T>;
    onBlur?: React.FocusEventHandler<T>;
    onBlurCapture?: React.FocusEventHandler<T>;

    // Form Events
    onChange?: React.FormEventHandler<T>;
    onChangeCapture?: React.FormEventHandler<T>;
    onInput?: React.FormEventHandler<T>;
    onInputCapture?: React.FormEventHandler<T>;
    onReset?: React.FormEventHandler<T>;
    onResetCapture?: React.FormEventHandler<T>;
    onSubmit?: React.FormEventHandler<T>;
    onSubmitCapture?: React.FormEventHandler<T>;

    // Image Events
    onLoad?: React.ReactEventHandler<T>;
    onLoadCapture?: React.ReactEventHandler<T>;
    onError?: React.ReactEventHandler<T>; // also a Media Event
    onErrorCapture?: React.ReactEventHandler<T>; // also a Media Event

    // Keyboard Events
    onKeyDown?: React.KeyboardEventHandler<T>;
    onKeyDownCapture?: React.KeyboardEventHandler<T>;
    onKeyPress?: React.KeyboardEventHandler<T>;
    onKeyPressCapture?: React.KeyboardEventHandler<T>;
    onKeyUp?: React.KeyboardEventHandler<T>;
    onKeyUpCapture?: React.KeyboardEventHandler<T>;

    // Media Events
    onAbort?: React.ReactEventHandler<T>;
    onAbortCapture?: React.ReactEventHandler<T>;
    onCanPlay?: React.ReactEventHandler<T>;
    onCanPlayCapture?: React.ReactEventHandler<T>;
    onCanPlayThrough?: React.ReactEventHandler<T>;
    onCanPlayThroughCapture?: React.ReactEventHandler<T>;
    onDurationChange?: React.ReactEventHandler<T>;
    onDurationChangeCapture?: React.ReactEventHandler<T>;
    onEmptied?: React.ReactEventHandler<T>;
    onEmptiedCapture?: React.ReactEventHandler<T>;
    onEncrypted?: React.ReactEventHandler<T>;
    onEncryptedCapture?: React.ReactEventHandler<T>;
    onEnded?: React.ReactEventHandler<T>;
    onEndedCapture?: React.ReactEventHandler<T>;
    onLoadedData?: React.ReactEventHandler<T>;
    onLoadedDataCapture?: React.ReactEventHandler<T>;
    onLoadedMetadata?: React.ReactEventHandler<T>;
    onLoadedMetadataCapture?: React.ReactEventHandler<T>;
    onLoadStart?: React.ReactEventHandler<T>;
    onLoadStartCapture?: React.ReactEventHandler<T>;
    onPause?: React.ReactEventHandler<T>;
    onPauseCapture?: React.ReactEventHandler<T>;
    onPlay?: React.ReactEventHandler<T>;
    onPlayCapture?: React.ReactEventHandler<T>;
    onPlaying?: React.ReactEventHandler<T>;
    onPlayingCapture?: React.ReactEventHandler<T>;
    onProgress?: React.ReactEventHandler<T>;
    onProgressCapture?: React.ReactEventHandler<T>;
    onRateChange?: React.ReactEventHandler<T>;
    onRateChangeCapture?: React.ReactEventHandler<T>;
    onSeeked?: React.ReactEventHandler<T>;
    onSeekedCapture?: React.ReactEventHandler<T>;
    onSeeking?: React.ReactEventHandler<T>;
    onSeekingCapture?: React.ReactEventHandler<T>;
    onStalled?: React.ReactEventHandler<T>;
    onStalledCapture?: React.ReactEventHandler<T>;
    onSuspend?: React.ReactEventHandler<T>;
    onSuspendCapture?: React.ReactEventHandler<T>;
    onTimeUpdate?: React.ReactEventHandler<T>;
    onTimeUpdateCapture?: React.ReactEventHandler<T>;
    onVolumeChange?: React.ReactEventHandler<T>;
    onVolumeChangeCapture?: React.ReactEventHandler<T>;
    onWaiting?: React.ReactEventHandler<T>;
    onWaitingCapture?: React.ReactEventHandler<T>;

    // MouseEvents
    onClick?: React.MouseEventHandler<T>;
    onClickCapture?: React.MouseEventHandler<T>;
    onContextMenu?: React.MouseEventHandler<T>;
    onContextMenuCapture?: React.MouseEventHandler<T>;
    onDoubleClick?: React.MouseEventHandler<T>;
    onDoubleClickCapture?: React.MouseEventHandler<T>;
    onDrag?: React.DragEventHandler<T>;
    onDragCapture?: React.DragEventHandler<T>;
    onDragEnd?: React.DragEventHandler<T>;
    onDragEndCapture?: React.DragEventHandler<T>;
    onDragEnter?: React.DragEventHandler<T>;
    onDragEnterCapture?: React.DragEventHandler<T>;
    onDragExit?: React.DragEventHandler<T>;
    onDragExitCapture?: React.DragEventHandler<T>;
    onDragLeave?: React.DragEventHandler<T>;
    onDragLeaveCapture?: React.DragEventHandler<T>;
    onDragOver?: React.DragEventHandler<T>;
    onDragOverCapture?: React.DragEventHandler<T>;
    onDragStart?: React.DragEventHandler<T>;
    onDragStartCapture?: React.DragEventHandler<T>;
    onDrop?: React.DragEventHandler<T>;
    onDropCapture?: React.DragEventHandler<T>;
    onMouseDown?: React.MouseEventHandler<T>;
    onMouseDownCapture?: React.MouseEventHandler<T>;
    onMouseEnter?: React.MouseEventHandler<T>;
    onMouseLeave?: React.MouseEventHandler<T>;
    onMouseMove?: React.MouseEventHandler<T>;
    onMouseMoveCapture?: React.MouseEventHandler<T>;
    onMouseOut?: React.MouseEventHandler<T>;
    onMouseOutCapture?: React.MouseEventHandler<T>;
    onMouseOver?: React.MouseEventHandler<T>;
    onMouseOverCapture?: React.MouseEventHandler<T>;
    onMouseUp?: React.MouseEventHandler<T>;
    onMouseUpCapture?: React.MouseEventHandler<T>;

    // Selection Events
    onSelect?: React.ReactEventHandler<T>;
    onSelectCapture?: React.ReactEventHandler<T>;

    // Touch Events
    onTouchCancel?: React.TouchEventHandler<T>;
    onTouchCancelCapture?: React.TouchEventHandler<T>;
    onTouchEnd?: React.TouchEventHandler<T>;
    onTouchEndCapture?: React.TouchEventHandler<T>;
    onTouchMove?: React.TouchEventHandler<T>;
    onTouchMoveCapture?: React.TouchEventHandler<T>;
    onTouchStart?: React.TouchEventHandler<T>;
    onTouchStartCapture?: React.TouchEventHandler<T>;

    // UI Events
    onScroll?: React.UIEventHandler<T>;
    onScrollCapture?: React.UIEventHandler<T>;

    // Wheel Events
    onWheel?: React.WheelEventHandler<T>;
    onWheelCapture?: React.WheelEventHandler<T>;

    // Animation Events
    onAnimationStart?: React.AnimationEventHandler<T>;
    onAnimationStartCapture?: React.AnimationEventHandler<T>;
    onAnimationEnd?: React.AnimationEventHandler<T>;
    onAnimationEndCapture?: React.AnimationEventHandler<T>;
    onAnimationIteration?: React.AnimationEventHandler<T>;
    onAnimationIterationCapture?: React.AnimationEventHandler<T>;

    // Transition Events
    onTransitionEnd?: React.TransitionEventHandler<T>;
    onTransitionEndCapture?: React.TransitionEventHandler<T>;
}
export interface HTMLAttributesWithoutChildren<T> extends DOMAttributesWithoutChildren<T> {
    // React-specific Attributes
    defaultChecked?: boolean;
    defaultValue?: string | string[];
    suppressContentEditableWarning?: boolean;

    // Standard HTML Attributes
    accept?: string;
    acceptCharset?: string;
    accessKey?: string;
    action?: string;
    allowFullScreen?: boolean;
    allowTransparency?: boolean;
    alt?: string;
    async?: boolean;
    autoComplete?: string;
    autoFocus?: boolean;
    autoPlay?: boolean;
    capture?: boolean;
    cellPadding?: number | string;
    cellSpacing?: number | string;
    charSet?: string;
    challenge?: string;
    checked?: boolean;
    cite?: string;
    classID?: string;
    className?: string;
    cols?: number;
    colSpan?: number;
    content?: string;
    contentEditable?: boolean;
    contextMenu?: string;
    controls?: boolean;
    coords?: string;
    crossOrigin?: string;
    data?: string;
    dateTime?: string;
    default?: boolean;
    defer?: boolean;
    dir?: string;
    disabled?: boolean;
    download?: any;
    draggable?: boolean;
    encType?: string;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    frameBorder?: number | string;
    headers?: string;
    height?: number | string;
    hidden?: boolean;
    high?: number;
    href?: string;
    hrefLang?: string;
    htmlFor?: string;
    httpEquiv?: string;
    id?: string;
    inputMode?: string;
    integrity?: string;
    is?: string;
    keyParams?: string;
    keyType?: string;
    kind?: string;
    label?: string;
    lang?: string;
    list?: string;
    loop?: boolean;
    low?: number;
    manifest?: string;
    marginHeight?: number;
    marginWidth?: number;
    max?: number | string;
    maxLength?: number;
    media?: string;
    mediaGroup?: string;
    method?: string;
    min?: number | string;
    minLength?: number;
    multiple?: boolean;
    muted?: boolean;
    name?: string;
    nonce?: string;
    noValidate?: boolean;
    open?: boolean;
    optimum?: number;
    pattern?: string;
    placeholder?: string;
    playsInline?: boolean;
    poster?: string;
    preload?: string;
    radioGroup?: string;
    readOnly?: boolean;
    rel?: string;
    required?: boolean;
    reversed?: boolean;
    role?: string;
    rows?: number;
    rowSpan?: number;
    sandbox?: string;
    scope?: string;
    scoped?: boolean;
    scrolling?: string;
    seamless?: boolean;
    selected?: boolean;
    shape?: string;
    size?: number;
    sizes?: string;
    slot?: string;
    span?: number;
    spellCheck?: boolean;
    src?: string;
    srcDoc?: string;
    srcLang?: string;
    srcSet?: string;
    start?: number;
    step?: number | string;
    style?: React.CSSProperties;
    summary?: string;
    tabIndex?: number;
    target?: string;
    title?: string;
    type?: string;
    useMap?: string;
    value?: string | string[] | number;
    width?: number | string;
    wmode?: string;
    wrap?: string;

    // RDFa Attributes
    about?: string;
    datatype?: string;
    inlist?: any;
    prefix?: string;
    property?: string;
    resource?: string;
    typeof?: string;
    vocab?: string;

    // Non-standard Attributes
    autoCapitalize?: string;
    autoCorrect?: string;
    autoSave?: string;
    color?: string;
    itemProp?: string;
    itemScope?: boolean;
    itemType?: string;
    itemID?: string;
    itemRef?: string;
    results?: number;
    security?: string;
    unselectable?: boolean;
}
