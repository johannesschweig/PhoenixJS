import {searchRejected} from "./actions-database.js"
import * as types from './types.js'
import * as constants from '../constants/constants.js'

// user action: play/pause button pressed
export const playPause = () => {
    return function(dispatch, getState){
        let currentTrack = getState().mediaplayer.currentTrack
        let tracklist = getState().mediaplayer.tracklist
        // song is playing -> pause song
        if (getState().mediaplayer.playing) {
            audiofile.pause()
            dispatch(pause())
        } else { // no song is playing
            // no active track
            if (currentTrack == -1) {
                // non-empty tracklist
                if (tracklist.length > 0) {
                    audiofile.src = constants.ROOT_PATH + tracklist[currentTrack + 1].path
                    audiofile.play()
                    dispatch(loadCover(tracklist[currentTrack + 1].path))
                    dispatch(moveCurrentTrack(1))
                    dispatch(resetElapsedTime())
                    dispatch(play())
                }
            } else { // active track
                if (tracklist.length > currentTrack) {
                    audiofile.play()
                    dispatch(play())
                } else {
                    console.log("ERROR state mismatch: Length of the tracklist", tracklist.length, "| index of active track:", currentTrack)
                }
            }
        }
    }
}

// system action: pause song
export const pause = () => {
    return {
        type: types.PAUSE
    }
}

// system action: plays the current track
export const play = () => {
    return{
        type: types.PLAY
    }
}

// system action: changes the current track to current+i
export const moveCurrentTrack = (i) => {
    return {
        type: types.MOVE_CURRENT_TRACK,
        payload: i
    }
}

// system action: sets the current track to i
export const setCurrentTrack = (i) => {
    return {
        type: types.SET_CURRENT_TRACK,
        payload: i
    }
}

// user action: switch to next mode of autoDj
export const toggleAutoDj = () => {
    return {
        type: types.TOGGLE_AUTODJ
    }
}

// system action: change autoDj mode to specified mode
export const setAutoDj = (mode) => {
    return {
        type: types.SET_AUTODJ,
        payload: mode
    }
}

// user action: backward button is pressed
export const backward = () => {
    return function(dispatch, getState){
        let currentTrack = getState().mediaplayer.currentTrack
        let time = getState().mediaplayer.time
        let tracklist = getState().mediaplayer.tracklist
        let playing = getState().mediaplayer.playing
        // if time elapsed more than 10 OR just one track -> set to 0
        if (time > 10 | currentTrack == 0) {
            audiofile.currentTime = 0
            dispatch(resetElapsedTime())
        } else if (time < 10 & currentTrack > 0) { // if there is a previous track and time elapsed < 10
            audiofile.src = constants.ROOT_PATH + tracklist[currentTrack - 1].path
            dispatch(loadCover(tracklist[currentTrack - 1].path))
            dispatch(moveCurrentTrack(-1))
            dispatch(resetElapsedTime())
            // start track if old track was played before
            if (playing) {
                audiofile.play()
                dispatch(play())
            }
        } else {
            console.log("INFO no track in tracklist. Can't perform 'back' action.")
        }
    }
}


// system action: resets the elapsed time to null
export const resetElapsedTime = () => {
    return {
        type: types.RESET_ELAPSED_TIME,
    }
}

// system action: sets the duration of track
export const setDuration = (duration) => {
    return {
        type: types.SET_DURATION,
        payload: duration
    }
}

