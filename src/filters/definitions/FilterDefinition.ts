import { createKeyedMap, Lazy } from "../../utils";
import { BetweenAppliedFilterLabel, BetweenFilterComponent, BetweenApplyFilterTest } from "./defaultBetweenComponent";



const defaultOperations = () => {

    const result: ObjectMap<OperationDefinition<any>> = {
        'eq': { key: 'eq', displayName: 'is equal to', test: (source, filterValue) => source == filterValue },
        'ne': { key: 'ne', displayName: 'is not equal to', test: (source, filterValue) => source == filterValue },
        'lt': { key: 'lt', displayName: 'is less than', test: (source, filterValue) => source < filterValue },
        'gt': { key: 'gt', displayName: 'is greater than', test: (source, filterValue) => source > filterValue },
        'between': { key: 'between', displayName: 'is between', filterComponent: BetweenFilterComponent, appliedLabel: BetweenAppliedFilterLabel, test: (source, filterValue) => source >= filterValue && source <= filterValue }

    };

    return createKeyedMap(result);
};


// export interface IFilterDefinition<T> extends FilterDefinitionOptions {
//     operations: KeyedMap<OperationDefinition<T>>;
//     radioButtonLabel: (props: RadioButtonLabelProps<T>) => React.ReactType;
//     filterComponent: (props: FilterComponentProps<T>) => JSX.Element;
//     defaultValue: T;

//     appliedFilterLabel?: (filter: AppliedFilter<T>) => string | Promise<string>;

//     applyFilter<TData>(data: TData[], field: string, operation: OperationDefinition<T>, value: T);

// }

export type FilterDefinitionOptionsOrFieldName = FilterDefinitionOptions | string;

//export type FilterDefinitionOptionsOrFieldName = FilterDefinitionOptions | string;

export abstract class FilterDefinition<T> implements FilterDefinitionOptions {
    fieldName: string;
    displayName?: string;
    canBeNull?: boolean;

    radioButtonLabel: (props:RadioButtonLabelProps<T>) => React.ReactType;
    filterComponent: (props: FilterComponentProps<T>) => JSX.Element;
    defaultValue: T;

    appliedLabel?: (filter: AppliedFilter<T>) => string;
    appliedLabelComponent?:  React.ComponentClass<AppliedFilter<T>> | React.StatelessComponent<AppliedFilter<T>>;

    serializeValue(value: T) {
        return value.toString();
    }    
    
    deSerializeValue(value: string): T {
        return value as any;
    }    
    
    constructor(options: FilterDefinitionOptionsOrFieldName) {

        if (typeof options === 'string') {
            this.fieldName = options;
            this.displayName = options;
        }
        else {

            this.fieldName = options.fieldName;
            this.displayName = options.displayName || options.fieldName;
            this.canBeNull = options.canBeNull;
        }


        const operations = this.getOperations() as KeyedMap<OperationDefinition<T>>;

        if (this.canBeNull) {
            operations.notnull = {
                key: 'notnull',
                displayName: 'has a value',
                appliedLabel: ((filter) => filter.filter.displayName + ' ' + filter.operation.displayName),
                filterComponent: () => null,
                test: (source, _filterValue) => source != null && source != undefined && source != ''
            } as OperationDefinition<T>;

            operations.null = {
                key: 'null',
                displayName: 'does not have a value',
                appliedLabel: (filter) => filter.filter.displayName + ' ' + filter.operation.displayName,
                filterComponent: () => null,
                test: (source, _filterValue) => source == null || source == undefined || source == ''

            };
        }

        operations.all = Object.keys(operations).filter(m => m != 'all').map(m => operations[m]);

        this.operations = operations;

    }

    protected abstract getOperations(): ObjectMap<OperationDefinition<T>>;
    public readonly operations: KeyedMap<OperationDefinition<T>>;

    public applyFilter<TData>(data: TData[], field: string, operation: OperationDefinition<T>, filterValue: T) {

        let { test } = operation;

        const parsedValue = this.parseValue(filterValue as any);

        console.group('applyFilter ' + operation.displayName + ' ' + filterValue + ' parsedValue: ' + parsedValue);

        if (operation.key == 'between') {
            test = BetweenApplyFilterTest(this.parseValue, filterValue as any as string);
        }

        const result = data.filter(d => {
            const result = test(d[field], parsedValue);
            console.log('test ' + d[field] + ' returned ' + result);
            return result;
        });
        console.groupEnd();
        return result;
    }

    static defaultAppliedFilterLabel = (filter: AppliedFilter<any>)=> {
        return filter.filter.displayName + ' ' + filter.operation.displayName + ' ' + filter.value
    };

    public parseValue(str: string): T {
        return str as any as T;
    }

    private readonly _defaultOperations = new Lazy(defaultOperations);
    protected get defaultOperations() {
        return this._defaultOperations.value;
    }

}



//export namespace PowerTable {
    export type ObjectMap<T> = {
        [key: string]: T;
    }
    export type Keyed<T> = T & { key: string };
    export type KeyedMap<T> = ObjectMap<Keyed<T>> & {
        all: Keyed<T>[];
    }



    export type AvailableFiltersMap = KeyedMap<FilterDefinition<any>>;

    export type AppliedFilterType = AppliedFilter<any>;

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




//}