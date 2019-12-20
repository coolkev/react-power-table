import * as React from 'react';
import { ActionLink } from './components/ActionLink';
import * as filters from './filters';

export interface AppliedFiltersProps {
    appliedFilters: ReadonlyArray<filters.AppliedFilter>;
    removeFilter: (filter: filters.AppliedFilter) => void;
    editFilter: (filter: filters.AppliedFilter) => void;

}

export const AppliedFilters = (props: AppliedFiltersProps) => {
    return (
        <div className="applied-filters small">
            {props.appliedFilters.map((appliedFilter) => <AppliedFilter appliedFilter={appliedFilter} key={appliedFilter.key} onEditFilter={props.editFilter} onRemoveFilter={props.removeFilter} />)}
        </div>
    );
};

export interface AppliedFilterProps {
    appliedFilter: filters.AppliedFilter;
    onRemoveFilter: (filter: filters.AppliedFilter) => void;
    onEditFilter: (filter: filters.AppliedFilter) => void;

}

const defaultAppliedFilterLabelComponent = (props: filters.AppliedFilter<any>) => {
    const appliedLabel = props.operation.appliedLabel || props.filter.appliedLabel || filters.FilterDefinition.defaultAppliedFilterLabel;
    return <span>{appliedLabel(props)}</span>;
};

export const AppliedFilter = ({ appliedFilter, onRemoveFilter, onEditFilter }: AppliedFilterProps) => {

    const handleRemoveFilter = React.useCallback((e: React.SyntheticEvent<any>) => {
        e.preventDefault();
        onRemoveFilter(appliedFilter);
    }, [appliedFilter, onRemoveFilter]);

    const handleEditFilter = React.useCallback(() => {

        onEditFilter(appliedFilter);

    }, [appliedFilter, onEditFilter]);

    const AppliedLabelComponent = appliedFilter.operation.appliedLabelComponent || appliedFilter.filter.appliedLabelComponent || defaultAppliedFilterLabelComponent;

    return (
        <div className="applied-filter well well-sm" style={{ marginBottom: 10 }} key={appliedFilter.filter.fieldName}>
            <button type="button" className="close" aria-label="Remove" onClick={handleRemoveFilter}><span aria-hidden="true">×</span></button>
            <ActionLink onClick={handleEditFilter}><AppliedLabelComponent {...appliedFilter} /></ActionLink>
        </div>
    );

};

