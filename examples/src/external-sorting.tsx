import * as React from 'react';
import { ReactPowerTable, SortSettings, withSorting, sortArray } from 'react-power-table';
import { sampledata, President, defaultColumns } from './shared'


interface ExternalSortingExampleState {
    data: President[];
    currentSort: SortSettings;
}

const Table = withSorting(ReactPowerTable);
export class ExternalSortingExample extends React.Component<never, ExternalSortingExampleState> {

    constructor(props: never) {
        super(props);

        this.state = { currentSort: { Column: 'number', Ascending: true }, data: sampledata };

        this.changeSort = this.changeSort.bind(this);

    }

    changeSort(sort: SortSettings) {

        this.setState(prev => ({ data: sortArray(prev.data, sort.Column, { descending: !sort.Ascending, caseInsensitive: true }), currentSort:sort }));
    }

    render() {
        const { data, currentSort } = this.state;

        //return null;        
        return <Table columns={defaultColumns} keyColumn="number" rows={data} sorting={{ ...currentSort, changeSort: this.changeSort }} />;

    }
}
