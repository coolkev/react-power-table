﻿import * as React from 'react';
import { withInternalSorting, ReactPowerTable, withInternalPaging, SortableColumn } from 'react-power-table';
import { sampledata, President, defaultColumns } from './shared'
//import { debuglog } from ;


interface PresidentWithChecked extends President {
    checked?: boolean;
}
interface CheckboxExampleState {    
    rows: PresidentWithChecked[];
}


const Table = withInternalSorting(withInternalPaging(ReactPowerTable));

export class CheckboxExample extends React.Component<never, CheckboxExampleState> {


    private columns: SortableColumn<PresidentWithChecked>[];

    constructor(props: never) {
        super(props);

        this.state = { rows: sampledata };

        this.columns = [
            {
                field: m => m.checked, cellComponent: (row) => {
                    console.log('checkbox cell render', row);
                    return <input type="checkbox" checked={row.value || false} onChange={e => this.checkChange(row.row, e.currentTarget.checked)} />;
                },
                headerComponent: () => {
                    return <input type="checkbox" checked={this.state.rows.every(m => m.checked)} onChange={e => { this.checkAllChange(e.currentTarget.checked) } } />;                    
                },
                sortable: false
            },
            ...defaultColumns
        ];

    }

    checkChange(row: President, checked: boolean) {
        
        //debuglog('checkChange', row, checked);
        this.setState((prevState) => {
            return { rows: prevState.rows.map(m => m.number == row.number ? { ...row, checked } : m) };
        });
    }

    checkAllChange(checked: boolean) {
        
        this.setState((prevState) => {
            return { rows: prevState.rows.map(m => ({ ...m, checked })) };
        });
    }

    render() {
        
        return <Table columns={this.columns} keyColumn="number" rows={this.state.rows} sorting={{ column: 'number'}} />;
        
    }
}
