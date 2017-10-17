import * as React from 'react';

/**
 * @module react-power-table/lib/utils
 *  Utility functions
 */

/**
 * Format a number with comma for thousands separator2
 */
export function numberWithCommas(x: any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const debugMode = false;

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x: any, y: any) {
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
 * @internal
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
export function shallowEqual<T extends any>(objA: T, objB: T, ...excludeProps: Array<keyof T>) {
    if (is(objA, objB)) {
        return true;
    }

    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        debuglog('values are null', objA, objB);
        return false;
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        debuglog('objects do not have same keys', keysA, keysB);
        return false;
    }

    if (excludeProps.length) {
        // Test for A's keys different from B.
        for (const key of keysA) {
            if (excludeProps.indexOf(key as any) === -1 && (!hasOwnProperty.call(objB, key) || !is(objA[key], objB[key]))) {

                return false;
            }
        }
    } else {
        for (const key of keysA) {
            if (!hasOwnProperty.call(objB, key) || !is(objA[key], objB[key])) {

                return false;
            }
        }
    }
    return true;
}

/**
 * @internal
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
export function shallowDiff<T extends any>(objA: T, objB: T, ...excludeProps: Array<keyof T>) {
    if (is(objA, objB)) {
        return [];
    }

    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        debuglog('values are null', objA, objB);
        return [{ 'values are null': [objA, objB] }];
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        //debuglog('objects do not have same keys', keysA, keysB);
        return [{ 'objects do not have same keys': [keysA, keysB] }];
    }

    const result = {} as any;
    if (excludeProps.length) {
        // Test for A's keys different from B.
        for (const key of keysA) {
            if (excludeProps.indexOf(key as any) === -1 && (!hasOwnProperty.call(objB, key) || !is(objA[key], objB[key]))) {
                result[key] = [objA[key], objB[key]];
            }
        }
    } else {
        for (const key of keysA) {
            if (!hasOwnProperty.call(objB, key) || !is(objA[key], objB[key])) {
                //result = [...result, [key, objA[key], objB[key]]];
                result[key] = [objA[key], objB[key]];
            }
        }
    }
    return result;
}

// if (result) {
//     const fields = distinct(Object.keys(this.props).concat(Object.keys(nextProps)));
//     for (const f of fields) {

//         const v1 = this.props[f];
//         const v2 = nextProps[f];

//         if (Array.isArray(v1) || Array.isArray(v2)) {
//             if (v1.length !== v2.length) {
//                 debuglog('returned true arrays different length field: ' + f, v1, v2);
//             }
//             for (let x = 0; x < v1.length; x++) {
//                 if (!shallowEqual(v1[x], v2[x])) {
//                     debuglog('returned true array values changed field: ' + f, v1[x], v2[x]);

//                 }
//             }

//         } else {
//             const result2 = shallowEqual(v1, v2);

//             if (!result2) {
//                 debuglog('returned true ' + f + ' changed', v1, v2);
//             }
//         }
//     }

// }

/**
 * @internal
 */
export const debuglog = debugMode ? console.log : () => { };

/** @internal */
export function getComponentDisplayName(WrappedComponent: React.ComponentType<any>) {
    return WrappedComponent.displayName || (WrappedComponent as any).name || 'Component';
}

interface PureOptions<T> {
    componentName?: string;
    deeperCompareProps?: keyof T | Array<keyof T>;

    exclude?: keyof T | Array<keyof T | 'children'>;
    //compareChildren?: boolean;
}
/** @internal */
export function makePure<T extends { children?: React.ReactNode, [key: string]: any }>(Component: React.ComponentType<T>, options?: PureOptions<T>): React.ComponentClass<T> {

    const componentName = options && options.componentName || Component.displayName || '(No Name)';
    const deeperCompareProps = options && options.deeperCompareProps ? (Array.isArray(options.deeperCompareProps) ? options.deeperCompareProps : [options.deeperCompareProps]) : [];
    const exclude = options && options.exclude ? (Array.isArray(options.exclude) ? options.exclude : [options.exclude]) : [];
    //const compareChildren = options && options.compareChildren;

    if (!Component.displayName && options && options.componentName) {
        Component.displayName = componentName;
    }
    if (debugMode || deeperCompareProps.length || exclude.length) {
        return class extends React.Component<T, never> {

            static displayName = `PureWrapped(${componentName})`;

            shouldComponentUpdate(nextProps: T) {
                const equal = shallowEqual(this.props, nextProps, ...deeperCompareProps, ...exclude
                    //,...(compareChildren ? ['children' as any]: [])
                );
                if (!equal) {
                    debuglog(componentName + ' shouldComponentUpdate returned true because props changed', shallowDiff(this.props, nextProps, ...deeperCompareProps));
                    return true;
                }

                for (const key of deeperCompareProps) {

                    if (!is(this.props[key as any], nextProps[key])) {
                        const innerEqual = shallowEqual(this.props[key], nextProps[key]);

                        if (!innerEqual) {
                            debuglog(componentName + ' shouldComponentUpdate returned true because props.' + key + ' changed', shallowDiff(this.props[key], nextProps[key]));
                            return true;
                        }
                    }
                }

                // if (compareChildren) {

                //     return !compareChildrenRecursive(this.props.children, nextProps.children);
                //     // const currentChildren = React.Children.toArray(this.props.children);
                //     // const nextChildren = React.Children.toArray(nextProps.children);

                //     // if (currentChildren.length !== nextChildren.length) {
                //     //     return true;
                //     // }

                //     // for (let x = 0; x < currentChildren.length; x++) {
                //     //     const currentChild = currentChildren[x];
                //     //     const nextChild = nextChildren[x];

                //     //     if (currentChild !== nextChild && React.isValidElement(currentChild) && React.isValidElement(nextChild)) {

                //     //         if (currentChild.type !== nextChild.type || currentChild.key !== nextChild.key || !shallowEqual(currentChild.props, nextChild.props)) {

                //     //             debuglog(componentName + ' shouldComponentUpdate returned true because child changed', { currentChild, nextChild });
                //     //             return true;

                //     //         }

                //     //     }
                //     // }

                // }

                return false;
            }

            render() {
                //debuglog('pure render', this.props);
                return React.createElement(Component, this.props);
            }
        };
    } else {

        return class extends React.PureComponent<T, never> {
            static displayName = `PureWrapped(${componentName})`;

            render() {
                //debuglog('pure render', this.props);
                return React.createElement(Component, this.props);
            }
        };
    }
}

