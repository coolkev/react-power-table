import * as React from 'react';
import { AddEditFilter } from './AddEditFilter'
import FormControl from 'react-bootstrap/lib/FormControl';
import { FilterDefinition } from "./DataTypes/DataType";


export type AvailableFiltersMap = KeyedMap<FilterDefinition<any>>;

export type AppliedFilterType = AppliedFilter<any>;


export interface GridFiltersProps {


    availableFilters: AvailableFiltersMap;
    appliedFilters: AppliedFilterType[];
    onFiltersChange: (newFilters: AppliedFilterType[]) => void;

}


//declare module "react-power-table" {

//  declare global {





declare global {
    type ObjectMap<T> = {
        [key: string]: T;
    }
    type Keyed<T> = T & { key: string };
    type KeyedMap<T> = ObjectMap<Keyed<T>> & {
        all: Keyed<T>[];
    }

    interface FilterDefinitionOptions {
        fieldName: string;
        displayName?: string;
        canBeNull?: boolean;

    }
    type FilterDefinitionOptionsOrFieldName = FilterDefinitionOptions | string;

    // const FilterDefinition: {
    //     defaultAppliedFilterLabel<T>(filter: AppliedFilter<T>): string | Promise<string>
    // };
    // interface FilterDefinition<T> extends FilterDefinitionOptions {
    //     operations: KeyedMap<OperationDefinition<T>>;
    //     radioButtonLabel: (props: RadioButtonLabelProps<T>) => React.ReactType;
    //     filterComponent: (props: FilterComponentProps<T>) => JSX.Element;
    //     defaultValue: T;

    //     appliedFilterLabel?: (filter: AppliedFilter<T>) => string | Promise<string>;

    //     applyFilter<TData>(data: TData[], field: string, operation: OperationDefinition<T>, value: T);

    // }
    interface OperationDefinition<T> {
        key: string;
        displayName: string;
        appliedFilterLabel?(filter: AppliedFilter<T>): string | Promise<string>;
        filterComponent?: (props: FilterComponentProps<T>) => JSX.Element;

        radioButtonLabel?: (props: RadioButtonLabelProps<T>) => JSX.Element;
        test(source: any, filterValue: T): boolean;
    }



    interface AppliedFilter<T> {
        filter: FilterDefinition<T>;
        operation: OperationDefinition<T>;
        value: T;

    }
    interface AppliedFilterDTO {
        key: string;
        operation: string;
        value: string;
    }

    interface FilterComponentProps<T> extends AppliedFilter<T> {

        onValueChange: (value: T) => void;

        style?: React.CSSProperties;
        className?: string;
        autoFocus?: boolean;
        disabled?: boolean;
        placeholder?: string;
        onEnterKeyPress: () => void;
    }
    interface RadioButtonLabelProps<T> {
        filter: FilterDefinition<T>;
        operation: OperationDefinition<T>;
    }

}




//}
export interface GridFiltersState {

    addingFilter?: boolean;
    editingFilter?: AppliedFilterType;

}

interface BackLinkProps {
    onClick: () => void;
}
const BackLink = (props: BackLinkProps) => {
    return <div style={{ marginBottom: 10 }}><a href="#" onClick={e => {
        e.preventDefault();
        props.onClick()
    }}><span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>Back</a>
    </div>;
}



export interface GridAppliedFiltersProps {
    availableFilters: AvailableFiltersMap;
    appliedFilters: AppliedFilterType[];
    removeFilter: (filter: AppliedFilterType) => void;
    editFilter: (filter: AppliedFilterType) => void;
    onOptionLoaded: () => void;
}



const GridAppliedFilters = (props: GridAppliedFiltersProps) => {

    return <div className="small">
        {props.appliedFilters.map(appliedFilter => {

            const formatFunc = appliedFilter.operation.appliedFilterLabel || appliedFilter.filter.appliedFilterLabel || FilterDefinition.defaultAppliedFilterLabel;

            const formatResult = formatFunc(appliedFilter);

            let displayText: string;
            if (typeof (formatResult) == 'string') {
                displayText = formatResult
            } else {
                formatResult.then(() => props.onOptionLoaded());
                displayText = 'Loading...';
            }
            return <div className="well well-sm" style={{ marginBottom: 10 }} key={appliedFilter.filter.fieldName}>
                <button type="button" className="close" aria-label="Remove" onClick={() => props.removeFilter(appliedFilter)}><span aria-hidden="true">×</span></button>
                <a href="#" onClick={e => { e.preventDefault(); props.editFilter(appliedFilter); }}>{displayText}</a>
            </div>;
        }
        )}



    </div>

};



export class GridFilters extends React.Component<GridFiltersProps, GridFiltersState> {

    constructor(props: GridFiltersProps) {
        super(props);
        this.state = {};
        this.hideAddFilter = this.hideAddFilter.bind(this);
        this.applyNewfilter = this.applyNewfilter.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
        this.editFilter = this.editFilter.bind(this);
        this.cancelEditFilter = this.cancelEditFilter.bind(this);
        this.applyEditFilter = this.applyEditFilter.bind(this);


    }

