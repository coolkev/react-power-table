import * as Select from 'react-select';
import { BooleanFilter } from './BooleanFilter';
import { DateFilter } from './DateFilter';
import { DecimalFilter } from './DecimalFilter';
import { FilterDefinition, FilterDefinitionOptionsOrFieldName, OperationDefinition } from './FilterDefinition';
import { IntFilter } from './IntFilter';
import { ListFilter } from './ListFilter';
import { RemoteListFilter, RemoteListOptionProvider } from './RemoteListFilter';
import { StringFilter } from './StringFilter';
import { TimeFilter } from './TimeFilter';

export * from './FilterDefinition';

//type Types = 'string' | 'boolean' | 'date' | 'decimal' | 'int';

const types = {
    string: StringFilter,
    boolean: BooleanFilter,
    date: DateFilter,
    decimal: DecimalFilter,
    int: IntFilter,
    list: ListFilter,
    remotelist: RemoteListFilter,
    timespan: TimeFilter,
};
type types = typeof types & { [key: string]: FilterDefinition<any> };

export function getFilterDefinition(type: 'string', options: FilterDefinitionOptionsOrFieldName): StringFilter;
export function getFilterDefinition(type: 'boolean', options: FilterDefinitionOptionsOrFieldName & { canBeNull: true }): BooleanFilter & { operations: { 'notnull': OperationDefinition<boolean>, 'null': OperationDefinition<boolean> } };
export function getFilterDefinition(type: 'boolean', options: FilterDefinitionOptionsOrFieldName): BooleanFilter;
export function getFilterDefinition(type: 'date', options: FilterDefinitionOptionsOrFieldName & { canBeNull: true }): DateFilter & { operations: { 'notnull': OperationDefinition<string>, 'null': OperationDefinition<string> } };
export function getFilterDefinition(type: 'date', options: FilterDefinitionOptionsOrFieldName): DateFilter;
export function getFilterDefinition(type: 'time', options: FilterDefinitionOptionsOrFieldName & { canBeNull: true }): TimeFilter & { operations: { 'notnull': OperationDefinition<string>, 'null': OperationDefinition<string> } };
export function getFilterDefinition(type: 'time', options: FilterDefinitionOptionsOrFieldName): TimeFilter;
export function getFilterDefinition(type: 'decimal', options: FilterDefinitionOptionsOrFieldName & { canBeNull: true }): DecimalFilter & { operations: { 'notnull': OperationDefinition<number>, 'null': OperationDefinition<number> } };
export function getFilterDefinition(type: 'decimal', options: FilterDefinitionOptionsOrFieldName): DecimalFilter;
export function getFilterDefinition(type: 'int', options: FilterDefinitionOptionsOrFieldName & { canBeNull: true }): IntFilter & { operations: { 'notnull': OperationDefinition<number>, 'null': OperationDefinition<number> } };
export function getFilterDefinition(type: 'int', options: FilterDefinitionOptionsOrFieldName): IntFilter;
export function getFilterDefinition(type: 'list', options: FilterDefinitionOptionsOrFieldName, items: ReadonlyArray<Select.Option>): ListFilter;
export function getFilterDefinition(type: 'remotelist', options: FilterDefinitionOptionsOrFieldName, optionProvider: RemoteListOptionProvider): RemoteListFilter;

export function getFilterDefinition(type: string, options: FilterDefinitionOptionsOrFieldName, items?: ReadonlyArray<Select.Option> | RemoteListOptionProvider) {

    return new types[type](options, items);
}

export const DataTypes = types;
