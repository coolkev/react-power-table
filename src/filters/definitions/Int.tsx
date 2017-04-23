import * as React from 'react';
import { FilterDefinition, FilterDefinitionOptionsOrFieldName, ObjectMap, OperationDefinition } from "./FilterDefinition";
import { NumericInput } from "../../components/NumericInput";


//const dataType = 'int';
export class Int extends FilterDefinition<number>
{

    //static readonly dataType = dataType;
    constructor(options: FilterDefinitionOptionsOrFieldName) {

        super(options);
        
        this.filterComponent = (props) => {

            const { value, onValueChange, filter, operation, onEnterKeyPress, ...rest } = props;

            return <NumericInput type="number" initialValue={value} onValueChange={v => onValueChange(v)} autoFocus className="form-control input-sm" onKeyPress={(e) => { if (e.charCode == 13) onEnterKeyPress() }} {...rest} />
        }
            
               
        
    }

    protected getOperations(): ObjectMap<OperationDefinition<number>> {
        return this.defaultOperations;
    }

    parseValue(str: string) {
        return parseInt(str);
    }
}

