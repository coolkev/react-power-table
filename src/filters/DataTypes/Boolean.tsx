import { FilterDefinition } from "./DataType";

const verbs = [
    ['is', 'is not'],
    ['has', 'does not have'],
    ['had', 'did not have'],
    ['can', 'cannot'],
    ['will', 'will not'],
    ['was', 'was not'],
];
export class Boolean extends FilterDefinition<boolean>
{
    constructor(options: FilterDefinitionOptionsOrFieldName) {

        super(options);

        this.appliedFilterLabel = (props) => props.operation.displayName;
    }

    protected getOperations() {


        const matchingVerb = verbs.find(m => {
            const name = this.displayName.toLowerCase();
            return m[0] == name || name.startsWith(m[0] + ' ');
        });

        const verb = matchingVerb || verbs[0];        
        const displayName = matchingVerb ? this.displayName.substring(matchingVerb[0].length + 1) : this.displayName;
        const trueName = verb[0] + ' ' + displayName;
        const falseName = verb[1] + ' ' + displayName;
                
        return {
            'eq': { key:'eq',displayName: trueName, test: (source)=> source  },
            'ne': { key: 'ne', displayName: falseName , test: (source)=> !source }
        };
    }

    

}

