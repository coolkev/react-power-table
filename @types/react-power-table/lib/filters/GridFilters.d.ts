/// <reference types="react" />
import * as React from 'react';
import * as PowerTable from "./definitions/FilterDefinition";
export interface GridFiltersProps {
    availableFilters: PowerTable.AvailableFiltersMap;
    appliedFilters: PowerTable.AppliedFilterType[];
    onFiltersChange: (newFilters: PowerTable.AppliedFilterType[]) => void;
}
export interface GridFiltersState {
    addingFilter?: boolean;
    editingFilter?: PowerTable.AppliedFilterType;
}
export interface GridAppliedFiltersProps {
    availableFilters: PowerTable.AvailableFiltersMap;
    appliedFilters: PowerTable.AppliedFilterType[];
    removeFilter: (filter: PowerTable.AppliedFilterType) => void;
    editFilter: (filter: PowerTable.AppliedFilterType) => void;
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
