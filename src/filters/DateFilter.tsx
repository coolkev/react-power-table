import * as React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FilterComponentProps, FilterDefinition, FilterDefinitionOptionsOrFieldName, nullableOperations, OperationDefinition } from './FilterDefinition';

export class DateFilter extends FilterDefinition<string> {
    public operations = this.getOperations();
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

    protected getOperations() {
        const result = {
            eq: { ...this.defaultOperations.eq, isValid: (v) => v !== '' },
            lt: { ...this.defaultOperations.lt, displayName: 'is before', isValid: (v) => v !== '' } as OperationDefinition<string>,
            gt: { ...this.defaultOperations.gt, displayName: 'is after', isValid: (v) => v !== '' } as OperationDefinition<string>,
            between: this.defaultOperations.between,
        };

        if (this.canBeNull) {
            return { ...result, ...nullableOperations<string>() };
        }
        return result as typeof result;
    }

}

class DateFilterComponent extends React.Component<FilterComponentProps<string>, never> {

    constructor(props: FilterComponentProps<string>) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        //this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    public handleChange(date: Date) {
        this.props.onValueChange(date.toDateString());
    }

    // public handleKeyPress(e: React.KeyboardEvent<any>) {
    //     if (e.charCode === 13) {
    //         this.props.onEnterKeyPress();
    //     }
    // }
    public render() {

        const { value, onValueChange, operation, invalid, ...rest } = this.props;

        const dateValue = value ? (new Date(value)) : null;

        return <span  className={invalid ? 'has-error' : null}><DatePicker className="form-control  form-control-sm" selected={dateValue} onChange={this.handleChange} isClearable={false} placeholderText="MM/DD/YYYY" {...rest} /></span>;

    }

}
