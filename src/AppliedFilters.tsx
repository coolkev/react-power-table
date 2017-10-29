import * as React from 'react';
import * as filters from './filters';

/**
 * @internal
 */
export interface AppliedFiltersProps {
    //availableFilters: PowerTable.AvailableFiltersMap;
    appliedFilters: filters.AppliedFilter[];
    removeFilter: (filter: filters.AppliedFilter) => void;
    editFilter: (filter: filters.AppliedFilter) => void;

}
export const AppliedFilters = (props: AppliedFiltersProps) => {

    return (
        <div className="small">
            {props.appliedFilters.map((appliedFilter) => <AppliedFilter appliedFilter={appliedFilter} key={appliedFilter.filter.fieldName} onEditFilter={props.editFilter} onRemoveFilter={props.removeFilter} />)}
        </div>
    );
};

/**
 * @internal
 */
export interface AppliedFilterProps {
    //availableFilters: PowerTable.AvailableFiltersMap;
    appliedFilter: filters.AppliedFilter;
    onRemoveFilter: (filter: filters.AppliedFilter) => void;
    onEditFilter: (filter: filters.AppliedFilter) => void;

}

const defaultAppliedFilterLabelComponent = (props: filters.AppliedFilter<any>) => {
    const appliedLabel = props.operation.appliedLabel || props.filter.appliedLabel || filters.FilterDefinition.defaultAppliedFilterLabel;
    return <span>{appliedLabel(props)}</span>;
};
/**
 * @internal
 */
export class AppliedFilter extends React.Component<AppliedFilterProps, never> {

    constructor(props: AppliedFilterProps) {
        super(props);
        this.handleEditFilter = this.handleEditFilter.bind(this);
        this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
    }

    private handleRemoveFilter(e: React.SyntheticEvent<any>) {
        e.preventDefault();
        this.props.onRemoveFilter(this.props.appliedFilter);

    }

    private handleEditFilter(e: React.SyntheticEvent<any>) {
        e.preventDefault();
        this.props.onEditFilter(this.props.appliedFilter);

    }

    public render() {
        const { appliedFilter } = this.props;

        const AppliedLabelComponent = appliedFilter.operation.appliedLabelComponent || appliedFilter.filter.appliedLabelComponent || defaultAppliedFilterLabelComponent;

        return (
            <div className="well well-sm" style={{ marginBottom: 10 }} key={appliedFilter.filter.fieldName}>
                <button type="button" className="close" aria-label="Remove" onClick={this.handleRemoveFilter}><span aria-hidden="true">×</span></button>
                <a href="#" onClick={this.handleEditFilter}><AppliedLabelComponent {...appliedFilter} /></a>
            </div>
        );

    }
}
