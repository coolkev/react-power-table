import * as React from 'react';
import { ReactPowerTable, withPaging, withSorting, SortSettings, sortArray } from 'react-power-table';
import { sampledata, President, defaultColumns } from './shared'

interface ExternalPagingSortingExampleState {
    data: President[];
    currentSort: SortSettings;

    currentPage: number;
    pageSize: number;
}

const p = withPaging(ReactPowerTable);
const Table = withSorting(p);

export class ExternalPagingSortingExample extends React.Component<never, ExternalPagingSortingExampleState> {

    constructor(props: never) {
        super(props);

        this.state = { currentPage: 1, pageSize: 20, currentSort: { Column: 'number', Ascending: true }, data: sampledata };

        this.changeSort = this.changeSort.bind(this);

        this.gotoPage = this.gotoPage.bind(this);

    }

    changeSort(sort: SortSettings) {

        this.setState(prev => ({ data: sortArray(prev.data, sort.Column, { descending: !sort.Ascending, caseInsensitive: true }), currentSort: sort }));
    }

    gotoPage(currentPage: number, pageSize?: number) {

        if (pageSize) {
            this.setState({ currentPage, pageSize });
        }
        else {
            this.setState({ currentPage });
        }
    }

    render() {
        const { data, currentSort } = this.state;
        const { currentPage, pageSize } = this.state;

        const skip = (currentPage - 1) * pageSize;
        const pageRows = data.slice(skip, skip + pageSize);
        const pagingProps = { currentPage, pageSize, gotoPage: this.gotoPage, totalRowCount: data.length };
        const sortingProps = { ...currentSort, changeSort: this.changeSort };

        return <Table columns={defaultColumns} keyColumn="number" rows={pageRows} paging={pagingProps} sorting={sortingProps} />;


    }
}