    private showAddFilter() {
        this.setState({
            addingFilter: true
        })
    }
    private hideAddFilter() {
        this.setState({
            addingFilter: false
        })
    }

    private applyNewfilter(filter: AppliedFilterType) {

        const newFilters = [...this.props.appliedFilters, filter];

        this.props.onFiltersChange(newFilters);
        this.setState({
            addingFilter: false
        })
    }


    private removeFilter(filter: AppliedFilterType) {
        const newFilters = this.props.appliedFilters.filter(m => m.filter.fieldName != filter.filter.fieldName);

        this.props.onFiltersChange(newFilters);
    }

    private editFilter(filter: AppliedFilterType) {
        this.setState({
            editingFilter: filter,
            addingFilter: false,
        })
    }

    private cancelEditFilter() {
        this.setState({
            editingFilter: null
        })
    }

    private applyEditFilter(filter: AppliedFilterType) {

        const newFilters = this.props.appliedFilters.map(m => m.filter.fieldName != filter.filter.fieldName ? m : filter);

        this.props.onFiltersChange(newFilters);
        this.setState({
            editingFilter: null
        })

    }


    render() {

        const { editingFilter } = this.state;
        const { availableFilters, appliedFilters } = this.props;
        if (editingFilter) {
            const { filter, operation, value } = editingFilter;

            return <div>
                <BackLink onClick={this.cancelEditFilter} />

                <div>

                    <AddEditFilter filter={filter} initialOperation={operation} initialValue={value} onApplyFilter={this.applyEditFilter} />


                </div>

            </div>;
        }

        return <div className="flex-column">


            <GridAppliedFilters appliedFilters={appliedFilters} availableFilters={availableFilters} removeFilter={this.removeFilter} editFilter={this.editFilter} onOptionLoaded={() => this.forceUpdate()} />


            {this.state.addingFilter
                ? <AddFilter cancelAddFilter={this.hideAddFilter} appliedFilters={appliedFilters} availableFilters={availableFilters} onApplyFilter={this
                    .applyNewfilter} />
                : <div><a href="#" onClick={e => {
                    e.preventDefault();
                    this.showAddFilter();
                }}><span className="glyphicon glyphicon-plus" style={{ marginRight: 5 }}></span>Add Filter</a>
                </div>
            }
        </div>;

    }

}




interface AddFilterProps {
    cancelAddFilter: () => void;

    availableFilters: AvailableFiltersMap;
    appliedFilters: AppliedFilterType[];
    onApplyFilter: (filter: AppliedFilterType) => void;

}

interface AddFilterState {
    searchText: string;
    selectedFilterKey?: string;
}

class AddFilter extends React.PureComponent<AddFilterProps, AddFilterState> {

    constructor(props: AddFilterProps) {
        super(props);
        this.state = { searchText: '' };
        this.onSearchTextChanged = this.onSearchTextChanged.bind(this);
        this.backToPrev = this.backToPrev.bind(this);

    }


    private onSearchTextChanged(e: React.FormEvent<FormControl & HTMLInputElement>) {
        this.setState({
            searchText: e.currentTarget.value
        });

    }

    private newFilterSelected(key: string) {
        this.setState({
            selectedFilterKey: key
        });

    }

    private backToPrev() {
        if (this.state.selectedFilterKey) {
            this.setState({ selectedFilterKey: null });
        } else {
            this.props.cancelAddFilter();
        }
    }
    render() {

        const props = this.props;

        const { searchText, selectedFilterKey } = this.state;

        if (selectedFilterKey) {

            const filter = props.availableFilters[selectedFilterKey];

            const initialOperation = filter.operations.all[0];

            return <div>
                <BackLink onClick={this.backToPrev} />

                <div>

                    <AddEditFilter filter={filter} initialOperation={initialOperation} onApplyFilter={this.props.onApplyFilter} />

                </div>
            </div>;

        }

        const unusedFilters = props.availableFilters.all.filter(m => props.appliedFilters.every(c => c.filter.fieldName != m.fieldName));

        const regex = new RegExp(searchText, 'i');
        const availableFilters = searchText ? unusedFilters.filter(m => m.displayName.match(regex)) : unusedFilters;


        return <div className="flex-column">
            <BackLink onClick={this.backToPrev} />


            <div><FormControl placeholder="Filter by" value={searchText} onChange={this.onSearchTextChanged} autoFocus /></div>

            <div className="small flex-column">
                <div style={{ margin: '10px 0' }}><b>Available Filters</b></div>
                <div className="available-filters">
                    <div className="list-group">
                        {availableFilters.map(m => <a href="#" onClick={e => {
                            e.preventDefault();
                            this.newFilterSelected(m.fieldName);
                        }} className="list-group-item" key={m.fieldName}>{m.displayName}</a>)}
                    </div>
                </div>

            </div>

        </div>;
    }
}