// system/user action: tries to play the next track / triggers autodj
export const forward = () => {
    return function(dispatch, getState){
        let tracklist = getState().mediaplayer.tracklist
        let currentTrack = getState().mediaplayer.currentTrack
        let playing = getState().mediaplayer.playing
        let autoDj = getState().mediaplayer.autoDj
        // if there is a next track in tracklist -> play next track
        if (tracklist.length > currentTrack + 1) {
            audiofile.src = constants.ROOT_PATH + tracklist[currentTrack + 1].path
            dispatch(loadCover(tracklist[currentTrack + 1].path))
            dispatch(resetElapsedTime())
            dispatch(moveCurrentTrack(1))
            audiofile.play()
            dispatch(play())
        } else { // if no next track in tracklist -> check autodj
            if (autoDj == constants.AUTODJ_OFF) { // nothing to do
                console.log("INFO no track to play. Try to enable autodj.")
            } else if (autoDj == constants.AUTODJ_RANDOM) { // find random track
                database.count({}, function (err, count) {
                    if (!err && count > 0) {
                        var skipCount = Math.floor(Math.random() * count)
                        database.find({}).skip(skipCount).limit(1).exec(function (err2, docs) {
                            if (!err2) {
                                audiofile.src = constants.ROOT_PATH + docs[0].path
                                audiofile.play()
                                dispatch(addTracks(docs))
                                dispatch(loadCover(docs[0].path))
                                dispatch(resetElapsedTime())
                                dispatch(moveCurrentTrack(1))
                                dispatch(play())
                            } else {
                                console.log("ERROR autodj (random), no appropriate track found")
                            }
                        })
                    } else {
                        console.log("ERROR autodj (random), database empty")
                    }
                })
            } else if (autoDj == constants.AUTODJ_ALBUM_ARTIST) { // find similar track from same artist or album
                if (tracklist.length > 0) {
                    // find appropriate track
                    let currentTrack = getState().mediaplayer.tracklist[getState().mediaplayer.currentTrack]

                    const onFinish = (err, docs) => {
                        if(err) console.log("ERROR failed to retrieve items from database")
                        if(docs.length > 0){
                            // choose random track out of found tracks
                            let t = Math.floor(Math.random() * docs.length)
                            audiofile.src = constants.ROOT_PATH + docs[t].path
                            audiofile.play()
                            dispatch(addTracks([docs[t]]))
                            dispatch(loadCover(docs[t].path))
                            dispatch(resetElapsedTime())
                            dispatch(moveCurrentTrack(1))
                            dispatch(play())
                        }else{
                            // switching to random autodj if no albumartist tracks remain
                            console.log("INFO no results found, autodj (albumartist) for " + currentTrack.title + " by " + currentTrack.albumartist + ". Switching to random autodj.")
                            dispatch(setAutoDj(constants.AUTODJ_RANDOM))
                            dispatch(forward())
                        }
                    }
                    // ids of all tracks in tracklist
                    let ids = getState().mediaplayer.tracklist.map(e => e.id)

                    if(currentTrack.album && currentTrack.albumartist && currentTrack.albumartist != "Various Artists"){
                        // FIXME problem if there is an album with the same name from another albumartist (e.g. bloom by rüfüs and beach house)
                        database.find(
                            {$and:
                                [ {$or: [{album: currentTrack.album}, {albumartist: currentTrack.albumartist}] },
                                {_id: {$nin: ids}}]}
                            ).sort({album: 1, albumartist: 1, track: 1}).exec(onFinish)
                        }else if(currentTrack.album) {
                            database.find(
                                {$and: [{album: currentTrack.album},
                                    {_id: {$nin: ids}}]}
                                ).sort({album: 1, albumartist: 1, track: 1}).exec(onFinish)
                        }else if(currentTrack.albumartist && currentTrack.albumartist != "Various Artists"){
                            database.find(
                                {$and: [{albumartist: currentTrack.albumartist},
                                    {_id: {$nin: ids}}]}
                                ).sort({album: 1, albumartist: 1, track: 1}).exec(onFinish)
                        }else{
                            console.log("WARN no albumartist and album information present for " + currentTrack.title + ". Search aborted.")
                        }
                } else {
                    console.log("ERROR autoDJ 'albumartist' needs at least one track to find similar tracks.")
                }

            }
        }
    }
}

// user action: delete key was pressed
export const deletePressed = () => {
    return function(dispatch, getState) {
        // only if musiccollection is visible (otherwise deleting in the search field will cause unwanted behavior)
        if (!getState().application.musiccollectionVisible) {
            dispatch(deleteSelectedTracks())
        }
    }
}

