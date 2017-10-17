// THIS FILE IS GENERATED AUTOMATICALLY
// ANY MANUAL EDITS TO THIS FILE WILL GET OVERWRITTEN

import { DisplayValue, FieldDefinition, DataTypes, Column, SelectOption, getOptionProvider, executeQuery } from './remote-data';

export interface CustomerViewModel {
    'CustomerID': DisplayValue<number>;
    'FirstName': { display: string };
    'LastName': { display: string };
    'Age': DisplayValue<number>;
    'OrderCount': DisplayValue<number>;
    'FirstOrderDate': DisplayValue<string>;
    'LastOrderDate': DisplayValue<string>;
}

export const fields = {
        Orders_Details_ProductID: {fieldName: 'Orders_Details_ProductID', displayName: 'Has Ordered Product', filterable: true, visible: false, typeName: 'Int32', dataType: 2} as FieldDefinition,
        CustomerID: {fieldName: 'CustomerID', displayName: 'Customer ID', filterable: true, visible: false, typeName: 'Int32', dataType: 2} as FieldDefinition,
        FirstName: {fieldName: 'FirstName', displayName: 'First Name', filterable: true, visible: true, typeName: 'String', dataType: 1} as FieldDefinition,
        LastName: {fieldName: 'LastName', displayName: 'Last Name', filterable: true, visible: true, typeName: 'String', dataType: 1} as FieldDefinition,
        Age: {fieldName: 'Age', displayName: 'Age', filterable: true, visible: true, typeName: 'Int32', dataType: 2} as FieldDefinition,
        OrderCount: {fieldName: 'OrderCount', displayName: 'Order Count', filterable: true, visible: true, typeName: 'Int32', dataType: 2} as FieldDefinition,
        FirstOrderDate: {fieldName: 'FirstOrderDate', displayName: 'First Order Date', filterable: true, visible: true, typeName: 'DateTime', canBeNull: true, dataType: 4} as FieldDefinition,
        LastOrderDate: {fieldName: 'LastOrderDate', displayName: 'Last Order Date', filterable: true, visible: true, typeName: 'DateTime', canBeNull: true, dataType: 4} as FieldDefinition,
};

const endpointUrl = '/api/customer/';

export default {
    executeQuery: (query) => executeQuery(endpointUrl + 'query', query),
    filters: {
        Orders_Details_ProductID: new DataTypes.int(fields.Orders_Details_ProductID),
        CustomerID: new DataTypes.int(fields.CustomerID),
        FirstName: new DataTypes.string(fields.FirstName),
        LastName: new DataTypes.string(fields.LastName),
        Age: new DataTypes.int(fields.Age),
        OrderCount: new DataTypes.int(fields.OrderCount),
        FirstOrderDate: new DataTypes.date(fields.FirstOrderDate),
        LastOrderDate: new DataTypes.date(fields.LastOrderDate),
    },
    columns: {
        FirstName: { fieldName: fields.FirstName.fieldName, headerText: fields.FirstName.displayName } as Column<CustomerViewModel, {}, string>,
        LastName: {fieldName: fields.LastName.fieldName, headerText: fields.LastName.displayName } as Column<CustomerViewModel, {}, string>,
        Age: {fieldName: fields.Age.fieldName, headerText: fields.Age.displayName } as Column<CustomerViewModel, {}, number>,
        OrderCount: {fieldName: fields.OrderCount.fieldName, headerText: fields.OrderCount.displayName } as Column<CustomerViewModel, {}, number>,
        FirstOrderDate: {fieldName: fields.FirstOrderDate.fieldName, headerText: fields.FirstOrderDate.displayName } as Column<CustomerViewModel, {}, string>,
        LastOrderDate: {fieldName: fields.LastOrderDate.fieldName, headerText: fields.LastOrderDate.displayName } as Column<CustomerViewModel, {}, string>,
    },
    keyColumn: 'CustomerID',
    defaultSort: {column: 'CustomerID', descending: false}
};
