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

      //function to read tags and add files to database
      var addToDatabase = (files) => {
         for(let i=0;i<files.length;i++){ //had to change NodeFileReader in jsmediatags to make this work
            if(files[i].endsWith(".mp3")){
               new jsmediatags.Reader(files[i])
                  .setTagsToRead(["title", "track", "artist", "album", "year"])
                  .read({
                     onSuccess: function(tag) {
                        database.insert({path: files[i], title: tag.tags.title, track: tag.tags.track, artist: tag.tags.artist, album: tag.tags.album, year: tag.tags.year});
                     },
                     onError: function(error) {
                        console.log("ERROR", error.type, error.info, files[i]);
                     }
               });
            }
         }
         dispatch(rebuildDbFulfilled());
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

export const search = (expr) => {
   return function(dispatch){
      database.find({path: new RegExp(expr, "i")}, function(err, docs){
         if(err) dispatch(searchRejected("ERROR failed to retrieve items from database"));
         //console.log("search <", expr, ">", docs.length, "items");
         if(docs.length>0){
            dispatch(searchFulfilled(docs));
         }else{
            dispatch(searchEmpty());
         }
      });

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

export const playTrack = (id) => {
   return{
      type: "PLAY_TRACK",
      payload: id
   }
}

export const moveTrack = (drag, hover) => {
   return{
      type: "MOVE_TRACK",
      payload: {dragIndex: drag, hoverIndex: hover}
   }
}

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
