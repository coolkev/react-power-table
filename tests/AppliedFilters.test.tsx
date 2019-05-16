import { mount } from 'enzyme';
import * as React from 'react';
import { AppliedFilter, DataTypes } from '../src/';
import { AppliedFilters } from '../src/AppliedFilters';
import { IntFilter } from '../src/filters/IntFilter';
import { StringFilter } from '../src/filters/StringFilter';
import { sampledata } from './shared';

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
describe('AppliedFilters tests',
    () => {

        test('none applied', () => {

            const c = <AppliedFilters appliedFilters={[]} editFilter={noop} removeFilter={noop} />;

            const component = mount(c);

            expect(component.render()).toMatchSnapshot();
        });

        test('one applied', () => {

            const presidentFilter = availableFilters.find(m => m.fieldName === 'president') as StringFilter;

            const applied: AppliedFilter<any> = {
                key: 'president',
                filter: presidentFilter,
                operation: presidentFilter.operations.contains,
                value: 'george'
            };

            const c = <AppliedFilters appliedFilters={[applied]} editFilter={noop} removeFilter={noop} />;

            const component = mount(c);

            expect(component.render()).toMatchSnapshot();
        });

        test('between filter applied', () => {

            const filter = availableFilters[0] as IntFilter;

            const applied: AppliedFilter<any> = {
                key: 'president',
                filter,
                operation: filter.operations.between,
                value: '20-30'
            };

            const c = <AppliedFilters appliedFilters={[applied]} editFilter={noop} removeFilter={noop} />;

            const component = mount(c);

            expect(component.render()).toMatchSnapshot();

        });

    });
