import * as React from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import { AddEditFilter } from './AddEditFilter';
import { BackLink } from './components/BackLink';
import { FilterDefinition, AppliedFilter, OperationDefinition } from './filters/FilterDefinition';
import { objectMapToArray } from './utils';

/**
 * @internal
 */
export interface AddFilterProps {
    cancelAddFilter: () => void;

    availableFilters: FilterDefinition[] | { [key: string]: FilterDefinition };

    //availableFilters: { [key: string]: PowerTable.FilterDefinition };
    appliedFilters: AppliedFilter[];
    onApplyFilter: (filter: AppliedFilter) => void;

    onlyShowUnused?: boolean;

}

/**
 * @internal
 */
export interface AddFilterState {
    searchText: string;
    selectedFilterKey?: string;
}

/**
 * @internal
 */
export class AddSelectFilter extends React.PureComponent<AddFilterProps, AddFilterState> {

    constructor(props: AddFilterProps) {
        super(props);
        this.state = { searchText: '' };
        this.onSearchTextChanged = this.onSearchTextChanged.bind(this);
        this.backToPrev = this.backToPrev.bind(this);
        this.newFilterSelected = this.newFilterSelected.bind(this);

    }

    private onSearchTextChanged(e: React.FormEvent<FormControl & HTMLInputElement>) {
        this.setState({
            searchText: e.currentTarget.value,
        });

    }

    private newFilterSelected(e: React.SyntheticEvent<HTMLAnchorElement>) {
        e.preventDefault();

        this.setState({
            selectedFilterKey: e.currentTarget.dataset.fieldname,
        });
    }

    private backToPrev(e: React.SyntheticEvent<HTMLAnchorElement>) {
        e.preventDefault();

        if (this.state.selectedFilterKey) {
            this.setState({ selectedFilterKey: null });
        } else {
            this.props.cancelAddFilter();
        }
    }
    render() {

        const { availableFilters, appliedFilters, onlyShowUnused } = this.props;

        const { searchText, selectedFilterKey } = this.state;

        if (selectedFilterKey) {

            const filter = Array.isArray(availableFilters) ? availableFilters.find((f) => f.fieldName === selectedFilterKey) : availableFilters[selectedFilterKey];

            const initialOperation = objectMapToArray(filter.operations)[0] as OperationDefinition;

            return (
                <div>
                    <BackLink onClick={this.backToPrev} />

                    <div>

                        <AddEditFilter filter={filter} initialOperation={initialOperation} onApplyFilter={this.props.onApplyFilter} />

                    </div>
                </div>
            );

        }

        const filters = objectMapToArray(availableFilters);

        const visibleFilters = onlyShowUnused ? filters.filter((m) => appliedFilters.every((c) => c.filter.fieldName !== m.fieldName)) : filters;

        const regex = new RegExp(searchText, 'i');
        const showFilters = searchText ? visibleFilters.filter((m) => m.displayName.match(regex)) : visibleFilters;

        // const onSelectFilter = (e: React.) => {
        //     e.preventDefault();
        //     this.newFilterSelected(m.fieldName);
        // };

        return (
            <div className="flex-column">
                <BackLink onClick={this.backToPrev} />

                <div><FormControl placeholder="Filter by" value={searchText} onChange={this.onSearchTextChanged} autoFocus /></div>

                <div className="small flex-column">
                    <div style={{ margin: '10px 0' }}><b>Available Filters</b></div>
                    <div className="available-filters">
                        <div className="list-group">
                            {showFilters.map((m) => <a href="#" onClick={this.newFilterSelected} data-fieldname={m.fieldName} className="list-group-item" key={m.fieldName}>{m.displayName}</a>)}
                        </div>
                    </div>

                </div>

            </div>
        );
    }
}
