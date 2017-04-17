/// <reference types="react" />
import { FilterDefinition } from "./DataType";
export declare class Date extends FilterDefinition<string> {
    constructor(options: FilterDefinitionOptionsOrFieldName);
    parseValue(str: string): string;
    protected getOperations(): {
        eq: {} & {
            key: string;
        } & OperationDefinition<any>;
        lt: {
            displayName: string;
            key: string;
            appliedFilterLabel?(filter: AppliedFilter<any>): string | Promise<string>;
            filterComponent?: (props: FilterComponentProps<any>) => JSX.Element;
            radioButtonLabel?: (props: RadioButtonLabelProps<any>) => JSX.Element;
            test(source: any, filterValue: any): boolean;
        };
        gt: {
            displayName: string;
            key: string;
            appliedFilterLabel?(filter: AppliedFilter<any>): string | Promise<string>;
            filterComponent?: (props: FilterComponentProps<any>) => JSX.Element;
            radioButtonLabel?: (props: RadioButtonLabelProps<any>) => JSX.Element;
            test(source: any, filterValue: any): boolean;
        };
        between: {} & {
            key: string;
        } & OperationDefinition<any>;
    };
}
