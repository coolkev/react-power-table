import * as React from 'react';
import { sampledata, defaultColumns, President } from './shared'
import { ReactPowerTable, withInternalSorting, Column, withInternalPaging } from '../../src/'
import { getColumnCore } from 'react-power-table/Column';

interface HideColumnsExampleState {
        visibleColumnNames: string[];
        counter: number;
}


const allColumns = defaultColumns.map(c => {
        const core = getColumnCore(c);
        return { col: c, fieldName: core.fieldName, headerText: core.headerText };
});

const Table = withInternalSorting(withInternalPaging(ReactPowerTable));
export class HideColumnsExample extends React.Component<never, HideColumnsExampleState>  {

        constructor(props: never) {
                super(props);
                this.state = {
                        visibleColumnNames: allColumns.map(m => m.fieldName),
                        counter: 0
                };

                this.handleVisibleChange = this.handleVisibleChange.bind(this);

                this.visibleColumns = defaultColumns;
        }

        visibleColumns: Column<President>[];
        handleVisibleChange(evt: React.SyntheticEvent<HTMLInputElement>) {

                const columnFieldName = evt.currentTarget.value;

                const { visibleColumnNames } = this.state;
                const newVisibleColumnNames = evt.currentTarget.checked ? [...visibleColumnNames, columnFieldName] : visibleColumnNames.filter(c => c != columnFieldName);

                this.setState({ visibleColumnNames: newVisibleColumnNames });

                this.visibleColumns = allColumns.filter(m => newVisibleColumnNames.indexOf(m.fieldName) > -1).map(m => m.col);

        }

        render() {

                return <div>


                        <button onClick={() => this.setState(prev => ({ counter: prev.counter + 1 }))}>Counter</button>

                        <div>Show Columns:

                                {allColumns.map(c => <label key={c.fieldName} style={{ marginRight: 10 }}><input type="checkbox" checked={this.state.visibleColumnNames.indexOf(c.fieldName) > -1} value={c.fieldName} onChange={this.handleVisibleChange} /> {c.headerText}</label>)}
                        </div>


                        <Table columns={this.visibleColumns} keyColumn="number" rows={sampledata} sorting={{ column: 'president'}} />
                </div>;
        }
}
