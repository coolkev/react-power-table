import * as React from 'react';
import * as FormControl from 'react-bootstrap/lib/FormControl';
import * as PowerTable from './FilterDefinition';

export class StringFilter extends PowerTable.FilterDefinition<string> {
    public readonly operations = this.getOperations();

    constructor(options: PowerTable.FilterDefinitionOptionsOrFieldName) {

        super(options);

        this.filterComponent = StringFilterComponent;

        this.appliedLabel = (filter) => filter.filter.displayName + ' ' + filter.operation.displayName + ' "' + filter.value + '"';
    }

    protected getOperations() {
        return {
            contains: { key: 'contains', displayName: 'contains', test: (source, value) => source.indexOf && source.toLowerCase().indexOf(value) > -1 },
            notcontains: { key: 'notcontains', displayName: 'does not contain', test: (source, value) => source.indexOf && source.toLowerCase().indexOf(value) === -1 },
            eq: this.defaultOperations.eq,
            ne: this.defaultOperations.ne,
        };
    }

    serializeValue(value: string) {
        if (value && value.startsWith('"') && value.endsWith('"')) {
            return value.substring(1, value.length - 2);
        }
        return value;
    }

    deSerializeValue(value: string): string {
        return value as any;
    }

    public applyFilter<TData>(data: TData[], operation: PowerTable.OperationDefinition<string>, value: string) {

        const valueLower = value.toLowerCase();
        return super.applyFilter(data, operation, valueLower);
    }

}

class StringFilterComponent extends React.Component<PowerTable.FilterComponentProps<string>, never> {

    constructor(props: PowerTable.FilterComponentProps<string>) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    public handleChange(e: React.FormEvent<FormControl>) {
        this.props.onValueChange(e.currentTarget.value);
    }

    public handleKeyPress(e: React.KeyboardEvent<FormControl>) {
        if (e.charCode === 13) {
            this.props.onEnterKeyPress();
        }
    }
    public render() {

        const { value } = this.props;

        return <FormControl value={value} autoFocus onChange={this.handleChange} onKeyPress={this.handleKeyPress} />;
    }

}
