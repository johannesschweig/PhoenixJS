import {combineReducers} from "redux";
import {DatabaseReducer} from "./reducer-database.js";
import {MediaplayerReducer} from "./reducer-mediaplayer.js";

const reducers =  combineReducers({
      database: DatabaseReducer,
      mediaplayer: MediaplayerReducer
});
export default reducers;
