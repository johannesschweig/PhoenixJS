import {combineReducers} from "redux"
import {DatabaseReducer} from "./reducer-database.js"
import {MediaplayerReducer} from "./reducer-mediaplayer.js"
import {ApplicationReducer} from './reducer-application.js'

const reducers =  combineReducers({
      application: ApplicationReducer,
      database: DatabaseReducer,
      mediaplayer: MediaplayerReducer
})
export default reducers
