import * as React from 'react';
import { FilterDefinition, FilterDefinitionOptionsOrFieldName } from "./FilterDefinition";
import { NumericInput } from "../../components/NumericInput";

export class Decimal extends FilterDefinition<number>
{
 constructor(options: FilterDefinitionOptionsOrFieldName) {

        super(options);
        

        this.filterComponent = (props) => {

            const { value, onValueChange, filter, operation, onEnterKeyPress, ...rest } = props;

            return <NumericInput type="number" initialValue={value} onValueChange={v => onValueChange(v)} autoFocus className="form-control input-sm" onKeyPress={(e) => { if (e.charCode == 13) onEnterKeyPress() }} {...rest} />
        }


    }


    protected getOperations() {
        return this.defaultOperations;
    }


    parseValue(str: string) {
        return parseFloat(str);
    }
}

