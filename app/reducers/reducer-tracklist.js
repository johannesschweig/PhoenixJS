const initialState = [];

export function TracklistReducer(state=initialState, action){
   switch(action.type){
      case "DELETE_TRACK":
         const trackId = action.payload;
         return state.filter(track => track.id !== trackId);
         break;
      case "ADD_TRACK_FULFILLED":
         //check if song already exists in tracklist
         let existing = false;
         for(let i = 0;i<state.length;i++){
            if(state[i].id==action.payload.id){
               existing = true;
               break;
            }
         }
         if(!existing){ //if id is not in tracklist -> add
            return state.concat(action.payload);
         }else{ //otherwise ignore
            return state;
         }
         break;
      case "ADD_TRACK_REJECTED":
         return state;
         break;
      case "PLAY_TRACK":
         return state;
         break;
    }
    return state;
}
