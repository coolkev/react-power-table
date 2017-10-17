import * as React from 'react';
import { sampledata, President } from './shared';
import { ReactPowerTable, Column, withInternalSorting, PowerTableProps } from '../../src/';

//const Table = ReactPowerTable;
const Table = (withInternalSorting(ReactPowerTable as any as React.ComponentClass<PowerTableProps<President>>));

let rows = sampledata;

for (let x = 1; x <= 1; x++) {
        rows = rows.concat(sampledata.map(m => ({ ...m, number: m.number + (44 * x) })));
}

export class CalculatedCellExample extends React.Component<{}, { nameHyperlink: boolean, partyBold: boolean, yearBold: boolean, counter: number, tableClassName: string }>  {

        private columns: Array<Column<President, { nameHyperlink?: boolean }>>;

        constructor(props: never) {
                super(props);
                console.log('CalculatedCellExample constructor');
                this.state = {
                        nameHyperlink: false,
                        partyBold: false,
                        yearBold: false,
                        counter: 1,
                        tableClassName: 'table'
                };

                this.handleHyperlinkNameChange = this.handleHyperlinkNameChange.bind(this);
                this.handlePartyBoldChange = this.handlePartyBoldChange.bind(this);
                this.handleYearBoldChange = this.handleYearBoldChange.bind(this);
                this.incrementCounter = this.incrementCounter.bind(this);
                this.changeTableClassName = this.changeTableClassName.bind(this);

                this.columns = [
                        { field: m => m.number },
                        { field: m => m.president, wrapper: v => v.nameHyperlink && <a href={'fakeurl/' + v.row.number} />, includeExtraCellProps: true },
                        { field: m => m.party, transformCellProps: v => ({ ...v, partyBold: this.state.partyBold }), wrapper: v => v['partyBold'] && <b />, },
                        { field: m => m.birth_year, wrapper: () => this.state.yearBold && <b />, pure: false, tdAttributes: cell => ({ style: { color: cell.value % 2 === 0 ? 'red' : null } }) } as Column<President, {}, number>,
                        { field: m => m.death_year, tdAttributes: { style: { color: 'red' } } },
                        { field: m => m.took_office, textAlign: 'right', width: 140 },
                        { field: m => m.left_office },

                ];

        }
        handleHyperlinkNameChange(e: React.FormEvent<HTMLInputElement>) {
                this.setState({ nameHyperlink: e.currentTarget.checked });
        }

        handlePartyBoldChange(e: React.FormEvent<HTMLInputElement>) {
                this.setState({ partyBold: e.currentTarget.checked });
        }

        handleYearBoldChange(e: React.FormEvent<HTMLInputElement>) {
                this.setState({ yearBold: e.currentTarget.checked });
        }

        incrementCounter() {
                this.setState(prev => ({ counter: prev.counter + 1 }));
        }
        changeTableClassName() {
                this.setState(prev => ({ tableClassName: prev.tableClassName === 'table' ? 'table table-striped' : 'table' }));
        }

        // tableRowComponent(props: RowComponentProps<President>) {
        //         const rowClassName = props.row.party === 'Republican' ? 'bg-danger' : (props.row.party === 'Democratic' ? 'bg-primary' : '');
        //         const { columns, row, ...rest } = props;
        //         return <tr {...rest} className={rowClassName} />;
        // }
        render() {

                const { nameHyperlink, partyBold, yearBold, counter, tableClassName } = this.state;

                console.log('CalculatedCellExample render');
                return (
                        <div>
                                <div>

                                        <label><input type="checkbox" checked={nameHyperlink} onChange={this.handleHyperlinkNameChange} /> Hyperlink Name (extraCellProps)</label>
                                        {' '}
                                        <label><input type="checkbox" checked={partyBold} onChange={this.handlePartyBoldChange} /> Bold Party (custom cellComponentProps)</label>
                                        {' '}
                                        <label><input type="checkbox" checked={yearBold} onChange={this.handleYearBoldChange} /> Bold Year (direct in cellComponent)</label>
                                </div>

                                <div>
                                        <button onClick={this.incrementCounter}>Dont Re-render {counter}</button>
                                        {' '}
                                        <button onClick={this.changeTableClassName}>Change TableClassName</button>
                                </div>

                                <Table
                                        columns={this.columns}
                                        keyColumn="number"
                                        rows={rows}
                                        extraCellProps={{ nameHyperlink }}
                                        sorting={{ column: 'number' }}
                                        tableClassName={tableClassName}
                                        //rowComponent={this.tableRowComponent}
                                        // tslint:disable-next-line:jsx-no-lambda
                                        rowHtmlAttributes={p => ({ className: p.row.party === 'Republican' ? 'bg-danger' : (p.row.party === 'Democratic' ? 'bg-primary' : '') })}
                                />

                        </div>
                );
        }
}

