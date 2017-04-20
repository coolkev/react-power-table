import { FilterDefinition, FilterDefinitionOptionsOrFieldName } from "./FilterDefinition";
export declare class Int extends FilterDefinition<number> {
    constructor(options: FilterDefinitionOptionsOrFieldName);
    protected getOperations(): any;
    parseValue(str: string): number;
}
