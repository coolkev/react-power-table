import * as React from 'react';
import { AddEditFilter } from './AddEditFilter'
import * as FormControl from 'react-bootstrap/lib/FormControl';
import * as PowerTable from "./definitions/FilterDefinition";
import { BackLink } from "./BackLink";


/**
  * @internal
  */
export interface AddFilterProps {
    cancelAddFilter: () => void;

    availableFilters: PowerTable.AvailableFiltersMap;
    appliedFilters: PowerTable.AppliedFilterType[];
    onApplyFilter: (filter: PowerTable.AppliedFilterType) => void;

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




