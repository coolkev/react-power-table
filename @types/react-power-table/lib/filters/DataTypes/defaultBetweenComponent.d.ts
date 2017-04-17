/// <reference types="react" />
export declare const BetweenFilterComponent: (props: FilterComponentProps<any>) => JSX.Element;
export declare const BetweenAppliedFilterLabel: (filter: AppliedFilter<any>) => string;
export declare const BetweenApplyFilterTest: (parseValue: (value: any) => any, filterValue: string) => <T>(source: any, _filterValue: T) => boolean;
