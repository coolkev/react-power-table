﻿import * as React from 'react';
import { FilterDefinition } from "./DataType";
import * as Select from 'react-select';
import { CustomSelectValue } from '../../components/CustomSelectValue';

//const valueDelimiter = ';';


export class List extends FilterDefinition<string[]>
{


    constructor(options: FilterDefinitionOptionsOrFieldName, items: Select.Option[]) {

        super(options);


        this.filterComponent = (props) => <Select value={
            props.value ? props.value : []} multi
            options={items}
            onChange={(e: Select.Option[]) => props
                .onValueChange(e.map(m => m.value as string || m.label  ))}
            valueComponent={CustomSelectValue as any} className="small" />

            //this.defaultFormat = (filter) => filter.filter.displayName + ' ' + filter.operation.displayName + ' "' + filter.value + '"'
    }
    protected getOperations(): ObjectMap<OperationDefinition<string[]>> {
        return {
            'in': {
                key: 'in',
                displayName: 'is any of',
                test: (sourceValue: string, filterValue) => filterValue.indexOf(sourceValue) > -1,
                appliedFilterLabel: (filter) => filter.filter.displayName + ' is ' + filter.value.join(' or ')
            }
        };
    }

}

