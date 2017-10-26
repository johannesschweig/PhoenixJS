import {combineReducers} from "redux";
import {ApplicationReducer} from "./reducer-application.js";
import {MediaplayerReducer} from "./reducer-mediaplayer.js";

const reducers =  combineReducers({
      application: ApplicationReducer,
      mediaplayer: MediaplayerReducer
});
export default reducers;
