import { render } from 'enzyme';
import * as React from 'react';
import { BasicExample } from '../examples/src/basic';
import { CheckboxExample } from '../examples/src/checkboxes';
import { CustomRowExample } from '../examples/src/CustomRow';
import { ExternalPagingExample } from '../examples/src/external-paging';
import { ExternalPagingSortingExample } from '../examples/src/external-paging-sorting';
import { ExternalSortingExample } from '../examples/src/external-sorting';
import { FiltersExample } from '../examples/src/filters';
import { HideColumnsExample } from '../examples/src/hideColumns';
import { InternalPagingExample } from '../examples/src/internal-paging';
import { InternalPagingSortingExample } from '../examples/src/internal-paging-sorting';
import { InternalSortingExample } from '../examples/src/internal-sorting';

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
