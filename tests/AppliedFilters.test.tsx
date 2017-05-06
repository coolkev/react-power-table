import * as React from 'react';
import { GridFilters, DataTypes, AppliedFilter, FilterDefinition } from '../src/';
import { defaultColumns, sampledata, President } from "./shared";
import { mount } from 'enzyme';
import { AppliedFilters } from "../src/AppliedFilters";

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
//const availableFiltersMap = createKeyedMap(availableFilters, m => m.fieldName);
describe('AppliedFilters tests',
    () => {



        test('none applied', () => {

            const c = <AppliedFilters appliedFilters={[]} editFilter={() => { }} removeFilter={() => { }} />;

            const component = mount(c);

            expect(component.render()).toMatchSnapshot();
        });



        test('one applied', () => {

            const presidentFilter = availableFilters.find(m => m.fieldName == 'president') as FilterDefinition<string>;

            const applied: AppliedFilter<any> = {
                filter: presidentFilter,
                operation: presidentFilter.operations.contains,
                value: 'george'
            };

            const c = <AppliedFilters appliedFilters={[applied]} editFilter={() => { }} removeFilter={() => { }} />;

            const component = mount(c);

            expect(component.render()).toMatchSnapshot();
        });


        test('between filter applied', () => {

            const filter = availableFilters[0] as FilterDefinition<number>;


            const applied: AppliedFilter<any> = {
                filter: filter,
                operation: filter.operations.between,
                value: '20-30'
            };

            const c = <AppliedFilters appliedFilters={[applied]} editFilter={() => { }} removeFilter={() => { }} />;

            const component = mount(c);

            expect(component.render()).toMatchSnapshot();

        });

    });
