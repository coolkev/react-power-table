import * as React from 'react';
//import * as shallowEqual from 'fbjs/lib/shallowEqual';
import * as PowerTable from "./filters/definitions/FilterDefinition";
import { Column } from "./ReactPowerTable";


const debugMode = false;


export type GlobalDate = Date;
export const GlobalDate = Date;

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//export { shallowEqual };

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
export function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}


// export function shallowEqual(a, b) {
//     return a != b;
// }


/**
  * @internal
  */
export const debuglog = debugMode ? console.log : () => { };


export interface ColumnCore<T> {
    key: string | number;
    field: (row: T) => any;
    fieldName: string;
    headerText: string;
}

export function getColumnCore<T>(col: Column<T> | string): ColumnCore<T> {

    //let fieldName: string;
    //let field: (row) => any;

    if (typeof (col) == 'string') {
        return {
            key: col,
            field: row => row[col],
            fieldName: col,
            headerText: col,
        
        };
    }

    const { field, key } = col;
    if (typeof field === 'function') {
        const fieldName = getExpression(field);
        return {
            key: key || fieldName,
            field: field,
            fieldName: fieldName,
            headerText: fieldName
        };
    }
    if (typeof (field) === "string") {
        return {
            key: key || field,
            field: row => row[field],
            fieldName: field,
            headerText: field

        };
    }

    if (!key) {
        throw new Error('Must specify value for "key" if field is not used')
    }
    //    field = _row => null;

    return {
        key: key,
        field: _row => null,
        fieldName: null,
        headerText: null
        
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
export function createKeyedMap<T, TObj extends PowerTable.ObjectMap<T>>(map: TObj): PowerTable.KeyedMap<T> & TObj;
export function createKeyedMap<T, TObj extends PowerTable.Keyed<T>[]>(array: PowerTable.Keyed<T>[]): PowerTable.KeyedMap<T>;
export function createKeyedMap<T, TObj extends PowerTable.Keyed<T>[]>(array: T[], keyField:(row:T)=> string): PowerTable.KeyedMap<T>;
export function createKeyedMap<T, TObj>(map: PowerTable.KeyedMap<T>): PowerTable.KeyedMap<T>;
export function createKeyedMap<T, TObj extends PowerTable.ObjectMap<T> | PowerTable.Keyed<T>[] | PowerTable.KeyedMap<T>>(mapOrArray: TObj, keyField?:(row:T)=> string) {

    if (Array.isArray(mapOrArray)) {
        const newMap = { all: mapOrArray } as PowerTable.KeyedMap<T> & TObj;
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
        const v = mapOrArray[m] as PowerTable.Keyed<T>;
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
