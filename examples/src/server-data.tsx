import * as React from 'react';
import { ReactPowerTable, DataTypes, getFilterDefinition, numberWithCommas, AppliedFilter, GridFilters, FilterDefinition, withPaging, withSorting, SortSettings, Column, ObjectMap, AppliedFilterDTO } from '../../src/'
import { objectMapToArray } from "react-power-table/utils";





    
interface OrderViewModel {
    "CustomerID": number;
    "FirstName": string;
    "LastName": string;
    "Date": Date;
    "OrderTotal": number;
    "DateUpdated": Date;
}
interface Query {
    appliedFilters: AppliedFilterDTO[];
    sort: SortSettings;
    currentPage: number;
    pageSize: number;
}

interface QueryResult {
    results: any[];
    totalResultCount: number;
    offset: number;
}

interface QueryDTO {
    filters: AppliedFilterDTO[],
    sort: SortSettings;

    paging: {
        skip: number;
        take: number;
        returnTotalCount?: boolean;
    }

}

export const ServerDataExample = () => {



const serverMetadata = {
    "filters": {
        "Details_ProductID": getFilterDefinition('int',{ fieldName: "Details_ProductID", displayName: "Details Product ID"}),
        "OrderID": getFilterDefinition('int', { fieldName: "OrderID", displayName: "Order ID", canBeNull: false}),
        "CustomerID": getFilterDefinition('int',{ fieldName: "CustomerID", displayName: "Customer ID"}),
        "FirstName": getFilterDefinition('string',{ fieldName: "FirstName", displayName: "First Name"}),
        "LastName": getFilterDefinition('string',{ fieldName: "LastName", displayName: "Last Name"}),
        "Date": getFilterDefinition('date',{ fieldName: "Date", displayName: "Date"}),
        "OrderTotal": getFilterDefinition('decimal',{ fieldName: "OrderTotal", displayName: "Order Total"}),
        "DateUpdated": getFilterDefinition('date',{ fieldName: "DateUpdated", displayName: "Date Updated",canBeNull: true}),
    },
    "columns": {
        "CustomerID": { field: "CustomerID", displayName: "Customer ID" } as Column<OrderViewModel,number>,
        "FirstName": { field: "FirstName", displayName: "First Name" } as Column<OrderViewModel,string>,
        "LastName": { field: "LastName", displayName: "Last Name" } as Column<OrderViewModel,string>,
        "Date": { field: "Date", displayName: "Date" } as Column<OrderViewModel,Date>,
        "OrderTotal": { field: "OrderTotal", displayName: "Order Total" } as Column<OrderViewModel,number>,
        "DateUpdated": { field: "DateUpdated", displayName: "Date Updated" } as Column<OrderViewModel,Date>,
    },
    "keyColumn": "OrderID",
    "defaultSort": { column: "Date", ascending: false }
};

    const availableFilters = serverMetadata.filters;
    const columns = serverMetadata.columns;

    columns.OrderTotal.formatter = (value, row) => "$" + value + " " + row.FirstName;
    columns.CustomerID.cellComponent = props => <a href={"#" + props.value}>{props.value}</a>
    availableFilters.FirstName.operations.notcontains.displayName = 'doesn\'t contain';
    
    
//availableFilters.OrderID.operations.


    return <ServerDataTable columns={columns} availableFilters={availableFilters} defaultSort={serverMetadata.defaultSort} keyColumn={serverMetadata.keyColumn} />;
}



interface ServerDataTableState {
    query: Query;

    loading: boolean;
    totalRowCount?: number;
    rows: any[];
    errorMessage?: string;
}

const Table = withSorting(withPaging(ReactPowerTable));

interface ServerDataTableProps {
    columns: ObjectMap<Column>;
    availableFilters: ObjectMap<FilterDefinition>;

    defaultSort: SortSettings;
    keyColumn: string;
}
class ServerDataTable extends React.Component<ServerDataTableProps, ServerDataTableState> {

    constructor(props: ServerDataTableProps) {
        super(props);
        this.state = {
            loading: false,
            rows: [],
            query: { appliedFilters: [], currentPage: 1, pageSize: 20, sort: props.defaultSort },
        };

        this.handleQueryData = this.handleQueryData.bind(this);
    }

    componentWillMount() {
        this.handleQueryData(this.state.query);
    }

    // componentWillReceiveProps(nextProps: ServerDataTableProps) {
    //     console.log('GridFiltersInternal.componentWillReceiveProps', { currentProps: this.props, nextProps });

    //     //this.transformProps(nextProps, this.props);

    //     if (nextProps.availableFilters != this.props.availableFilters) {
    //         console.log('nextProps.availableFilters != this.props.availableFilters');

