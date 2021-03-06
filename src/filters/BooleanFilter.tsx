﻿import { FilterDefinition, FilterDefinitionOptionsOrFieldName, nullableOperations, OperationDefinition } from './FilterDefinition';

const verbs = [
    ['is', 'is not'],
    ['has', 'does not have'],
    ['had', 'did not have'],
    ['can', 'cannot'],
    ['will', 'will not'],
    ['was', 'was not'],
];
export class BooleanFilter extends FilterDefinition<boolean> {
    public operations = this.getOperations();
    constructor(options: FilterDefinitionOptionsOrFieldName) {

        super(options);

        this.appliedLabel = (props) => props.operation.displayName;

        this.defaultValue = true;
    }

    private getOperations() {

        const matchingVerb = verbs.find((m) => {
            const name = this.displayName.toLowerCase();
            return m[0] === name || name.startsWith(m[0] + ' ');
        });

        const verb = matchingVerb || verbs[0];
        const displayName = matchingVerb ? this.displayName.substring(matchingVerb[0].length + 1) : this.displayName;
        const trueName = verb[0] + ' ' + displayName;
        const falseName = verb[1] + ' ' + displayName;

        return {
            eq: { key: 'eq', displayName: trueName, test: (source) => source }  as OperationDefinition<boolean>,
            ne: { key: 'ne', displayName: falseName, test: (source) => !source } as OperationDefinition<boolean>,
            ...(this.canBeNull && nullableOperations<boolean>()),
        };
    }
}
