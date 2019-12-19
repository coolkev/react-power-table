import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';
import { ExamplesApp } from './app';

const render = Component => {
  ReactDOM.render(
      <Component />,
    document.getElementById('root')
  );
};

render(hot(ExamplesApp));

// Allow Hot Module Reloading
// declare var module: any;

// if (module.hot) {
//   module.hot.accept('./app', () => { render(ExamplesApp); });
// }
