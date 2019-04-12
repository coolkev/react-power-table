import { getExpression } from "../src/Column";

describe('Column tests',
    () => {


        test('can getExpression', () => {

            const expr = getExpression(m => m.jobID);
            expect(expr).toBe('jobID');

        });

    });
