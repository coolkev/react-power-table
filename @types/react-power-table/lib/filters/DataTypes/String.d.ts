import { FilterDefinition } from "./DataType";
export declare class String extends FilterDefinition<string> {
    constructor(options: FilterDefinitionOptionsOrFieldName);
    protected getOperations(): {
        'contains': {
            key: string;
            displayName: string;
            test: (source: any, value: any) => boolean;
        };
        'notcontains': {
            key: string;
            displayName: string;
            test: (source: any, value: any) => boolean;
        };
        'eq': {} & {
            key: string;
        } & OperationDefinition<any>;
        'ne': {} & {
            key: string;
        } & OperationDefinition<any>;
    };
    applyFilter<TData>(data: TData[], field: string, operation: OperationDefinition<string>, value: string): TData[];
}
