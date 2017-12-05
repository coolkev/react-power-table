import * as React from 'react';
import { AddEditFilter } from './AddEditFilter';
import { AddSelectFilter } from './AddSelectFilter';
import { AppliedFilters } from './AppliedFilters';
import { BackLink } from './components/BackLink';
import { AppliedFilter, FilterDefinition } from './filters/FilterDefinition';

export interface GridFiltersProps {

    availableFilters: FilterDefinition[] | { [key: string]: FilterDefinition };
    appliedFilters: AppliedFilter[];
    onFiltersChange: (newFilters: AppliedFilter[]) => void;

}

interface AppliedFilterDTO {
    columnKey: string;
    operationKey: string;
    value: string;
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
        this.showAddFilter = this.showAddFilter.bind(this);
        this.handleRemoveEditFilter = this.handleRemoveEditFilter.bind(this);
    }

    public render() {

        const { editingFilter } = this.state;
        const { appliedFilters, availableFilters } = this.props;

        if (editingFilter) {
            const { columnKey, operationKey, value } = editingFilter;
            const filter = Array.isArray(availableFilters) ? availableFilters.find((f) => f.fieldName === columnKey) : availableFilters[columnKey];
            const operation = filter.operations[operationKey];

            return (
                <div>
                    <BackLink onClick={this.cancelEditFilter} />

                    <div>

                        <AddEditFilter filter={filter} initialOperation={operation} initialValue={value} onApplyFilter={this.applyEditFilter} onRemoveFilter={this.handleRemoveEditFilter} />

                    </div>

                </div>
            );
        }

        const children = this.state.addingFilter
            ? <AddSelectFilter cancelAddFilter={this.hideAddFilter} appliedFilters={appliedFilters} availableFilters={availableFilters} onApplyFilter={this.applyNewfilter} />
            : <div><a href="#" onClick={this.showAddFilter}><span className="glyphicon glyphicon-plus" style={{ marginRight: 5 }} />Add Filter</a></div>;

        return (
            <div className="flex-column">

                <AppliedFilters appliedFilters={appliedFilters} removeFilter={this.removeFilter} editFilter={this.editFilter} />

                {children}
            </div>
        );

    }
    private showAddFilter(e: React.SyntheticEvent<HTMLAnchorElement>) {
        e.preventDefault();

        this.setState({
            addingFilter: true,
        });
    }
    private hideAddFilter() {
        this.setState({
            addingFilter: false,
        });
    }

    private applyNewfilter(filter: AppliedFilter) {
        //const isValid = filter.filter.isValid(filter.value);
        //console.log('GridFilters.applyNewfilter', { filter });
        //if (isValid) {
        const newFilters = [...this.props.appliedFilters, filter];

        this.props.onFiltersChange(newFilters);
        this.setState({
            addingFilter: false,
        });
        //}
    }

    private removeFilter(filter: AppliedFilter) {
        const newFilters = this.props.appliedFilters.filter((m) => m.filter.fieldName !== filter.filter.fieldName);

        this.props.onFiltersChange(newFilters);
    }

    private handleRemoveEditFilter() {
        const toRemove = this.state.editingFilter;
        const newFilters = this.props.appliedFilters.filter((m) => m.filter.fieldName !== toRemove.columnKey);

        this.props.onFiltersChange(newFilters);

        this.setState({
            editingFilter: null
        });
    }
    private editFilter(filter: AppliedFilter) {

        const filterDto: AppliedFilterDTO = {
            columnKey: filter.filter.fieldName,
            operationKey: filter.operation.key,
            value: filter.value,
        };

        this.setState({
            editingFilter: filterDto,
            addingFilter: false,
        });
    }

    private cancelEditFilter(e: React.SyntheticEvent<HTMLAnchorElement>) {
        e.preventDefault();

        this.setState({
            editingFilter: null,
        });
    }

    private applyEditFilter(filter: AppliedFilter) {

        const newFilters = this.props.appliedFilters.map((m) => m.filter.fieldName !== filter.filter.fieldName ? m : filter);

        this.props.onFiltersChange(newFilters);
        this.setState({
            editingFilter: null,
        });

    }

}

export const GridFilters: React.ComponentClass<GridFiltersProps> = GridFiltersInternal;
