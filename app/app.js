import {ipcRenderer} from "electron";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from "redux-thunk";
import  {createLogger} from "redux-logger";
import {applyMiddleware, createStore} from 'redux';
import reducers from "./reducers/index.js";
import App from "./components/app.js";
import {startDb} from "./actions/actions-database.js";
import {forward, mediaStatusChange, timeUpdate, loadedMetaData, backward, playPause, toggleAutoDj, toggleMusiccollectionOverlay} from "./actions/actions-mediaplayer.js";

//what middlewares should be added after an action is fired
//thunk allows the delay or conditional dispatch of actions
const middleware = applyMiddleware(thunk); //, createLogger());
const rootPath = process.platform === "linux" ? "/mnt/music/Musik/" : "E:/Musik/";
const store = createStore(reducers, middleware);

//fs
const fs = require("graceful-fs");

//database
const Datastore = require("nedb");
const databaseFilePath = rootPath.replace("Musik", "Tools") + "musiccollection.db";
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
const mm = require("music-metadata");

// version
console.log("INFO loaded version 06.09.2018");

// Handle keyboard shortcuts
ipcRenderer.on("forward", () => {
    store.dispatch(forward());
});
ipcRenderer.on("backward", () => {
    store.dispatch(backward());
});
ipcRenderer.on("playPause", () => {
    store.dispatch(playPause());
});
ipcRenderer.on("autodj", () => {
    store.dispatch(toggleAutoDj());
});

window.addEventListener('keyup', (e) => {
    switch(e.code) {
        case "Escape": store.dispatch(toggleMusiccollectionOverlay(false));
            break;
        case "KeyF": store.dispatch(toggleMusiccollectionOverlay(true));
            break;
    }
}, true);

//Provider grants access to store to all components
ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>
  , document.getElementById("app"));
