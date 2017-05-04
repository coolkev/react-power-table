﻿import { Lazy } from "../utils";
import { BetweenAppliedFilterLabel, BetweenFilterComponent, BetweenApplyFilterTest } from "./defaultBetweenComponent";



function defaultOperations<T>() {

    const result = {
        'eq': { key: 'eq', displayName: 'is equal to', test: (source, filterValue) => source == filterValue } as OperationDefinition<T>,
        'ne': { key: 'ne', displayName: 'is not equal to', test: (source, filterValue) => source == filterValue } as OperationDefinition<T>,
        'lt': { key: 'lt', displayName: 'is less than', test: (source, filterValue) => source < filterValue } as OperationDefinition<T>,
        'gt': { key: 'gt', displayName: 'is greater than', test: (source, filterValue) => source > filterValue } as OperationDefinition<T>,
        'between': { key: 'between', displayName: 'is between', filterComponent: BetweenFilterComponent, appliedLabel: BetweenAppliedFilterLabel, test: (source, filterValue) => source >= filterValue && source <= filterValue } as OperationDefinition<T>

    };

    return result;
};

export function nullableOperations<T>() {
    return {
        "notnull": {
            key: 'notnull',
            displayName: 'has a value',
            appliedLabel: ((filter) => filter.filter.displayName + ' ' + filter.operation.displayName),
            filterComponent: () => null,
            test: (source, _filterValue) => source != null && source != undefined && source != ''
        },

        "null": {
            key: 'null',
            displayName: 'does not have a value',
            appliedLabel: (filter) => filter.filter.displayName + ' ' + filter.operation.displayName,
            filterComponent: () => null,
            test: (source, _filterValue) => source == null || source == undefined || source == ''

        }
    };
}
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

export abstract class FilterDefinition<T = any> implements FilterDefinitionOptions {
    fieldName: string;
    displayName: string;
    canBeNull?: boolean;

    radioButtonLabel: (props: RadioButtonLabelProps<T>) => React.ReactType;
    filterComponent: (props: FilterComponentProps<T>) => JSX.Element;
    defaultValue: T;

    appliedLabel?: (filter: AppliedFilter<T>) => string;
    appliedLabelComponent?: React.ComponentClass<AppliedFilter<T>> | React.StatelessComponent<AppliedFilter<T>>;

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


        const operations = this.operations;

        //operations.all = Object.keys(operations).filter(m => m != 'all').map(m => operations[m]);

        this.operations = operations;

    }

    //protected abstract getOperations(): ObjectMap<OperationDefinition<T>>;
    public readonly operations: ObjectMap<OperationDefinition<T>>;

    public applyFilter<TData>(data: TData[], operation: OperationDefinition<T>, filterValue: T) {

        let { test } = operation;

        const parsedValue = this.parseValue(filterValue as any);
        // if (console.group) {
        //     console.group('applyFilter ' + operation.displayName + ' ' + filterValue + ' parsedValue: ' + parsedValue);
        // }
        if (operation.key == 'between') {
            test = BetweenApplyFilterTest(this.parseValue, filterValue as any as string);
        }

        const result = data.filter(d => {
            const result = test(d[this.fieldName], parsedValue);
            //console.log('test ' + d[this.fieldName] + ' returned ' + result);
            return result;
        });
        // if (console.groupEnd) {

        //     console.groupEnd();
        // }    
        return result;
    }

    static defaultAppliedFilterLabel = (filter: AppliedFilter<any>) => {
        return filter.filter.displayName + ' ' + filter.operation.displayName + ' ' + filter.value
    };

    public parseValue(str: string): T {
        return str as any as T;
    }

    private readonly _defaultOperations = new Lazy(() => this.canBeNull ? { ...defaultOperations<T>(), ...nullableOperations() } : defaultOperations<T>());
    protected get defaultOperations() {
        return this._defaultOperations.value;
    }

    // protected getNullableOperations() {

    //     if (!this.canBeNull) {
    //         return undefined;
    //     }
    //     return {
    //         "notnull": {
    //             key: 'notnull',
    //             displayName: 'has a value',
    //             appliedLabel: ((filter) => filter.filter.displayName + ' ' + filter.operation.displayName),
    //             filterComponent: () => null,
    //             test: (source, _filterValue) => source != null && source != undefined && source != ''
    //         },

    //         "null": {
    //             key: 'null',
    //             displayName: 'does not have a value',
    //             appliedLabel: (filter) => filter.filter.displayName + ' ' + filter.operation.displayName,
    //             filterComponent: () => null,
    //             test: (source, _filterValue) => source == null || source == undefined || source == ''

    //         }
    //     };

    // }

}



//export namespace PowerTable {
export type ObjectMap<T> = {
    [key: string]: T;
};

// export type Keyed<T> = T & { key: string };
// export type KeyedMap<T> = ObjectMap<Keyed<T>> & {
//     all: Keyed<T>[];
// }



//export type AvailableFiltersMap = KeyedMap<FilterDefinition<any>>;

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



export interface AppliedFilter<T = any> {
    filter: FilterDefinition<T>;
    operation: OperationDefinition<T>;
    value: T;

}

export interface AppliedFilterDTO {
    columnKey: string;
    operationKey: string;
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