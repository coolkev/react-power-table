import { FilterDefinition } from "./DataType";
export declare class Decimal extends FilterDefinition<number> {
    constructor(options: FilterDefinitionOptionsOrFieldName);
    protected getOperations(): ObjectMap<Keyed<{}>> & {
        all: Keyed<{}>[];
    } & ObjectMap<OperationDefinition<any>>;
    parseValue(str: string): number;
}
