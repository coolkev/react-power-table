import * as React from 'react';
import { AddEditFilter } from './AddEditFilter'
import FormControl from 'react-bootstrap/lib/FormControl';
import { FilterDefinition, AppliedFilter, AppliedFilterDTO } from "./filters/FilterDefinition";
import { BackLink } from "./components/BackLink";
import { AddSelectFilter } from "./AddSelectFilter";
import { AppliedFilters } from './AppliedFilters'


export interface GridFiltersProps {


    availableFilters: FilterDefinition[] | { [key: string]: FilterDefinition };
    appliedFilters: AppliedFilter[];
    onFiltersChange: (newFilters: AppliedFilter[]) => void;

}



interface GridFiltersState {

    addingFilter?: boolean;
    editingFilter?: AppliedFilterDTO;

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

    private applyNewfilter(filter: AppliedFilter) {

        const newFilters = [...this.props.appliedFilters, filter];

        this.props.onFiltersChange(newFilters);
        this.setState({
            addingFilter: false
        })
    }


    private removeFilter(filter: AppliedFilter) {
        const newFilters = this.props.appliedFilters.filter(m => m.filter.fieldName != filter.filter.fieldName);

        this.props.onFiltersChange(newFilters);
    }

    private editFilter(filter: AppliedFilter) {
        
        const filterDto: AppliedFilterDTO = {
            columnKey: filter.filter.fieldName,
            operationKey: filter.operation.key,
            value: filter.value
        };

        this.setState({
            editingFilter: filterDto,
            addingFilter: false,
        })
    }

    private cancelEditFilter() {
        this.setState({
            editingFilter: null
        })
    }

    private applyEditFilter(filter: AppliedFilter) {

        const newFilters = this.props.appliedFilters.map(m => m.filter.fieldName != filter.filter.fieldName ? m : filter);

        this.props.onFiltersChange(newFilters);
        this.setState({
            editingFilter: null
        })

    }


    render() {

        const { editingFilter } = this.state;
        const { appliedFilters, availableFilters } = this.props;

        if (editingFilter) {
            const { columnKey, operationKey, value } = editingFilter;
            const filter = Array.isArray(availableFilters) ? availableFilters.find(f => f.fieldName == columnKey) : availableFilters[columnKey];
            const operation = filter.operations[operationKey];

            return <div>
                <BackLink onClick={this.cancelEditFilter} />

                <div>

                    <AddEditFilter filter={filter} initialOperation={operation} initialValue={value} onApplyFilter={this.applyEditFilter} />


                </div>

            </div>;
        }

        return <div className="flex-column">


            <AppliedFilters appliedFilters={appliedFilters} removeFilter={this.removeFilter} editFilter={this.editFilter} />


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