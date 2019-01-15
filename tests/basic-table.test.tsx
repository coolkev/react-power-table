import * as React from 'react';
import { ReactPowerTable } from '../src/ReactPowerTable';
import { defaultColumns, sampledata } from './shared';
import { render } from 'enzyme';

const columns = defaultColumns;
const rows = sampledata.slice(0, 5);
describe('basic tests',
    () => {

        test('Render plain table', () => {
            const component = render(
                <ReactPowerTable columns={columns} rows={rows} keyColumn="number" />
            );

            expect(component).toMatchSnapshot();

        });

        test('Render plain table with custom tdComponent', () => {
            const component = render(
                // tslint:disable-next-line:jsx-no-lambda
                <ReactPowerTable columns={columns} rows={rows} keyColumn="number" tdComponent={(p) => <span>{p.value}</span>} />
            );

            expect(component).toMatchSnapshot();

        });

        test('Render plain table with custom headerComponent', () => {

            const columns2 = columns.map(c => ({ ...c }));
            columns2[0].headerComponent = () => <span>Test</span>;

            const component = render(
                // tslint:disable-next-line:jsx-no-lambda
                <ReactPowerTable columns={columns2} rows={rows} keyColumn="number" />
            );

            expect(component).toMatchSnapshot();

        });

        test('Render plain table with custom valueComponent', () => {

            const columns2 = columns.map(c => ({ ...c }));
            columns2[0].valueComponent = p => <span>{p.row.number}</span>;

            const component = render(
                // tslint:disable-next-line:jsx-no-lambda
                <ReactPowerTable columns={columns2} rows={rows} keyColumn="number" />
            );

            expect(component).toMatchSnapshot();

        });

        test('Render plain table with wrapper', () => {

            const columns2 = columns.map(c => ({ ...c }));
            columns2[0].wrapper = <b />;

            const component = render(
                // tslint:disable-next-line:jsx-no-lambda
                <ReactPowerTable columns={columns2} rows={rows} keyColumn="number" />
            );

            expect(component).toMatchSnapshot();

        });

        test('Render plain table with wrapper func', () => {

            const columns2 = columns.map(c => ({ ...c }));
            columns2[0].wrapper = () => <b />;

            const component = render(
                // tslint:disable-next-line:jsx-no-lambda
                <ReactPowerTable columns={columns2} rows={rows} keyColumn="number" />
            );

            expect(component).toMatchSnapshot();

        });
    });
