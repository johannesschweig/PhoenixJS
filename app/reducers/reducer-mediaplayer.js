import update from 'immutability-helper';
import Audiofile from "../components/audiofile.js";

const initialState = {
   audiofile: new Audiofile(),
   status: null,
   currentTrack: null,
   tracklist: []
};
// {album: "testalbum", artist: "testartist", id: "1Hqw0krtsT1wECG0", path: "testpath", title: "testtitle", year: 1921},
//                {album: "testalbum2", artist: "testartist2", id: "2Hqw0krtsT1wECG0", path: "testpath2", title: "testtitle2", year: 1922},
//                {album: "testalbum3", artist: "testartist3", id: "3Hqw0krtsT1wECG0", path: "testpath3", title: "testtitle3", year: 1923},
//                {album: "testalbum4", artist: "testartist4", id: "4Hqw0krtsT1wECG0", path: "testpath4", title: "testtitle4", year: 1924}

export function MediaplayerReducer(state=initialState, action){
   //vars
   let index;
   let id;
   let ct;
   let tl;
   let a;
   let existing;

   switch(action.type){
      case "DELETE_TRACK":
         index = action.index;
         id = action.id;
         ct = state.currentTrack;
         tl = state.tracklist;

         if(index==ct){ //active track gets deleted
            state.audiofile.pause();
            //check if new audiofile exists
            if(tl.length>1){ //switch to next track
               if(tl.length-index>1){ //if there is a subsequent track
                  return {...state, audiofile: new Audio(tl[ct+1].path), status: "paused", currentTrack: ct, tracklist: state.tracklist.filter(track => track.id !== id)};
               }else{
                  return {...state, audiofile: new Audio(tl[ct-1].path), status: "paused", currentTrack: ct-1, tracklist: state.tracklist.filter(track => track.id !== id)};
               }
            }else{ //last track in tracklist
               return {...state, audiofile: null, status: null, currentTrack: null, tracklist: []};
            }
         }else if(index<ct){ //decrease currentTrack
            return {...state, currentTrack: ct-1, tracklist: state.tracklist.filter(track => track.id !== id)};
         }else{ //keep currentTrack stable
            return {...state, tracklist: state.tracklist.filter(track => track.id !== id)};
         }
         break;
      case "ADD_TRACK_FULFILLED":
         //check if song already exists in tracklist
         existing = false;
         for(let i = 0;i<state.tracklist.length;i++){
            if(state.tracklist[i].id==action.payload.id){
               existing = true;
               break;
            }
         }
         if(!existing){ //if id is not in tracklist -> add
            if(state.status==null){ //no track loaded -> load this track
               a = state.audiofile;
               a.setSource(action.payload.path);
               return {...state, audiofile: a, status: "paused", currentTrack: 0, tracklist: state.tracklist.concat(action.payload)};
            }else{
               return {...state, tracklist: state.tracklist.concat(action.payload)};
            }
         }else{ //otherwise ignore
            console.log("ERROR id is already in tracklist");
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
      case "PLAY_PAUSE":
         switch(state.status){
            case null: console.log("ERROR no track in tracklist");
               return state;
               break;
            case "playing":
               state.audiofile.pause();
               return {...state, status: "paused"};
               break;
            case "paused":
               //load current track
               state.audiofile.play();
               return{...state, status: "playing"};
               break;
         }
      break;
      case "FORWARD":
         console.log("f");
         ct = state.currentTrack;
         if(state.tracklist.length>ct+1){ //if there is a next track
            a = state.audiofile;
            a.pause();
            a.setSource(state.tracklist[ct+1].path);
            a.play();
            return {...state, audiofile: a, status: "playing", currentTrack: ct+1};
         }else{
            console.log("ERROR no next track to play");
            return state;
         }
      break;
      case "BACKWARD": // TODO seek song backwards if <10s
         ct = state.currentTrack;
         if(ct>=1){ //if there is a next track
            a = state.audiofile;
            a.pause();
            a.setSource(state.tracklist[ct-1].path);
            a.play();
            return {...state, audiofile: a, status: "playing", currentTrack: ct-1};
         }else{
            console.log("ERROR no previous track to play");
            return state;
         }
      break;
    }
    return state;
}
