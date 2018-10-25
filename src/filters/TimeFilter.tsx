import * as React from 'react';
import Select, { Option } from 'react-select';
import { FilterComponentProps, FilterDefinition, FilterDefinitionOptionsOrFieldName, nullableOperations, OperationDefinition, AppliedFilter, RadioButtonLabelProps } from './FilterDefinition';

export class TimeFilter extends FilterDefinition<string> {
    public operations = this.getOperations();
    constructor(options: FilterDefinitionOptionsOrFieldName) {

        super(options);

        this.filterComponent = TimeFilterComponent;
    }

    public appliedLabel = (filter: AppliedFilter<any>) => {
        return filter.filter.displayName + ' ' + filter.operation.displayName + ' ' + formatTimeValue(filter.value);
    }

    protected getOperations() {
        const result = {
            lt: { ...this.defaultOperations.lt, displayName: 'is before', isValid: (v) => v !== '' } as OperationDefinition<string>,
            gt: { ...this.defaultOperations.gt, displayName: 'is after', isValid: (v) => v !== '' } as OperationDefinition<string>,
            between: { ...this.defaultOperations.between, appliedLabel: filter => filter.filter.displayName + ' ' + filter.operation.displayName + ' ' + filter.value.toString().split(' ').map(formatTimeValue).join(' and ') }

        };

        if (this.canBeNull) {
            return { ...result, ...nullableOperations<string>() };
        }
        return result as typeof result;
    }

}

class TimeFilterComponent extends React.Component<FilterComponentProps<string> & { options: Array<Option<string>> }, never> {

    static defaultProps = {
        options: [...new Array(48)].map((_, i) => getTimeOption(i))
    } as Partial<FilterComponentProps<string> & { options: Array<Option<string>> }>;

    constructor(props: FilterComponentProps<string> & { options: Array<Option<string>> }) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        //this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    public handleChange(value: Option<string>) {
        this.props.onValueChange(value && value.value);
    }

    public render() {

        const { value, onValueChange, operation, invalid, ...rest } = this.props;

        return <span className={invalid ? 'has-error' : null}><Select value={value} onChange={this.handleChange} clearable={false} {...rest} /></span>;

    }

}

function getTimeOption(x: number): Option<string> {

    const half = x % 2;
    const hour = (x - half) / 2;
    const minute = half ? 30 : 0;

    const value = padStart(hour.toString(), 2, '0') + ':' + padStart(minute.toString(), 2, '0');

    const label = formatTimeFromHourMin(hour, minute);

    return { value, label };
}

export function formatTimeValue(time: string): string {

    const parts = time.split(':').map(m => parseInt(m[0] === '0' && m.length > 1 ? m.substring(1) : m, 10));

    if (parts.length < 2) {
        throw new Error('Invalid time: ' + time + ' should be in 24 hour format: hh:mm');
    }
    const hour = parts[0];
    const minute = parts[1];

    return formatTimeFromHourMin(hour, minute);
}

function formatTimeFromHourMin(hour: number, minute: number): string {

    if (isNaN(hour) || hour < 0 || hour >= 24) {
        throw new Error('Invalid hour: ' + hour + ' must be number >= 0 and < 24');
    }

    if (isNaN(minute) || minute < 0 || minute >= 60) {
        throw new Error('Invalid minute: ' + minute + ' must be number >= 0 and < 60');
    }

    const ampm = hour < 12 ? 'AM' : 'PM';

    const hourDisplay = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);

    const label = hourDisplay + ':' + padStart(minute.toString(), 2, '0') + ' ' + ampm;

    return label;
}

function padStart(str: string, targetLength: number, padString: string) {
    // tslint:disable-next-line:no-bitwise
    targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (str.length >= targetLength) {
        return String(str);
    } else {
        targetLength = targetLength - str.length;
        if (targetLength > padString.length) {
            padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
        }
        return padString.slice(0, targetLength) + str;
    }
}
function trimStart(string: string, charToRemove: string) {
    while (string.charAt(0) === charToRemove) {
        string = string.substring(1);
    }

    return string;
}
