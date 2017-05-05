import * as React from 'react';
import Radio from 'react-bootstrap/lib/Radio';
import Button from 'react-bootstrap/lib/Button';
import { debuglog } from "./utils";
import * as filters from "./filters/FilterDefinition";


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

        this.state = { value: value, operationKey: props.initialOperation.key };

        this.selectedOperationChange = this.selectedOperationChange.bind(this);
        this.handleFilterValueChange = this.handleFilterValueChange.bind(this);
        this.applyFilter = this.applyFilter.bind(this);

    }

    private selectedOperationChange(e: React.FormEvent<Radio & HTMLInputElement>) {

        const prevOperationKey = this.state.operationKey;
        const operationKey = e.currentTarget.value;
        //const operation = this.props.filter.operations[operationKey];

        const newState: Partial<AddEditFilterState> = { operationKey: operationKey };

        if (prevOperationKey == 'between' && operationKey != prevOperationKey && typeof this.state.value === 'string') {
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
        const operation = this.props.filter.operations[this.state.operationKey];

        this.props.onApplyFilter({ filter: this.props.filter, operation: operation, value: this.state.value });
    }
    render() {
        debuglog('AddEditFilter.render', this.props);

        const filter = this.props.filter;

        return <div>
            <div style={{ margin: '10px 0' }}><b>{filter.displayName}</b>
            </div>




            {Object.keys(filter.operations).map(opKey => {
                const op = filter.operations[opKey];
                let selectedFilterComponentProps: filters.FilterComponentProps<any>;
                let SelectedFilterComponent: React.ComponentClass<filters.FilterComponentProps<any>> | React.StatelessComponent<filters.FilterComponentProps<any>>;

                if (op.key == this.state.operationKey) {
                    selectedFilterComponentProps = {
                        filter: this.props.filter,
                        operation: op,
                        value: this.state.value,
                        onValueChange: this.handleFilterValueChange,
                        onEnterKeyPress: this.applyFilter
                    };

                    SelectedFilterComponent = op.filterComponent || filter.filterComponent;

                }



                return <div key={op.key}>
                    <Radio checked={op.key == this.state.operationKey} onChange={this.selectedOperationChange} value={op.key}>
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



/**
  * @internal
  */
//export const AddEditFilter : React.ComponentClass<AddEditFilterProps>= AddEditFilterInternal;