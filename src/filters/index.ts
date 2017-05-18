import { String } from './String';
import { Boolean } from './Boolean';
import { Date } from './Date';
import { Decimal } from './Decimal';
import { Int } from './Int';
import { List } from './List';
import { RemoteList,RemoteListOptionProvider } from './RemoteList';
import { FilterDefinition, FilterDefinitionOptionsOrFieldName,OperationDefinition } from "./FilterDefinition";
import * as Select from 'react-select';

export * from "./FilterDefinition";

//type Types = 'string' | 'boolean' | 'date' | 'decimal' | 'int';


const types = {
    'string': String,
    'boolean': Boolean,
    'date': Date,
    'decimal': Decimal,
    'int': Int,
    'list': List,
    'remotelist': RemoteList
}
type types = typeof types & { [key: string]: FilterDefinition<any> };

export function getFilterDefinition(type: 'string', options: FilterDefinitionOptionsOrFieldName): String;
export function getFilterDefinition(type: 'boolean', options: FilterDefinitionOptionsOrFieldName & { canBeNull: true }): Boolean & { operations: { "notnull": OperationDefinition<boolean>, "null": OperationDefinition<boolean> } };
export function getFilterDefinition(type: 'boolean', options: FilterDefinitionOptionsOrFieldName): Boolean;
export function getFilterDefinition(type: 'date', options: FilterDefinitionOptionsOrFieldName & { canBeNull: true }): Date & { operations: { "notnull": OperationDefinition<string>, "null": OperationDefinition<string> } };
export function getFilterDefinition(type: 'date', options: FilterDefinitionOptionsOrFieldName): Date;
export function getFilterDefinition(type: 'decimal', options: FilterDefinitionOptionsOrFieldName & { canBeNull: true }): Decimal & { operations: { "notnull": OperationDefinition<number>, "null": OperationDefinition<number> } };
export function getFilterDefinition(type: 'decimal', options: FilterDefinitionOptionsOrFieldName): Decimal;
export function getFilterDefinition(type: 'int', options: FilterDefinitionOptionsOrFieldName & { canBeNull: true }): Int & { operations: { "notnull": OperationDefinition<number>, "null": OperationDefinition<number> } };
export function getFilterDefinition(type: 'int', options: FilterDefinitionOptionsOrFieldName): Int;
export function getFilterDefinition(type: 'list', options: FilterDefinitionOptionsOrFieldName, items: Select.Option[]): List;
export function getFilterDefinition(type: 'remotelist', options: FilterDefinitionOptionsOrFieldName, optionProvider: RemoteListOptionProvider): RemoteList;

export function getFilterDefinition(type: string, options: FilterDefinitionOptionsOrFieldName, items?: Select.Option[] | RemoteListOptionProvider) {
    
    return new types[type](options, items);
}

export const DataTypes = types;

