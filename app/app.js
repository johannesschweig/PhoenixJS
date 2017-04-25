import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from "redux-thunk";
import  {createLogger} from "redux-logger";
import {applyMiddleware, createStore} from 'redux';
import reducers from "./reducers/index.js";
import App from "./components/app.js";
import {startDb} from "./actions/index.js";

//what middlewares should be added after an action is fired
const middleware = applyMiddleware(thunk);

const store = createStore(reducers, middleware);

//database
const Datastore = require("nedb");
var database = new Datastore({filename: "musiccollection.db", autoload: true});
store.dispatch(startDb());


// db.find({year : 2015}, function (err,docs){ console.log(docs); });

//Provider grants access to store to all components
ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>
  , document.getElementById("app"));
