﻿import * as React from 'react';
import * as Select from 'react-select';
import { FilterDefinition, FilterDefinitionOptionsOrFieldName, ObjectMap, OperationDefinition, AppliedFilter } from './FilterDefinition';
import { SelectOption } from './ListFilter';
//import { CustomSelectValue } from '../components/CustomSelectValue';
export type RemoteListOptionProvider = (input: string | number[], maxOptions?: number) => Promise<Array<SelectOption<any>>>;

export class RemoteListFilter extends FilterDefinition<number[]> {

    private queryHandler: (input: string | number[]) => Promise<Array<SelectOption<any>>>;
    private cachedOptions: { [key: number]: string } = {};
    public readonly operations = this.getOperations();

    constructor(options: FilterDefinitionOptionsOrFieldName, optionProvider: RemoteListOptionProvider) {
        super(options);

        this.serializeValue = (value) => value.join(' ');
        this.deSerializeValue = (value) => value.split(' ').map((m) => parseInt(m, 10));

        const maxOptions = 20;

        this.queryHandler = (input) => {
            return optionProvider(input, maxOptions).then((opts) => {

                opts.forEach((o) => {
                    if (!this.cachedOptions[o.value]) {
                        this.cachedOptions[o.value] = o.label;
                    }
                });

                return opts;
            });
        };

        const loadOptions = (input) => this.queryHandler(input).then((opts) => {

            return {
                options: opts,
                complete: opts.length < maxOptions,
            };

        });

        this.filterComponent = (props) => {
            const { autoFocus, value, onEnterKeyPress, onValueChange, children, filter, operation, ...rest } = props;

            return (
                <Select.Async
                    {...rest}
                    value={props.value && props.value.map((m) => ({ label: this.cachedOptions[m], value: m })) || []}
                    multi
                    loadOptions={loadOptions}
                    // tslint:disable-next-line:jsx-no-lambda
                    onChange={(e: Array<SelectOption<any>>) => props.onValueChange(e.map((m) => m.value))}
                    autofocus={autoFocus}
                />);

        };
        this.filterComponent.defaultProps = {
            className: 'small',
            autoFocus: true
        };

        this.appliedLabelComponent = (props) => {
            const selectedOptions = props.value.map((m) => ({ label: this.cachedOptions[m], value: m }));

            return <RemoteListFilterLabel appliedFilter={props} selectedOptions={selectedOptions} listOptionsProvider={this.queryHandler} />;

        };

    }
    protected getOperations(): ObjectMap<OperationDefinition<number[]>> {
        return {
            in: {
                key: 'in',
                displayName: 'is any of',
                test: (sourceValue: number, filterValue) => filterValue.indexOf(sourceValue) > -1,

            },
        };
    }

}

interface RemoteListFilterLabelProps {

    appliedFilter: AppliedFilter;
    selectedOptions: Array<SelectOption<any>>;
    listOptionsProvider: (input: string | number[]) => Promise<Array<SelectOption<any>>>;
}

class RemoteListFilterLabel extends React.Component<RemoteListFilterLabelProps, never> {
    private anyMissing: boolean;
    private checkingOptions: boolean;

    constructor(props: RemoteListFilterLabelProps) {
        super(props);

    }

    componentWillMount() {

        this.checkOptions(this.props);

    }
    componentWillReceiveProps(nextProps: RemoteListFilterLabelProps) {

        this.checkOptions(nextProps);
    }

    checkOptions(props: RemoteListFilterLabelProps) {

        if (!this.checkingOptions) {
            this.checkingOptions = true;
            const missing = props.selectedOptions.filter((m) => !m.label).map((m) => m.value);
            this.anyMissing = missing.length > 0;
            if (this.anyMissing) {
                props.listOptionsProvider(missing).then(() => {
                    this.checkingOptions = false;
                    this.forceUpdate();
                }).catch(error => {
                    if (!error.message.match(/aborted/)) {
                        throw error;
                    }
                });
            }
        }
    }
    render() {

        if (this.anyMissing) {
            return <span>Loading...</span>;
        }
        const { selectedOptions, appliedFilter } = this.props;
        const label = appliedFilter.filter.displayName + ' is ' + selectedOptions.map((m) => m.label).join(' or ');

        return <span>{label}</span>;

    }
}
