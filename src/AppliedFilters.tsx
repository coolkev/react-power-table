import * as React from 'react';
import * as filters from "./filters";


/**
  * @internal
  */
export interface AppliedFiltersProps {
    //availableFilters: PowerTable.AvailableFiltersMap;
    appliedFilters: filters.AppliedFilter[];
    removeFilter: (filter: filters.AppliedFilter) => void;
    editFilter: (filter: filters.AppliedFilter) => void;
    
}



/**
  * @internal
  */
export const AppliedFilters = (props: AppliedFiltersProps) => {

    return <div className="small">
        {props.appliedFilters.map(appliedFilter => {

            let AppliedLabelComponent = appliedFilter.operation.appliedLabelComponent || appliedFilter.filter.appliedLabelComponent;

            if (!AppliedLabelComponent) {
                const appliedLabel = appliedFilter.operation.appliedLabel || appliedFilter.filter.appliedLabel || filters.FilterDefinition.defaultAppliedFilterLabel;
                AppliedLabelComponent = (props: filters.AppliedFilter<any>) => <span>{appliedLabel(props)}</span>;
            }
            
            return <div className="well well-sm" style={{ marginBottom: 10 }} key={appliedFilter.filter.fieldName}>
                <button type="button" className="close" aria-label="Remove" onClick={() => props.removeFilter(appliedFilter)}><span aria-hidden="true">×</span></button>
                <a href="#" onClick={e => { e.preventDefault(); props.editFilter(appliedFilter); }}><AppliedLabelComponent {...appliedFilter} /></a>
            </div>;
        }
        )}



    </div>

};
