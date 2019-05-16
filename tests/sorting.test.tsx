import { mount, render } from 'enzyme';
import * as React from 'react';
import { InternalSortingProps, InternalSortingState, ReactPowerTable, withInternalSorting } from '../src/';
import { defaultColumns, sampledata } from './shared';

const columns = defaultColumns;
const rows = sampledata.slice(0, 5);

describe('withInternalSorting tests',
    () => {

        test('change sort on th click', () => {

            const Table = withInternalSorting(ReactPowerTable);

            const c = <Table columns={columns} rows={rows} keyColumn="number" sorting={{ column: 'number' }} />;
            const component = mount<InternalSortingProps, InternalSortingState<any>>(c);

            expect(component.state('currentSort').column).toEqual('number');

            const th = component.find('th');

            expect(th.at(0).text()).toEqual('number ');
            expect(th.at(1).text()).toEqual('name');
            expect(th.at(0).render()).toMatchSnapshot();
            expect(th.at(1).render()).toMatchSnapshot();

            expect(component.render()).toMatchSnapshot();

            th.at(1).simulate('click');

            expect(component.state('currentSort').column).toEqual('president');

            expect(th.at(1).text()).toEqual('name ');
            expect(th.at(0).render()).toMatchSnapshot();
            expect(th.at(1).render()).toMatchSnapshot();

            expect(component.render()).toMatchSnapshot();

        });

        test('change sort from props', () => {

            const Table = withInternalSorting(ReactPowerTable);

            const c = <Table columns={columns} rows={rows} keyColumn="number" sorting={{ column: 'number' }} />;

            const component = mount(c);
            expect(component.state('currentSort').descending).toBeFalsy();

            component.setProps({ sorting: { column: 'number', descending: true } });
            expect(component.state('currentSort').descending).toEqual(true);

            expect(component.render()).toMatchSnapshot();

        });

        test('change rows from props', () => {

            const Table = withInternalSorting(ReactPowerTable);

            const c = <Table columns={columns} rows={rows} keyColumn="number" sorting={{ column: 'number' }} />;

            const component = mount(c);
            expect(component.find('tbody tr').length).toEqual(5);

            component.setProps({ rows: sampledata.slice(0, 4) });

            expect(component.find('tbody tr').length).toEqual(4);
            expect(component.render()).toMatchSnapshot();

        });

        test('raises sortChanging and sortChanged events', () => {

            const Table = withInternalSorting(ReactPowerTable);

            let sortChangingCalled = false;
            let sortChangedCalled = false;

            const onSortChanging = () => sortChangingCalled = true;
            const onSortChanged = () => sortChangedCalled = true;

            const c = <Table columns={columns} rows={rows} keyColumn="number" sorting={{ column: 'number', onSortChanging, onSortChanged }} />;
            const component = mount(c);

            const th = component.find('th');

            th.at(1).simulate('click');

            expect(sortChangedCalled).toEqual(true);
            expect(sortChangedCalled).toEqual(true);

        });

        test('sorting with custom cellcomponent', () => {

            const columns2 = columns.map(c => ({ ...c }));
            columns2[0].valueComponent = p => <span>{p.children}</span>;
            columns2[0].textAlign = 'right';

            const Table = withInternalSorting(ReactPowerTable);

            const component = render(<Table columns={columns2} rows={rows} keyColumn="number" sorting={{ column: 'number' }} />);

            expect(component).toMatchSnapshot();

        });
    });
