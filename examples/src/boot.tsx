import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { ExamplesApp } from './app';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  );
};

render(ExamplesApp);

// Allow Hot Module Reloading
declare var module: any;

if (module.hot) {
  module.hot.accept('./app', () => { render(ExamplesApp); });
}
