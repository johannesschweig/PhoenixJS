import * as types from './types.js'

// show the musiccollection overlay
export const toggleMusiccollectionOverlay = (visible) => {
    return {
        type: types.TOGGLE_MUSICCOLLECTION_OVERLAY,
        payload: visible
    }
}
