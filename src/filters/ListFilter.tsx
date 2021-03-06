﻿import * as React from 'react';
import Select from 'react-select';
import * as PowerTable from './FilterDefinition';
import { nullableOperations } from './FilterDefinition';
//import { CustomSelectValue } from '../components/CustomSelectValue';

export interface SelectOption<T extends string | number> {
    label: string;
    value: T;
}
export class ListFilter<T extends string | number = string> extends PowerTable.FilterDefinition<ReadonlyArray<T>> {

    private deserializeFunc?: (str: string) => T;
    public operations = this.getOperations();

    constructor(options: PowerTable.FilterDefinitionOptionsOrFieldName, private items: Array<SelectOption<T>>, deserializeFunc?: (str: string) => T) {

        super(options);

        if (deserializeFunc) {
            this.deserializeFunc = deserializeFunc;
        } else if (items.length > 0) {
            if (typeof (items[0].value) === 'number') {
                this.deserializeFunc = (v) => parseInt(v, 10) as any;
            } else {
                this.deserializeFunc = (v) => v as any;
            }
        }

        this.filterComponent = (props) => {
            const { autoFocus, value, onValueChange, children, filter, operation, invalid, ...rest } = props;

            return (
                <Select
                    {...rest}
                    value={props.value ? props.value : []}
                    multi
                    options={this.items}
                    // tslint:disable-next-line:jsx-no-lambda
                    onChange={(e: Array<SelectOption<T>>) => props.onValueChange(e.map((m) => m.value))}
                    autoFocus={autoFocus}
                    className={invalid ? 'has-error ' + rest.className : rest.className}
                />);
        };
        this.filterComponent.defaultProps = {
            className: 'small',
            autoFocus: true
        };
    }
    private getOperations(): PowerTable.ObjectMap<PowerTable.OperationDefinition<ReadonlyArray<T>>> {
        return {
            in: {
                key: 'in',
                displayName: 'is any of',
                test: (sourceValue: any, filterValue) => filterValue.indexOf(sourceValue) > -1,
                appliedLabel: (filter) => filter.filter.displayName + ' is ' + getSelectedLabels(filter.value, this.items).join(' or '),
                isValid: v => v as any !== '' && v.length !== 0,
            },
            notin: {
                key: 'notin',
                displayName: 'is not any of',
                test: (sourceValue: any, filterValue) => filterValue.indexOf(sourceValue) === -1,
                appliedLabel: (filter) => filter.filter.displayName + ' is not ' + getSelectedLabels(filter.value, this.items).join(' or '),
                isValid: v => v as any !== '' && v.length !== 0,
            },
            ...(this.canBeNull && nullableOperations<ReadonlyArray<T>>())
        };
    }

    serializeValue(value: ReadonlyArray<T>) {
        return Array.isArray(value) ? value.join(' ') : value as unknown as string;
    }

    deSerializeValue(value: string): ReadonlyArray<T> {
        return value.split(' ').map((m) => this.deserializeFunc(m));
    }
}

function getSelectedLabels<T extends string | number>(values: ReadonlyArray<T>, items: ReadonlyArray<SelectOption<T>>) {
    return values.map((m) => {
        const i = items.find((o) => (o.value === undefined ? o.label : o.value) === m);

        return i && '"' + i.label + '"';
    }).filter((m) => m);

}
