import * as React from 'react';
import shallowEqual from 'fbjs/lib/shallowEqual';
import { FilterDefinition } from "./filters/DataTypes/DataType";
import { Column } from "./ReactPowerTable";

export type GlobalDate = Date;
export const GlobalDate = Date;

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export { shallowEqual };

const debugMode = false;

export const debuglog = debugMode ? console.log : () => { };


export interface ColumnCore<T> {
    key: string | number;
    field: (row: T) => any;
    fieldName: string;
}

export function getColumnCore<T>(col: Column<T> | string): ColumnCore<T> {

    //let fieldName: string;
    //let field: (row) => any;

    if (typeof (col) == 'string') {
        return {
            key: col,
            field: row => row[col],
            fieldName: col,
        };
    }

    const { field, key } = col;
    if (typeof field === 'function') {
        const fieldName = getExpression(field);
        return {
            key: key || fieldName,
            field: field,
            fieldName: fieldName
        };
    }
    if (typeof (field) === "string") {
        return {
            key: key || field,
            field: row => row[field],
            fieldName: field,

        };
    }

    if (!key) {
        throw new Error('Must specify value for "key" if field is not used')
    }
    //    field = _row => null;

    return {
        key: key,
        field: _row => null,
        fieldName: null
    };

}

export function getExpression(func: Function): string {

    const expr = func.toString();

    let myregexp = /(?:return|\w+ => ).*\.(\w+);?/;
    let match = myregexp.exec(expr);
    if (match != null) {
        return match[1];
    }
    return null;
}

export function getComponentDisplayName(WrappedComponent: React.ComponentClass<any> | React.StatelessComponent<any>) {
    return WrappedComponent.displayName || (<any>WrappedComponent).name || 'Component';
}
export function makePure<T>(factory: React.StatelessComponent<T>): React.ComponentClass<T> {

    if (debugMode) {
        return class extends React.Component<T, never> {

            shouldComponentUpdate(nextProps: T) {
                var result = !shallowEqual(this.props, nextProps);
                debuglog('shouldComponentUpdate returned ' + result, this.props, nextProps);
                return result;
            }

            render() {
                return factory(this.props);
            }
        }
    } else {

        return class extends React.PureComponent<T, never> {

            render() {
                return factory(this.props);
            }
        }
    }
}

export interface SortArrayOptions {
    descending?: boolean;
    caseInsensitive?: boolean;
}
export function sortArray<T, TKey>(array: T[], property: string, options?: SortArrayOptions): T[];
export function sortArray<T, TKey>(array: T[], expression: (item: T) => TKey, options?: SortArrayOptions): T[];
export function sortArray<T, TKey>(array: T[], expressionOrProperty: string | ((item: T) => TKey), options?: SortArrayOptions): T[];
export function sortArray<T, TKey>(array: T[], expressionOrProperty: string | ((item: T) => TKey), options?: SortArrayOptions): T[] {

    const sortDirNum = options && options.descending ? -1 : 1;

    const expression = typeof (expressionOrProperty) === 'string' ? (m: any) => m[expressionOrProperty] : expressionOrProperty;

    if (options && options.caseInsensitive) {

        var sortFunc: (a: any, b: any) => number;

        return [...array].sort((a: any, b: any) => {
            var av = <any>expression(a);
            var bv = <any>expression(b);

            if (av == null) {
                if (bv == null) {
                    return 0;
                }
                else {
                    return -sortDirNum;
                }
            }
            else if (bv == null) {
                return sortDirNum;
            }

            if (!sortFunc) {

                const aType = typeof av;
                const bType = typeof bv;

                if (aType === bType && aType === 'string') {
                    sortFunc = (a, b) => {
                        return a.localeCompare(b, [], { sensitivity: 'base' }) * sortDirNum;

                    };

                }
                else {
                    sortFunc = (a, b) => {

                        return ((a < b) ? -sortDirNum : ((a > b) ? sortDirNum : 0));
                    }
                }

            }
            return sortFunc(av, bv);

        });
    }
    return [...array].sort((a: any, b: any) => {
        var av = expression(a);
        var bv = expression(b);
        return ((av < bv) ? -sortDirNum : ((av > bv) ? sortDirNum : 0));
    });

}


