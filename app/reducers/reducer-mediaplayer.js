import update from 'immutability-helper';

const initialState = {
   status: null,
   currentTrack: null,
   tracklist: [{album: "testalbum", artist: "testartist", id: "1Hqw0krtsT1wECG0", path: "testpath", title: "testtitle", year: 1921},
                  {album: "testalbum2", artist: "testartist2", id: "2Hqw0krtsT1wECG0", path: "testpath2", title: "testtitle2", year: 1922},
                  {album: "testalbum3", artist: "testartist3", id: "3Hqw0krtsT1wECG0", path: "testpath3", title: "testtitle3", year: 1923},
                  {album: "testalbum4", artist: "testartist4", id: "4Hqw0krtsT1wECG0", path: "testpath4", title: "testtitle4", year: 1924}
]
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
