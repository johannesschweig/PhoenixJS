import {searchRejected} from "./actions-database.js";

// delete tracks from the tracklist
export const deleteSelectedTracks = () => {
    return function(dispatch, getState){
        // iterate over all tracks
        let tl = getState().mediaplayer.tracklist;
        let ct = getState().mediaplayer.currentTrack;

        for (let i=0; i<tl.length; i++ ){
            if(tl[i].selected){
                let id = tl[i].id;

                if(i==ct){ //active track gets deleted
                    //check if new audiofile exists
                    if(tl.length>1){ //switch to next track
                        if(tl.length-i>1){ //if there is a subsequent track
                            dispatch(loadCover(tl[ct+1].path));
                        }else{
                            dispatch(loadCover(tl[ct-1].path));
                        }
                    }else{ //last track in tracklist
                        dispatch(loadCoverRejected());
                    }
                }
                dispatch(deleteTrackFulfilled(id, i));
            }
        }
    };
}

export const deleteTrackFulfilled = (id, index) => {
    return {
        type: "DELETE_TRACK_FULFILLED",
        id: id,
        index: index,
    };
}

// is never called
export const deleteTrackRejected = () => {
    return {
        type: "DELETE_TRACK_REJECTED",
    }
}

//add track to tracklist
export const addTracks = (tracks) => {
    return function(dispatch, getState){
        for (let track of tracks) {
            //check if file exists
            if(fs.existsSync(rootPath + track.path)){
                dispatch(addTrackFulfilled({id: track._id, title: track.title, path: track.path, artist: track.artist, albumartist: track.albumartist, album: track.album, year: track.year, selected: false}));
            }else{
                dispatch(addTrackRejected("ERROR physical file not found: " + track.path))
            }
        }
    }
}

export const addTrackFulfilled = (track) => {
    return{
        type: "ADD_TRACK_FULFILLED",
        payload: track
    }
}

export const addTrackRejected = (err) => {
    return{
        type: "ADD_TRACK_REJECTED",
        payload: err
    }
}

//loads coverart
export const loadCover = (path) => {
    return function(dispatch, getState){
        //read coverart
        let fpath = rootPath + path;
        mm.parseFile(fpath)
        .then( metadata => {
            if(metadata.common.picture){
                dispatch(loadCoverFulfilled(metadata.common.picture[0].data));
            }else{
                dispatch(loadCoverRejected());
            }
        })
        .catch((err) => {
            console.log(err.message);
        });
    }
}

export const loadCoverFulfilled = (cover) => {
    return{
        type: "LOAD_COVER_FULFILLED",
        payload: cover
    }
}

