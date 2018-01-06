//Action creator
/// when database has been started
export const startDb = () => {
    return {
        type: "START_DB"
    }
}

export const rebuildDb = () => {
    return function(dispatch, getState){
        //drop old database
        database.remove({ }, { multi: true }, function (err, numRemoved) {
            database.loadDatabase(function (err) {    });
        });
        //root path of music
        var rootPath = getState().mediaplayer.rootPath;

        require('node-dir').files(rootPath, function(err, files) {
            if (err) dispatch(rebuildDbRejected("ERROR while reading the database directory"));
            files.forEach(function(file){
                if(file.endsWith(".mp3")){
                    var readableStream = fs.createReadStream(file);
                    var parser =  musicmetadata(readableStream, function (err, metadata) {
                        if(err) throw err;
                        // to avoid ratings being undefined
                        var r = 0;
                        if(metadata.ratings.length>0){
                            r = metadata.ratings[0].rating;
                        }
                        //remove rootPath from filepath
                        let filePath = file.replace(rootPath, "");
                        database.insert({path: filePath, title: metadata.title, track: metadata.track.no, artist: metadata.albumartist[0], album: metadata.album, year: metadata.year, rating: r});
                        readableStream.close();
                    });
                }
            });
            dispatch(rebuildDbFulfilled());
        });
    }
}

export const rebuildDbFulfilled = () => {
    return {
        type: "REBUILD_DB_FULFILLED"
    }
}

export const rebuildDbRejected = (err) => {
    return {
        type: "REBUILD_DB_REJECTED",
        payload: err
    }
}


export const deleteTrack = (id, index) => {
    return function(dispatch, getState){
        let ct = getState().mediaplayer.currentTrack;
        let tl = getState().mediaplayer.tracklist;

        if(index==ct){ //active track gets deleted
            //check if new audiofile exists
            if(tl.length>1){ //switch to next track
                if(tl.length-index>1){ //if there is a subsequent track
                    dispatch(loadCover(tl[ct+1].path));
                }else{
                    dispatch(loadCover(tl[ct-1].path));
                }
            }else{ //last track in tracklist
                dispatch(loadCoverRejected());
            }
        }
        dispatch(deleteTrackFulfilled(id, index));
    };
}
export const deleteTrackFulfilled = (id, index) => {
    return {
        type: "DELETE_TRACK_FULFILLED",
        id: id,
        index: index,
    };
}
export const deleteTrackRejected = () => {
    return {
        type: "DELETE_TRACK_REJECTED",
    }
}

//search the database for the search term
///results are sorted (artist, album, track)
export const search = (expr) => {
    return function(dispatch){
        const onFinish = (err, docs) => {
            if(err) dispatch(searchRejected("ERROR failed to retrieve items from database"));
            //console.log("search <", expr, ">", docs.length, "items");
            if(docs.length>0){
                dispatch(searchFulfilled(docs));
            }else{
                dispatch(searchEmpty(expr));
            }
        }
        let prefix;
        let suffix;
        if(expr.startsWith("\"")){ //literal search
            prefix = "^";
            suffix = "$";
            expr = expr.replace(/^"|"$/g, ''); //replace double quotes
        }else{ //normal search
            prefix = "";
            suffix = "";
        }
        database.find(
            {$or:[
                {title: new RegExp(prefix + expr.toLowerCase() + suffix, "i")},
                {track: new RegExp(prefix + expr.toLowerCase() + suffix, "i")},
                {artist: new RegExp(prefix + expr.toLowerCase() + suffix, "i")},
                {album: new RegExp(prefix + expr.toLowerCase() + suffix, "i")},
                {year: new RegExp(prefix + expr.toLowerCase() + suffix, "i")}
            ]}
        ).sort({artist: 1, album: 1, track: 1}).exec(onFinish);
    }
}

export const searchFulfilled = (tracks) => {
    return{
        type: "SEARCH_FULFILLED",
        payload: tracks
    }
}

