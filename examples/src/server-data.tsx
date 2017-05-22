import * as React from 'react';
import { ReactPowerTable, numberWithCommas, AppliedFilter, GridFilters, FilterDefinition, withPaging, withSorting, SortSettings, Column, ObjectMap } from '../../src/';
import { objectMapToArray } from '../../src/utils';
import { QueryDTO, QueryResult } from './remote/interfaces';
import { OrderController } from './remote/';

export const ServerDataExample = () => {

    return <ServerDataTable {...OrderController} />;
};

export interface ServerDataTableProps {
    columns: ObjectMap<Column>;
    filters: ObjectMap<FilterDefinition>;

    defaultSort: SortSettings;
    keyColumn: string;

    executeQuery: (query: QueryDTO) => Promise<QueryResult>;
}

interface ServerDataTableState {
    query: QueryDTO;

    loading: boolean;
    totalRowCount?: number;
    rows: any[];
    errorMessage?: string;
}

const Table = withSorting(withPaging(ReactPowerTable));

class ServerDataTable extends React.Component<ServerDataTableProps, ServerDataTableState> {

    constructor(props: ServerDataTableProps) {
        super(props);
        this.state = {
            loading: false,
            rows: [],
            query: {
                filters: [],
                paging: {
                    currentPage: 1,
                    pageSize: 20
                },
                sort: props.defaultSort
            },
        };

        this.handleQueryData = this.handleQueryData.bind(this);
    }

    componentWillMount() {
        this.handleQueryData(this.state.query);
    }

    handleQueryData(query: QueryDTO) {

        this.setState({ query, loading: true });

        this.props.executeQuery(query).then(result => {
            console.log('fetch returned ', result);
            this.setState({ errorMessage: null, rows: result.results, totalRowCount: result.totalResults, loading: false });

        }).catch((error: Error) => {
            this.setState({ errorMessage: error.message + ': ' + error.stack, loading: false });
            throw error;
        });

    }

    render() {
        console.log('ServerDataTable.render', this.props.filters);

        const { errorMessage, loading, ...extraState } = this.state;

        if (errorMessage) {
            return <div className="alert alert-danger" role="alert">{errorMessage}</div>;
        }
        return (
            <div>

                <TableWithExternalFilters {...this.props} {...extraState} onQueryData={this.handleQueryData} />

            </div>);

    }
}

export interface TableWithExternalFiltersProps extends ServerDataTableProps {
    query: QueryDTO;
    totalRowCount?: number;
    rows: any[];
    onQueryData: (query: QueryDTO) => void;
}

export class TableWithExternalFilters extends React.Component<TableWithExternalFiltersProps, never> {

    constructor(props: never) {
        super(props);

        this.handleFiltersChange = this.handleFiltersChange.bind(this);
        this.handleChangeSort = this.handleChangeSort.bind(this);
        this.handleGotoPage = this.handleGotoPage.bind(this);
    }

    handleFiltersChange(newFilters: Array<AppliedFilter<any>>) {
        console.log('onFiltersChange', newFilters);

        const filtersDto = newFilters.map(m => ({
            columnKey: m.filter.fieldName, operationKey: m.operation.key, value: m.filter.serializeValue(m.value),
        }));
        this.props.onQueryData({ ...this.props.query, filters: filtersDto });

    }

    handleChangeSort(sort: SortSettings) {

        this.props.onQueryData({ ...this.props.query, sort });
    }

    handleGotoPage(currentPage: number, pageSize?: number) {

        const newQuery = pageSize ? { ...this.props.query, currentPage, pageSize } : { ...this.props.query, currentPage };
        this.props.onQueryData(newQuery);
    }

    render() {

        const { query, rows, totalRowCount, filters, keyColumn, columns } = this.props;

        const appliedFilters = this.props.query.filters.map(m => {

            const filter = filters[m.columnKey];

            return { filter, operation: filter.operations[m.operationKey], value: filter.deSerializeValue(m.value) } as AppliedFilter;
        });

        console.log('TableWithExternalFilters.render', appliedFilters);

        const columnArray = objectMapToArray(columns);

        return (
            <div className="row">

                <div className="col-md-3">
                    <div className="grid-filters">

                        <div className="small">
                            {totalRowCount && numberWithCommas(totalRowCount) + ' Records'}
                            &nbsp;
                    </div>

                        <div style={{ marginTop: 10 }}/>

                        <GridFilters availableFilters={filters} appliedFilters={appliedFilters} onFiltersChange={this.handleFiltersChange} />
                    </div>

                </div>
                <div className="col-md-9">
                    <Table
                        columns={columnArray}
                        keyColumn={keyColumn}
                        rows={rows}
                        sorting={{ ...query.sort, changeSort: this.handleChangeSort }}
                        paging={{ currentPage: query.paging.currentPage, pageSize: query.paging.pageSize, totalRowCount, gotoPage: this.handleGotoPage }}
                    />
                </div>
            </div>
        );

    }
}
