# react-power-table

[![Build Status](https://travis-ci.org/coolkev/react-power-table.svg?branch=master)](https://travis-ci.org/coolkev/react-power-table)
[![Coverage Status](https://coveralls.io/repos/github/coolkev/react-power-table/badge.svg?branch=master)](https://coveralls.io/github/coolkev/react-power-table?branch=master)
[![npm version](https://badge.fury.io/js/react-power-table.svg)](https://badge.fury.io/js/react-power-table)


## Installation


```bash
$ npm install react-power-table --save
```



## Table Props

### columns `(Column|string)[]` *Required*


Array of column definitions for the table. Refer to column props.


### keyColumn `string | (row => string | number)` *Required*

Field name or function to specify unique key for each row.

### rows `object[]` *Required*

Rows to display in table.

### tableProps `React.HTMLProps<HTMLTableElement>`

Customize the props passed to the `<table>` element


### tableClassName `string`

Customize the className of the `<table>` element


### extraCellProps `object`

Optional properties to pass down to valueProps for each column that has `includeExtraCellProps` set to true 
or use `alwaysIncludeExtraCellProps` to always include these props

### alwaysIncludeExtraCellProps `boolean`

Set to true to pass the extraCellProps into the valueProps of each row


## Column Definition

The columns array passed to the `<ReactPowerTable/>` can be a simple array of string which contain the field names for the objects supplied to the `rows` prop. Or it can be an array of Column definition objects to have full control of the rendering of each column. This array should be defined outside of the `render()` method so the columns do not have to be recalculated every render. This should typically be defined as a module level const, or be defined in the constructor of your component (if it needs access to state from your component).

### field `string` | `row => any`
At the very least, `field` must be defined for data to be rendered automatically in that cell, or just `key` can be used in cases where you do not want any data rendered automatically in that column.

```javascript
const columns = [
    { field: row => row.name }, // using function
    { field: 'age' }, // using field name
];
```

### headerText `string`
The text to render in the header (`<th>`) cell for this column. Defaults to the field name for this column.

### headerCssClass `string`
Specify the className to use for this columns's `<th/>` element. Shortcut for `thAttributes: { className: '' }`

### width `number`
Specify the width (in pixels) for this column. Sets the `style="width: 100px"` for both the `th` and each `td` for this column.


### maxWidth `number`
Specify the max-width (in pixels) for this column. Sets the `style="max-width: 100px"` for both the `th` and each `td` for this column.

### textAlign `string`
Specify the text-align for this column. Sets the `style="text-align: 'value'"` for both the `th` and each `td` for this column.



### visible `boolean` (Default: true)
Specify false to hide this column.



### formatter `(value, row) => any`
Provide a format function to transform the value for this cell.

```javascript
const columns = [
    { field: row => row.name }
    { field: 'birthdate', formatter: value=> moment(value).format('l') }
];
```


### includeExtraCellProps `boolean`
Set to true to include the containing Table's `extraCellProps` in the `cellProps` object passed to the cell customization functions.



### thAttributes `React.ThHTMLAttributes<HTMLTableHeaderCellElement>`
Customize the html attributes set in the `<th/>` element for this column.

### headerComponent `Component (props: {column: Column})`
Customize the content rendered inside of the `<th/>` element for this column



### tdAttributes `React.TdHTMLAttributes<HTMLTableDataCellElement> | (cellProps => React.TdHTMLAttributes<HTMLTableDataCellElement>)`
Customize the html attributes set in the `<td/>` element for each row for this column. Can be a static object, or a function that returns an object with the attributes to use for that row.


```javascript
const columns = [
    { field: row => row.name }
    { field: row => row.age, tdAttributes: cell => ({ style: { color: cell.value % 2===0 ? 'red' : 'blue' } }) }
    // make cells having an even number colored red, and odd number blue
];
```
