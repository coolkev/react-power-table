import * as React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { ReactPowerTable } from '../../src/';
import { BasicExample } from './basic';
import { InternalSortingExample } from './internal-sorting';
import { ExternalSortingExample } from './external-sorting';
import { InternalPagingExample } from './internal-paging';
import { InternalPagingSortingExample } from './internal-paging-sorting';
import { ExternalPagingExample } from './external-paging';
import { ExternalPagingSortingExample } from './external-paging-sorting';
import { CalculatedCellExample } from './calculatedCell';

import { CheckboxExample } from './checkboxes';
import { FiltersExample } from './filters';
import { HideColumnsExample } from './hideColumns';
import { CustomRowExample } from './CustomRow';
import { ServerDataExample } from './server-data';

interface ExamplesProps {
    selected: string;
    onSelect: (selected: any) => void;
}

import 'react-select/dist/react-select.css';

ReactPowerTable.defaultProps.tableClassName = 'table';

//ReactPowerTable.defaultProps.testDefault = 'test123' ;
//ReactPowerTable.defaultProps.testDefault = 'test123';

const examples = {
    'Basic': BasicExample,
    'Internal Sorting': InternalSortingExample,
    'Internal Paging': InternalPagingExample,
    'Internal Paging/Sorting': InternalPagingSortingExample,
    'External Sorting': ExternalSortingExample,
    'External Paging': ExternalPagingExample,
    'External Paging/Sorting': ExternalPagingSortingExample,
    'Checkboxes': CheckboxExample,
    'Calculated Cell': CalculatedCellExample,
    'Filters': FiltersExample,
    'Hide Columns': HideColumnsExample,
    'Custom Row': CustomRowExample,
    'Server Data': ServerDataExample

};
class Examples extends React.Component<ExamplesProps, never> {

    render() {

        const selected = this.props.selected || 'Basic';

        const SelectedComponent = examples[selected];
        //return <div><ReactPowerTable columns={this.columns} keyColumn="number" rows={data} sorting={{ ...sort, changeSort: this.changeSort }}  /></div>;
        return (
            <div>

                <div className="row">
                    <div className="col-md-3">
                        <Nav bsStyle="pills" stacked activeKey={selected} onSelect={this.props.onSelect}>
                            {Object.keys(examples).map((name) => <NavItem key={name} eventKey={name}>{name}</NavItem>)}
                        </Nav>
                    </div>
                    <div className="col-md-9">

                        <SelectedComponent />

                    </div>

                </div>

            </div>
        );

    }
}

export class ExamplesApp extends React.Component<{}, {}> {

    constructor(props: {}) {
        super(props);
        this.reload = this.reload.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }
    handleSelect(name: any) {
        location.hash = '#' + name.replace(/ /g, '-');
    }

    reload() {
        this.setState({});
    }
    componentWillMount() {
        window.addEventListener('hashchange', this.reload, false);
    }

    componentWillUnmount() {
        window.removeEventListener('hashchange', this.reload);
    }
    render() {

        const name = location.hash && location.hash.substring(1).replace('-', ' ');
        const selected = examples[name] && name;
        return <Examples selected={selected} onSelect={this.handleSelect} />;
    }
}
