import { mount } from 'enzyme';
import * as React from 'react';
import { InternalPagingProps, PowerTableProps, ReactPowerTable, withInternalPaging } from '../src/';
import { defaultColumns, President, sampledata } from './shared';

const columns = defaultColumns;
const rows = sampledata.slice(0, 25);

describe('withInternalPaging tests',
    () => {

        test('render paging', () => {

            const Table = withInternalPaging(ReactPowerTable);

            const c = <Table columns={columns} rows={rows} keyColumn="number" />;
            const component = mount(c);

            expect(component.state('currentPage')).toEqual(1);

            expect(component.render()).toMatchSnapshot();

        });

        test('change currentPage from click', () => {

            const Table = withInternalPaging(ReactPowerTable);

            const c: React.ReactElement<PowerTableProps<President> & { paging?: Partial<InternalPagingProps> }> = <Table columns={columns} rows={rows} keyColumn="number" />;

            const component = mount(c);
            expect(component.find('tbody').first().find('tr').length).toEqual(20);

            expect(component.state('currentPage')).toEqual(1);
            component.find('.glyphicon-forward').simulate('click');
            expect(component.state('currentPage')).toEqual(2);

            expect(component.find('tbody').first().find('tr').length).toEqual(5);
            expect(component.render()).toMatchSnapshot();

        });

        test('change currentPage from props', () => {

            const Table = withInternalPaging(ReactPowerTable);

            const c: React.ReactElement<PowerTableProps<President> & { paging?: Partial<InternalPagingProps> }> = <Table columns={columns} rows={rows} keyColumn="number" />;

            const component = mount(c);
            expect(component.find('tbody').first().find('tr').length).toEqual(20);
            component.setProps({ paging: { currentPage: 2 } });

            expect(component.find('tbody').first().find('tr').length).toEqual(5);
            expect(component.render()).toMatchSnapshot();

        });

    });
