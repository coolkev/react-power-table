import * as React from 'react';
import { ReactPowerTable, withPaging, withSorting, SortSettings, sortArray } from '../../src/'
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

        this.state = { currentPage: 1, pageSize: 20, currentSort: { column: 'number'}, data: sampledata };

        this.changeSort = this.changeSort.bind(this);

        this.gotoPage = this.gotoPage.bind(this);

    }

    changeSort(sort: SortSettings) {

        //should reset back to page 1 when changing sort
        this.setState(prev => ({ data: sortArray(prev.data, sort.column, { descending: sort.descending, caseInsensitive: true }), currentSort: sort, currentPage: 1 }));
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
