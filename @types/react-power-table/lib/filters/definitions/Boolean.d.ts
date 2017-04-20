import { FilterDefinition, FilterDefinitionOptionsOrFieldName } from "./FilterDefinition";
export declare class Boolean extends FilterDefinition<boolean> {
    constructor(options: FilterDefinitionOptionsOrFieldName);
    protected getOperations(): {
        'eq': {
            key: string;
            displayName: string;
            test: (source: any) => any;
        };
        'ne': {
            key: string;
            displayName: string;
            test: (source: any) => boolean;
        };
    };
}
