import * as React from 'react';
import OrderController, { lookups } from './OrderController.generated';

// customize columns/filters here
const { columns, filters } = OrderController;

// columns.Customer.cellComponent = props => <a href={"customer/" + props.value.ID}>{props.value.Name}</a>;
// columns.Date.formatter = v => v && v.substr(0, 10);
// columns.OrderTotal.formatter = (value) => "$" + value;
// //filters.OrderTotal.appliedLabel = (value) => "$" + value.value;
// columns.DateUpdated.formatter = v => v && v.substr(0, 10);
// columns.DateUpdated.headerText = 'Updated';
// columns.Type.formatter = v => lookups.Type[v];


export { OrderController  };
