﻿import * as React from 'react';
import { ReactPowerTable, withInternalSorting, SortableColumn } from '../../src/';
import { sampledata, defaultColumns } from './shared';

const columns = [...defaultColumns];

columns[2] = { ...columns[2], sortable: false, headerText: 'party (not sortable)' } as SortableColumn;

const Table = withInternalSorting(ReactPowerTable);

export const InternalSortingExample = () => {
    console.log('examples.render()');

    return <Table columns={columns} keyColumn="number" rows={sampledata} sorting={{ column: 'number', onSortChanging: s => console.log('sort changing', s), onSortChanged: s => console.log('sort changed', s)    }} />;

};
