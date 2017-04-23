﻿import * as React from 'react';
import { ReactPowerTable, GridProps, withInternalSorting, InternalSortingProps, SortableColumn } from '../src/';
import { defaultColumns, sampledata } from "./shared";
import { mount } from 'enzyme';

const columns = defaultColumns;
const rows = sampledata.slice(0,5);

describe('withInternalSorting tests',
    () => {

        test('change sort on th click', () => {


            const Table = withInternalSorting(ReactPowerTable);

            const c = <Table columns={columns} rows={rows} keyColumn='number' sorting={{ Column: 'number', Ascending: true }} />;
            const component = mount(c);

            expect(component.state('currentSort').Column).toEqual('number');
            
            const th = component.find('th');

            expect(th.at(0).text()).toEqual('number ');
            expect(th.at(1).text()).toEqual('president');
            expect(th.at(0).render()).toMatchSnapshot();
            expect(th.at(1).render()).toMatchSnapshot();

            expect(component.render()).toMatchSnapshot();


            th.at(1).simulate('click');

            expect(component.state('currentSort').Column).toEqual('president');
            
            expect(th.at(1).text()).toEqual('president ');
            expect(th.at(0).render()).toMatchSnapshot();
            expect(th.at(1).render()).toMatchSnapshot();

            expect(component.render()).toMatchSnapshot();


        });

        
        test('change sort from props', () => {

            const Table = withInternalSorting(ReactPowerTable);

            const c = <Table columns={columns} rows={rows} keyColumn='number' sorting={{ Column: 'number', Ascending: true }} />;

            const component = mount(c);
            expect(component.state('currentSort').Ascending).toEqual(true);

            component.setProps({ sorting: { Column: 'number', Ascending: false } });
            expect(component.state('currentSort').Ascending).toEqual(false);

            expect(component.render()).toMatchSnapshot();


        });


        test('change rows from props', () => {

            const Table = withInternalSorting(ReactPowerTable);

            const c = <Table columns={columns} rows={rows} keyColumn='number' sorting={{ Column: 'number', Ascending: true }} />;

            const component = mount(c);
            expect(component.find('tbody tr').length).toEqual(5);

            component.setProps({ rows: sampledata.slice(0, 4) });

            expect(component.find('tbody tr').length).toEqual(4);
            expect(component.render()).toMatchSnapshot();


        });

        test('raises sortChanging and sortChanged events', () => {


            const Table = withInternalSorting(ReactPowerTable);

            let sortChangingCalled = false, sortChangedCalled = false;

            const onSortChanging = () => sortChangingCalled = true;
            const onSortChanged = () => sortChangedCalled = true;

            const c = <Table columns={columns} rows={rows} keyColumn='number' sorting={{ Column: 'number', Ascending: true, onSortChanging: onSortChanging, onSortChanged: onSortChanged }} />;
            const component = mount(c);

            const th = component.find('th');

            th.at(1).simulate('click');

            expect(sortChangedCalled).toEqual(true);
            expect(sortChangedCalled).toEqual(true);

        });

    });