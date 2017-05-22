
//import { ReactElement } from "react";

//declare global {
  declare  module 'react-test-renderer' {

         interface Renderer<P> {
            toJSON(): ReactTestRendererJSON<P>;
            unmount(nextElement?: React.ReactElement<any>): void;
        }
         interface ReactTestRendererJSON<P> {
            type: string;
            props: P & { [propName: string]: string };
            children: null | Array<string | ReactTestRendererJSON<any>>;
            $$typeof?: any;
        }
         interface TestRendererOptions {
            createNodeMock(element: React.ReactElement<any>): any;
        }
        // https://github.com/facebook/react/blob/master/src/renderers/testing/ReactTestMount.js#L155
         function create<P>(nextElement: React.ReactElement<P>, options?: TestRendererOptions): Renderer<P>;

    }
//}
