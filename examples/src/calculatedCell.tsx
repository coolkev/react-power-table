import * as React from 'react';
import { sampledata, President } from './shared';
import { ReactPowerTable, Column, withInternalSorting, withInternalPaging, RowComponentProps, ValueComponentProps, PowerTableProps } from '../../src/';

//const Table = ReactPowerTable;
const Table = (withInternalSorting(ReactPowerTable as any as React.ComponentClass<PowerTableProps<President>>));

let rows = sampledata;

for (let x = 1; x <= 1; x++) {
        rows = rows.concat(sampledata.map(m => ({ ...m, number: m.number + (44 * x) })));
}

export class CalculatedCellExample extends React.Component<{}, { nameHyperlink: boolean, partyBold: boolean, yearBold: boolean, counter: number, tableClassName: string }>  {

        private columns: Array<Column<President, {}, { nameHyperlink?: boolean }>>;

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
                        {
                                field: m => m.president, headerText: 'name', valueComponent: (v) => {
                                        return v.nameHyperlink ? <a href="#">{v.children}</a> : v.children;
                                },
                                includeExtraCellProps: true
                        } as Column<President, {}, { nameHyperlink?: boolean }>,
                        {
                                field: m => m.party,
                                valueComponent: (v) => {
                                        return this.state.partyBold ? <b>{v.children}</b> : <div>{v.children}</div>;
                                }
                        } as Column<President>,
                        {
                                field: m => m.birth_year, valueComponent: (v) => {
                                        return this.state.yearBold ? <b>{v.children}</b> : <div>{v.children}</div>;
                                }
                        } as Column<President>,
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
