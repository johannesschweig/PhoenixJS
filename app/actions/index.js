//Action creator
/// when database has been started
export const startDb = () => {
   return {
      type: "START_DB"
   }
}

export const rebuildDb = () => {
   return function(dispatch){
      var fs = require("fs");
      let folder = "E:/Musik/Von Wegen Lisbeth/01-Grande-2016/";
      let tracks = [];
      fs.readdir(folder, function(err, files) {
         if(err){
            console.error("Could not list the directory.", err);
            dispatch(rebuildDbRejected("ERROR"));
            return;
         }

         files.forEach(function(file, index) {
            database.insert({name: file, path: folder + file});
         })
      })

      dispatch(rebuildDbFulfilled());
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


export const deleteTrack = (id) => {
  return {
    type: "DELETE_TRACK",
    payload: id
  };
};

export const addTrack = (track) => {
   return function(dispatch){
      let fs = require("fs");
      database.find({name: track.title+".mp3"}, function(err, docs){
         if(err) throw dispatch(addTrackRejected("ERROR no entry in database"));
         if(fs.existsSync("E:/Musik/Von Wegen Lisbeth/01-Grande-2016/" + track.title + ".mp3")){
            dispatch(addTrackFulfilled(track));
         }else{
            dispatch(addTrackRejected("ERROR physical file not found"))
         }
      });

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

export const playTrack = (track) => {
   return{
      type: "PLAY_TRACK",
      payload: track
   }
}
