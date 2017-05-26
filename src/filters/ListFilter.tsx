import * as React from 'react';
import * as Select from 'react-select';
import * as PowerTable from './FilterDefinition';
//import { CustomSelectValue } from '../components/CustomSelectValue';

export interface SelectOption<T extends string | number> {
    label: string;
    value: T;
}
export class ListFilter<T extends string | number = string> extends PowerTable.FilterDefinition<T[]> {

    private deserializeFunc?: (str: string) => T;
    public readonly operations = this.getOperations();

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
            const { autoFocus, value, onEnterKeyPress, onValueChange, children, filter, operation, ...rest } = props;

            return (
                <Select
                    {...rest}
                    value={props.value ? props.value : []}
                    multi
                    options={items}
                    // tslint:disable-next-line:jsx-no-lambda
                    onChange={(e: Array<SelectOption<T>>) => props.onValueChange(e.map((m) => m.value))}
                    autofocus={autoFocus}
                />);
        };
        this.filterComponent.defaultProps = {
            className: 'small',
            autoFocus: true
        };
    }
    private getOperations(): PowerTable.ObjectMap<PowerTable.OperationDefinition<T[]>> {
        return {
            in: {
                key: 'in',
                displayName: 'is any of',
                test: (sourceValue: any, filterValue) => filterValue.indexOf(sourceValue) > -1,
                appliedLabel: (filter) => filter.filter.displayName + ' is ' + getSelectedLabels(filter.value, this.items).join(' or '),
            },
        };
    }

    serializeValue(value: T[]) {
        return Array.isArray(value) ? value.join(' ') : value;
    }

    deSerializeValue(value: string): T[] {
        return value.split(' ').map((m) => this.deserializeFunc(m));
    }
}

function getSelectedLabels<T extends string | number>(values: T[], items: Array<SelectOption<T>>) {
    return values.map((m) => {
        const i = items.find((o) => (o.value === undefined ? o.label : o.value) === m);

        return i && '"' + i.label + '"';
    }).filter((m) => m);

}