export function serializeFilters(filters: AppliedFilter<any>[]) {
    console.log('serializeFilters', filters);
    return filters.map(f => {
        const { filter, operation, value } = f;
        // const value = filter.dataType.key == 'string' ? '"' + f.Value + '"' : f.Value;
        // if (filter.canBeNull && (operation.key == 'null' || operation.key == 'notnull')) {
        //     return f.Column.Key + ' ' + f.Operation.key;
        // }
        //TODO: add serialize method to datatype
        return filter.fieldName + ' ' + operation.key + ' ' + value;


    }).join(' and ');

}

export function deSerializeFilters(filters: string, availableFilters: KeyedMap<FilterDefinition<any>>): AppliedFilter<any>[] {

    console.log('deSerializeFilters', filters);
    var myregexp = /(?:(.+?)\s+(eq|ne|gt|lt|contains|notcontains|between|in|notin|daterange|notnull|null)(?:\s+"?(.*?)"?)?(?:\s*$|\s+(?:or|and|not)\s+))/ig;
    var match = myregexp.exec(filters);

    var result: AppliedFilterDTO[] = [];
    while (match != null) {

        result.push({ key: match[1], operation: match[2], value: match[3] });

        match = myregexp.exec(filters);
    }

    return result.map(m => {

        const filter = availableFilters[m.key];

        if (filter) {
            const operation = filter.operations[m.operation];

            if (operation) {
                return { filter: filter, operation: operation, value: m.value };

            }
        }

        return null;
    }).filter(m => m != null);

}



export function groupBy<T, TKey>(items: T[], keyGen: (item: T, index?: number) => TKey): Group<T, TKey>[] {
    var result: Group<T, TKey>[] = [];
    for (var i = 0; i < items.length; i++) {
        var key = keyGen(items[i], i);
        var g = result.find(a => a.key === key);
        if (g == null) {
            g = {
                key: key,
                items: []
            };
            result.push(g);
        }
        g.items.push(items[i]);
    }

    return result;
}
export interface Group<T, TKey> {
    key: TKey; items: T[];
};


//export function createKeyedMap<T extends { key: string }, TObj extends ObjectMap<T>>(mapOrArray: TObj): KeyedMap<T> & TObj {
export function createKeyedMap<T, TObj extends ObjectMap<T>>(map: TObj): KeyedMap<T> & TObj;
export function createKeyedMap<T, TObj extends Keyed<T>[]>(array: Keyed<T>[]): KeyedMap<T>;
export function createKeyedMap<T, TObj extends Keyed<T>[]>(array: T[], keyField:(row:T)=> string): KeyedMap<T>;
export function createKeyedMap<T, TObj>(map: KeyedMap<T>): KeyedMap<T>;
export function createKeyedMap<T, TObj extends ObjectMap<T> | Keyed<T>[] | KeyedMap<T>>(mapOrArray: TObj, keyField?:(row:T)=> string) {

    if (Array.isArray(mapOrArray)) {
        const newMap = { all: mapOrArray } as KeyedMap<T> & TObj;
        mapOrArray.forEach(m => {

            const k = keyField && keyField(m) || m.key;
            if (newMap[k]) {
                throw new Error(`Duplicate key found '${k}'. Cannot create a keyed map with duplicate keys.`)
            }
            newMap[k] = m;
        });

        return newMap;
    }
    // if ((<KeyedMap<T>>mapOrArray).all) {
    //     //already a map        
    //     return mapOrArray;
    // }
    const all = <any>Object.keys(mapOrArray).filter(m=>m!='all').map(m => {
        const v = mapOrArray[m] as Keyed<T>;
        v.key = m;
        return v;
    });
    return { ...<any>mapOrArray, all };
}




export class Lazy<T> {

    private _value: T;    
    private func: () => T;
    constructor(func: () => T) {
        
        this.func = () => {
            
            this.func = () => this._value;
            return this._value = func();
            
        }
    }

    public get value(): T {
        return this.func();
    }
}
