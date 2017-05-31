import * as React from 'react';
import * as Button from 'react-bootstrap/lib/Button';
import * as Radio from 'react-bootstrap/lib/Radio';
import * as filters from './filters/FilterDefinition';
import { debuglog } from './utils';

/**
 * @internal
 */
export interface AddEditFilterProps {
    filter: filters.FilterDefinition<any>;
    initialOperation: filters.OperationDefinition<any>;
    initialValue?: any;
    onApplyFilter: (filter: filters.AppliedFilter<any>) => void;
}

/**
 * @internal
 */
export interface AddEditFilterState {

    operationKey: string;
    value: any;

}

/**
 * @internal
 */
export class AddEditFilter extends React.PureComponent<AddEditFilterProps, AddEditFilterState> {

    constructor(props: AddEditFilterProps) {
        super(props);

        const value = props.initialValue || props.filter.defaultValue || '';

        this.state = { value, operationKey: props.initialOperation.key };

        this.selectedOperationChange = this.selectedOperationChange.bind(this);
        this.handleFilterValueChange = this.handleFilterValueChange.bind(this);
        this.applyFilter = this.applyFilter.bind(this);

    }

    private selectedOperationChange(e: React.FormEvent<Radio & HTMLInputElement>) {

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
        debuglog('AddEditFilter.filterValueChange', value);
        this.setState({
            value,
        });
    }

    private applyFilter() {
        const operation = this.props.filter.operations[this.state.operationKey];

        this.props.onApplyFilter({ filter: this.props.filter, operation, value: this.state.value });
    }
    render() {
        debuglog('AddEditFilter.render', this.props);

        const filter = this.props.filter;

        const { value, operationKey } = this.state;

        const opComponents = Object.keys(filter.operations).map((opKey) => {
            const op = filter.operations[opKey];
            let children: React.ReactChild;
            if (opKey === this.state.operationKey) {

                const SelectedFilterComponent = op.filterComponent || filter.filterComponent;

                if (SelectedFilterComponent) {
                    children = <div style={{ marginLeft: 20 }}><SelectedFilterComponent filter={filter} operation={op} value={value} onValueChange={this.handleFilterValueChange} onEnterKeyPress={this.applyFilter} /></div>;
                }
            }

            return <FilterOperation key={opKey} operation={op} filter={filter} selected={opKey === operationKey} onChange={this.selectedOperationChange}>{children}</FilterOperation>;
        });

        return (
            <div>
                <div style={{ margin: '10px 0' }}><b>{filter.displayName}</b>
                </div>

                {opComponents.map((opComponent) => opComponent)}

                <div style={{ marginTop: 20 }}>
                    <Button bsStyle="primary" bsSize="sm" onClick={this.applyFilter}>Apply Filter</Button>
                </div>

            </div>);
    }
}

/**
 * @internal
 */
export interface FilterOperationProps extends React.Props<any> {
    operation: filters.OperationDefinition;
    filter: filters.FilterDefinition;

    selected: boolean;
    onChange: React.EventHandler<React.FormEvent<Radio & HTMLInputElement>>;
}

/**
 * @internal
 */
export const FilterOperation = (props: FilterOperationProps) => {

    const { operation, filter, onChange, selected, children } = props;

    return (
        <div key={operation.key}>
            <Radio checked={selected} onChange={onChange} value={operation.key}>
                {filter.radioButtonLabel ? filter.radioButtonLabel({ filter, operation }) : operation.displayName}

            </Radio>
            {children}
        </div>
    );

};
