import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from "redux-thunk";
import  {createLogger} from "redux-logger";
import {applyMiddleware, createStore} from 'redux';
import reducers from "./reducers/index.js";
import App from "./components/app.js";



//what middlewares should be added after a action is fired
const middleware = applyMiddleware(thunk, createLogger());

const store = createStore(reducers, middleware);

//Provider grants access to store to all components
ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>
  , document.getElementById("app"));
