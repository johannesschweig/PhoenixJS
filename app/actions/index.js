//Action creator
export const deleteTrack = (id) => {
  return {
    type: "DELETE_TRACK",
    payload: id
  };
};

export const addTrack = (track) => {
   return function(dispatch){
      let fs = require("fs");
      if(fs.existsSync(track.title + ".mp3")){
      //if(fs.existsSync("C:/Users/Nash/Downloads/redux-master/pack.json")){
         dispatch(addTrackFulfilled(track));
      }else{
         dispatch(addTrackRejected("ERROR"))
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

export const playTrack = (track) => {
   return{
      type: "PLAY_TRACK",
      payload: track
   }
}
