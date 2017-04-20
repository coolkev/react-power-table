import { FilterDefinition, FilterDefinitionOptionsOrFieldName } from "./FilterDefinition";
export declare class Decimal extends FilterDefinition<number> {
    constructor(options: FilterDefinitionOptionsOrFieldName);
    protected getOperations(): any;
    parseValue(str: string): number;
}
