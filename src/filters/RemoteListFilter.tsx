import * as React from 'react';
import * as Select from 'react-select';
import { FilterDefinition, FilterDefinitionOptionsOrFieldName, ObjectMap, OperationDefinition, AppliedFilter, FilterComponentProps, nullableOperations } from './FilterDefinition';
import { SelectOption } from './ListFilter';

export type RemoteListOptionProvider = (input: string | number[], maxOptions?: number) => Promise<Array<SelectOption<any>>>;

const maxOptions = 20;

export class RemoteListFilter extends FilterDefinition<number[]> {
    loadOptions: (input: any) => Promise<{
        options: Array<SelectOption<any>>;
        complete: boolean;
    }>;

    private queryHandler: (input: string | number[]) => Promise<Array<SelectOption<any>>>;
    private cachedOptions: { [key: number]: string } = {};
    public operations = this.getOperations();

    constructor(options: FilterDefinitionOptionsOrFieldName, private optionProvider: RemoteListOptionProvider) {
        super(options);

        if (typeof options !== 'string' && options.canBeNull) {
            this.deSerializeValue = (value) => value === 'true' || value === 'false' ? [value === 'true'] as any : value.split(' ').map((m) => parseInt(m, 10));
            this.serializeValue = (value) => Array.isArray(value) ? value.join(' ') : value;

        } else {
            this.deSerializeValue = (value) => value.split(' ').map((m) => parseInt(m, 10));
            this.serializeValue = (value) => Array.isArray(value) ? value.join(' ') : value;
        }

        this.queryHandler = (input) => {
            return this.optionProvider(input, maxOptions).then((opts) => {
                //console.log('queryhandler options returned', opts);
                opts.forEach((o) => {
                    if (!this.cachedOptions[o.value]) {
                        this.cachedOptions[o.value] = o.label;
                    }
                });

                return opts;
            });
        };

        this.loadOptions = (input) => this.queryHandler(input).then((opts) => {

            return {
                options: opts,
                complete: opts.length < maxOptions,
            };

        });

        this.filterComponent.defaultProps = {
            className: 'small',
            autoFocus: true
        };

        this.appliedLabelComponent = (props) => {
            const selectedOptions = Array.isArray(props.value) ? props.value.map((m) => ({ label: this.cachedOptions[m], value: m })) : null;
            //console.log('appliedLabelComponent render', selectedOptions);
            return <RemoteListFilterLabel appliedFilter={props} selectedOptions={selectedOptions} listOptionsProvider={this.queryHandler} />;

        };

    }

    public filterComponent: React.SFC<FilterComponentProps<number[]>> = (props) => {
        const { autoFocus, value, onValueChange, children, filter, operation, invalid, ...rest } = props;

        return (
            <Select.Async
                {...rest}
                value={props.value && props.value.map((m) => ({ label: this.cachedOptions[m], value: m })) || []}
                multi
                loadOptions={this.loadOptions}
                // tslint:disable-next-line:jsx-no-lambda
                onChange={(e: Array<SelectOption<any>>) => props.onValueChange(e.map((m) => m.value))}
                autofocus={autoFocus}
                className={invalid ? 'has-error ' + rest.className : rest.className}
            />);

    }
    protected getOperations(): ObjectMap<OperationDefinition<number[]>> {
        return {
            in: {
                key: 'in',
                displayName: 'is any of',
                test: (sourceValue: number, filterValue) => filterValue.indexOf(sourceValue) > -1,
                appliedLabel: (filter) => filter.filter.displayName + ' is ',
                isValid: v => v as any !== '' && v.length !== 0,

            },
            notin: {
                key: 'notin',
                displayName: 'is not any of',
                test: (sourceValue: number, filterValue) => filterValue.indexOf(sourceValue) > -1,
                appliedLabel: (filter) => filter.filter.displayName + ' is not ',
                isValid: v => v as any !== '' && v.length !== 0,

            },
            ...(this.canBeNull && nullableOperations<number[]>())
        };
    }

}

interface RemoteListFilterLabelProps {

    appliedFilter: AppliedFilter;
    selectedOptions: Array<SelectOption<any>>;
    listOptionsProvider: (input: string | number[]) => Promise<Array<SelectOption<any>>>;
}

class RemoteListFilterLabel extends React.Component<RemoteListFilterLabelProps, { label: string }> {
    //private anyMissing: boolean;
    private checkingOptions: boolean;

    constructor(props: RemoteListFilterLabelProps) {
        super(props);
        this.state = { label: null };
    }

    componentWillMount() {

        this.checkOptions(this.props);

    }
    componentWillReceiveProps(nextProps: RemoteListFilterLabelProps) {

        this.checkOptions(nextProps);
    }

    checkOptions(props: RemoteListFilterLabelProps) {
        //console.log('checkOptions', { checkingOptions: this.checkingOptions });

        if (!this.checkingOptions) {
            this.checkingOptions = true;
            const operationLabel = props.appliedFilter.operation.appliedLabel(props.appliedFilter);

            if (props.appliedFilter.operation.key === 'in' || props.appliedFilter.operation.key === 'notin') {
                const missing = props.selectedOptions.filter((m) => !m.label).map((m) => m.value);
                const anyMissing = missing.length > 0;

                if (anyMissing) {

                    if (this.state.label) {
                        this.setState({ label: null });
                    }
                    props.listOptionsProvider(missing).then((options) => {
                        //console.log('listOptionsProvider callback');
                        this.checkingOptions = false;
                        //this.anyMissing = false;
                        //this.forceUpdate();
                        const newOptions = props.selectedOptions.map((m) => m.label ? m : options.find(o => o.value === m.value));
                        this.setState({ label: operationLabel + newOptions.filter(m => m).map((m) => m.label).join(' or ') });

                    }).catch(error => {
                        //console.log('error from listOptionsProvider', error);
                        this.checkingOptions = false;
                        if (!error.message.match(/aborted/)) {
                            throw error;
                        }
                    });
                } else {
                    this.checkingOptions = false;
                    this.setState({ label: operationLabel + props.selectedOptions.map((m) => m.label).join(' or ') });
                }
            } else {
                this.checkingOptions = false;
                this.setState({ label: operationLabel });

            }
        } else {
            this.checkingOptions = false;
        }
    }
    render() {

        const { label } = this.state;

        if (!label) {
            return <span>Loading...</span>;
        }
        return <span>{label}</span>;

    }
}
