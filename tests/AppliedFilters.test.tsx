import * as React from 'react';
import { GridFilters, DataTypes, createKeyedMap, AppliedFilter } from '../src/';
import { defaultColumns, sampledata, President } from "./shared";
import { mount } from 'enzyme';
import { AppliedFilters } from "../src/filters/AppliedFilters";

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
describe('AppliedFilters tests',
    () => {



        test('none applied', () => {

            const c = <AppliedFilters availableFilters={availableFiltersMap} appliedFilters={[]} editFilter={() => { }} removeFilter={() => { }} />;

            const component = mount(c);

            expect(component.render()).toMatchSnapshot();
        });



        test('one applied', () => {

            const applied: AppliedFilter<any> = {
                filter: availableFiltersMap.president,
                operation: availableFiltersMap.president.operations.contains,
                value: 'george'
            };

            const c = <AppliedFilters availableFilters={availableFiltersMap} appliedFilters={[applied]} editFilter={() => { }} removeFilter={() => { }} />;

            const component = mount(c);

            expect(component.render()).toMatchSnapshot();
        });

    });
