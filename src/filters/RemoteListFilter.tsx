import * as React from 'react';
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
                //console.log('queryhandler options returned', opts);
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
            const { autoFocus, value, onValueChange, children, filter, operation, ...rest } = props;

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
            //console.log('appliedLabelComponent render', selectedOptions);
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
                    this.setState({ label: props.appliedFilter.filter.displayName + ' is ' + newOptions.map((m) => m.label).join(' or ') });

                }).catch(error => {
                    console.log('error from listOptionsProvider', error);
                    if (!error.message.match(/aborted/)) {
                        throw error;
                    }
                });
            } else {
                this.setState({ label: props.appliedFilter.filter.displayName + ' is ' + props.selectedOptions.map((m) => m.label).join(' or ') });
            }
        }
    }
    render() {
        //console.log('render', { anyMissing: this.anyMissing });

        // if (this.anyMissing) {
        //     return <span>Loading...</span>;
        // }
        //const { selectedOptions, appliedFilter } = this.props;
        //const label = appliedFilter.filter.displayName + ' is ' + selectedOptions.map((m) => m.label).join(' or ');
        const { label } = this.state;

        if (!label) {
            return <span>Loading...</span>;
        }
        return <span>{label}</span>;

    }
}
