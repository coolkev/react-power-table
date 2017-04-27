import * as React from 'react';
import DatePicker from 'react-bootstrap-date-picker';
import { GlobalDate } from "../../utils";
import { FilterDefinition, FilterDefinitionOptionsOrFieldName, OperationDefinition, ObjectMap } from "./FilterDefinition";

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

    public parseValue(str: string): string {
        if (str) {

            const d = (new GlobalDate(str));

            if (!isNaN(d.getTime())) {
                return d.toISOString();
            }
        }

        return '';

    }



    protected getOperations(): ObjectMap<OperationDefinition<string>> {
        return {
            eq: this.defaultOperations.eq,
            lt: { ...this.defaultOperations.lt, displayName: 'is before' },
            gt: { ...this.defaultOperations.gt, displayName: 'is after' },
            between: this.defaultOperations.between
        };
    }


}
