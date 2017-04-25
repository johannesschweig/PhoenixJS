import {combineReducers} from "redux";
import {TracklistReducer} from "./reducer-tracklist.js";
import {ApplicationReducer} from "./reducer-application.js";

const reducers =  combineReducers({
      application: ApplicationReducer,
      tracklist: TracklistReducer
});
export default reducers;

//let initialState = {application: {display: "windowed", update: false}, audioplayer: {state: null, currentTime: null, totalTime: null,  activeTrack: -1, validateTrack: null, tracks: []}};
