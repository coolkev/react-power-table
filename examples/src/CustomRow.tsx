import * as React from 'react';
import { ReactPowerTable, withInternalSorting, SortableColumn, withInternalPaging, TableRowComponentProps } from '../../src/'
import { sampledata, defaultColumns, President } from './shared'



const columns = [...defaultColumns] as SortableColumn<President>[];

columns[2] = { ...columns[2], sortable: false, headerText: 'party (not sortable)' };
columns[3] = { ...columns[3], textAlign: 'right' };

const Table = withInternalSorting((ReactPowerTable));

const tableRowComponent = (props: TableRowComponentProps) => <tbody><tr className="tr-test" style={{ backgroundColor: props.row.number % 2 == 0 ? 'silver' : '' }}>{props.children}</tr></tbody>;
        
export const CustomRowExample = () => {
    console.log('examples.render()');

    //const tbodyComponent: (props) => React.ReactElement<any> = props => props.children;

    return <Table columns={columns} keyColumn="number" rows={sampledata} sorting={{ column: 'number' }} tableBodyComponent={null}
        tableRowComponent={tableRowComponent}
    />;

}
