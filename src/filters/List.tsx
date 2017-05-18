﻿import * as React from 'react';
import * as PowerTable from "./FilterDefinition";
import * as Select from 'react-select';
//import { CustomSelectValue } from '../components/CustomSelectValue';

export interface SelectOption<T extends string | number> {
    label: string;
    value: T;
}
export class List<T extends string | number = string> extends PowerTable.FilterDefinition<T[]>
{

    private deserializeFunc?: (str: string) => T;

    constructor(options: PowerTable.FilterDefinitionOptionsOrFieldName, private items: SelectOption<T>[], deserializeFunc?: (str: string)=>T) {

        super(options);

        if (deserializeFunc) {
            this.deserializeFunc = deserializeFunc;
        }
        else if (items.length>0) {
            if (typeof (items[0].value) === 'number') {
                this.deserializeFunc = v => parseInt(v) as any;                
            }
            else {
                this.deserializeFunc = v => v as any;        
            }
        }

        this.filterComponent = (props) => <Select value={
            props.value ? props.value : []} multi
            options={items}
            onChange={(e: SelectOption<T>[]) => props
                .onValueChange(e.map(m => m.value))}
            /*valueComponent={CustomSelectValue as any}  */
            className="small" />

        //this.defaultFormat = (filter) => filter.filter.displayName + ' ' + filter.operation.displayName + ' "' + filter.value + '"'
    }

    public readonly operations = this.getOperations();

    private getOperations(): PowerTable.ObjectMap<PowerTable.OperationDefinition<T[]>> {
        return {
            'in': {
                key: 'in',
                displayName: 'is any of',
                test: (sourceValue: any, filterValue) => filterValue.indexOf(sourceValue) > -1,
                appliedLabel: (filter) => filter.filter.displayName + ' is ' + getSelectedLabels(filter.value, this.items).join(' or ')
            }
        };
    }

    serializeValue(value: T[]) {
        return Array.isArray(value) ? value.join(' ') : value;
    }

    deSerializeValue(value: string): T[] {
        return value.split(' ').map(m=>this.deserializeFunc(m));
    }


}


function getSelectedLabels<T extends string | number>(values: T[], items: SelectOption<T>[]) {
    return values.map(m => {
        const i = items.find(o => (o.value===undefined ? o.label :o.value) == m);

        return i && '"' + i.label + '"';
    }).filter(m => m);

}