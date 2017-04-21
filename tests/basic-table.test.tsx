import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { ReactPowerTable, GridProps } from '../src/ReactPowerTable';
import { defaultColumns, sampledata } from "./shared";

const columns = defaultColumns;
const rows = sampledata.slice(0,5);
describe('basic tests',
    () => {

        
        test('Render plain table', () => {
            const component = renderer.create<GridProps<any>>(
                <ReactPowerTable columns={columns} rows={rows} keyColumn='number' />
            );
            
            let tree = component.toJSON();
            
            expect(tree).toMatchSnapshot();

        });


    });
