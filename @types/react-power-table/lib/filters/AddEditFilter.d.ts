/// <reference types="react" />
import * as React from 'react';
import { FilterDefinition } from "./DataTypes/DataType";
export interface AddEditFilterProps {
    filter: FilterDefinition<any>;
    initialOperation: OperationDefinition<any>;
    initialValue?: any;
    onApplyFilter: (filter: AppliedFilter<any>) => void;
}
export interface AddEditFilterState {
    operation: OperationDefinition<any>;
    value: any;
}
export declare class AddEditFilter extends React.PureComponent<AddEditFilterProps, AddEditFilterState> {
    constructor(props: AddEditFilterProps);
    private selectedOperationChange(e);
    private handleFilterValueChange(value);
    private applyFilter();
    render(): JSX.Element;
}
