import { Lazy } from '../utils';
import { BetweenAppliedFilterLabel, BetweenApplyFilterTest, BetweenFilterComponent } from './defaultBetweenComponent';

function defaultOperations<T>() {

    const result = {
        eq: { key: 'eq', displayName: 'is equal to', test: (source, filterValue) => source === filterValue } as OperationDefinition<T>,
        ne: { key: 'ne', displayName: 'is not equal to', test: (source, filterValue) => source !== filterValue } as OperationDefinition<T>,
        lt: { key: 'lt', displayName: 'is less than', test: (source, filterValue) => source < filterValue, isValid: v => v !== '' as any } as OperationDefinition<T>,
        gt: { key: 'gt', displayName: 'is greater than', test: (source, filterValue) => source > filterValue, isValid: v => v !== '' as any } as OperationDefinition<T>,
        between: {
            key: 'between', displayName: 'is between', filterComponent: BetweenFilterComponent, appliedLabel: BetweenAppliedFilterLabel,
            test: (source, filterValue) => source >= filterValue && source <= filterValue,
            isValid: v => {
                //console.log('between isValid', v);
                const values = v.toString().split(' ');

                return values.length === 2 && values[0] !== '' && values[1] !== '';
            }
        } as OperationDefinition<T>,

    };

    return result;
}

export function nullableOperations<T>() {
    return {
        notnull: {
            key: 'notnull',
            displayName: 'has a value',
            appliedLabel: ((filter) => filter.filter.displayName + ' ' + filter.operation.displayName),
            filterComponent: () => null,
            test: (source) => source != null && source !== undefined && source !== '',
        } as OperationDefinition<T>,

        null: {
            key: 'null',
            displayName: 'does not have a value',
            appliedLabel: (filter) => filter.filter.displayName + ' ' + filter.operation.displayName,
            filterComponent: () => null,
            test: (source) => source == null || source === undefined || source === '',

        } as OperationDefinition<T>,
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

// export type FilterDefinitionOptionsOrFieldName = FilterDefinitionOptions | string;

export abstract class FilterDefinition<T = any, TOperations extends ObjectMap<OperationDefinition<T>> = {}> implements FilterDefinitionOptions {

    public fieldName: string;
    public displayName: string;
    public canBeNull?: boolean;

    public radioButtonLabel: (props: RadioButtonLabelProps<T>) => React.ReactType;
    //public filterComponent: (props: FilterComponentProps<T>) =>JSX.Element;
    public filterComponent: React.ComponentType<FilterComponentProps<T>>;
    public defaultValue: T;

    public appliedLabel?: (filter: AppliedFilter<T>) => string;
    public appliedLabelComponent?: React.ComponentType<AppliedFilter<T>>;
    //public operations: TOperations;
    public abstract readonly operations: TOperations;
    private readonly lazyDefaultOperations = new Lazy(() => this.canBeNull ? { ...defaultOperations<T>(), ...nullableOperations<T>() } : defaultOperations<T>());

    public static readonly defaultAppliedFilterLabel = (filter: AppliedFilter<any>) => {
        return filter.filter.displayName + ' ' + filter.operation.displayName + ' ' + filter.value;
    }
    constructor(options: FilterDefinitionOptionsOrFieldName) {

        if (typeof options === 'string') {
            this.fieldName = options;
            this.displayName = options;
        } else {

            this.fieldName = options.fieldName;
            this.displayName = options.displayName || options.fieldName;
            this.canBeNull = options.canBeNull;
        }

        // const operations = this.operations;

        // operations.all = Object.keys(operations).filter(m => m != 'all').map(m => operations[m]);

        // this.operations = operations;

    }

    // protected getOperations(): TOperations {

    //     return this.defaultOperations as any as TOperations;
    // }

    public onOperationChange(prevOperationKey: string, newFilterState: OnChangeOperationProps) {
        if (prevOperationKey === 'between' && newFilterState.operationKey !== prevOperationKey && typeof newFilterState.value === 'string') {
            newFilterState.value = newFilterState.value.split(' ')[0];
        }
    }
    public serializeValue(value: T, _type?: string) {
        return value.toString();
    }

    public deSerializeValue(value: string): T {
        return value as any;
    }

    public applyFilter<TData>(data: ReadonlyArray<TData>, operation: OperationDefinition<T>, filterValue: T) {

        let { test } = operation;

        const parsedValue = this.parseValue(filterValue as any);
        // if (console.group) {
        //     console.group('applyFilter ' + operation.displayName + ' ' + filterValue + ' parsedValue: ' + parsedValue);
        // }
        if (operation.key === 'between') {
            test = BetweenApplyFilterTest(this.parseValue, filterValue as any as string);
        }

        const result = data.filter((d: any) => {
            const r = test(d[this.fieldName], parsedValue);
            // console.log('test ' + d[this.fieldName] + ' returned ' + result);
            return r;
        });
        // if (console.groupEnd) {

        //     console.groupEnd();
        // }
        return result;
    }
    public parseValue(str: string): T {
        return str as any as T;
    }

    protected get defaultOperations() {
        return this.lazyDefaultOperations.value;
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

    // public isValid(value: T) {
    //     return true;
    // }
}

// export namespace PowerTable {
export interface ObjectMap<T> {
    [key: string]: T;
}

// export type Keyed<T> = T & { key: string };
// export type KeyedMap<T> = ObjectMap<Keyed<T>> & {
//     all: Keyed<T>[];
// }

// export type AvailableFiltersMap = KeyedMap<FilterDefinition<any>>;

export interface FilterDefinitionOptions {
    fieldName: string;
    displayName?: string;
    canBeNull?: boolean;

}

export interface OperationDefinition<T = any> {
    key: string;
    displayName: string;
    appliedLabel?: (filter: AppliedFilter<T>) => string;
    appliedLabelComponent?: React.ComponentType<AppliedFilter<T>>;
    filterComponent?: React.ComponentType<FilterComponentProps<T>>;

    radioButtonLabel?: React.ComponentType<RadioButtonLabelProps<T>>;
    test(source: any, filterValue: T): boolean;

    isValid?(value: T): boolean;
}

export interface AppliedFilter<T = any> {
    filter: FilterDefinition<T>;
    operation: OperationDefinition<T>;
    value: T;

    key: string;

}

export interface FilterComponentProps<T> extends AppliedFilter<T> {

    onValueChange: (value: T) => void;

    style?: React.CSSProperties;
    className?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    placeholder?: string;

    invalid?: boolean;
    //onEnterKeyPress: () => void;
}
export interface RadioButtonLabelProps<T> {
    filter: FilterDefinition<T>;
    operation: OperationDefinition<T>;
}

// }

export interface OnChangeOperationProps {

    operationKey: string;
    value: any;

}
