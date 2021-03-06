﻿import { mount } from 'enzyme';
import * as React from 'react';
import { PowerTableProps, ReactPowerTable } from '../src/';
import { withInternalPaging } from '../src/Paging';
import { withInternalSorting } from '../src/Sorting';
import { makePure } from '../src/utils';
import { defaultColumns, sampledata } from './shared';

const columns = defaultColumns;
const rows = sampledata.slice(0, 5);
describe('basic re-render tests',
    () => {

        const tableComponents = [ReactPowerTable, withInternalSorting(ReactPowerTable), withInternalPaging(ReactPowerTable)] as Array<React.ComponentType<PowerTableProps>>;

        const RowComponent = ReactPowerTable.defaultProps.rowComponent;
        const TdComponent = ReactPowerTable.defaultProps.tdComponent;

        tableComponents.forEach(Table => {

            const extraProps: any = {};
            if (Table.displayName.match(/WithInternalSorting/)) {
                extraProps.sorting = { column: 'number' };
            }

            test('render only changed rows ' + Table.displayName, () => {

                let rowRenderCount = 0;
                const rowComponent = p => {
                    rowRenderCount++;
                    return <RowComponent {...p} />;
                };
                let cellRenderCount = 0;
                const cellComponent = makePure<any>(p => {
                    cellRenderCount++;
                    return <TdComponent {...p} />;
                });

                columns[0] = { ...columns[0], width: 50 };

                const component = mount(
                    <Table columns={columns} rows={rows} keyColumn="number" rowComponent={rowComponent} tdComponent={cellComponent} {...extraProps} />
                );
                expect(rowRenderCount).toBe(5);
                expect(cellRenderCount).toBe(rows.length * columns.length);
                expect(component.render()).toMatchSnapshot();

                component.setProps({ rows: sampledata.slice(3, 8) });

                expect(rowRenderCount).toBe(10);
                expect(cellRenderCount).toBe(56);
                expect(component.render()).toMatchSnapshot();

            });

            test('render all rows when columns changed ' + Table.displayName, () => {

                let rowRenderCount = 0;
                const rowComponent = p => {
                    rowRenderCount++;
                    return <RowComponent {...p} />;

                };
                let cellRenderCount = 0;
                const cellComponent = makePure<any>(p => {
                    cellRenderCount++;
                    return <TdComponent {...p} />;
                });

                const component = mount(
                    <Table columns={columns} rows={rows} keyColumn="number" rowComponent={rowComponent} tdComponent={cellComponent}  {...extraProps} />
                );
                expect(rowRenderCount).toBe(5);
                expect(cellRenderCount).toBe(rows.length * columns.length);

                expect(component.render()).toMatchSnapshot();

                const newColumns = [...columns];
                newColumns[0] = { ...newColumns[0], width: 80 };

                component.setProps({ columns: newColumns });

                expect(rowRenderCount).toBe(10);
                expect(cellRenderCount).toBe(40);
                expect(component.render()).toMatchSnapshot();

            });

            test('dont re-render when tableClassName changed ' + Table.displayName, () => {

                let rowRenderCount = 0;
                const rowComponent = p => {
                    rowRenderCount++;
                    return <RowComponent {...p} />;
                };
                let cellRenderCount = 0;
                const cellComponent = makePure<any>(p => {
                    cellRenderCount++;
                    return <TdComponent {...p} />;
                });

                const component = mount(
                    <Table columns={columns} rows={rows} keyColumn="number" rowComponent={rowComponent} tdComponent={cellComponent}  {...extraProps} />
                );
                expect(rowRenderCount).toBe(5);
                expect(cellRenderCount).toBe(rows.length * columns.length);

                //expect(component.render()).toMatchSnapshot();

                //console.log('changing tableClassName to test');

                component.setProps({ tableClassName: 'test' });
                //console.log('done changing tableClassName to test');

                expect(cellRenderCount).toBe(35);
                expect(rowRenderCount).toBe(10);
                //expect(component.render()).toMatchSnapshot();

            });

        });

    });
