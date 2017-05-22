import * as React from 'react';
import { GridFilters, DataTypes, AppliedFilter, FilterDefinition } from '../src/';
import { defaultColumns, sampledata, President, partyList } from './shared';
import { mount } from 'enzyme';
import { AddEditFilter } from '../src/AddEditFilter';

//const columns = defaultColumns;
const rows = sampledata.slice(0, 25);

const availableFilters = [
    new DataTypes.int('number'),
    new DataTypes.string('president'),
    new DataTypes.int('birth_year'),
    new DataTypes.int({ fieldName: 'death_year', canBeNull: true }),
    new DataTypes.date({ fieldName: 'took_office' }),
    new DataTypes.date({ fieldName: 'left_office', canBeNull: true }),
    new DataTypes.list('party', partyList),
    new DataTypes.boolean({ fieldName: 'assasinated', displayName: 'was assasinated' }),
    new DataTypes.decimal('empty'),
];


const testSerializeValues = [
    1,
    'test',
    1790,
    1850,
    '1900-02-03',
    '1900-02-03',
    'Republican',
    true,
    1.03
];


describe('AddEditFilter tests',
    () => {


        availableFilters.forEach((filter: FilterDefinition<any>, i) => {

            Object.keys(filter.operations).filter(m => m != 'between').forEach(opKey => {
                const op = filter.operations[opKey];

                test('add filter ' + filter.fieldName + ' ' + opKey, () => {

                    const c = <AddEditFilter filter={filter} initialOperation={op} initialValue="" onApplyFilter={_e => { }} />;

                    const component = mount(c);

                    expect(component.render()).toMatchSnapshot('AddEditFilter tests add filter ' + filter.fieldName + ' ' + opKey);

                    const testValue = testSerializeValues[i];

                    expect(typeof (filter.serializeValue(testValue))).toBe('string');

                    filter.applyFilter(sampledata, op, testValue);

                });

            });

        });

        test('between filter', () => {

            const filter = availableFilters[0] as FilterDefinition<number>;

            const op = filter.operations['between'];
            const c = <AddEditFilter filter={filter} initialOperation={op} initialValue="" onApplyFilter={_e => { }} />;

            const component = mount(c);

            expect(component.render()).toMatchSnapshot();


            const testValue = '20-30' as any;

            //expect(typeof (filter.serializeValue(testValue))).toBe('string');

            filter.applyFilter(sampledata, op, testValue);

        });

    });