export const searchEmpty = (term) => {
    return{
        type: "SEARCH_EMPTY",
        payload: term
    }
}

export const searchRejected = (err) => {
    return{
        type: "SEARCH_REJECTED",
        payload: err
    }
}
//add track to tracklist
export const addTrack = (track) => {
    return function(dispatch, getState){
        //check if file exists
        let rootPath = getState().mediaplayer.rootPath;
        if(fs.existsSync(rootPath + track.path)){
            if(getState().mediaplayer.tracklist.length==0){
                dispatch(loadCover(track.path));
            }
            dispatch(addTrackFulfilled({id: track._id, title: track.title, path: track.path, artist: track.artist, album: track.album, year: track.year}));
        }else{
            dispatch(addTrackRejected("ERROR physical file not found: " + track.path))
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
        //do image processing
        //read coverart
        let rootPath = getState().mediaplayer.rootPath;
        var readableStream = fs.createReadStream(rootPath + path);
        var parser = musicmetadata(readableStream, function (err, metadata) {
            if (err) throw err;
            if(metadata.picture.length!=0){
                dispatch(loadCoverFulfilled(metadata.picture[0].data));
            }else{
                dispatch(loadCoverRejected());
            }
            readableStream.close();
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
       let rootPath = getState().mediaplayer.rootPath;
       var readableStream = fs.createReadStream(rootPath + path);
       var parser = musicmetadata(readableStream, function (err, metadata) {
           if (err) throw err;
           if(metadata.picture.length!=0){
               dispatch(loadTrackFulfilled(id, metadata.picture[0].data));
           }else{
               dispatch(loadTrackRejected());
            }
           readableStream.close();
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

export const loadTrackRejected = () => {
    return{
        type: "LOAD_TRACK_REJECTED"
    }
}
//plays the current track
export const playTrack = () => {
    return{
        type: "PLAY_TRACK"
    }
}

// export const moveTrack = (drag, hover) => {
//    return{
//       type: "MOVE_TRACK",
//       payload: {dragIndex: drag, hoverIndex: hover}
//    }
// }

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
        }else if(getState().mediaplayer.autoDj){ // if autoDJ is enabled
            // find appropriate track
            let currentTrack = getState().mediaplayer.tracklist[getState().mediaplayer.currentTrack];

            const onFinish = (err, docs) => {
                if(err) dispatch(searchRejected("ERROR failed to retrieve items from database"));
                // delete all tracks currently in tracklist (including the track the search was based on)
                let ids = getState().mediaplayer.tracklist.map(e => e.id);
                docs = docs.filter(track => ids.indexOf(track._id) == -1);
                if(docs.length>0){
                    dispatch(addTrack(docs[0]));
                    dispatch(loadCover(getState().mediaplayer.tracklist[getState().mediaplayer.currentTrack+1].path));
                    dispatch(forwardFulfilled());
                }else{
                    dispatch(searchRejected("INFO no results found autodj for " + currentTrack.title));
                }
            }
            if(currentTrack.album && currentTrack.artist && currentTrack.artist != "Various Artists"){
                database.find(
                    {$or:[ {album: currentTrack.album}, {artist: currentTrack.artist} ]}
                ).sort({album: 1, artist: 1, track: 1}).exec(onFinish);
            }else if(currentTrack.album){
                database.find({album: currentTrack.album}).sort({album: 1, artist: 1, track: 1}).exec(onFinish);
            }else if(currentTrack.artist && currentTrack.artist != "Various Artists"){
                database.find({artist: currentTrack.artist}).sort({album: 1, artist: 1, track: 1}).exec(onFinish);
            }else{
                dispatch(searchRejected("WARN no artist and album information present for " + currentTrack.title + ". Search aborted."));
            }
        }
    }
}

export const forwardFulfilled = () => {
    return {
        type: "FORWARD_FULFILLED"
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
