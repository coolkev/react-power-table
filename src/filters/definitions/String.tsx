import * as React from 'react';
import * as FormControl from 'react-bootstrap/lib/FormControl';
import * as PowerTable from './FilterDefinition';

export class String extends PowerTable.FilterDefinition<string>
{

    constructor(options: PowerTable.FilterDefinitionOptionsOrFieldName) {

        super(options);

        this.filterComponent = (props) => <FormControl value={props.value} autoFocus onChange={(e: React.FormEvent<FormControl & HTMLInputElement>) => props.onValueChange(e.currentTarget.value)}
        onKeyPress={(e) => { if (e.charCode==13) props.onEnterKeyPress()}}/>

        this.appliedLabel = (filter) => filter.filter.displayName + ' ' + filter.operation.displayName + ' "' + filter.value + '"'
    }

    protected getOperations() {
        return {
            'contains': { key: 'contains', displayName: 'contains', test: (source, value) => source.indexOf && source.toLowerCase().indexOf(value) > -1 },
            'notcontains': {key: 'notcontains', displayName: 'does not contain', test: (source, value) => source.indexOf && source.toLowerCase().indexOf(value) == -1 },
            'eq': this.defaultOperations.eq,
            'ne': this.defaultOperations.ne
        };
    }


    serializeValue(value: string) {
        if (value && value.startsWith('"') && value.endsWith('"')) {
            return value.substring(1, value.length - 2);
        }
        return value;
    }    
    
    deSerializeValue(value: string): string {
        return value as any;
    }    
    
    public applyFilter<TData>(data: TData[],  operation: PowerTable.OperationDefinition<string>, value: string) {

        const valueLower = value.toLowerCase();
        return super.applyFilter(data, operation, valueLower);
    }

}
