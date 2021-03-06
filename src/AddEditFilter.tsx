﻿import * as React from 'react';
import Button from 'react-bootstrap/Button';
import * as filters from './filters/FilterDefinition';
import { debuglog } from './utils';

export interface AddEditFilterProps {
    filter: filters.FilterDefinition<any>;
    initialOperation: filters.OperationDefinition<any>;
    initialValue?: any;
    onApplyFilter: (filter: filters.AppliedFilter<any>) => void;
    onRemoveFilter?: () => void;
    filterKey?: string;
}

export interface AddEditFilterState {

    operationKey: string;
    value: any;

    invalid?: boolean;
}

export class AddEditFilter extends React.PureComponent<AddEditFilterProps, AddEditFilterState> {

    constructor(props: AddEditFilterProps) {
        super(props);

        const value = props.initialValue === undefined ? (props.filter.defaultValue === undefined ? '' : props.filter.defaultValue) : props.initialValue;

        this.state = { value, operationKey: props.initialOperation.key };

        this.selectedOperationChange = this.selectedOperationChange.bind(this);
        this.handleFilterValueChange = this.handleFilterValueChange.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
    }

    private selectedOperationChange(e: React.FormEvent<HTMLInputElement>) {

        const prevOperationKey = this.state.operationKey;
        const operationKey = e.currentTarget.value;
        //const operation = this.props.filter.operations[operationKey];

        const newState: AddEditFilterState = { operationKey, value: this.state.value };

        this.props.filter.onOperationChange(prevOperationKey, newState);
        // if (prevOperationKey === 'between' && operationKey !== prevOperationKey && typeof this.state.value === 'string') {
        //     newState.value = this.state.value.split(' ')[0];
        // }
        this.setState(newState);
    }

    private handleFilterValueChange(value: string) {
        //console.log('AddEditFilter.filterValueChange', value);
        this.setState({
            value,
        });
    }

    private applyFilter() {
        const operation = this.props.filter.operations[this.state.operationKey];

        //console.log('AddEditFilter.applyFilter', { filter: this.props.filter, operation, value: this.state.value });
        const isValid = operation.isValid === undefined || operation.isValid(this.state.value);
        //console.log('GridFilters.applyNewfilter', { filter: this.props.filter, isValid });
        if (isValid) {
            this.props.onApplyFilter({ filter: this.props.filter, operation, value: this.state.value, key: this.props.filterKey });
        }
        if (isValid !== !this.state.invalid) {
            this.setState({ invalid: !isValid });
        }
    }

    private removeFilter() {
        this.props.onRemoveFilter();
    }

    private handleKeyPress(e: React.KeyboardEvent<any>) {
        if (e.charCode === 13) {
            this.applyFilter();
        }
    }
    render() {
        debuglog('AddEditFilter.render', this.props);

        const filter = this.props.filter;

        const { value, operationKey, invalid } = this.state;

        const opComponents = Object.keys(filter.operations).map((opKey) => {
            const op = filter.operations[opKey];
            let children: React.ReactChild;
            if (opKey === this.state.operationKey) {

                const SelectedFilterComponent = op.filterComponent || filter.filterComponent;

                if (SelectedFilterComponent) {
                    children = <div onKeyPress={this.handleKeyPress}><SelectedFilterComponent filter={filter} operation={op} value={value} onValueChange={this.handleFilterValueChange} invalid={invalid} /></div>;
                }
            }

            return <FilterOperation key={opKey} operation={op} filter={filter} selected={opKey === operationKey} onChange={this.selectedOperationChange}>{children}</FilterOperation>;
        });

        return (
            <div className="add-edit-filter">
                <div style={{ margin: '10px 0' }}><b>{filter.displayName}</b>
                </div>

                {opComponents.map((opComponent) => opComponent)}

                <div style={{ marginTop: 20 }}>
                    <Button variant="primary" size="sm" onClick={this.applyFilter}>Apply Filter</Button>

                    {this.props.onRemoveFilter && ' '}

                    {this.props.onRemoveFilter && <Button size="sm" variant="danger" onClick={this.removeFilter}>Remove Filter</Button>}

                </div>

            </div>);
    }
}

interface FilterOperationProps extends React.Props<any> {
    operation: filters.OperationDefinition;
    filter: filters.FilterDefinition;

    selected: boolean;
    onChange: React.EventHandler<React.FormEvent<HTMLInputElement>>;
}

const FilterOperation = (props: FilterOperationProps) => {

    const { operation, filter, onChange, selected, children } = props;

    return (
        <div style={{ marginTop: 10, marginBottom: 10 }}>
            <div className="form-group form-check" key={operation.key}>
                <label className="form-check-label" style={selected ? { marginBottom: 10 } : undefined}>
                    <input type="radio" className="form-check-input" checked={selected} onChange={onChange} value={operation.key} />
                    {filter.radioButtonLabel ? filter.radioButtonLabel({ filter, operation }) : operation.displayName}
                </label>

                {children}
            </div>
        </div>
    );

};
