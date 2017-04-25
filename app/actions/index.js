import {walk} from "../utils/filewalk.js";
//Action creator
/// when database has been started
export const startDb = () => {
   return {
      type: "START_DB"
   }
}

export const rebuildDb = () => {
   return function(dispatch){
      var addToDatabase = (files) => {
         for(let i=0;i<files.length;i++){
            database.insert({path: files[i]});
         }
         dispatch(rebuildDbFulfilled());
      }

      walk("E:/Musik/", function(err, results) {
       if (err) dispatch(rebuildDbRejected("ERROR while reading the database directory"));
        addToDatabase(results);
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


export const deleteTrack = (id) => {
  return {
    type: "DELETE_TRACK",
    payload: id
  };
};

export const search = (expr) => {
   return function(dispatch){
      let fs = require("fs");
      database.find({path: new RegExp(expr)}, function(err, docs){
         if(err) dispatch(addTrackRejected("ERROR no entry in database"));
         console.log("search <", expr, ">", docs.length, "items");

         if(docs.length>0){
            if(fs.existsSync(docs[0].path)){ //take only first result TODO
               dispatch(addTrackFulfilled({id: docs[0]._id, title: docs[0].path}));
            }else{
               dispatch(addTrackRejected("ERROR physical file not found: " + docs[0].path))
            }
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
