﻿import * as React from 'react';
import { sampledata, defaultColumns } from './shared'
import { ReactPowerTable, withInternalPaging, withInternalSorting } from 'react-power-table';


const Table = withInternalSorting(withInternalPaging(ReactPowerTable));

export const InternalPagingSortingExample = () => {

    return <Table columns={defaultColumns} keyColumn="number" rows={sampledata} sorting={{column: 'number'}}  />;

}
