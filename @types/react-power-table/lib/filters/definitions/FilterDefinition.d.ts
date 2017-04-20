/// <reference types="react" />
export declare type FilterDefinitionOptionsOrFieldName = FilterDefinitionOptions | string;
export declare abstract class FilterDefinition<T> implements FilterDefinitionOptions {
    fieldName: string;
    displayName?: string;
    canBeNull?: boolean;
    radioButtonLabel: (props: RadioButtonLabelProps<T>) => React.ReactType;
    filterComponent: (props: FilterComponentProps<T>) => JSX.Element;
    defaultValue: T;
    appliedLabel?: (filter: AppliedFilter<T>) => string;
    appliedLabelComponent?: React.ComponentClass<AppliedFilter<T>> | React.StatelessComponent<AppliedFilter<T>>;
    serializeValue(value: T): string;
    deSerializeValue(value: string): T;
    constructor(options: FilterDefinitionOptionsOrFieldName);
    protected abstract getOperations(): ObjectMap<OperationDefinition<T>>;
    readonly operations: KeyedMap<OperationDefinition<T>>;
    applyFilter<TData>(data: TData[], field: string, operation: OperationDefinition<T>, filterValue: T): TData[];
    static defaultAppliedFilterLabel: (filter: AppliedFilter<any>) => string;
    parseValue(str: string): T;
    private readonly _defaultOperations;
    protected readonly defaultOperations: ObjectMap<Keyed<{}>> & {
        all: Keyed<{}>[];
    } & ObjectMap<OperationDefinition<any>>;
}
export declare type ObjectMap<T> = {
    [key: string]: T;
};
export declare type Keyed<T> = T & {
    key: string;
};
export declare type KeyedMap<T> = ObjectMap<Keyed<T>> & {
    all: Keyed<T>[];
};
export declare type AvailableFiltersMap = KeyedMap<FilterDefinition<any>>;
export declare type AppliedFilterType = AppliedFilter<any>;
export interface FilterDefinitionOptions {
    fieldName: string;
    displayName?: string;
    canBeNull?: boolean;
}
export interface OperationDefinition<T> {
    key: string;
    displayName: string;
    appliedLabel?: (filter: AppliedFilter<T>) => string;
    appliedLabelComponent?: React.ComponentClass<AppliedFilter<T>> | React.StatelessComponent<AppliedFilter<T>>;
    filterComponent?: React.ComponentClass<FilterComponentProps<T>> | React.StatelessComponent<FilterComponentProps<T>>;
    radioButtonLabel?: React.ComponentClass<RadioButtonLabelProps<T>> | React.StatelessComponent<RadioButtonLabelProps<T>>;
    test(source: any, filterValue: T): boolean;
}
export interface AppliedFilter<T> {
    filter: FilterDefinition<T>;
    operation: OperationDefinition<T>;
    value: T;
}
export interface AppliedFilterDTO {
    key: string;
    operation: string;
    value: string;
}
export interface FilterComponentProps<T> extends AppliedFilter<T> {
    onValueChange: (value: T) => void;
    style?: React.CSSProperties;
    className?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    placeholder?: string;
    onEnterKeyPress: () => void;
}
export interface RadioButtonLabelProps<T> {
    filter: FilterDefinition<T>;
    operation: OperationDefinition<T>;
}