/** returns true if children are equal */
// function compareChildrenRecursive(current: React.ReactNode, next: React.ReactNode) {
//     const currentChildren = React.Children.toArray(current);
//     const nextChildren = React.Children.toArray(next);

//     if (currentChildren.length !== nextChildren.length) {
//         return true;
//     }

//     for (let x = 0; x < currentChildren.length; x++) {
//         const currentChild = currentChildren[x];
//         const nextChild = nextChildren[x];

//         if (currentChild !== nextChild && React.isValidElement<{ children?: React.ReactNode }>(currentChild) && React.isValidElement<{ children?: React.ReactNode }>(nextChild)) {

//             if (currentChild.type !== nextChild.type || currentChild.key !== nextChild.key || !shallowEqual(currentChild.props, nextChild.props, 'children')) {

//                 debuglog('shouldComponentUpdate returned true because child changed', { currentChild, nextChild });
//                 return false;

//             }

//             if (currentChild.props.children) {
//                 if (!compareChildrenRecursive(currentChild.props.children, nextChild.props.children)) {
//                     return false;
//                 }
//             }
//         }

//     }

//     return true;
// }
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

        let sortFunc: (a: any, b: any) => number;

        return [...array].sort((a: any, b: any) => {
            const av = expression(a) as any;
            const bv = expression(b) as any;

            if (av == null) {
                if (bv == null) {
                    return 0;
                } else {
                    return -sortDirNum;
                }
            } else if (bv == null) {
                return sortDirNum;
            }

            if (!sortFunc) {

                const aType = typeof av;
                const bType = typeof bv;

                if (aType === bType && aType === 'string') {
                    sortFunc = (x, y) => {
                        return x.localeCompare(y, [], { sensitivity: 'base' }) * sortDirNum;

                    };

                } else {
                    sortFunc = (x, y) => {

                        return ((x < y) ? -sortDirNum : ((x > y) ? sortDirNum : 0));
                    };
                }

            }
            return sortFunc(av, bv);

        });
    }
    return [...array].sort((a: any, b: any) => {
        const av = expression(a);
        const bv = expression(b);
        return ((av < bv) ? -sortDirNum : ((av > bv) ? sortDirNum : 0));
    });

}

export function groupBy<T, TKey>(items: T[], keyGen: (item: T, index?: number) => TKey): Array<Group<T, TKey>> {
    const result: Array<Group<T, TKey>> = [];
    for (let i = 0; i < items.length; i++) {
        const key = keyGen(items[i], i);
        let g = result.find((a) => a.key === key);
        if (g == null) {
            g = {
                key,
                items: [],
            };
            result.push(g);
        }
        g.items.push(items[i]);
    }

    return result;
}
export interface Group<T, TKey> {
    key: TKey; items: T[];
}

export function objectMapToArray<T>(mapOrArray: { [key: string]: T } | T[]): T[] {

    if (Array.isArray(mapOrArray)) {
        return mapOrArray;
    }
    return Object.keys(mapOrArray).map((key) => mapOrArray[key]);
}

export class Lazy<T> {

    private _value: T;
    private lazyValue: () => T;
    constructor(private func: () => T) {

        //const actualFunc = func;

        this.lazyValue = () => {

            this._value = this.func();
            this.lazyValue = () => this._value;
            return this._value;

        };
    }

    public get value(): T {
        return this.lazyValue();
    }
}
