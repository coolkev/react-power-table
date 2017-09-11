﻿import * as React from 'react';
import { ReactPowerTable, withInternalSorting, withInternalPaging, DataTypes, groupBy, sortArray, numberWithCommas, AppliedFilter, GridFilters } from '../../src/';
import { sampledata, defaultColumns, partyList } from './shared';

// //if coming in from DTO
// const availDTO = [
//     { fieldName: 'number', dataType: 'int' },
//     { fieldName: 'president', dataType: 'string' },
//     { fieldName: 'birth_year', dataType: 'int' },
//     { fieldName: 'death_year', dataType: 'int', canBeNull: true },
//     { fieldName: 'took_office', dataType: 'date' },
//     { fieldName: 'left_office', dataType: 'date', canBeNull: true },
//     { fieldName: 'party', dataType: 'string' },
// ];

// const availableFiltersMap = createKeyedMap(availDTO.map(m => new DataTypes[m.dataType](m)), m=>m.fieldName);
//availableFilters.party = new DataTypes.list(availableFilters.party, partyList);

const partyListOptions = partyList.map(m => ({ label: m.label, value: m.label }));

//if building in JS
const availableFilters = [
    new DataTypes.int('number'),
    new DataTypes.string('president'),
    new DataTypes.int('birth_year'),
    new DataTypes.decimal({ fieldName: 'death_year', canBeNull: true }),
    new DataTypes.date({ fieldName: 'took_office'}),
    new DataTypes.date({ fieldName: 'left_office', canBeNull: true }),
    new DataTypes.list('party', partyListOptions),
    new DataTypes.boolean({ fieldName: 'assasinated', displayName: 'was assasinated'}),

];

const assasinatedPresidents = [16, 20, 25, 35];

const data = sampledata.map(m => ({ ...m, assasinated: assasinatedPresidents.indexOf(m.number) > -1 }));

//const availableFiltersMap = createKeyedMap(availableFilters, m => m.fieldName);

//availableFiltersMap.number.operations.gt.displayName = 'greater than TEST';
availableFilters.find(m => m.fieldName === 'death_year').operations['null'].displayName = 'still alive';

interface FiltersExampleState {
    appliedFilters: Array<AppliedFilter<any>>;
}

const Table = withInternalSorting(withInternalPaging(ReactPowerTable));

export class FiltersExample extends React.Component<never, FiltersExampleState> {

    constructor(props: never) {
        super(props);
        this.state = { appliedFilters: [] };

        this.handleFiltersChange = this.handleFiltersChange.bind(this);
    }

    handleFiltersChange(newFilters: Array<AppliedFilter<any>>) {
        console.log('onFiltersChange', newFilters);
        this.setState({ appliedFilters: newFilters });
    }
    render() {

        let filteredData = data;

        this.state.appliedFilters.forEach(m => {
            filteredData = m.filter.applyFilter(filteredData, m.operation, m.value);
        });

        return (
            <div className="row">

            <div className="col-md-3">
                <div className="grid-filters">

                    <div className="small">
                        {numberWithCommas(filteredData.length) + ' Presidents'}
                        &nbsp;
                    </div>

                    <div style={{ marginTop: 10 }}/>

                    <GridFilters availableFilters={availableFilters} appliedFilters={this.state.appliedFilters} onFiltersChange={this.handleFiltersChange} />
                </div>

            </div>
            <div className="col-md-9">
                <Table columns={defaultColumns} keyColumn="number" rows={filteredData} sorting={{column: 'number' }} />
            </div>
            </div>
        );

    }
}
