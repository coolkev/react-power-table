import * as React from 'react';
import * as PowerTable from "./FilterDefinition";
import * as Select from 'react-select';
//import { CustomSelectValue } from '../components/CustomSelectValue';


export class List extends PowerTable.FilterDefinition<string[]>
{


    constructor(options: PowerTable.FilterDefinitionOptionsOrFieldName, items: Select.Option[]) {

        super(options);


        this.filterComponent = (props) => <Select value={
            props.value ? props.value : []} multi
            options={items}
            onChange={(e: Select.Option[]) => props
                .onValueChange(e.map(m => m.value as string || m.label))}
            /*valueComponent={CustomSelectValue as any}  */
            className="small" />

        //this.defaultFormat = (filter) => filter.filter.displayName + ' ' + filter.operation.displayName + ' "' + filter.value + '"'
    }

    public readonly operations = this.getOperations();

    private getOperations(): PowerTable.ObjectMap<PowerTable.OperationDefinition<string[]>> {
        return {
            'in': {
                key: 'in',
                displayName: 'is any of',
                test: (sourceValue: string, filterValue) => filterValue.indexOf(sourceValue) > -1,
                appliedLabel: (filter) => filter.filter.displayName + ' is ' + filter.value.join(' or ')
            }
        };
    }

}

