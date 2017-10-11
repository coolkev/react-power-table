import * as React from 'react';
import { ReactPowerTable, GridProps, TableRowComponentProps } from '../src/ReactPowerTable';
import { defaultColumns, sampledata } from './shared';
import { mount } from 'enzyme';
import { makePure } from '../src/utils';
import { withInternalSorting } from '../src/Sorting';
import { withInternalPaging } from '../src/Paging';

const columns = defaultColumns;
const rows = sampledata.slice(0, 5);
describe('basic re-render tests',
    () => {

        const tableComponents = [ReactPowerTable, withInternalSorting(ReactPowerTable), withInternalPaging(ReactPowerTable)];

        tableComponents.forEach(Table => {

            const extraProps: any = {};
            if (Table.displayName.match(/WithInternalSorting/)) {
                extraProps.sorting = { column: 'number' };
            }

            test('render only changed rows ' + Table.displayName, () => {

                let rowRenderCount = 0;
                const rowComponent = p => {
                    rowRenderCount++;
                    return (ReactPowerTable.defaultProps.tableRowComponent as React.StatelessComponent<TableRowComponentProps>)(p);
                };
                let cellRenderCount = 0;
                const cellComponent = makePure('cellComponent', p => {
                    cellRenderCount++;
                    return (ReactPowerTable.defaultProps.defaultTdComponent as React.StatelessComponent<React.HTMLProps<HTMLTableCellElement>>)(p);
                });

                columns[0] = { ...columns[0], width: 50 };

                const component = mount(
                    <Table columns={columns} rows={rows} keyColumn="number" tableRowComponent={rowComponent} defaultTdComponent={cellComponent} {...extraProps} />
                );
                expect(rowRenderCount).toBe(5);
                expect(cellRenderCount).toBe(rows.length * columns.length);
                expect(component.render()).toMatchSnapshot();

                component.setProps({ rows: sampledata.slice(3, 8) });

                expect(rowRenderCount).toBe(8);
                expect(cellRenderCount).toBe(56);
                expect(component.render()).toMatchSnapshot();

            });

            test('render all rows when columns changed ' + Table.displayName, () => {

                let rowRenderCount = 0;
                const rowComponent = p => {
                    rowRenderCount++;
                    return (ReactPowerTable.defaultProps.tableRowComponent as React.StatelessComponent<TableRowComponentProps>)(p);
                };
                let cellRenderCount = 0;
                const cellComponent = makePure('cellComponent', p => {
                    cellRenderCount++;
                    return (ReactPowerTable.defaultProps.defaultTdComponent as React.StatelessComponent<React.HTMLProps<HTMLTableCellElement>>)(p);
                });

                const component = mount(
                    <Table columns={columns} rows={rows} keyColumn="number" tableRowComponent={rowComponent} defaultTdComponent={cellComponent}  {...extraProps} />
                );
                expect(rowRenderCount).toBe(5);
                expect(cellRenderCount).toBe(rows.length * columns.length);

                expect(component.render()).toMatchSnapshot();

                const newColumns = [...columns];
                newColumns[0] = { ...newColumns[0], width: 80 };

                component.setProps({ columns: newColumns });

                expect(rowRenderCount).toBe(10);
                expect(cellRenderCount).toBe(70);
                expect(component.render()).toMatchSnapshot();

            });

            test('dont re-render when tableClassName changed ' + Table.displayName, () => {

                let rowRenderCount = 0;
                const rowComponent = p => {
                    rowRenderCount++;
                    return (ReactPowerTable.defaultProps.tableRowComponent as React.StatelessComponent<TableRowComponentProps>)(p);
                };
                let cellRenderCount = 0;
                const cellComponent = makePure('cellComponent', p => {
                    cellRenderCount++;
                    return (ReactPowerTable.defaultProps.defaultTdComponent as React.StatelessComponent<React.HTMLProps<HTMLTableCellElement>>)(p);
                });

                const component = mount(
                    <Table columns={columns} rows={rows} keyColumn="number" tableRowComponent={rowComponent} defaultTdComponent={cellComponent}  {...extraProps} />
                );
                expect(rowRenderCount).toBe(5);
                expect(cellRenderCount).toBe(rows.length * columns.length);

                //expect(component.render()).toMatchSnapshot();

                console.log('changing tableClassName to test');

                component.setProps({ tableClassName: 'test' });
                console.log('done changing tableClassName to test');

                expect(rowRenderCount).toBe(5);
                expect(cellRenderCount).toBe(35);
                //expect(component.render()).toMatchSnapshot();

            });

        });

    });
