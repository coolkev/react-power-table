/// <reference types="react" />
import * as React from 'react';
import { FilterDefinition } from "./DataTypes/DataType";
export declare type AvailableFiltersMap = KeyedMap<FilterDefinition<any>>;
export declare type AppliedFilterType = AppliedFilter<any>;
export interface GridFiltersProps {
    availableFilters: AvailableFiltersMap;
    appliedFilters: AppliedFilterType[];
    onFiltersChange: (newFilters: AppliedFilterType[]) => void;
}
declare global  {
    type ObjectMap<T> = {
        [key: string]: T;
    };
    type Keyed<T> = T & {
        key: string;
    };
    type KeyedMap<T> = ObjectMap<Keyed<T>> & {
        all: Keyed<T>[];
    };
    interface FilterDefinitionOptions {
        fieldName: string;
        displayName?: string;
        canBeNull?: boolean;
    }
    type FilterDefinitionOptionsOrFieldName = FilterDefinitionOptions | string;
    interface OperationDefinition<T> {
        key: string;
        displayName: string;
        appliedFilterLabel?(filter: AppliedFilter<T>): string | Promise<string>;
        filterComponent?: (props: FilterComponentProps<T>) => JSX.Element;
        radioButtonLabel?: (props: RadioButtonLabelProps<T>) => JSX.Element;
        test(source: any, filterValue: T): boolean;
    }
    interface AppliedFilter<T> {
        filter: FilterDefinition<T>;
        operation: OperationDefinition<T>;
        value: T;
    }
    interface AppliedFilterDTO {
        key: string;
        operation: string;
        value: string;
    }
    interface FilterComponentProps<T> extends AppliedFilter<T> {
        onValueChange: (value: T) => void;
        style?: React.CSSProperties;
        className?: string;
        autoFocus?: boolean;
        disabled?: boolean;
        placeholder?: string;
        onEnterKeyPress: () => void;
    }
    interface RadioButtonLabelProps<T> {
        filter: FilterDefinition<T>;
        operation: OperationDefinition<T>;
    }
}
export interface GridFiltersState {
    addingFilter?: boolean;
    editingFilter?: AppliedFilterType;
}
export interface GridAppliedFiltersProps {
    availableFilters: AvailableFiltersMap;
    appliedFilters: AppliedFilterType[];
    removeFilter: (filter: AppliedFilterType) => void;
    editFilter: (filter: AppliedFilterType) => void;
    onOptionLoaded: () => void;
}
export declare class GridFilters extends React.Component<GridFiltersProps, GridFiltersState> {
    constructor(props: GridFiltersProps);
    private showAddFilter();
    private hideAddFilter();
    private applyNewfilter(filter);
    private removeFilter(filter);
    private editFilter(filter);
    private cancelEditFilter();
    private applyEditFilter(filter);
    render(): JSX.Element;
}
