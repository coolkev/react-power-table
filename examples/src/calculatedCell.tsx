import * as React from 'react';
import { sampledata, President } from './shared';
import { ReactPowerTable, Column, withInternalSorting, PowerTableProps } from '../../src/';

//const Table = ReactPowerTable;
const Table = (withInternalSorting(ReactPowerTable as any as React.ComponentClass<PowerTableProps<President>>));

let rows = sampledata;

for (let x = 1; x <= 1; x++) {
        rows = rows.concat(sampledata.map(m => ({ ...m, number: m.number + (44 * x) })));
}

// type ReactComponentType<P = {}> = React.ComponentClass<P> | ReactStatelessComponent<P>;
// interface ReactStatelessComponent<P = {}> {
//         (props: P & { children?: React.ReactNode }, context?: any): JSX.Element | JSX.Element[] | string | number | null | false | React.ReactChild | React.ReactFragment | boolean | null | undefined;
//         propTypes?: React.ValidationMap<P>;
//         contextTypes?: React.ValidationMap<any>;
//         defaultProps?: Partial<P>;
//         displayName?: string;
// }

// class ColumnBuilder<TRow, TExtraProps = {}> {

//         // public column<TValue>(field: (row: TRow) => TValue) {
//         //         return new ColumnBuilderWithField<TRow, TValue>(field);
//         // }
//         public column<TValue>(options: Column<TRow, TValue>) {
//                 return new ColumnBuilderWithField<TRow, TValue, TExtraProps>(options);
//         }

// }
// class ColumnBuilderWithField<TRow, TValue, TExtraProps = {}, TProps = ValueComponentProps<TRow, {}, TValue>> implements Column<TRow, TValue> {
//         key?: string | number;

//         field?: ((row: TRow) => TValue);
//         fieldName?: string;

//         headerText?: string;

//         wrapper: StaticOrDynamicProps<ValueComponentProps<TRow, {}, TValue>, JSX.Element>;

//         valueComponent?: React.ComponentType<ValueComponentProps<TRow, {}, TValue>>;

//         valueProps?: (props: ValueComponentProps<TRow, {}, TValue>) => ValueComponentProps<TRow, {}, TValue>;

//         includeExtraCellProps?: boolean;
//         //private component: ReactComponentType<TProps>;
//         //private propsTransformer: (props: ValueComponentProps<TRow, {}, TValue>) => TProps;

//         constructor(options: Column<TRow, TValue>) {
//                 for (const x of Object.keys(options)) {
//                         this[x] = options[x];
//                 }
//         }

//         public to(component: ReactComponentType<TProps>) {
//                 this.valueComponent = component as any;
//                 return this;
//         }

//         public transformProps<TTransformProps>(propsTransformer: (props: ValueComponentProps<TRow, {}, TValue>) => TTransformProps) {
//                 const t = this as any as ColumnBuilderWithField<TRow, TValue, TExtraProps, TTransformProps>;

//                 t.valueProps = propsTransformer as any;
//                 return t;
//         }

//         public withWrapper(wrapper: StaticOrDynamicProps<TProps, JSX.Element>) {

//                 this.wrapper = wrapper as any;
//                 return this;
//         }

//         public includeExtraProps() {
//                 this.includeExtraCellProps = true;
//                 return this as ColumnBuilderWithField<TRow, TValue, TExtraProps, TProps & TExtraProps>;
//         }
//         // public get valueComponent() {
//         //         return this.component as any; // as React.ComponentType<ValueComponentProps<TRow, {}, TValue>>;
//         // }
//         // public get wrapper() {
//         //         return this._wrapper as any; // as StaticOrDynamicProps<ValueComponentProps<TRow, {}, TValue>, JSX.Element>;
//         // }
// }

// interface ValueComponentProps<TRow = {}, TExtraProps = {}, TValue = {}> {

//         row: TRow;
//         column: StrictColumn<TRow, {}, TExtraProps>;
//         value: TValue;
//         //children?: React.ReactNode;
// }

// const builder = new ColumnBuilder<President, { nameHyperlink: boolean }>();
// builder.column({ field: m => m.number, headerText: 'name' }).transformProps(v => ({ value: v.value })).to(m => m.value);

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

                //const boldElement = <b />;
                this.columns = [
                        { field: m => m.number },
                        { field: m => m.president, wrapper: v => v.nameHyperlink && <a href={'fakeurl/' + v.row.number} />, includeExtraCellProps: true },
                        //{ field: m => m.president, wrapper: v => v.nameHyperlink && <a href={'fakeurl/' + v.row.number} />, includeExtraCellProps: true },
                        // builder.column({
                        //         field: m => m.president, headerText: 'name',
                        // }).includeExtraProps().withWrapper(v => v.nameHyperlink ? <a href={'fakeurl/' + v.row.number} /> : null)
                        // ,
                        { field: m => m.party, valueProps: v => ({ ...v, partyBold: this.state.partyBold }), wrapper: v => v['partyBold'] && <b />, },
                        //{ field: m => m.party, key: 'party2', valueProps: v => ({ ...v, partyBold: this.state.partyBold }), valueComponent: v => v['partyBold'] ? <b style={{color: 'green'}} children={v.children} /> : v.children as any },

                        //{ field: m => m.birth_year, wrapper: () => this.state.yearBold && <b />, pure: false },

                        // builder.column({
                        //         field: m => m.party,
                        // }).transformProps(v => ({ ...v, partyBold: this.state.partyBold })).withWrapper(v => v.partyBold ? boldElement : null),
                        // builder.column({
                        //         field: m => m.birth_year,
                        //         wrapper: () => this.state.yearBold ? boldElement : null
                        // }).to(v => this.state.yearBold ? <b>{v.children}</b> : v.children),
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
