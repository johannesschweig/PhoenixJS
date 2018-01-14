import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from "redux-thunk";
import  {createLogger} from "redux-logger";
import {applyMiddleware, createStore} from 'redux';
import reducers from "./reducers/index.js";
import App from "./components/app.js";
import {startDb, forward, mediaStatusChange, timeUpdate, loadedMetaData} from "./actions/index.js";

//what middlewares should be added after an action is fired
//thunk allows the delay or conditional dispatch of actions
const middleware = applyMiddleware(thunk); //createLogger()
const store = createStore(reducers, middleware);

//fs
const fs = require("fs");

//database
const Datastore = require("nedb");
const databaseFilePath = "musiccollection.db";
// check if database file exists
if(!fs.existsSync(databaseFilePath)){
    console.error("Database file '" + databaseFilePath + "' not found");
}else{
    var database = new Datastore({filename: databaseFilePath, autoload: true});
    store.dispatch(startDb());
    database.count({}, function(err, count){
        console.log("INFO database loaded with " + count + " entries");
    });
}
//audiofile - ugly but dont know where to put my eventlistener
var audiofile = new Audio();
audiofile.addEventListener("ended", () => store.dispatch(forward()), false);
audiofile.addEventListener("loadedmetadata", () => store.dispatch(loadedMetaData()));
audiofile.addEventListener("playing", () => store.dispatch(mediaStatusChange("playing")));
audiofile.addEventListener("pause", () => store.dispatch(mediaStatusChange("paused")));
audiofile.addEventListener("timeupdate", () => store.dispatch(timeUpdate(audiofile.currentTime)));
// audiofile.muted = true;

//musicmetadata
const musicmetadata = require("musicmetadata");

//Provider grants access to store to all components
ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>
  , document.getElementById("app"));
