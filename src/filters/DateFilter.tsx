import * as React from 'react';
import DatePicker from 'react-bootstrap-date-picker';
import { FilterComponentProps, FilterDefinition, FilterDefinitionOptionsOrFieldName, nullableOperations, OperationDefinition } from './FilterDefinition';

export class DateFilter extends FilterDefinition<string> {
    public readonly operations = this.getOperations();
    constructor(options: FilterDefinitionOptionsOrFieldName) {

        super(options);

        this.filterComponent = DateFilterComponent;

        // this.filterComponent = (props) => {

        //     const { value, onValueChange, filter, operation, ...rest } = props;

        //     const dateValue = value ? (new GlobalDate(value)).toISOString() : '';

        //     return <DatePicker value={dateValue} onChange={(_value, formattedValue) => props.onValueChange(formattedValue)} showClearButton={false} {...rest} />;

        // };

    }
    //public readonly operations = { ...this.defaultOperations,...this.getNullableOperations() };

    public parseValue(str: string): string {
        if (str) {

            const d = (new Date(str));

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
            between: this.defaultOperations.between,
        };

        if (this.canBeNull) {
            return { ...result, ...nullableOperations() };
        }
        return result;
    }

}

class DateFilterComponent extends React.Component<FilterComponentProps<string>, never> {

    constructor(props: FilterComponentProps<string>) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public handleChange(_value, formattedValue: string) {
        this.props.onValueChange(formattedValue);
    }

    public handleKeyPress(e: React.KeyboardEvent<any>) {
        if (e.charCode === 13) {
            this.props.onEnterKeyPress();
        }
    }
    public render() {

        const { value, onEnterKeyPress, onValueChange, operation, ...rest } = this.props;

        const dateValue = value ? (new Date(value)).toISOString() : '';

        return <DatePicker value={dateValue} onChange={this.handleChange} showClearButton={false} {...rest} />;

        //return <FormControl value={value} autoFocus onChange={this.handleChange} onKeyPress={this.handleKeyPress} />;
    }

}
