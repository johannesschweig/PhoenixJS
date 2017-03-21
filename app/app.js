import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {createStore} from 'redux';
import reducers from "./reducers/index.js";
import App from "./components/app.js";

const initialState = {};
const store = createStore(reducers);

//Provider grants access to store to all components
ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>
  , document.getElementById("app"));
