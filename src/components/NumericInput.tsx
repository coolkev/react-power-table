import * as React from 'react';

// export interface NumericInputProps extends React.HTMLProps<HTMLInputElement> {

//     initialValue: number | string;
//     onValueChange: (newValue: number) => void;
//     onValueChangeInvalid?: (newValue: any) => void;
//     allowDecimal?: boolean;
//     //onEnterKeyPress?: () => void;
//     invalid?: boolean;
// }

// interface NumericInputState {
//     value: string;
// }
// export const NumericInput: React.ComponentClass<NumericInputProps> = class extends React.Component<NumericInputProps, NumericInputState> {

//     constructor(props: NumericInputProps & React.HTMLProps<HTMLInputElement>) {
//         super(props);

//         const initialValue: any = props.initialValue;

//         this.state = { value: initialValue };
//         this.onChange = this.onChange.bind(this);
//         this.onKeyPress = this.onKeyPress.bind(this);
//     }

//     private isValid() {

//         return !isNaN(this.props.allowDecimal ? parseFloat(this.state.value) : parseInt(this.state.value, 10));
//     }
//     componentWillReceiveProps(nextProps: NumericInputProps) {
//         if (nextProps.initialValue !== this.props.initialValue) {
//             this.setState({ value: nextProps.initialValue as any });
//         }
//     }
//     private onChange(e: React.FormEvent<HTMLInputElement>) {

//         const ivalue = this.props.allowDecimal ? parseFloat(e.currentTarget.value) : parseInt(e.currentTarget.value, 10);

//         const isValid = !isNaN(ivalue);
//         if (isValid) {
//             this.props.onValueChange(ivalue);
//         } else if (this.props.onValueChangeInvalid) {
//             this.props.onValueChangeInvalid(e.currentTarget.value);
//         }

//         this.setState({ value: e.currentTarget.value });

//     }

//     private onKeyPress(evt: React.KeyboardEvent<HTMLInputElement>) {
//         //console.log('onKeyPress which: ' + evt.which, evt);
//         if (this.props.onKeyPress) {
//             this.props.onKeyPress(evt);
//         }

//         if (evt.metaKey || evt.which <= 0 || evt.which === 8 || evt.which === 45 || (evt.which >= 48 && evt.which <= 57) || (evt.which === 46 && this.props.allowDecimal)) {
//         } else {
//             // if (evt.charCode === 13 && this.props.onEnterKeyPress) {
//             //     this.props.onEnterKeyPress();
//             // }
//             evt.preventDefault();
//         }
//     }
//     render() {

//         const { initialValue, onValueChange, onValueChangeInvalid, allowDecimal, invalid, ...rest } = this.props;

//         return <span className={!invalid && this.isValid() ? null : 'has-error'}><input type="text" {...rest} value={this.state.value} onKeyPress={this.onKeyPress} onChange={this.onChange} /></span>;

//     }
// };


export type NumericInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    allowDecimal?: boolean;
    allowNegative?: boolean;
    invalid?: boolean;
    value?: string | number;
};

export const NumericInput = ({ allowDecimal, allowNegative, invalid, onKeyPress, children, value, ...rest }:  NumericInputProps) => {

    const handleKeyPress = React.useCallback((evt: React.KeyboardEvent<any>) => {

        if (onKeyPress) {
            onKeyPress(evt);
        }
        if (evt.metaKey || evt.which <= 0 || evt.which === 8 || (evt.which >= 48 && evt.which <= 57) || (allowNegative && evt.which === 45) || (evt.which === 46 && allowDecimal)) {
        } else {
            evt.preventDefault();
        }
    }, [allowDecimal, allowNegative, onKeyPress]);

    const isValid = !isNaN(allowDecimal ? parseFloat(value as string) : parseInt(value as string, 10));;

    return <span className={!invalid && isValid ? null : 'has-error'}><input type="text" {...rest} value={value} onKeyPress={handleKeyPress} /></span>;

};