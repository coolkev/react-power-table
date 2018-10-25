import * as React from 'react';

describe('TimeFilter tests',
    () => {

        for (let x = 0; x < 48; x++) {
            test('can format timespan ' + x, () => {

                const half = x % 2;
                const hour = (x - half) / 2;
                const minute = half ? 30 : 0;

                const ampm = hour < 12 ? 'AM' : 'PM';

                const hourDisplay = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);

                const value = padStart(hour.toString(), 2, '0') + ':' + padStart(minute.toString(), 2, '0') + ':00';

                const label = hourDisplay + ':' + padStart(minute.toString(), 2, '0') + ' ' + ampm;

                expect({value, label}).toMatchSnapshot();

            });
        }

    });

function padStart(str: string, targetLength: number, padString: string) {
    // tslint:disable-next-line:no-bitwise
    targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (str.length >= targetLength) {
        return String(str);
    } else {
        targetLength = targetLength - str.length;
        if (targetLength > padString.length) {
            padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
        }
        return padString.slice(0, targetLength) + str;
    }
}
