import * as React from 'react';
import { sampledata, defaultColumns } from './shared'
import {ReactPowerTable} from '../../src/'

export const BasicExample = () => {

    
        return <ReactPowerTable columns={defaultColumns} keyColumn="number" rows={sampledata}  />;
    
}
