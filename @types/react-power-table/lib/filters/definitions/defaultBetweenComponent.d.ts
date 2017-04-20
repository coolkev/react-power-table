/// <reference types="react" />
import * as PowerTable from './FilterDefinition';
export declare const BetweenFilterComponent: (props: PowerTable.FilterComponentProps<any>) => JSX.Element;
export declare const BetweenAppliedFilterLabel: (filter: PowerTable.AppliedFilter<any>) => string;
export declare const BetweenApplyFilterTest: (parseValue: (value: any) => any, filterValue: string) => <T>(source: any, _filterValue: T) => boolean;
