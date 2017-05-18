// THIS FILE IS GENERATED AUTOMATICALLY
// ANY MANUAL EDITS TO THIS FILE WILL GET OVERWRITTEN

import { DataTypes, Column, SelectOption, getOptionProvider, executeQuery } from './remote-data';

interface CustomerViewModel {
    "CustomerID": number;
    "FirstName": string;
    "LastName": string;
    "Age": number;
    "OrderCount": number;
    "FirstOrderDate": string;
    "LastOrderDate": string;
}


const fields = {
        "Orders_Details_ProductID": {"fieldName":"Orders_Details_ProductID","displayName":"Has Ordered Product"},
        "CustomerID": {"fieldName":"CustomerID","displayName":"Customer ID"},
        "FirstName": {"fieldName":"FirstName","displayName":"First Name"},
        "LastName": {"fieldName":"LastName","displayName":"Last Name"},
        "Age": {"fieldName":"Age","displayName":"Age"},
        "OrderCount": {"fieldName":"OrderCount","displayName":"Order Count"},
        "FirstOrderDate": {"fieldName":"FirstOrderDate","displayName":"First Order Date","canBeNull":true},
        "LastOrderDate": {"fieldName":"LastOrderDate","displayName":"Last Order Date","canBeNull":true},
};

const endpointUrl = "/api/customer/";

export default {
    "executeQuery": (query)=> executeQuery(endpointUrl + 'query', query),
    "filters": {
        "Orders_Details_ProductID": new DataTypes.int(fields.Orders_Details_ProductID),
        "CustomerID": new DataTypes.int(fields.CustomerID),
        "FirstName": new DataTypes.string(fields.FirstName),
        "LastName": new DataTypes.string(fields.LastName),
        "Age": new DataTypes.int(fields.Age),
        "OrderCount": new DataTypes.int(fields.OrderCount),
        "FirstOrderDate": new DataTypes.date(fields.FirstOrderDate),
        "LastOrderDate": new DataTypes.date(fields.LastOrderDate),
    },
    "columns": {
        "FirstName": {fieldName: fields.FirstName.fieldName, headerText: fields.FirstName.displayName } as Column<CustomerViewModel,string>,
        "LastName": {fieldName: fields.LastName.fieldName, headerText: fields.LastName.displayName } as Column<CustomerViewModel,string>,
        "Age": {fieldName: fields.Age.fieldName, headerText: fields.Age.displayName } as Column<CustomerViewModel,number>,
        "OrderCount": {fieldName: fields.OrderCount.fieldName, headerText: fields.OrderCount.displayName } as Column<CustomerViewModel,number>,
        "FirstOrderDate": {fieldName: fields.FirstOrderDate.fieldName, headerText: fields.FirstOrderDate.displayName } as Column<CustomerViewModel,string>,
        "LastOrderDate": {fieldName: fields.LastOrderDate.fieldName, headerText: fields.LastOrderDate.displayName } as Column<CustomerViewModel,string>,
    },
    "keyColumn": "CustomerID",
    "defaultSort": {"column":"CustomerID","descending":false}
};
