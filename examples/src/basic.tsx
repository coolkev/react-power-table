import * as React from 'react';
import { sampledata, defaultColumns } from './shared'
import {ReactPowerTable} from 'react-power-table';

export const BasicExample = () => {

    
        return <ReactPowerTable columns={defaultColumns} keyColumn="number" rows={sampledata} />;
    
}
