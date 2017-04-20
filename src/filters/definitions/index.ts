import { String } from './String';
import { Boolean } from './Boolean';
import { Date } from './Date';
import { Decimal } from './Decimal';
import { Int } from './Int';
import { List } from './List';
import { FilterDefinition } from "./FilterDefinition";
export * from "./FilterDefinition";

const types = {
    'string': String,
    'boolean': Boolean,
    'date': Date,
    'decimal': Decimal,
    'int': Int,
    'list': List,
}
type types = typeof types & { [key: string]: FilterDefinition<any> };
export const DataTypes = types;

