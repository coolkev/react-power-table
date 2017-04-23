import * as React from 'react';


export interface NumericInputProps extends React.HTMLProps<HTMLInputElement> {
    
    initialValue: number | string;
    onValueChange: (newValue: number) => void;
    allowDecimal?: boolean;
}


/**
  * @internal
  */
export interface NumericInputState {
    value: string;
}
export const NumericInput : React.ComponentClass<NumericInputProps> = class NumericInput extends React.Component<NumericInputProps, NumericInputState> {

    constructor(props: NumericInputProps & React.HTMLProps<HTMLInputElement>) {
        super(props);

        const initialValue: any = props.initialValue;

        this.state = { value: initialValue };
        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    private isValid() {

        return !isNaN(parseInt(this.state.value));
    }
    componentWillReceiveProps(nextProps: NumericInputProps) {
        if (nextProps.initialValue != this.props.initialValue) {
            this.setState({ value: nextProps.initialValue as any });
        }
    }
    private onChange(e: React.FormEvent<HTMLInputElement>) {

        const ivalue = parseInt(e.currentTarget.value);

        const isValid = !isNaN(ivalue);
        if (isValid) {
            this.props.onValueChange(ivalue);
        }

        this.setState({ value: e.currentTarget.value });

    }

    private onKeyPress(evt: React.KeyboardEvent<HTMLInputElement>) {
        //console.log('onKeyPress which: ' + evt.which, evt);
        this.props.onKeyPress && this.props.onKeyPress(evt);
        
        if (evt.metaKey || evt.which <= 0 || evt.which == 8 || evt.which == 45 || (evt.which >= 48 && evt.which <= 57) || (evt.which == 46 && this.props.allowDecimal)) {
        }
        else {
            evt.preventDefault();
        }
    }
    render() {

        const {initialValue, onValueChange, allowDecimal,...rest } = this.props;

        return <span className={this.isValid() ? null : 'has-error'}><input type="text" {...rest} value={this.state.value} onKeyPress={this.onKeyPress} onChange={this.onChange} /></span>

    }
}