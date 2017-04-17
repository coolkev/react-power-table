import * as React from 'react';
import { ReactPowerTable, withPaging } from 'react-power-table';
import { sampledata, defaultColumns } from './shared'


interface ExternalPagingExampleState {
    currentPage: number;
    pageSize: number;
}

const Table = withPaging(ReactPowerTable);
const rows = sampledata;

export class ExternalPagingExample extends React.Component<never, ExternalPagingExampleState> {

    constructor(props: never) {
        super(props);

        this.state = { currentPage: 1, pageSize: 20 };

        this.gotoPage = this.gotoPage.bind(this);

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
        const { currentPage, pageSize } = this.state;

        const skip = (currentPage - 1) * pageSize;
        const pageRows = rows.slice(skip, skip + pageSize);
        
        return <div><Table columns={defaultColumns} keyColumn="number" rows={pageRows} paging={{currentPage, pageSize, gotoPage: this.gotoPage, totalRowCount: rows.length}}/></div>;

    }
}
