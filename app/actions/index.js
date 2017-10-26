//Action creator
/// when database has been started
export const startDb = () => {
   return {
      type: "START_DB"
   }
}

export const rebuildDb = () => {
   return function(dispatch){
      //drop old database
      database.remove({ }, { multi: true }, function (err, numRemoved) {
        database.loadDatabase(function (err) {    });
      });

      require('node-dir').files("/media/music/Musik/", function(err, files) {
         if (err) dispatch(rebuildDbRejected("ERROR while reading the database directory"));
         for(let i=0; i<files.length;i++){
            if(files[i].endsWith(".mp3")){
               var readableStream = fs.createReadStream(files[i]);
               var parser =  musicmetadata(readableStream, function (err, metadata) {
                  if(err) throw err;
                  database.insert({path: files[i], title: metadata.title, track: metadata.track.no, artist: metadata.albumartist[0], album: metadata.album, year: metadata.year});
                  readableStream.close();
               });
            }
         }
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
  return {
    type: "DELETE_TRACK",
    id: id,
    index: index,
  };
};

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
            dispatch(searchEmpty());
         }
      }
      if(expr.startsWith("\"")){ //literal search
         let new_expr = expr.replace(/^"|"$/g, ''); //replace double quotes
         database.find(
            {$or:[
                  {title: new RegExp("^" + new_expr.toLowerCase() + "$", "i")},
                  {track: new RegExp("^" + new_expr.toLowerCase() + "$", "i")},
                  {artist: new RegExp("^" + new_expr.toLowerCase() + "$", "i")},
                  {album: new RegExp("^" + new_expr.toLowerCase() + "$", "i")},
                  {year: new RegExp("^" + new_expr.toLowerCase() + "$", "i")}
               ]}
         ).sort({artist: 1, album: 1, track: 1}).exec(onFinish);
      }else{ //normal search
         database.find({path: new RegExp(expr.toLowerCase(), "i")}).sort({artist: 1, album: 1, track: 1}).exec(onFinish);
      }
   }
}

export const searchFulfilled = (tracks) => {
   return{
      type: "SEARCH_FULFILLED",
      payload: tracks
   }
}

export const searchEmpty = () => {
   return{
      type: "SEARCH_EMPTY",
   }
}

export const searchRejected = (err) => {
   return{
      type: "SEARCH_REJECTED",
      payload: err
   }
}

export const addTrack = (track) => {
   return function(dispatch){
      //check if file exists
      // if(fs.existsSync(track.path)){
         dispatch(addTrackFulfilled({id: track._id, title: track.title, path: track.path, artist: track.artist, album: track.album, year: track.year}));
      // }else{
         // dispatch(addTrackRejected("ERROR physical file not found: " + track.path))
      // }
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

export const loadTrack = (id) => {
   return{
      type: "LOAD_TRACK",
      payload: id
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

export const forward = () => {
   return {
      type: "FORWARD"
   }
}

export const backward = () => {
   return {
      type: "BACKWARD"
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
