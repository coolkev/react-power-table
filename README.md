# react-power-table

[![Build Status](https://travis-ci.org/coolkev/react-power-table.svg?branch=master)](https://travis-ci.org/coolkev/react-power-table)
[![Coverage Status](https://coveralls.io/repos/github/coolkev/react-power-table/badge.svg?branch=master)](https://coveralls.io/github/coolkev/react-power-table?branch=master)
[![npm version](https://badge.fury.io/js/react-power-table.svg)](https://badge.fury.io/js/react-power-table)


## Installation


```bash
$ npm install react-power-table --save
```



## Table Props

#### columns 
`(Column|string)[]` *Required*

Array of column definitions for the table. Refer to column props.


#### keyColumn 
`string | (row => string | number)` *Required*

Field name or function to specify unique key for each row.

#### rows 
`object[]` *Required*

Rows to display in table.

#### tableProps 
`React.HTMLProps<HTMLTableElement>`

Customize the props passed to the `<table>` element


#### tableClassName 
`string`

Customize the className of the `<table>` element

#### rowHtmlAttributes
`React.HTMLProps<HTMLTableRowElement>` | `rowProps => React.HTMLProps<HTMLTableRowElement>`

Define attributes to be set on each `<tr>` element. Can be an object or a function that returns an object. Function is passed `rowProps: { row, columns }` for the current row.


#### extraCellProps 
`object`

Optional properties to pass down to [CellProps](#cellprops) for each column that has `includeExtraCellProps` set to true 
or use `alwaysIncludeExtraCellProps` to always include these props

#### alwaysIncludeExtraCellProps 
`boolean`

Set to true to pass the extraCellProps into the [CellProps](#cellprops) of each row


## Column Definition

The columns array passed to the `<ReactPowerTable/>` can be a simple array of strings which contain the field names for the objects supplied to the `rows` prop. Or it can be an array of Column definition objects to have full control of the rendering of each column. This array should be defined outside of the `render()` method so the columns do not have to be recalculated every render. This should typically be defined as a module level const, or be defined in the constructor of your component (if it needs access to state from your component).

#### field 
`string` | `row => any`

At the very least, `field` must be defined for data to be rendered automatically in that cell, or just `key` can be used in cases where you do not want any data rendered automatically in that column.

```javascript
const columns = [
    { field: row => row.name }, // using function
    { field: 'age' }, // using field name
];
```

#### headerText 
`string`

The text to render in the header (`<th>`) cell for this column. Defaults to the field name for this column.

#### headerCssClass 
`string`

Specify the className to use for this columns's `<th/>` element. Shortcut for `thAttributes: { className: '' }`

#### width 
`number`

Specify the width (in pixels) for this column. Sets the `style="width: 100px"` for both the `th` and each `td` for this column.


#### maxWidth 
`number`

Specify the max-width (in pixels) for this column. Sets the `style="max-width: 100px"` for both the `th` and each `td` for this column.

#### textAlign 
`string`

Specify the text-align for this column. Sets the `style="text-align: value"` for both the `th` and each `td` for this column.

#### cssClass 
`string | (CellProps => string)`

Specify the className to use for this `<td/>` element for each row. Can be a string or a function that returns a string for the given [CellProps](#cellprops)

#### visible 
`boolean` (Default: true)

Specify false to hide this column.



#### formatter 
`(value, row) => any`

Provide a format function to transform the value for this cell.

```javascript
const columns = [
    { field: row => row.name }
    { field: 'birthdate', formatter: value=> moment(value).format('l') }
];
```


#### includeExtraCellProps 
`boolean`

Set to true to include the containing Table's `extraCellProps` in the `cellProps` object passed to the cell customization functions.



#### thAttributes 
`React.ThHTMLAttributes<HTMLTableHeaderCellElement>`

Customize the html attributes set in the `<th/>` element for this column.

#### headerComponent 
`Component (props: {column: Column})`

Customize the content rendered inside of the `<th/>` element for this column


## Advanced Column Customizations

Each of the props/functions below will be passed a `CellProps` object:

#### CellProps
```javascript 
CellProps: {
    row: Row,
    column: Column,
    value: any, // raw value from row for this column
    formattedValue: any // formatted value using the formatter function for this column if present, otherwise, same as the value
}
```

#### tdAttributes 
`React.TdHTMLAttributes<HTMLTableDataCellElement> | (cellProps => React.TdHTMLAttributes<HTMLTableDataCellElement>)`

Customize the html attributes set in the `<td/>` element for each row for this column. Can be a static object, or a function that returns an object with the attributes to use for that row.


```javascript
const columns = [
    { field: row => row.name }
    { field: row => row.age, tdAttributes: cell => ({ style: { color: cell.value % 2===0 ? 'red' : 'blue' } }) }
    // make cells having an even number colored red, and odd number blue
];
```


#### valueComponent
`Component (props: CellProps)`

Component that is rendered inside td for this column for every row. If not specified, it will use the valueComponent set on the Table and if that is not specified, it will just render the value for this cell directly inside the `<td>`


```javascript
const columns = [
    { field: row => row.name }
    { field: row => row.age, valueComponent: cell => <MyCustomComponent age={cell.value}/> }    
];
```


#### wrapper
`Element | (props: CellProps) => Element`

A simpler alternative to `valueComponent` where you can just wrap the cell contents inside of another element. Useful when you don't need to change the rendered value, but just want to wrap it inside of a `div` or `a` element.

```javascript
const columns = [
    { field: row => row.name, wrapper: cell => <a href={'/person/' + cell.row.personId }/> }, 
    // function -  age will be injected into a element using children, and href will be specific to this row's personId

    { field: row => row.age, wrapper: <div className="special"/> } 
    // static element - age will be injected into div using children
    
];
```




#### transformCellProps
`(props: CellProps) => CellProps`

Function that allows you to customize or augment the `CellProps` object passed around to the customization functions. You can add your own component's state here so they get passed into your custom valueComponent and the valueComponent can remain pure. 

```javascript
const columns = [
    { field: row => row.name },
    { field: row => row.age, wrapper: <div className="special"/> } 
];
```


#### pure
`boolean`

Cells are pure by default, so they will not be re-rendered unless the value (or props) for that cell change. If you are referencing some external state from within `tdAttributes`, `valueComponent` or `wrapper`, then you will need to either pass that state in using the [CellProps](#cellprops) or the Table `extraCellProps` or you can set `pure: false` so the cell will always get re-rendered.


## Pure by Default

React Power Table is pure by default so that it can prevent unnecessary re-rendering as much as possible. There are some scenarios where you may need to include other state from your containing component that isn't included in the row data passed to the table in `rows`.

Here are a few different ways you can handle that and ensure that the cells are re-rendered when your external state changes.

```javascript
class MyComponent extends React.Component {

    private columns;
    constructor(props) {
        super(props);
        this.state = { highlightEvenRows: false };

        this.handleHighlightChange = this.handleHighlightChange.bind(this);

        this.columns = [
            { field: row => row.name },

            // bad - this will not work because the row data has not changed and this cell will not be re-rendered.
            { field: row => row.age, tdAttributes: cell => this.state.highlightEvenRows && {style: {backgroundColor: cell.value % 2===0 ? 'yellow' : null }  } 
            
            // quick and dirty fix for this is to specify pure: false so this cell is always re-rendered
            { field: row => row.age, tdAttributes: cell => this.state.highlightEvenRows && {style: {backgroundColor: cell.value % 2===0 ? 'yellow' : null }, pure: false } 

            // better fix is to customize the CellProps and pass the state in so component can remain pure:
            { field: row => row.age, tdAttributes: cell => cell.highlightEvenRows && {style: {backgroundColor: cell.value % 2===0 ? 'yellow' : null }, transformCellProps: cell=> ({...cell, highlightEvenRows: this.state.highlightEvenRows }) } 
            
            // or another option is to pass highlightEvenRows into the table extraCellProps so it can be accessed by the columns that need it
            { field: row => row.age, tdAttributes: cell => cell.highlightEvenRows && {style: {backgroundColor: cell.value % 2===0 ? 'yellow' : null }, includeExtraCellProps: true } 
            
        ];
    }
    
    handleHighlightChange(e) {
        this.setState({ highlightEvenRows: e.currentTarget.checked });
    }

    render() {
        const { highlightEvenRows } = this.state;

        return <div>
            <label><input type="checkbox" checked={highlightEvenRows} onChange={this.handleHighlightChange} /> Highlight even rows</label>
            <ReactPowerTable rows={rows} columns={columns} extraCellProps={{highlightEvenRows}}/>
        </div>
    }
}
```



## Table Components

All of the components used in the top-level ReactPowerTable component can be overriden to customize the rendering. Most of these components are passed children props which contain the child elements so you can omit rendering the children or change how they are rendered.

#### tableComponent
`Component (React.HTMLProps<HTMLTableElement>)`

Customize the `<table>` tag. Children are passed to props and must be rendered.


#### headComponent
`props: {columns, children}`

Customize the `<thead>` tag. Children are passed to props and must be rendered.


#### headRowComponent
`props: {columns, children}`

Customize the `<tr>` tag that is rendered in `<thead>`. Children are passed to props and must be rendered.

#### thComponent
`props: {column, htmlAttributes, children}`

Customize the `<th>` tag. Children are passed to props and must be rendered.

#### thInnerComponent

Customize the content that is rendered inside the `<th>`. Defaults to a `<div/>`

#### bodyComponent
`props: {columns, rows, children}`

Customize the `<tbody>` tag. Children are passed to props and must be rendered.

#### rowComponent
`props: {columns, row, children}`

Customize the `<tr>` tag that is rendered in `<tbody>`. Children are passed to props and must be rendered.


#### tdComponent
`props: CellProps & { children }`

Customize the `<td>` tag. Children are passed to props and must be rendered.


#### valueComponent
`props: CellProps & { children }`

Customize the content that is rendered inside the `<td>`. Children default to the formattedValue of the `CellProps`



#### footerComponent

Customize the `<tfoot>` tag. 



#### footerProps

Customize the props passed into the `footerComponent`

