import * as React from 'react';
import * as PowerTable from './FilterDefinition';

const valueDelimiter = ' ';

export const BetweenFilterComponent = (props: PowerTable.FilterComponentProps<any>) => {

    const { value, onValueChange, ...rest } = props;

    const values = value.toString().split(valueDelimiter);
    const min = values[0];
    const max = values.length >= 2 ? values[1] : '';
    const FilterComponent = props.filter.filterComponent;

    /* tslint:disable:jsx-no-lambda */
    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <FilterComponent value={min} onValueChange={(v) => onValueChange(v + valueDelimiter + max)} placeholder="min" {...rest} />
                        </td>
                        <td style={{ padding: '0 5px' }}>
                            and
                       </td>
                        <td>
                            <FilterComponent value={max} onValueChange={(v) => onValueChange(min + valueDelimiter + v)} placeholder="max" {...rest} autoFocus={false} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );

};

export const BetweenAppliedFilterLabel = (filter: PowerTable.AppliedFilter<any>) => filter.filter.displayName + ' ' + filter.operation.displayName + ' ' + filter.value.toString().split(valueDelimiter).join(' and ');

export const BetweenApplyFilterTest = (parseValue: (value: any) => any, filterValue: string) => {

    const values = filterValue.split(valueDelimiter);
    const min = parseValue(values[0]);
    const max = parseValue(values[1]);
    return (source: any, _filterValue: any) => {

        return source >= min && source <= max;
    };
};
