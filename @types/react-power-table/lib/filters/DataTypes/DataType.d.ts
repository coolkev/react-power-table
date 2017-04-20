/// <reference types="react" />
export declare abstract class FilterDefinition<T> implements FilterDefinitionOptions {
    fieldName: string;
    displayName?: string;
    canBeNull?: boolean;
    radioButtonLabel: (props: RadioButtonLabelProps<T>) => React.ReactType;
    filterComponent: (props: FilterComponentProps<T>) => JSX.Element;
    defaultValue: T;
    appliedFilterLabel?: (filter: AppliedFilter<T>) => string | Promise<string>;
    serializeValue(value: T): string;
    deSerializeValue(value: string): T;
    constructor(options: FilterDefinitionOptionsOrFieldName);
    protected abstract getOperations(): ObjectMap<OperationDefinition<T>>;
    readonly operations: KeyedMap<OperationDefinition<T>>;
    applyFilter<TData>(data: TData[], field: string, operation: OperationDefinition<T>, filterValue: T): TData[];
    static defaultAppliedFilterLabel<T>(filter: AppliedFilter<T>): string;
    parseValue(str: string): T;
    private readonly _defaultOperations;
    protected readonly defaultOperations: ObjectMap<Keyed<{}>> & {
        all: Keyed<{}>[];
    } & ObjectMap<OperationDefinition<any>>;
}
