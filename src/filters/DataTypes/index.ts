import { String } from './String';
import { Boolean } from './Boolean';
import { Date } from './Date';
import { Decimal } from './Decimal';
import { Int } from './Int';
import { List } from './List';
import { FilterDefinition } from "./DataType";
export { FilterDefinition } from "./DataType";

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
