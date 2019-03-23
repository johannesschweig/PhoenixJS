import {ipcRenderer} from "electron"
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import thunk from "redux-thunk"
import  {createLogger} from "redux-logger"
import {applyMiddleware, createStore} from 'redux'
import reducers from "./reducers/index.js"
import App from "./components/app.js"
import {startDb} from "./actions/actions-database.js"
import {forward, play, pause, updateElapsedTime, backward, playPause, toggleAutoDj, setDuration, deletePressed} from "./actions/actions-mediaplayer.js"
import {toggleMusiccollectionOverlay} from './actions/actions-application.js'
import * as constants from './constants/constants.js'

//what middlewares should be added after an action is fired
//thunk allows the delay or conditional dispatch of actions
const middleware = applyMiddleware(thunk) // createLogger()
const store = createStore(reducers, middleware)

//fs
const fs = require("graceful-fs")

//database
const Datastore = require("nedb")
// check if database file exists
if(!fs.existsSync(constants.DATABASE_FILE_PATH)){
    console.error("Database file '" + constants.DATABASE_FILE_PATH + "' not found")
}else{
    var database = new Datastore({filename: constants.DATABASE_FILE_PATH, autoload: true})
    store.dispatch(startDb())
    database.count({}, function(err, count){
        console.log("INFO database loaded with " + count + " entries")
    })
}
//audiofile - ugly but dont know where to put my eventlistener
var audiofile = new Audio()
audiofile.addEventListener("ended", () => store.dispatch(forward()), false)
audiofile.addEventListener("loadedmetadata", () => store.dispatch(setDuration(audiofile.duration)))
audiofile.addEventListener("playing", () => store.dispatch(play()))
audiofile.addEventListener("pause", () => store.dispatch(pause()))
audiofile.addEventListener("timeupdate", () => store.dispatch(updateElapsedTime(audiofile.currentTime)))
// audiofile.muted = true

//musicmetadata
const mm = require("music-metadata")

// version
console.log("INFO loaded version 23.03.2019")

// Handle keyboard shortcuts
ipcRenderer.on("forward", () => {
    store.dispatch(forward())
})
ipcRenderer.on("backward", () => {
    store.dispatch(backward())
})
ipcRenderer.on("playPause", () => {
    store.dispatch(playPause())
})
ipcRenderer.on("autodj", () => {
    store.dispatch(toggleAutoDj())
})

window.addEventListener('keyup', (e) => {
    switch(e.code) {
        case "Escape": store.dispatch(toggleMusiccollectionOverlay(false))
            break
        case "KeyF": store.dispatch(toggleMusiccollectionOverlay(true))
            break
        case "Delete": store.dispatch(deletePressed())
            break
    }
}, true)

//Provider grants access to store to all components
ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>
  , document.getElementById("app"))
