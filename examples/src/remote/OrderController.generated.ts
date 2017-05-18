// THIS FILE IS GENERATED AUTOMATICALLY
// ANY MANUAL EDITS TO THIS FILE WILL GET OVERWRITTEN

import { DataTypes, Column, SelectOption, getOptionProvider, executeQuery } from './remote-data';

interface OrderViewModel {
    "OrderID": number;
    "Customer": CustomerEntityRef;
    "Date": string;
    "OrderTotal": number;
    "DateUpdated": string;
    "Type": OrderType;
}

interface CustomerEntityRef extends EntityRef {
}

enum OrderType {
    OnlineOrder=0,
    PhoneOrder=1,
}

interface EntityRef {
    "ID": number;
    "Name": string;
}


function mapEntries(obj: { [key:number]: string }) {
    return Object.keys(obj).map((k) => ({ label: obj[k], value: k as any } as SelectOption<number>))
}
const fields = {
        "ProductID": {"fieldName":"ProductID","displayName":"Product ID"},
        "OrderID": {"fieldName":"OrderID","displayName":"Order ID"},
        "Customer": {"fieldName":"Customer","displayName":"Customer"},
        "Date": {"fieldName":"Date","displayName":"Date"},
        "OrderTotal": {"fieldName":"OrderTotal","displayName":"Order Total"},
        "DateUpdated": {"fieldName":"DateUpdated","displayName":"Date Updated","canBeNull":true},
        "Type": {"fieldName":"Type","displayName":"Type"},
};

const endpointUrl = "/api/order/";

export const lookups = {
        "ProductID": {101:"Blue Shirt",102:"Red Shirt",103:"Jeans",104:"Hat",105:"Shoes"},
        "Type": {0:"Online Order",1:"Phone Order"},
};

export const filterOptions = {
        "ProductID": mapEntries(lookups.ProductID),
        "Customer": getOptionProvider(endpointUrl + 'options',"Customer"),
        "Type": mapEntries(lookups.Type),
};

export default {
    "executeQuery": (query)=> executeQuery(endpointUrl + 'query', query),
    "filters": {
        "ProductID": new DataTypes.list(fields.ProductID, filterOptions.ProductID),
        "OrderID": new DataTypes.int(fields.OrderID),
        "Customer": new DataTypes.remotelist(fields.Customer, filterOptions.Customer),
        "Date": new DataTypes.date(fields.Date),
        "OrderTotal": new DataTypes.decimal(fields.OrderTotal),
        "DateUpdated": new DataTypes.date(fields.DateUpdated),
        "Type": new DataTypes.list(fields.Type, filterOptions.Type),
    },
    "columns": {
        "OrderID": {fieldName: fields.OrderID.fieldName, headerText: fields.OrderID.displayName } as Column<OrderViewModel,number>,
        "Customer": {fieldName: fields.Customer.fieldName, headerText: fields.Customer.displayName } as Column<OrderViewModel,CustomerEntityRef>,
        "Date": {fieldName: fields.Date.fieldName, headerText: fields.Date.displayName } as Column<OrderViewModel,string>,
        "OrderTotal": {fieldName: fields.OrderTotal.fieldName, headerText: fields.OrderTotal.displayName } as Column<OrderViewModel,number>,
        "DateUpdated": {fieldName: fields.DateUpdated.fieldName, headerText: fields.DateUpdated.displayName } as Column<OrderViewModel,string>,
        "Type": {fieldName: fields.Type.fieldName, headerText: fields.Type.displayName } as Column<OrderViewModel,OrderType>,
    },
    "keyColumn": "OrderID",
    "defaultSort": {"column":"Date","descending":true}
};
