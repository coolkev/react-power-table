/// <reference types="react-select" />
import * as PowerTable from "./FilterDefinition";
import * as Select from 'react-select';
export declare class List extends PowerTable.FilterDefinition<string[]> {
    constructor(options: PowerTable.FilterDefinitionOptionsOrFieldName, items: Select.Option[]);
    protected getOperations(): PowerTable.ObjectMap<PowerTable.OperationDefinition<string[]>>;
}