// user action / system action: delete selected tracks from the tracklist
export const deleteSelectedTracks = () => {
    return function(dispatch, getState){
        // iterate over all tracks
        let tracklist = getState().mediaplayer.tracklist
        let currentTrack = getState().mediaplayer.currentTrack

        // find all tracks to delete
        let toDelete = [] // array of all indices to delete
        let currentTrackDelete = false // if currentTrack gets deleted
        let toDeleteBeforeCurrent = 0
        let toDeleteAfterCurrent = 0
        for (let i = 0; i < tracklist.length; i++) {
            if (tracklist[i].selected) {
                toDelete.push(i)
                if (i == currentTrack) { // current track gets deleted
                    currentTrackDelete = true
                } else if (i < currentTrack) { // deleted track is before current track
                    toDeleteBeforeCurrent  += 1
                } else if (i > currentTrack) { // deleted track is after current track
                    toDeleteAfterCurrent += 1
                }
            }
        }

        if (currentTrackDelete) {
            if (toDelete.length == tracklist.length) { // all tracks get deleted
                audiofile.src = ''
                dispatch(loadCoverRejected())
                dispatch(resetElapsedTime())
                dispatch(setDuration(null))
                dispatch(setCurrentTrack(-1))
                dispatch(pause())
                dispatch(deleteAllTracks())
            } else { // only some tracks get deleted
                let newCurrentTrack
                if (tracklist.length > currentTrack + toDeleteAfterCurrent + 1) { // there is a subsequent track
                    newCurrentTrack = currentTrack - toDeleteBeforeCurrent
                } else { // there is a previous track
                    newCurrentTrack = currentTrack - toDeleteBeforeCurrent - 1
                }
                // FIXME order important...ugly
                dispatch(deleteTracks(toDelete))
                tracklist = getState().mediaplayer.tracklist
                audiofile.src = constants.ROOT_PATH + tracklist[newCurrentTrack].path
                dispatch(loadCover(tracklist[newCurrentTrack].path))
                dispatch(setCurrentTrack(newCurrentTrack))
                dispatch(resetElapsedTime())
                dispatch(pause())
            }
        } else {
            dispatch(moveCurrentTrack(-toDeleteBeforeCurrent))
            dispatch(deleteTracks(toDelete))
        }
    }
}

// system action: delete tracks specified by index from tracklist
export const deleteTracks = (indices) => {
    return {
        type: types.DELETE_TRACKS,
        payload: indices
    }
}

// system action: delete all tracks from the tracklist
export const deleteAllTracks = () => {
    return {
        type: types.DELETE_ALL_TRACKS,
    }
}

//user action / system action: check tracks for existence and trigger to add them to tracklist
export const addTracks = (tracks) => {
    return function(dispatch, getState) {
        let valid_tracks = []
        let ids = getState().mediaplayer.tracklist.map(t => t.id)
        for (let track of tracks) {
            //check if file exists
            if(fs.existsSync(constants.ROOT_PATH + track.path)){
                if (ids.indexOf(track._id) > -1) { // track already in tracklist
                    console.log("INFO track", track.title , " is already in tracklist")
                } else { // not in tracklist
                    valid_tracks.push({id: track._id, title: track.title, path: track.path, artist: track.artist, albumartist: track.albumartist, album: track.album, year: track.year, selected: false})
                }
            }else{
                console.log("ERROR physical file not found: " + track.path)
            }
        }
        if (valid_tracks.length) { // add tracks if there are valid tracks
            dispatch(addTracksFulfilled(valid_tracks))
        }
    }
}

// system action: adds the passed tracks to the tracklist
export const addTracksFulfilled = (tracks) => {
    return {
        type: types.ADD_TRACKS_FULFILLED,
        payload: tracks
    }
}

//system action: load coverart of path and trigger display to change
export const loadCover = (path) => {
    return function(dispatch){
        //read coverart
        let fpath = constants.ROOT_PATH + path
        mm.parseFile(fpath)
        .then( metadata => {
            if(metadata.common.picture){
                dispatch(loadCoverFulfilled(metadata.common.picture[0].data))
            }else{
                dispatch(loadCoverRejected())
            }
        })
        .catch((err) => {
            console.log(err.message)
        })
    }
}

// system action: load the specified cover data into display
export const loadCoverFulfilled = (cover) => {
    return{
        type: types.LOAD_COVER_FULFILLED,
        payload: cover
    }
}

// system action: missing coverart will be cause a placeholder to be displayed
export const loadCoverRejected = () => {
    return {
        type: types.LOAD_COVER_REJECTED
    }
}

// user action: changes Track to the track of specified index
export const changeTrack = (index) => {
   return function(dispatch, getState){
       audiofile.src = constants.ROOT_PATH + getState().mediaplayer.tracklist[index].path
       audiofile.play()
       dispatch(loadCover(getState().mediaplayer.tracklist[index].path))
       dispatch(setCurrentTrack(index))
       dispatch(resetElapsedTime())
       dispatch(play())
    }
}

// user action: seeks the track to the specified percentage
export const seek = (percent) => {
    return function (dispatch, getState) {
        let t = Math.round(percent * getState().mediaplayer.duration)
        audiofile.currentTime = t
        dispatch(updateElapsedTime(t))
    }
}

// system action: update the time with the specified time
export const updateElapsedTime = (t) => {
     return {
        type: types.UPDATE_ELAPSED_TIME,
        payload: t,
    }
}

// select entries in tracklist with indices either additional (add to current selection) or exclusive (delete old selection)
export const selectInTracklist = (indices, exclusive) => {
    return {
        type: types.SELECT_IN_TRACKLIST,
        indices: indices,
        exclusive: exclusive,
    }
}
