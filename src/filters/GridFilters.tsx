import * as React from 'react';
import { AddEditFilter } from './AddEditFilter'
import FormControl from 'react-bootstrap/lib/FormControl';
import * as PowerTable from "./definitions/FilterDefinition";
import { BackLink } from "./BackLink";
import { AddSelectFilter } from "./AddSelectFilter";
import {AppliedFilters} from './AppliedFilters'


export interface GridFiltersProps {


    availableFilters: PowerTable.AvailableFiltersMap;
    appliedFilters: PowerTable.AppliedFilterType[];
    onFiltersChange: (newFilters: PowerTable.AppliedFilterType[]) => void;

}



interface GridFiltersState {

    addingFilter?: boolean;
    editingFilter?: PowerTable.AppliedFilterType;

}



class GridFiltersInternal extends React.Component<GridFiltersProps, GridFiltersState> {

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


            <AppliedFilters appliedFilters={appliedFilters} availableFilters={availableFilters} removeFilter={this.removeFilter} editFilter={this.editFilter} onOptionLoaded={() => this.forceUpdate()} />


            {this.state.addingFilter
                ? <AddSelectFilter cancelAddFilter={this.hideAddFilter} appliedFilters={appliedFilters} availableFilters={availableFilters} onApplyFilter={this
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




export const GridFilters: React.ComponentClass<GridFiltersProps> = GridFiltersInternal;