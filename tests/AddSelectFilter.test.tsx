import * as React from 'react';
import { GridFilters, DataTypes, AppliedFilter } from '../src/';
import { defaultColumns, sampledata, President } from './shared';
import { mount } from 'enzyme';
import { AddSelectFilter } from '../src/AddSelectFilter';

//const columns = defaultColumns;
const rows = sampledata.slice(0, 25);

const availableFilters = [
    new DataTypes.int('number'),
    new DataTypes.string('president'),
    new DataTypes.int('birth_year'),
    new DataTypes.int({ fieldName: 'death_year', canBeNull: true }),
    new DataTypes.date({ fieldName: 'took_office' }),
    new DataTypes.date({ fieldName: 'left_office', canBeNull: true }),
    new DataTypes.boolean({ fieldName: 'assasinated', displayName: 'was assasinated' }),

];

const noop = () => { };

describe('AddSelectFilter tests',
    () => {

        test('add filter', () => {

            const c = <AddSelectFilter availableFilters={availableFilters} appliedFilters={[]} cancelAddFilter={noop} onApplyFilter={noop} />;

            const component = mount(c);

            expect(component.render()).toMatchSnapshot();

        });

        test('select filter', () => {

            const c = <AddSelectFilter availableFilters={availableFilters} appliedFilters={[]} cancelAddFilter={noop} onApplyFilter={noop} />;

            const component = mount(c);

            expect(component.render()).toMatchSnapshot();

            component.setState({ selectedFilterKey: 'birth_year' });

            expect(component.render()).toMatchSnapshot();

        });

    });
