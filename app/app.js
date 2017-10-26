import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from "redux-thunk";
import  {createLogger} from "redux-logger";
import {applyMiddleware, createStore} from 'redux';
import reducers from "./reducers/index.js";
import App from "./components/app.js";
import {startDb, forward, mediaStatusChange, timeUpdate} from "./actions/index.js";

//what middlewares should be added after an action is fired
//thunk allows the delay or conditional dispatch of actions
const middleware = applyMiddleware(thunk); //createLogger()
const store = createStore(reducers, middleware);

//database
const Datastore = require("nedb");
var database = new Datastore({filename: "musiccollection.db", autoload: true});
store.dispatch(startDb());
//audiofile - ugly but dont know where to put my eventlistener
var audiofile = new Audio();
audiofile.addEventListener("ended", () => store.dispatch(forward()), false);
audiofile.addEventListener("playing", () => store.dispatch(mediaStatusChange("playing")));
audiofile.addEventListener("pause", () => store.dispatch(mediaStatusChange("paused")));
audiofile.addEventListener("timeupdate", () => store.dispatch(timeUpdate(audiofile.currentTime)));

//musicmetadata
const musicmetadata = require("musicmetadata");
//fs
const fs = require("fs");


//Provider grants access to store to all components
ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>
  , document.getElementById("app"));
