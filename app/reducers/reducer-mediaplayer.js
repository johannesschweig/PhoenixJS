import update from 'immutability-helper'
import * as types from '../actions/types.js'
import * as constants from '../constants/constants.js'

//let test_tl = [{album: "Billy Talent", albumartist: "Billy Talent", artist: "Billy Talent", id: "adH32KVLdnHnPGUm", path: "Billy Talent/01-Billy Talent-2003/01 This Is How It Goes.mp3", selected: false, title: "This Is How It Goes", year: 2003 }, { album: "Billy Talent II", albumartist: "Billy Talent", artist: "Billy Talent", id: "xbBy5MApCHcO5plQ", path: "Billy Talent/02-Billy Talent II-2006/01 Devil In A Midnight Mass.mp3", selected: false, title: "Devil In A Midnight Mass", year: 2006 }, { album: "Billy Talent III", albumartist: "Billy Talent", artist: "Billy Talent", id: "Ok12vLGMmxTYWKDi", path: "Billy Talent/03-Billy Talent III-2009/04 Tears into Wine.mp3", selected: false, title: "Tears into Wine", year: 2009 }]
const initialState = {
    autoDj: constants.AUTODJ_RANDOM, //status of the autoDJ: enabled or disabled
    cover: null, //cover of current track
    currentTrack: -1, //int of current track in tracklist 0-99
    duration: null,
    playing: false, //playing or paused
    time: null, // elapsed time of current track
    tracklist: [], // tracklist
}


export function MediaplayerReducer(state=initialState, action){
    //vars
    let index, id, ct, tl, a, existing

    switch(action.type){
        case types.PLAY:
            return{...state, playing: true}
        case types.PAUSE:
            return {...state, playing: false}
        case types.MOVE_CURRENT_TRACK:
            return {...state, currentTrack: state.currentTrack + action.payload}
        case types.SET_CURRENT_TRACK:
            return {...state, currentTrack: action.payload}
        case types.TOGGLE_AUTODJ:
            let aj
            if (state.autoDj == constants.AUTODJ_OFF) {
                aj = constants.AUTODJ_RANDOM
            } else if (state.autoDj == constants.AUTODJ_RANDOM) {
                aj = constants.AUTODJ_ALBUM_ARTIST
            } else if (state.autoDj == constants.AUTODJ_ALBUM_ARTIST) {
                aj = constants.AUTODJ_OFF
            }
            return {...state, autoDj: aj}
        case types.SET_AUTODJ:
            return {...state, autoDj: action.payload}
        case types.RESET_ELAPSED_TIME:
            return {...state, time: null}
        case types.SET_DURATION:
            return {...state, duration: action.payload}
        case types.DELETE_TRACKS:
            return {...state, tracklist: state.tracklist.filter((_, i) => !action.payload.includes(i))}
        case types.DELETE_ALL_TRACKS:
            return {...state, tracklist: []}
        case types.ADD_TRACKS_FULFILLED:
            return {...state, tracklist: state.tracklist.concat(action.payload)}
        case types.LOAD_COVER_FULFILLED:
            return {...state, cover: action.payload}
        case types.LOAD_COVER_REJECTED:
            return {...state, cover: null}
        case types.UPDATE_ELAPSED_TIME:
            return {...state, time: action.payload}
        case types.SELECT_IN_TRACKLIST:
            return {...state, tracklist: state.tracklist.map((obj, index) => {
                if (action.indices.includes(index)) {
                    obj.selected = true
                } else {
                    if (action.exclusive) {
                        obj.selected = false
                    }
                }
                return obj
            })}
        }
    return state
}
