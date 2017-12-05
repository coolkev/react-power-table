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

    onlyShowUnused?: boolean;

}

interface AppliedFilterDTO {
    columnKey: string;
    operationKey: string;
    value: string;
}

interface GridFiltersState {

    addingFilter?: boolean;
    editingFilter?: AppliedFilter;

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
        const { appliedFilters, availableFilters, onlyShowUnused } = this.props;

        if (editingFilter) {
            const { filter, operation, value, key } = editingFilter;

            return (
                <div>
                    <BackLink onClick={this.cancelEditFilter} />

                    <div>

                        <AddEditFilter filter={filter} initialOperation={operation} initialValue={value} onApplyFilter={this.applyEditFilter} onRemoveFilter={this.handleRemoveEditFilter} filterKey={key} />

                    </div>

                </div>
            );
        }

        const children = this.state.addingFilter
            ? <AddSelectFilter cancelAddFilter={this.hideAddFilter} appliedFilters={appliedFilters} availableFilters={availableFilters} onApplyFilter={this.applyNewfilter} onlyShowUnused={onlyShowUnused} />
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

        const count = filter.key ? 1 : this.props.appliedFilters.filter(m => m.filter.fieldName === filter.filter.fieldName).length + 1;
        const key = filter.key || filter.filter.fieldName + (count === 1 ? '' : count);
        const newFilters = [...this.props.appliedFilters, { ...filter, key }];

        this.props.onFiltersChange(newFilters);
        this.setState({
            addingFilter: false,
        });
        //}
    }

    private removeFilter(filter: AppliedFilter) {
        const newFilters = this.props.appliedFilters.filter((m) => m !== filter);

        this.props.onFiltersChange(newFilters);
    }

    private handleRemoveEditFilter() {
        const toRemove = this.state.editingFilter;
        const newFilters = this.props.appliedFilters.filter((m) => m !== toRemove);

        this.props.onFiltersChange(newFilters);

        this.setState({
            editingFilter: null
        });
    }
    private editFilter(filter: AppliedFilter) {

        this.setState({
            editingFilter: filter,
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

        const newFilters = this.props.appliedFilters.map((m) => m.key !== filter.key ? m : filter);

        this.props.onFiltersChange(newFilters);
        this.setState({
            editingFilter: null,
        });

    }

}

export const GridFilters: React.ComponentClass<GridFiltersProps> = GridFiltersInternal;
