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

      //function to read tags in batches and add files to database
      var addToDatabase = (files) => {
         var batch = 2500;
         //read tags for array files from position start to end
         function readTags(start){
            let end = (start+batch<files.length) ? (start+batch) : files.length;

            for(let i=start;i<end;i++){
               if(files[i].endsWith(".mp3")){
                  new jsmediatags.Reader(files[i])
                     .setTagsToRead(["title", "track", "artist", "album", "year"])
                     .read({
                        onSuccess: function(tag) {
                           database.insert({path: files[i], title: tag.tags.title, track: tag.tags.track, artist: tag.tags.artist, album: tag.tags.album, year: tag.tags.year});
                           if(i%2500==0){
                              readTags(end);
                           }
                           if(i==files.length){
                              dispatch(rebuildDbFulfilled());
                           }
                        },
                        onError: function(error) {
                           console.log("ERROR", error.type, error.info, files[i]);
                        }
                  });
               }
            }
         }

         readTags(0);
      }
      require('node-dir').files("E:/Musik/", function(err, files) {
         if (err) dispatch(rebuildDbRejected("ERROR while reading the database directory"));
         addToDatabase(files);
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
///results are sorted (artist, album, track) and limited to 50
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
         ).limit(50).sort({artist: 1, album: 1, track: 1}).exec(onFinish);
      }else{ //normal search
         database.find({path: new RegExp(expr.toLowerCase(), "i")}).limit(50).sort({artist: 1, album: 1, track: 1}).exec(onFinish);
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
