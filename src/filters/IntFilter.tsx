import * as React from 'react';
import { NumericInput } from '../components/NumericInput';
import { FilterDefinition, FilterDefinitionOptionsOrFieldName, OperationDefinition } from './FilterDefinition';

//const dataType = 'int';
export class IntFilter extends FilterDefinition<number> {
    public operations = this.getOperations();

    //static readonly dataType = dataType;
    constructor(options: FilterDefinitionOptionsOrFieldName) {

        super(options);

        this.filterComponent = (props) => {

            const { value, onValueChange, filter, operation, ...rest } = props;

            const handleChange = React.useCallback((evt: React.FormEvent<HTMLInputElement>) => {

                const newValue = parseInt(evt.currentTarget.value, 10);

                onValueChange(isNaN(newValue) ? evt.currentTarget.value : newValue as any);

            }, [onValueChange]);
            return <NumericInput type="number" value={value} onChange={handleChange} autoFocus className="form-control input-sm" {...rest} />;
        };

    }

    protected getOperations() {

        return {
            ...this.defaultOperations,
            eq: { ...this.defaultOperations.eq, isValid: (v: number) => v !== '' as any } as OperationDefinition<number>,
            ne: { ...this.defaultOperations.ne, isValid: (v: number) => v !== '' as any } as OperationDefinition<number>,
            //between: this.defaultOperations.between
        };
    }

    parseValue(str: string) {
        return parseInt(str, 10);
    }
}
