import * as PowerTable from './FilterDefinition';
export declare class String extends PowerTable.FilterDefinition<string> {
    constructor(options: PowerTable.FilterDefinitionOptionsOrFieldName);
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
        } & PowerTable.OperationDefinition<any>;
        'ne': {} & {
            key: string;
        } & PowerTable.OperationDefinition<any>;
    };
    serializeValue(value: string): string;
    deSerializeValue(value: string): string;
    applyFilter<TData>(data: TData[], field: string, operation: PowerTable.OperationDefinition<string>, value: string): TData[];
}
