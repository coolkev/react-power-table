import * as React from 'react';
import { AddEditFilter } from './AddEditFilter'
import FormControl from 'react-bootstrap/lib/FormControl';
import * as PowerTable from "./definitions/FilterDefinition";
import { BackLink } from "./BackLink";
import { AddSelectFilter } from "./AddSelectFilter";


/**
  * @internal
  */
export interface AppliedFiltersProps {
    availableFilters: PowerTable.AvailableFiltersMap;
    appliedFilters: PowerTable.AppliedFilterType[];
    removeFilter: (filter: PowerTable.AppliedFilterType) => void;
    editFilter: (filter: PowerTable.AppliedFilterType) => void;
    onOptionLoaded: () => void;
}



/**
  * @internal
  */
export const AppliedFilters = (props: AppliedFiltersProps) => {

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
                <a href="#" onClick={e => { e.preventDefault(); props.editFilter(appliedFilter); }}><AppliedLabelComponent {...appliedFilter} /></a>
            </div>;
        }
        )}



    </div>

};
