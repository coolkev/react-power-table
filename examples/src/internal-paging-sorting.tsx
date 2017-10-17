import * as React from 'react';
import { sampledata, defaultColumns, President } from './shared';
import { typedTable, withInternalPaging, withInternalSorting } from '../../src/';

const Table = withInternalSorting(withInternalPaging(typedTable<President>()));

export const InternalPagingSortingExample = () => {

    return <Table columns={defaultColumns} keyColumn="number" rows={sampledata} sorting={{ column: 'number' }} />;

};
