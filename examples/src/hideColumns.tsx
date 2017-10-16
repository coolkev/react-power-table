import * as React from 'react';
import { sampledata, defaultColumns, President } from './shared';
import { ReactPowerTable, withInternalSorting, Column, withInternalPaging } from '../../src/';
import { getColumnCore } from '../../src/Column';

interface HideColumnsExampleState {
        columns: Column[];
        //counter: number;
}

// const allColumns = defaultColumns.map(c => {
//         const core = getColumnCore(c);
//         return { col: c, fieldName: core.fieldName, headerText: core.headerText };
// });

const initialColumns = defaultColumns.map(c => {
        const core = getColumnCore(c);
        return { ...c, key: core.key, headerText: core.headerText };
});
// tslint:disable:jsx-no-lambda
const Table = withInternalSorting(withInternalPaging(ReactPowerTable));
export class HideColumnsExample extends React.Component<never, HideColumnsExampleState>  {

        constructor(props: never) {
                super(props);
                this.state = {
                        columns: initialColumns
                };

                //this.handleVisibleChange = this.handleVisibleChange.bind(this);

        }

        handleVisibleChange(col: Column, checked: boolean) {

                // const columnFieldName = evt.currentTarget.value;

                // const { columns } = this.state;
                // //const newVisibleColumnNames = evt.currentTarget.checked ? [...visibleColumnNames, columnFieldName] : visibleColumnNames.filter(c => c != columnFieldName);

                // this.setState({ visibleColumnNames: newVisibleColumnNames });

                // this.visibleColumns = allColumns.filter(m => newVisibleColumnNames.indexOf(m.fieldName) > -1).map(m => m.col);

                this.setState(prev => ({ columns: prev.columns.map(c => c === col ? { ...c, visible: checked } : c) }));
        }

        render() {

                const { columns } = this.state;

                return (
                        <div>

                                <div>Show Columns:

                                {columns.map(c => <label key={c.key} style={{ marginRight: 10 }}><input type="checkbox" checked={c.visible !== false} onChange={(e) => this.handleVisibleChange(c, e.currentTarget.checked)} /> {c.headerText}</label>)}
                                </div>

                                <Table columns={this.state.columns} keyColumn="number" rows={sampledata} sorting={{ column: 'president' }} />
                        </div>
                );
        }
}
