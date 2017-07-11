import * as React from 'react';
import { NumericInput } from '../components/NumericInput';
import { FilterDefinition, FilterDefinitionOptionsOrFieldName, OperationDefinition } from './FilterDefinition';

export class DecimalFilter extends FilterDefinition<number> {
    public operations = this.defaultOperations;

    constructor(options: FilterDefinitionOptionsOrFieldName) {

        super(options);

        this.filterComponent = (props) => {

            const { value, onValueChange, filter, operation, ...rest } = props;

            return <NumericInput type="number" initialValue={value} onValueChange={onValueChange} autoFocus className="form-control input-sm" {...rest} />;
        };

    }

    //public readonly operations = this.defaultOperations;

    // protected getOperations(): ObjectMap<OperationDefinition<number>> {
    //     return this.defaultOperations;
    // }

    parseValue(str: string) {
        return parseFloat(str);
    }
}
