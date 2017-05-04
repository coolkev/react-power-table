import * as React from 'react';
import DatePicker from 'react-bootstrap-date-picker';
import { GlobalDate } from "../utils";
import { FilterDefinition, FilterDefinitionOptionsOrFieldName, nullableOperations, OperationDefinition } from "./FilterDefinition";

export class Date extends FilterDefinition<string>
{
    constructor(options: FilterDefinitionOptionsOrFieldName) {

        super(options);

        this.filterComponent = (props) => {

            const { value, onValueChange, filter, operation, ...rest } = props;

            var dateValue = value ? (new GlobalDate(value)).toISOString() : '';

            return <DatePicker value={dateValue} onChange={(_value, formattedValue) => props.onValueChange(formattedValue)} showClearButton={false} {...rest} />;

        }


    }
    //public readonly operations = { ...this.defaultOperations,...this.getNullableOperations() };

    public readonly operations = this.getOperations();
    public parseValue(str: string): string {
        if (str) {

            const d = (new GlobalDate(str));

            if (!isNaN(d.getTime())) {
                return d.toISOString();
            }
        }

        return '';

    }



    private getOperations() {
        const result = {
            eq: this.defaultOperations.eq,
            lt: { ...this.defaultOperations.lt, displayName: 'is before' } as OperationDefinition<string>,
            gt: { ...this.defaultOperations.gt, displayName: 'is after' } as OperationDefinition<string>,
            between: this.defaultOperations.between            
        };

        if (this.canBeNull) {
            return { ...result,...nullableOperations() };
}
        return result;
    }


}
