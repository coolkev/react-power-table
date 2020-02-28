import * as React from 'react';
import { NumericInput } from '../components/NumericInput';
import { FilterDefinition, FilterDefinitionOptionsOrFieldName, OperationDefinition } from './FilterDefinition';

export class DecimalFilter extends FilterDefinition<number> {
    public operations = this.getOperations();

    constructor(options: FilterDefinitionOptionsOrFieldName) {

        super(options);

        this.filterComponent = (props) => {

            const { value, onValueChange, filter, operation, ...rest } = props;
            const handleChange = React.useCallback((evt: React.FormEvent<HTMLInputElement>) => {

                const newValue = parseInt(evt.currentTarget.value, 10);

                onValueChange(isNaN(newValue) ? evt.currentTarget.value : newValue as any);

            }, [onValueChange]);
            return <NumericInput type="number" value={value} onChange={handleChange} autoFocus className="form-control form-control-sm" allowDecimal {...rest} />;
            //return <NumericInput type="number" initialValue={value} onValueChange={onValueChange} onValueChangeInvalid={onValueChange} autoFocus className="form-control form-control-sm" allowDecimal {...rest} />;
        };

    }

    //public readonly operations = this.defaultOperations;

    protected getOperations() {

        return {
            ...this.defaultOperations,
            eq: { ...this.defaultOperations.eq, isValid: (v: number) => v !== '' as any } as OperationDefinition<number>,
            ne: { ...this.defaultOperations.ne, isValid: (v: number) => v !== '' as any } as OperationDefinition<number>,
            //between: this.defaultOperations.between
        };
    }

    parseValue(str: string) {
        return parseFloat(str);
    }
}
