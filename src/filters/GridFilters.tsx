import * as React from 'react';
import { AddEditFilter } from './AddEditFilter'
import FormControl from 'react-bootstrap/lib/FormControl';
import * as PowerTable from "./definitions/FilterDefinition";


export interface GridFiltersProps {


    availableFilters: PowerTable.AvailableFiltersMap;
    appliedFilters: PowerTable.AppliedFilterType[];
    onFiltersChange: (newFilters: PowerTable.AppliedFilterType[]) => void;

}



export interface GridFiltersState {

    addingFilter?: boolean;
    editingFilter?: PowerTable.AppliedFilterType;

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
    availableFilters: PowerTable.AvailableFiltersMap;
    appliedFilters: PowerTable.AppliedFilterType[];
    removeFilter: (filter: PowerTable.AppliedFilterType) => void;
    editFilter: (filter: PowerTable.AppliedFilterType) => void;
    onOptionLoaded: () => void;
}



const GridAppliedFilters = (props: GridAppliedFiltersProps) => {

    return <div className="small">
        {props.appliedFilters.map(appliedFilter => {

            let AppliedLabelComponent = appliedFilter.operation.appliedLabelComponent || appliedFilter.filter.appliedLabelComponent;

            if (!AppliedLabelComponent) {
                const appliedLabel = appliedFilter.operation.appliedLabel || appliedFilter.filter.appliedLabel || PowerTable.FilterDefinition.defaultAppliedFilterLabel;
                AppliedLabelComponent = (props: PowerTable.AppliedFilter<any>) => <span>{appliedLabel(props)}</span>;
            }
            //const formatResult = formatFunc(appliedFilter);

            {/*let displayText: string;
            if (typeof (formatResult) == 'string') {
                displayText = formatResult
            } else {
                formatResult.then(() => props.onOptionLoaded());
                displayText = 'Loading...';
            }*/}
            return <div className="well well-sm" style={{ marginBottom: 10 }} key={appliedFilter.filter.fieldName}>
                <button type="button" className="close" aria-label="Remove" onClick={() => props.removeFilter(appliedFilter)}><span aria-hidden="true">×</span></button>
                <a href="#" onClick={e => { e.preventDefault(); props.editFilter(appliedFilter); }}><AppliedLabelComponent {...appliedFilter}/></a>
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

    private applyNewfilter(filter: PowerTable.AppliedFilterType) {

        const newFilters = [...this.props.appliedFilters, filter];

        this.props.onFiltersChange(newFilters);
        this.setState({
            addingFilter: false
        })
    }


    private removeFilter(filter: PowerTable.AppliedFilterType) {
        const newFilters = this.props.appliedFilters.filter(m => m.filter.fieldName != filter.filter.fieldName);

        this.props.onFiltersChange(newFilters);
    }

    private editFilter(filter: PowerTable.AppliedFilterType) {
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

    private applyEditFilter(filter: PowerTable.AppliedFilterType) {

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

    availableFilters: PowerTable.AvailableFiltersMap;
    appliedFilters: PowerTable.AppliedFilterType[];
    onApplyFilter: (filter: PowerTable.AppliedFilterType) => void;

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




