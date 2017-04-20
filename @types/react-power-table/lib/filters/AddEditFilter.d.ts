/// <reference types="react" />
import * as React from 'react';
import * as PowerTable from "./definitions/FilterDefinition";
export interface AddEditFilterProps {
    filter: PowerTable.FilterDefinition<any>;
    initialOperation: PowerTable.OperationDefinition<any>;
    initialValue?: any;
    onApplyFilter: (filter: PowerTable.AppliedFilter<any>) => void;
}
export interface AddEditFilterState {
    operation: PowerTable.OperationDefinition<any>;
    value: any;
}
export declare class AddEditFilter extends React.PureComponent<AddEditFilterProps, AddEditFilterState> {
    constructor(props: AddEditFilterProps);
    private selectedOperationChange(e);
    private handleFilterValueChange(value);
    private applyFilter();
    render(): JSX.Element;
}
