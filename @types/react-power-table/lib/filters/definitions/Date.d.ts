import { FilterDefinition, FilterDefinitionOptionsOrFieldName } from "./FilterDefinition";
export declare class Date extends FilterDefinition<string> {
    constructor(options: FilterDefinitionOptionsOrFieldName);
    parseValue(str: string): string;
    protected getOperations(): {
        eq: any;
        lt: any;
        gt: any;
        between: any;
    };
}
