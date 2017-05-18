import { QueryOptions, SelectOption, QueryDTO, QueryResult } from './interfaces';
export { Column, DataTypes } from '../../../src/';
export { SelectOption };
    
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