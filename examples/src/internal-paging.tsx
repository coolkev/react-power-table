﻿import * as React from 'react';
import { sampledata, defaultColumns } from './shared'
import { ReactPowerTable, withInternalPaging } from 'react-power-table';


const Table = withInternalPaging(ReactPowerTable);

export function InternalPagingExample() {

    return <Table columns={defaultColumns} keyColumn="number" rows={sampledata} />;

}
