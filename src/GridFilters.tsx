import * as React from 'react';
import { AddEditFilter } from './AddEditFilter';
import { AddSelectFilter } from './AddSelectFilter';
import { AppliedFilters } from './AppliedFilters';
import { BackLink } from './components/BackLink';
import { AppliedFilter, FilterDefinition } from './filters/FilterDefinition';

export interface GridFiltersProps {

    availableFilters: ReadonlyArray<FilterDefinition> | { [key: string]: FilterDefinition };
    appliedFilters: ReadonlyArray<AppliedFilter>;
    onFiltersChange: (newFilters: ReadonlyArray<AppliedFilter>) => void;

    onlyShowUnused?: boolean;

}

export const GridFilters = React.memo(({ appliedFilters, ...props }: GridFiltersProps) => {

    const [editing, setEditing] = React.useState<AppliedFilter>();

    const handleEndEdit = React.useCallback(() => setEditing(undefined), [setEditing]);

    const appliedFiltersRef = React.useRef(appliedFilters);
    appliedFiltersRef.current = appliedFilters;

    if (editing) {

        return (
            <EditFilter {...props} editing={editing} onEndEdit={handleEndEdit} appliedFiltersRef={appliedFiltersRef} />
        );
    }

    return <AddEditFilterInternal {...props} onEditFilter={setEditing} appliedFiltersRef={appliedFiltersRef} />;

});
GridFilters.displayName = 'GridFilters';


type GridFiltersRefProps = Omit<GridFiltersProps, 'appliedFilters'> & { appliedFiltersRef: React.MutableRefObject<readonly AppliedFilter[]> };

const EditFilter = React.memo(({ editing, appliedFiltersRef, onFiltersChange, onEndEdit }: { editing: AppliedFilter, onEndEdit: () => void } & Omit<GridFiltersRefProps, 'availableFilters' | 'onlyShowUnused'>) => {

    const { filter, operation, value, key } = editing;

    const applyEditFilter = React.useCallback((filter: AppliedFilter) => {

        const newFilters = appliedFiltersRef.current.map(m => m.key !== filter.key ? m : filter);

        onFiltersChange(newFilters);
        onEndEdit();

    }, [onFiltersChange, onEndEdit, appliedFiltersRef]);

    const handleRemoveEditFilter = React.useCallback(() => {
        const toRemove = editing;
        const newFilters = appliedFiltersRef.current.filter(m => m !== toRemove);

        onFiltersChange(newFilters);

        onEndEdit();
    }, [onFiltersChange, editing, appliedFiltersRef, onEndEdit]);

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

const AddEditFilterInternal = React.memo(({ appliedFiltersRef, availableFilters, onlyShowUnused, onFiltersChange, onEditFilter }: GridFiltersRefProps & { onEditFilter: (filter: AppliedFilter<any>) => void }) => {

    const [adding, setAdding] = React.useState<boolean>();

    const showAddFilter = React.useCallback((e: React.SyntheticEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        setAdding(true);
    }, [setAdding]);
    const hideAddFilter = React.useCallback(() => {
        setAdding(false);
    }, [setAdding]);

    const removeFilter = React.useCallback((filter: AppliedFilter) => {
        const newFilters = appliedFiltersRef.current.filter(m => m !== filter);

        onFiltersChange(newFilters);
    }, [appliedFiltersRef, onFiltersChange]);

    const editFilter = React.useCallback((filter: AppliedFilter) => {

        onEditFilter(filter);
        setAdding(false);
    }, [onEditFilter, setAdding]);

    const children = adding
        ? <AddFilter appliedFiltersRef={appliedFiltersRef} availableFilters={availableFilters} onlyShowUnused={onlyShowUnused} onFiltersChange={onFiltersChange} onHide={hideAddFilter} />
        : <div><a href="#" onClick={showAddFilter} className="add-filter"><span className="glyphicon glyphicon-plus" style={{ marginRight: 5 }} />Add Filter</a></div>;

    return (
        <div>

            <AppliedFilters appliedFilters={appliedFiltersRef.current} removeFilter={removeFilter} editFilter={editFilter} />

            {children}
        </div>
    );
});
AddEditFilterInternal.displayName = 'AddEditFilterInternal';

const AddFilter = React.memo(({ appliedFiltersRef, availableFilters, onlyShowUnused, onFiltersChange, onHide }: { onHide: () => void } & GridFiltersRefProps) => {

    const applyNewfilter = React.useCallback((filter: AppliedFilter) => {

        const count = filter.key ? 1 : appliedFiltersRef.current.filter(m => m.filter.fieldName === filter.filter.fieldName).length + 1;
        const key = filter.key || filter.filter.fieldName + (count === 1 ? '' : count);
        const newFilters = [...appliedFiltersRef.current, { ...filter, key }];

        onFiltersChange(newFilters);

        onHide();

    }, [onHide, appliedFiltersRef, onFiltersChange]);

    return <AddSelectFilter cancelAddFilter={onHide} appliedFilters={appliedFiltersRef.current} availableFilters={availableFilters} onApplyFilter={applyNewfilter} onlyShowUnused={onlyShowUnused} />;
});

AddFilter.displayName = 'AddFilter';
