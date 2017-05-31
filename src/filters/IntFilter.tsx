import * as React from 'react';
import { NumericInput } from '../components/NumericInput';
import { FilterDefinition, FilterDefinitionOptionsOrFieldName, OperationDefinition } from './FilterDefinition';

//const dataType = 'int';
export class IntFilter extends FilterDefinition<number> {
    public readonly operations = this.defaultOperations;

    //static readonly dataType = dataType;
    constructor(options: FilterDefinitionOptionsOrFieldName) {

        super(options);

        this.filterComponent = (props) => {

            const { value, onValueChange, filter, operation, ...rest } = props;

            return <NumericInput type="number" initialValue={value} onValueChange={onValueChange} autoFocus className="form-control input-sm" {...rest} />;
        };

    }

    // protected getOperations() {
    //     return this.defaultOperations;
    // }

    parseValue(str: string) {
        return parseInt(str, 10);
    }
}
