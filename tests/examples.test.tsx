import * as React from 'react';
import {  render } from 'enzyme';
import { BasicExample } from '../examples/src/basic';
import { InternalSortingExample } from '../examples/src/internal-sorting';
import { ExternalSortingExample } from '../examples/src/external-sorting';
import { InternalPagingExample } from '../examples/src/internal-paging';
import { InternalPagingSortingExample } from '../examples/src/internal-paging-sorting';
import { ExternalPagingExample } from '../examples/src/external-paging';
import { ExternalPagingSortingExample } from '../examples/src/external-paging-sorting';
import { CheckboxExample } from '../examples/src/checkboxes';
import { FiltersExample } from '../examples/src/filters';
import { HideColumnsExample } from '../examples/src/hideColumns';
import { CustomRowExample } from '../examples/src/CustomRow';

const examples = {
    'Basic': BasicExample,
    'Internal Sorting': InternalSortingExample,
    'Internal Paging': InternalPagingExample,
    'Internal Paging/Sorting': InternalPagingSortingExample,
    'External Sorting': ExternalSortingExample,
    'External Paging': ExternalPagingExample,
    'External Paging/Sorting': ExternalPagingSortingExample,
    'Checkboxes': CheckboxExample,
    'Filters': FiltersExample,
    'Hide Columns': HideColumnsExample,
    'Custom Row': CustomRowExample,

};

describe('examples tests',
    () => {

        Object.keys(examples).forEach(key => {
            test('example ' + key, () => {
                const ExampleComponent = examples[key];

                const component = render(<ExampleComponent />);

                expect(component).toMatchSnapshot();

            });

        });

    });
