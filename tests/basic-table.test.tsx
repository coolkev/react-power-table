import * as React from 'react';
import { ReactPowerTable, GridProps } from '../src/ReactPowerTable';
import { defaultColumns, sampledata } from "./shared";
import { render } from 'enzyme';

const columns = defaultColumns;
const rows = sampledata.slice(0,5);
describe('basic tests',
    () => {

        
        test('Render plain table', () => {
            const component = render(
                <ReactPowerTable columns={columns} rows={rows} keyColumn='number' />
            );
            
            
            expect(component).toMatchSnapshot();

        });

        test('Render plain table with custom cellValueComponent', () => {
            const component = render(
                <ReactPowerTable columns={columns} rows={rows} keyColumn='number' tableCellValueComponent={(p) => <span>{p.value}</span> } />
            );
            
            
            expect(component).toMatchSnapshot();

        });



    });
