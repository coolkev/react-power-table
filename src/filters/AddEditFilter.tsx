import * as React from 'react';
import Radio from 'react-bootstrap/lib/Radio';
import Button from 'react-bootstrap/lib/Button';
import { debuglog } from "../utils";
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


export class AddEditFilter extends React.PureComponent<AddEditFilterProps, AddEditFilterState> {

    constructor(props: AddEditFilterProps) {
        super(props);


        const value = props.initialValue || props.filter.defaultValue || '';

        this.state = { value: value, operation: props.initialOperation };

        this.selectedOperationChange = this.selectedOperationChange.bind(this);
        this.handleFilterValueChange = this.handleFilterValueChange.bind(this);
        this.applyFilter = this.applyFilter.bind(this);

    }

    private selectedOperationChange(e: React.FormEvent<Radio & HTMLInputElement>) {

        const prevOperation = this.state.operation;
        const operationKey = e.currentTarget.value;
        const operation = this.props.filter.operations[operationKey];

        const newState: Partial<AddEditFilterState> = { operation: operation };

        if (prevOperation.key == 'between' && operation.key != prevOperation.key && typeof this.state.value === 'string') {
            newState.value = this.state.value.split(' ')[0];
        }
        this.setState(newState as any)
    }

    private handleFilterValueChange(value: string) {
        debuglog('AddEditFilter.filterValueChange', value);
        this.setState({
            value: value
        });
    }

    private applyFilter() {
        this.props.onApplyFilter({ filter: this.props.filter, operation: this.state.operation, value: this.state.value });
    }
    render() {
        debuglog('AddEditFilter.render', this.props);

        const filter = this.props.filter;


        return <div>
            <div style={{ margin: '10px 0' }}><b>{filter.displayName}</b>
            </div>




            {filter.operations.all.map(op => {
                
                let selectedFilterComponentProps: PowerTable.FilterComponentProps<any>;
                let SelectedFilterComponent: React.ComponentClass<PowerTable.FilterComponentProps<any>> | React.StatelessComponent<PowerTable.FilterComponentProps<any>>;

                if (op.key == this.state.operation.key) {
                    selectedFilterComponentProps = {
                        filter: this.props.filter,
                        operation:op,
                        value: this.state.value,
                        onValueChange: this.handleFilterValueChange,
                        onEnterKeyPress: this.applyFilter
                    };

                    SelectedFilterComponent = op.filterComponent || filter.filterComponent;

                }



                return <div key={op.key}>
                    <Radio checked={op.key == this.state.operation.key} onChange={this.selectedOperationChange} value={op.key}>
                        {filter.radioButtonLabel ? filter.radioButtonLabel({
                            filter: this.props.filter,
                            operation: op
                        }) : op.displayName}

                    </Radio>
                    {SelectedFilterComponent &&
                        <div style={{ marginLeft: 20 }}><SelectedFilterComponent {...selectedFilterComponentProps} /></div>
                    }
                </div>;


            })}


            <div style={{ marginTop: 20 }}>
                <Button bsStyle="primary" bsSize="sm" onClick={this.applyFilter}>Apply Filter</Button>
            </div>

        </div>;
    }
}
