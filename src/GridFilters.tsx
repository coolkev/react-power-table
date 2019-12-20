import * as React from 'react';
import { AddEditFilter } from './AddEditFilter';
import { AddSelectFilter } from './AddSelectFilter';
import { AppliedFilters } from './AppliedFilters';
import { ActionLink } from './components/ActionLink';
import { BackLink } from './components/BackLink';
import { AppliedFilter, FilterDefinition } from './filters/FilterDefinition';

export interface GridFiltersProps {

    availableFilters: ReadonlyArray<FilterDefinition> | { [key: string]: FilterDefinition };
    appliedFilters: ReadonlyArray<AppliedFilter>;
    onFiltersChange: (newFilters: ReadonlyArray<AppliedFilter>) => void;

    onlyShowUnused?: boolean;

}

export const GridFilters = React.memo(({ appliedFilters, onFiltersChange, availableFilters, onlyShowUnused, ...props }: GridFiltersProps) => {

    const [editing, setEditing] = React.useState<AppliedFilter>();

    const handleEndEdit = React.useCallback(() => setEditing(undefined), [setEditing]);

    const appliedFiltersRef = React.useRef(appliedFilters);
    appliedFiltersRef.current = appliedFilters;

    const handleFiltersChange = React.useCallback((change: (prev: ReadonlyArray<AppliedFilter>) => ReadonlyArray<AppliedFilter>) => {
        onFiltersChange(change(appliedFiltersRef.current));
    }, [onFiltersChange, appliedFiltersRef]);

    const [adding, setAdding] = React.useState<boolean>();

    const showAddFilter = React.useCallback(() => {

        setAdding(true);
    }, [setAdding]);
    const hideAddFilter = React.useCallback(() => {
        setAdding(false);
    }, [setAdding]);

    const removeFilter = React.useCallback((filter: AppliedFilter) => {
        handleFiltersChange(filters => filters.filter(m => m !== filter));
    }, [handleFiltersChange]);

    const editFilter = React.useCallback((filter: AppliedFilter) => {

        setEditing(filter);
        setAdding(false);
    }, []);

    const children = adding
        ? <AddFilter appliedFilters={appliedFilters} availableFilters={availableFilters} onlyShowUnused={onlyShowUnused} onFiltersChange={handleFiltersChange} onHide={hideAddFilter} />
        :
        editing ?
            <EditFilter {...props} appliedFilters={appliedFilters} editing={editing} onEndEdit={handleEndEdit} onFiltersChange={handleFiltersChange} />
            :
            <div className="add-filter-link"><ActionLink onClick={showAddFilter}><span className="glyphicon glyphicon-plus" style={{ marginRight: 5 }} />Add Filter</ActionLink></div>;

    return (
        <>

            {!editing && <AppliedFilters appliedFilters={appliedFilters} removeFilter={removeFilter} editFilter={editFilter} />}

            <div className="add-edit-filters">
                {children}
            </div>
        </>
    );

});
GridFilters.displayName = 'GridFilters';

type GridFiltersInternalProps = Omit<GridFiltersProps, 'onFiltersChange'> & { onFiltersChange: (newFilters: (prev: ReadonlyArray<AppliedFilter>) => ReadonlyArray<AppliedFilter>) => void };

const EditFilter = React.memo(({ editing, appliedFilters, onFiltersChange, onEndEdit }: { editing: AppliedFilter, onEndEdit: () => void } & Omit<GridFiltersInternalProps, 'availableFilters' | 'onlyShowUnused'>) => {

    const { filter, operation, value, key } = editing;

    const applyEditFilter = React.useCallback((f: AppliedFilter) => {

        onFiltersChange(filters => filters.map(m => m.key !== f.key ? m : f));
        onEndEdit();

    }, [onFiltersChange, onEndEdit, appliedFilters]);

    const handleRemoveEditFilter = React.useCallback(() => {

        onFiltersChange(filters => filters.filter(m => m !== editing));

        onEndEdit();
    }, [onFiltersChange, editing, appliedFilters, onEndEdit]);

    return (
        <div className="edit-filter">
            <BackLink onClick={onEndEdit} />

            <div>

                <AddEditFilter filter={filter} initialOperation={operation} initialValue={value} onApplyFilter={applyEditFilter} onRemoveFilter={handleRemoveEditFilter} filterKey={key} />

            </div>

        </div>
    );
});
EditFilter.displayName = 'EditFilter';

const AddFilter = React.memo(({ appliedFilters, availableFilters, onlyShowUnused, onFiltersChange, onHide }: { onHide: () => void } & GridFiltersInternalProps) => {

    const applyNewfilter = React.useCallback((filter: AppliedFilter) => {

        onFiltersChange(filters => {
            const count = filter.key ? 1 : filters.filter(m => m.filter.fieldName === filter.filter.fieldName).length + 1;
            const key = filter.key || filter.filter.fieldName + (count === 1 ? '' : count);
            return [...filters, { ...filter, key }];
        });

        onHide();

    }, [onHide, onFiltersChange]);

    return <AddSelectFilter cancelAddFilter={onHide} appliedFilters={appliedFilters} availableFilters={availableFilters} onApplyFilter={applyNewfilter} onlyShowUnused={onlyShowUnused} />;
});

AddFilter.displayName = 'AddFilter';
