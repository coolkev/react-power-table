import * as React from 'react';
import * as Select from 'react-select';
import { SelectOption } from "./List";
import { FilterDefinition, FilterDefinitionOptionsOrFieldName, ObjectMap, OperationDefinition } from "./FilterDefinition";
//import { CustomSelectValue } from '../components/CustomSelectValue';
export type RemoteListOptionProvider = (input: string | number[], maxOptions?: number) => Promise<SelectOption<any>[]>;

export class RemoteList extends FilterDefinition<number[]> {

    private queryHandler: (input: string | number[]) => Promise<SelectOption<any>[]>;
    private cachedOptions: { [key: number]: string } = {};

    constructor(options: FilterDefinitionOptionsOrFieldName, optionProvider: RemoteListOptionProvider) {
        super(options)

        this.serializeValue = (value) => value.join(' ');
        this.deSerializeValue = (value) => value.split(' ').map(m => parseInt(m));

        const maxOptions = 20;

        this.queryHandler = (input) => {
            return optionProvider(input, maxOptions).then(options => {

                options.forEach(o => {
                    if (!this.cachedOptions[o.value]) {
                        this.cachedOptions[o.value] = o.label;
                    }
                });

                return options;
            });
        }

        const loadOptions = input => this.queryHandler(input).then(options => {

            return {
                options: options,
                complete: options.length < maxOptions
            };

        });
        this.filterComponent = props => {

            console.log('filterComponent', props.value);
            return <Select.Async value={props.value && props.value.map(m => ({ label: this.cachedOptions[m], value: m })) || []} multi
                loadOptions={loadOptions}
                onChange={(e: SelectOption<any>[]) => props.onValueChange(e.map(m => m.value))}
                /*valueComponent={CustomSelectValue as any}*/
                className="small" />
        };


        this.appliedLabelComponent = props => {
            const selectedOptions = props.value.map(m => ({ label: this.cachedOptions[m], value: m }));

            return <RemoteListFilterLabel selectedOptions={selectedOptions} listOptionsProvider={this.queryHandler} />

        }

    }

    public readonly operations = this.getOperations();

    protected getOperations(): ObjectMap<OperationDefinition<number[]>> {
        return {
            'in': {
                key: 'in',
                displayName: 'is any of',
                test: (sourceValue: number, filterValue) => filterValue.indexOf(sourceValue) > -1,


            }
        };
    }

}

interface RemoteListFilterLabelProps {
    selectedOptions: SelectOption<any>[];
    listOptionsProvider: (input: string | number[]) => Promise<SelectOption<any>[]>;
}

class RemoteListFilterLabel extends React.Component<RemoteListFilterLabelProps, never> {

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

        const missing = props.selectedOptions.filter(m => !m.label).map(m => m.value);
        this.anyMissing = missing.length > 0;
        if (this.anyMissing) {
            props.listOptionsProvider(missing).then(() => {
                this.forceUpdate();
            });
        }
    }

    private anyMissing: boolean;

    render() {


        if (this.anyMissing) {
            return <span>Loading...</span>;

        }
        return <span>{this.props.selectedOptions.map(m => m.label).join(' or ')}</span>;

    }
}