// export class CalculatedCellExample extends React.Component<never, { highlightEvenRows: boolean, counter: number }> {

//         private columns: Array<Column<President, {}, { highlightEvenRows: boolean }>>;
//         constructor(props: never) {
//                 super(props);
//                 this.state = { highlightEvenRows: false, counter: 1 };

//                 this.handleHighlightChange = this.handleHighlightChange.bind(this);
//                 this.incrementCounter = this.incrementCounter.bind(this);

//                 this.columns = [
//                         { field: row => row.president },

//                         // bad - this will not work because the row data has not changed and this cell will not be re-rendered.
//                         {
//                                 field: row => row.birth_year, key: 'y1',
//                                 tdAttributes: cell => this.state.highlightEvenRows && { style: { backgroundColor: cell.value % 2 === 0 ? 'yellow' : null } },
//                                 //wrapper: cell => this.state.highlightEvenRows  && <div style={{ backgroundColor: cell.value % 2 === 0 ? 'yellow' : null } }/>,
//                         } as Column<President, number, { highlightEvenRows: boolean }>,

//                         // quick and dirty fix for this is to specify pure: false so this cell is always re-rendered
//                         {
//                                 field: row => row.birth_year, key: 'y2',
//                                 tdAttributes: cell => this.state.highlightEvenRows && { style: { backgroundColor: cell.value % 2 === 0 ? 'yellow' : null } },
//                                 //wrapper: cell => this.state.highlightEvenRows  && <div style={{ backgroundColor: cell.value % 2 === 0 ? 'yellow' : null } }/>,
//                                 pure: false
//                         } as Column<President, number, { highlightEvenRows: boolean }>,

//                         // better fix is to customize the valueProps and pass the state in so component can remain pure:
//                         {
//                                 field: row => row.birth_year, key: 'y3',
//                                 //tdAttributes: cell => cell.highlightEvenRows && { style: { backgroundColor: cell.value % 2 === 0 ? 'yellow' : null } },
//                                 wrapper: cell => cell.highlightEvenRows && <div style={{ backgroundColor: cell.value % 2 === 0 ? 'yellow' : null } }/>,
//                                 transformCellProps: cell => ({ ...cell, highlightEvenRows: this.state.highlightEvenRows })

//                         } as Column<President, number, { highlightEvenRows: boolean }>,

//                         // or another option is to pass highlightEvenRows into the table extraCellProps so it can be accessed by the columns that need it
//                         {
//                                 field: row => row.birth_year, key: 'y4',
//                                 //tdAttributes: cell => cell.highlightEvenRows && { style: { backgroundColor: cell.value % 2 === 0 ? 'yellow' : null } },
//                                 wrapper: cell => cell.highlightEvenRows && <div style={{ backgroundColor: cell.value % 2 === 0 ? 'yellow' : null } }/>,
//                                 includeExtraCellProps: true
//                         } as Column<President, number, { highlightEvenRows: boolean }>
//                 ];
//         }

//         handleHighlightChange(e) {
//                 this.setState({ highlightEvenRows: e.currentTarget.checked });
//         }

//         incrementCounter() {
//                 this.setState(prev => ({ counter: prev.counter + 1 }));
//         }
//         render() {
//                 const { highlightEvenRows, counter } = this.state;

//                 return (
//                         <div>
//                                 <label><input type="checkbox" checked={highlightEvenRows} onChange={this.handleHighlightChange} /> Highlight even rows</label>
//                                 &nbsp;
//                                 <button onClick={this.incrementCounter}>Dont Re-render {counter}</button>

//                                 <ReactPowerTable rows={rows} columns={this.columns} keyColumn="number" extraCellProps={{highlightEvenRows}} />
//                         </div>
//                 );
//         }
// }
