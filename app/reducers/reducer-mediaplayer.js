import update from 'immutability-helper';

const initialState = {
   status: null,
   currentTrack: null,
   tracklist: []
};

export function MediaplayerReducer(state=initialState, action){
   switch(action.type){
      case "DELETE_TRACK":
         const trackId = action.payload;
         return {...state, tracklist: state.tracklist.filter(track => track.id !== trackId)};
         break;
      case "ADD_TRACK_FULFILLED":
         //check if song already exists in tracklist
         let existing = false;
         for(let i = 0;i<state.tracklist.length;i++){
            if(state.tracklist[i].id==action.payload.id){
               existing = true;
               break;
            }
         }
         if(!existing){ //if id is not in tracklist -> add
            return {...state, tracklist: state.tracklist.concat(action.payload)};
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
      case "MOVE_TRACK":
         const dragCard = state.tracklist[action.payload.dragIndex];
         return {...state, tracklist: update(state.tracklist, {$splice: [[action.payload.dragIndex, 1],[action.payload,0, dragCard]]})};
         break;
    }
    return state;
}
