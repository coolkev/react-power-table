// THIS CODE IS GENERATED AUTOMATICALLY
// ANY MANUAL EDITS TO THIS FILE MAY GET OVERWRITTEN

import { QueryOptions, SelectOption, QueryDTO, QueryResult, DisplayValue } from './interfaces';
export { Column, DataTypes } from '../../../src/';
export { SelectOption, DisplayValue };

export function getOptionProvider(url: string, key: string) {

    return (input: string | number[], maxOptions?: number) => {

        const query: QueryOptions = {
            columnKey: key,
            take: maxOptions || 20,
            matchText: null,
            ids: null
        };
        if (typeof (input) == 'string') {
            query.matchText = input;

        } else {
            query.ids = input;
        }

        return executeRequest<SelectOption<any>[]>(url, query);
    }
}


export function executeQuery(url: string, query: QueryDTO): Promise<QueryResult> {

    return executeRequest<QueryResult>(url, query);
}

function executeRequest<T>(url: string, postData: any): Promise<T> {

    var options: RequestInit = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData),
        credentials: 'include'
    };

    return fetch(url, options).then(response => {

        if (response.ok) {
            var contentType = response.headers.get('Content-Type');
            if (!contentType.match(/application\/json/i)) {
                var msg = `Invalid Content-Type received. Expected 'application/json', was '${contentType}'`;
                throw new Error(msg);
            } else {
                return response.json() as any as T;
            }
        } else {
            throw new Error('Error');
        }
    });
}


export interface FieldDefinition {
    fieldName: string;
    displayName: string;
    filterable?: boolean;
    visible?: boolean;
    typeName: string;
    dataType: FieldDataType;

}

export enum FieldDataType {
    String = 1,
    Int = 2,
    Decimal = 3,
    Date = 4,
    DateTime = 5,
    Boolean = 6,
    Enum = 7,
    EntityRef = 8,
}
