import * as React from 'react';
import { ReactPowerTable, withInternalSorting, SortableColumn } from '../../src/';
import { sampledata, defaultColumns, President } from './shared';

const columns = [...defaultColumns];

columns[2] = { ...columns[2], sortable: false, headerText: 'party (not sortable)' } as SortableColumn<President>;

const Table = withInternalSorting(ReactPowerTable);

export const InternalSortingExample = () => {

    return <Table columns={columns} keyColumn="number" rows={sampledata} sorting={{ column: 'number', onSortChanging: s => console.log('sort changing', s), onSortChanged: s => console.log('sort changed', s)    }} />;

};