export const loadCoverRejected = () => {
    return{
        type: "LOAD_COVER_REJECTED"
    }
}
//loads coverart for a to-be played track and arranges to load the track into memory
export const loadTrack = (id, path) => {
   return function(dispatch, getState){
       //read coverart
        let fpath = rootPath + path;
        mm.parseFile(fpath).then( metadata => {
            if(metadata.common.picture){
                dispatch(loadTrackFulfilled(id, metadata.common.picture[0].data));
            }else{
                dispatch(loadTrackFulfilled(id, null));
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }
}

//loads the selected track into memory
export const loadTrackFulfilled = (_id, _img) => {
    return{
        type: "LOAD_TRACK_FULFILLED",
        id: _id,
        img: _img
    }
}

//plays the current track
export const playTrack = () => {
    return{
        type: "PLAY_TRACK"
    }
}

export const playPause = () => {
    return {
        type: "PLAY_PAUSE"
    }
}

export  const toggleAutoDj = () => {
    return {
        type: "TOGGLE_AUTO_DJ"
    }
}

export const seek = (t) => {
    return {
        type: "SEEK",
        payload: t
    }
}

// gets dispatched when the forward button is pressed or the current track has ended
export const forward = () => {
    return function(dispatch, getState){
        if(getState().mediaplayer.tracklist.length>getState().mediaplayer.currentTrack+1){ // if there is a next track
            dispatch(loadCover(getState().mediaplayer.tracklist[getState().mediaplayer.currentTrack+1].path));
            dispatch(forwardFulfilled());
        }else if(getState().mediaplayer.autoDj == "random") { //if autodj is set to random mode
            // find random track
            database.count({}, function (err, count) {
                    if (!err && count > 0) {
                        var skipCount = Math.floor(Math.random() * count);
                        database.find({}).skip(skipCount).limit(1).exec(function (err2, docs) {
                            if (!err2) {
                                dispatch(addTracks(docs));
                                dispatch(loadCover(docs[0].path));
                                dispatch(forwardFulfilled());
                            } else {
                                dispatch(searchRejected("ERROR autodj (random), not appropriate track found"));
                            }
                        })
                    } else {
                        dispatch(searchRejected("ERROR autodj (random), database empty"));
                    }
            });
        }else if(getState().mediaplayer.autoDj == "albumartist" && getState().mediaplayer.currentTrack >= 0){ // if autoDJ is set to albumartist mode and there is at least a track in the tracklist
            // find appropriate track
            let currentTrack = getState().mediaplayer.tracklist[getState().mediaplayer.currentTrack];

            const onFinish = (err, docs) => {
                if(err) dispatch(searchRejected("ERROR failed to retrieve items from database"));
                // delete all tracks currently in tracklist (including the track the search was based on)
                if(docs.length>0){
                    // choose random track
                    let t = Math.floor(Math.random() * docs.length);
                    dispatch(addTracks([docs[t]]));
                    dispatch(loadCover(docs[t].path));
                    dispatch(forwardFulfilled());
                }else{
                    // switching to random autodj if no albumartist tracks remain
                    dispatch(searchRejected("INFO no results found, autodj (albumartist) for " + currentTrack.title + " by " + currentTrack.albumartist + ". Switching to random autodj."));
                    //FIXME double toggleAutoDj is ugly
                    dispatch(toggleAutoDj());
                    dispatch(toggleAutoDj());
                    dispatch(forward());
                }
            }
            // ids of all tracks in tracklist
            let ids = getState().mediaplayer.tracklist.map(e => e.id);

            if(currentTrack.album && currentTrack.albumartist && currentTrack.albumartist != "Various Artists"){
                // FIXME problem if there is an album with the same name from another albumartist (e.g. bloom by rüfüs and beach house)
                database.find(
                    {$and:
                        [ {$or: [{album: currentTrack.album}, {albumartist: currentTrack.albumartist}] },
                        {_id: {$nin: ids}}]}
                ).sort({album: 1, albumartist: 1, track: 1}).exec(onFinish);
            }else if(currentTrack.album){
                database.find(
                    {$and: [{album: currentTrack.album},
                        {_id: {$nin: ids}}]}
                ).sort({album: 1, albumartist: 1, track: 1}).exec(onFinish);
            }else if(currentTrack.albumartist && currentTrack.albumartist != "Various Artists"){
                database.find(
                    {$and: [{albumartist: currentTrack.albumartist},
                        {_id: {$nin: ids}}]}
                ).sort({album: 1, albumartist: 1, track: 1}).exec(onFinish);
            }else{
                dispatch(searchRejected("WARN no albumartist and album information present for " + currentTrack.title + ". Search aborted."));
            }
        }
    }
}

// advances the tracklist and loads (and optionally plays) the next track
export const forwardFulfilled = (play) => {
    return {
        type: "FORWARD_FULFILLED",
        play: play
    }
}
export const forwardRejected = () => {
    return {
        type: "FORWARD_REJECTED",
    }
}

export const backward = () => {
    return function(dispatch, getState){
        if(getState().mediaplayer.time>10 | getState().mediaplayer.currentTrack==0){
            dispatch(backwardFulfilled());
        }else if(getState().mediaplayer.currentTrack>=1){ //if there is a previous track
            dispatch(loadCover(getState().mediaplayer.tracklist[getState().mediaplayer.currentTrack-1].path));
            dispatch(backwardFulfilled());
        }
    }

}
export const backwardFulfilled = () => {
    return {
        type: "BACKWARD_FULFILLED",
    }
}

export const backwardRejected= () => {
    return {
        type: "BACKWARD_REJECTED",
    }
}

export const mediaStatusChange = (status) => {
    return {
        type: "MEDIA_STATUS_CHANGE",
        payload: status,
     }
}

export const timeUpdate = (t) => {
     return {
        type: "TIME_UPDATE",
        payload: t,
    }
}

//metadata has been loaded from audiofile
export const loadedMetaData = () => {
    return {
        type: "LOADED_META_DATA"
    }
}

// select entries in tracklist with indices either additional (add to current selection) or exclusive (delete old selection)
export const selectInTracklist = (indices, exclusive) => {
    return {
        type: "SELECT_IN_TRACKLIST",
        indices: indices,
        exclusive: exclusive,
    }
}

// show the musiccollection overlay
export const toggleMusiccollectionOverlay = (visible) => {
    return {
        type: "TOGGLE_MUSICCOLLECTION_OVERLAY",
        payload: visible
    }
}
