import {addTracks} from "./actions-mediaplayer.js";

// when database has been started
export const startDb = () => {
    return {
        type: "START_DB"
    }
}

// rebuilds the whole database (mode: full, folder: "") or adds a folder (mode: "partial", folder: "/...")
export const rebuildDb = (mode, folder) => {
    return function(dispatch, getState){
        // path to rebuild
        let path;
        let rootPath = getState().mediaplayer.rootPath;
        // delete database and make a full rebuild
        if(mode=="full"){
            //drop old database
            database.remove({ }, { multi: true }, function (err, numRemoved) {
                database.loadDatabase(function (err) {    });
            });

            //root path of music
            path = rootPath;
        }else{ // add folder to database
            path = folder;
        }
        require('node-dir').files(path, function(err, files) {
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
                        database.insert({path: filePath, title: metadata.title, track: metadata.track.no, artist: metadata.albumartist[0], album: metadata.album, year: metadata.year, rating: r, selected: false});
                        readableStream.close();
                    });
                }
            });
            dispatch(rebuildDbFulfilled(mode, folder));
        });
    }
}

export const rebuildDbFulfilled = (mode, folder) => {
    return {
        type: "REBUILD_DB_FULFILLED",
        mode: mode,
        folder: folder,
    }
}

export const rebuildDbRejected = (err) => {
    return {
        type: "REBUILD_DB_REJECTED",
        payload: err
    }
}
//search the database for the search term
///results are sorted (artist, album, track)
export const search = (expr) => {
    return function(dispatch){
        const onFinish = (err, docs) => {
            if(err) dispatch(searchRejected("ERROR failed to retrieve items from database"));
            if(docs.length>0){
                dispatch(searchFulfilled(expr, docs));
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

export const searchFulfilled = (term, tracks) => {
    return{
        type: "SEARCH_FULFILLED",
        term: term,
        tracks: tracks.map((val, index) => {
            val.index = index;
            val.selected = false;
            return val;
        })
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

// select entries in musiccollection with indices either additional (add to current selection) or exclusive (delete old selection)
export const selectInMusiccollection = (indices, exclusive) => {
    return {
        type: "SELECT_IN_MUSICCOLLECTION",
        indices: indices,
        exclusive: exclusive,
    }
}
// add selected tracks to tracklist
export const addSelectedTracks = () => {
    return function(dispatch, getState) {
        let tracks = getState().database.searchResults.filter(track => track.selected == true);
        dispatch(addTracks(tracks));
    }
}
