import * as React from 'react';
import SelectValue from 'react-select/lib/Value';
import * as classNames from 'classnames';


export class CustomSelectValue extends SelectValue {

    render() {

        const t = (this as any);
        const props = (this as any).props;

        return (
            <div className={classNames('Select-value', props.value.className)}
                style={props.value.style}
                title={props.value.title}
            >
                {t.renderLabel()}
                {t.renderRemoveIcon()}

            </div>
        );
    }
}
