import * as types from '../actions/types.js'

const initialState = {
    musiccollectionVisible: false, // if musiccollection overlay is visible
}

export function ApplicationReducer(state = initialState, action){
    switch(action.type){
        case types.TOGGLE_MUSICCOLLECTION_OVERLAY:
            return {...state, musiccollectionVisible: action.payload}
    }
    return state
}
