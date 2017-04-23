import * as React from 'react';
import { GridFilters, DataTypes, createKeyedMap, AppliedFilter } from '../src/';
import { defaultColumns, sampledata, President } from "./shared";
import { mount } from 'enzyme';
import { AddSelectFilter } from "../src/filters/AddSelectFilter";

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
const availableFiltersMap = createKeyedMap(availableFilters, m => m.fieldName);
describe('AddSelectFilter tests',
    () => {

        test('render gridfilters', () => {

            let filtersChanged = false;

            const onFiltersChange = (_newFilters: AppliedFilter<any>[]) => filtersChanged = true;
            const c = <GridFilters availableFilters={availableFiltersMap} appliedFilters={[]} onFiltersChange={onFiltersChange} />;
            const component = mount(c);

            expect(component.render()).toMatchSnapshot();

            expect(component.state('addingFilter')).toBeFalsy();

            component.setState({ addingFilter: true });


            expect(component.render()).toMatchSnapshot();


        });


    });
