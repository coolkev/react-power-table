/// <reference types="react-select" />
import { FilterDefinition } from "./DataType";
import * as Select from 'react-select';
export declare class List extends FilterDefinition<string[]> {
    constructor(options: FilterDefinitionOptionsOrFieldName, items: Select.Option[]);
    protected getOperations(): ObjectMap<OperationDefinition<string[]>>;
}
