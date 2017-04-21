import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Nav, NavItem, Navbar } from "react-bootstrap";
import { ReactPowerTable } from "react-power-table";
import { BasicExample } from "./basic";
import { InternalSortingExample } from "./internal-sorting";
import { ExternalSortingExample } from "./external-sorting";
import { InternalPagingExample } from "./internal-paging";
import { InternalPagingSortingExample } from "./internal-paging-sorting";
import { ExternalPagingExample } from "./external-paging";
import { ExternalPagingSortingExample } from "./external-paging-sorting";
import { CheckboxExample } from "./checkboxes";
 import { FiltersExample } from "./filters";
import { HideColumnsExample } from "./hideColumns";


interface ExamplesProps {
    selected: string;
    onSelect: (selected: any) => void;
}

import 'react-select/dist/react-select.css';


const examples = {
    'Basic': BasicExample,
    'Internal Sorting': InternalSortingExample,
    'Internal Paging': InternalPagingExample,
    'Internal Paging/Sorting': InternalPagingSortingExample,
     'External Sorting': ExternalSortingExample,
    'External Paging': ExternalPagingExample,
    'External Paging/Sorting': ExternalPagingSortingExample,
    'Checkboxes': CheckboxExample,
     'Filters': FiltersExample,
     'Hide Columns': HideColumnsExample
    
};
ReactPowerTable.defaultProps = { tableProps: { className: 'table' } };
class Examples extends React.Component<ExamplesProps, never> {
   
    render() {

        const selected = this.props.selected || 'Basic';

        const SelectedComponent = examples[selected]
        //return <div><ReactPowerTable columns={this.columns} keyColumn="number" rows={data} sorting={{ ...sort, changeSort: this.changeSort }}  /></div>;
        return <div className="container-fluid">
            <Navbar fluid>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">React Power Table Examples</a>
                    </Navbar.Brand>
                </Navbar.Header>

                <Nav activeKey={selected} onSelect={this.props.onSelect}>
                    {Object.keys(examples).map((name) => <NavItem key={name} eventKey={name}>{name}</NavItem>)}
                </Nav>
            </Navbar>
         <div className="container">
            
            <SelectedComponent />
         </div>
            
        </div>;

    }
}

class ExamplesApp extends React.Component<never, never> {
    
    handleSelect(name: any) {
        //this.setState({ selected: name });
        location.hash = '#' + name.replace(/ /g, '-');
        //this.forceUpdate();
    }

    componentWillMount() {
        window.addEventListener('hashchange', ()=> this.forceUpdate(), false);
    }
    
    componentWillUnmount() {
        window.removeEventListener('hashchange');
    }
    render() {

        //const keys = Object.keys(examples).map(name => name.replace(/ /g, '-'));
        //console.log('render location.hash=' + location.hash);
        const name = location.hash && location.hash.substring(1).replace('-', ' ') ;
        const selected = examples[name] && name;
        return <Examples selected={selected} onSelect={s => this.handleSelect(s)}/>
    }
}

ReactDOM.render(
    <ExamplesApp />,
    document.getElementById('root')
);



// Allow Hot Module Reloading
declare var module: any;

if (module.hot) {
    module.hot.accept();
}
