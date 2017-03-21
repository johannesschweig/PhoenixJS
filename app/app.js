import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store';
import reducers from "./reducers";

const initialState = {};
const store = configureStore(reducers);

// ReactDOM.render(
//   <Provider store={store}>
//     <Router history={routerHistory} routes={routes} />
//   </Provider>,
//   rootElement
// );
ReactDOM.render(
  <h2>hey now</h2>, document.getElementById("app")
);