    //         this.setState((prev: ServerDataTableState) => {
    //             var result =  ({
    //                 query: {
    //                     ...prev.query, appliedFilters: prev.query.appliedFilters.map(f => {

    //                         return { ...f, filter: nextProps.availableFilters[f.filter.fieldName] };
    //                     })
    //                 }
    //             });
    //             console.log('new State', result);

    //             return result;
    //         });

    //     }
    // }

    handleQueryData(query: Query) {

        this.setState({ query: query, loading: true });

        const dto: QueryDTO = {
            filters: query.appliedFilters,
            paging: {
                skip: ((query.currentPage - 1) * query.pageSize),
                take: query.pageSize,
            },
            sort: query.sort
        };

        var options: RequestInit = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dto),
            //credentials: 'same-origin',

        };


        fetch('/api/Order/', options).then(response => {

            if (response.ok) {
                var contentType = response.headers.get('Content-Type');
                if (!contentType.match(/application\/json/i)) {
                    var msg = 'Invalid Content-Type received. Expected "application/json", was "' +
                        contentType +
                        '"';
                    throw new Error(msg);
                } else {
                    return response.json() as any as QueryResult;
                }
            } else {
                throw new Error('Error');
            }
        }).then(result => {
            console.log('fetch returned ', result)
            this.setState({ errorMessage: null, rows: result.results, totalRowCount: result.totalResultCount, loading: false });

        }).catch((error: Error) => {
            this.setState({ errorMessage: error.message + ': ' + error.stack, loading: false });
            throw error;
        });


    }

    render() {
        console.log('ServerDataTable.render', this.props.availableFilters);

        const { errorMessage, loading, ...extraState } = this.state;

        if (errorMessage) {
            return <div className="alert alert-danger" role="alert">{errorMessage}</div>;
        }
        return <div>

            <TableWithExternalFilters {...this.props} {...extraState} onQueryData={this.handleQueryData} />

        </div>;


    }
}



interface TableWithExternalFiltersProps extends ServerDataTableProps {
    query: Query;

    //columns: { [key: string]: Column };
    //availableFilters: { [key: string]: FilterDefinition };

    totalRowCount?: number;
    rows: any[];

    onQueryData: (query: Query) => void;
}


export class TableWithExternalFilters extends React.Component<TableWithExternalFiltersProps, never> {

    constructor(props: never) {
        super(props);

        this.handleFiltersChange = this.handleFiltersChange.bind(this);
        this.handleChangeSort = this.handleChangeSort.bind(this);
        this.handleGotoPage = this.handleGotoPage.bind(this);
    }

    handleFiltersChange(newFilters: AppliedFilter<any>[]) {
        console.log('onFiltersChange', newFilters)

        const filtersDto = newFilters.map(m => ({
            columnKey: m.filter.fieldName, operationKey: m.operation.key, value: m.value
        }));
        this.props.onQueryData({ ...this.props.query, appliedFilters: filtersDto });

    }

    handleChangeSort(sort: SortSettings) {

        this.props.onQueryData({ ...this.props.query, sort });
    }

    handleGotoPage(currentPage: number, pageSize?: number) {

        const newQuery = pageSize ? { ...this.props.query, currentPage, pageSize } : { ...this.props.query, currentPage };
        this.props.onQueryData(newQuery);
    }

    render() {


        const { query, rows, totalRowCount, availableFilters, keyColumn, columns } = this.props;

        const appliedFilters = this.props.query.appliedFilters.map(m => {

            const filter = availableFilters[m.columnKey];

            return { filter: filter, operation: filter.operations[m.operationKey], value: m.value } as AppliedFilter;
        });

        console.log('TableWithExternalFilters.render', appliedFilters);

        const columnArray = objectMapToArray(columns);

        return <div className="row">

            <div className="col-md-3">
                <div className="grid-filters">

                    <div className="small">
                        {totalRowCount && numberWithCommas(totalRowCount) + ' Records'}
                        &nbsp;
                    </div>

                    <div style={{ marginTop: 10 }}></div>

                    <GridFilters availableFilters={availableFilters} appliedFilters={appliedFilters} onFiltersChange={this.handleFiltersChange} />
                </div>

            </div>
            <div className="col-md-9">
                <Table columns={columnArray} keyColumn={keyColumn} rows={rows}
                    sorting={{ ...query.sort, changeSort: this.handleChangeSort }}
                    paging={{ currentPage: query.currentPage, pageSize: query.pageSize, totalRowCount: totalRowCount, gotoPage: this.handleGotoPage }} />
            </div>
        </div>;



    }
}


