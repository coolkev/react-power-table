/// <reference types="react" />
import * as React from 'react';
export interface NumericInputProps extends React.HTMLProps<HTMLInputElement> {
    initialValue: number | string;
    onValueChange: (newValue: number) => void;
    allowDecimal?: boolean;
}
export interface NumericInputState {
    value: string;
}
export declare class NumericInput extends React.Component<NumericInputProps, NumericInputState> {
    constructor(props: NumericInputProps & React.HTMLProps<HTMLInputElement>);
    private isValid();
    componentWillReceiveProps(nextProps: NumericInputProps): void;
    private onChange(e);
    private onKeyPress(evt);
    render(): JSX.Element;
}
