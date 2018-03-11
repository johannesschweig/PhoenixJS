import update from 'immutability-helper';
import {forward} from "../actions/index.js";

const initialState = {
    rootPath: "/mnt/music/Musik/",
    audiofile: null, //audiofile, defined in app.js
    status: null, //status: playing or paused
    autoDj: true, //status of the autoDJ: enabled or disabled
    time: null, //currentTime
    duration: null,
    currentTrack: null, //int of current track in tracklist 0-99
    cover: null, //cover of current track
    tracklist: [//{album: "testalbum", artist: "Billy Talent", id: "1Hqw0krtsT1wECG0", path: "testpath", title: "Broken Mirrors", year: 1921}, {album: "testalbum2", artist: "Billy Talent", id: "2Hqw0krtsT1wECG0", path: "testpath2", title: "Hey ho", year: 1922}, {album: "testalbum3", artist: "Billy Talent", id: "3Hqw0krtsT1wECG0", path: "testpath3", title: "Plumbuses are made", year: 1923}, {album: "testalbum4", artist: "Billy Talent", id: "4Hqw0krtsT1wECG0", path: "testpath4", title: "No time", year: 1924}
]
};

export function MediaplayerReducer(state=initialState, action){
    //vars
    let index, id, ct, tl, a, existing;

    switch(action.type){
        case "DELETE_TRACK_FULFILLED":
            index = action.index;
            id = action.id;
            ct = state.currentTrack;
            tl = state.tracklist;

            if(index==ct){ //active track gets deleted
                state.audiofile.pause();
                //check if new audiofile exists
                if(tl.length>1){ //switch to next track
                    if(tl.length-index>1){ //if there is a subsequent track
                        return {...state, audiofile: new Audio(state.rootPath + tl[ct+1].path), status: "paused", currentTrack: ct, tracklist: state.tracklist.filter(track => track.id !== id)};
                    }else{
                        return {...state, audiofile: new Audio(state.rootPath + tl[ct-1].path), status: "paused", currentTrack: ct-1, tracklist: state.tracklist.filter(track => track.id !== id)};
                    }
                }else{ //last track in tracklist
                    return {...state, audiofile: null, status: null, currentTrack: null, time: null, duration: null, tracklist: []};
                }
            }else if(index<ct){ //decrease currentTrack
                return {...state, currentTrack: ct-1, tracklist: state.tracklist.filter(track => track.id !== id)};
            }else{ //keep currentTrack stable
                return {...state, tracklist: state.tracklist.filter(track => track.id !== id)};
            }
            break;
        case "DELETE_TRACK_REJECTED":
            return state;
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
                    audiofile.src = state.rootPath + action.payload.path;

                    return {...state, audiofile: audiofile, status: "paused", currentTrack: 0, tracklist: state.tracklist.concat(action.payload)};
                }else{
                    return {...state, tracklist: state.tracklist.concat(action.payload)};
                }
            }else{ //otherwise ignore
                console.log("INFO id is already in tracklist");
                return state;
            }
            break;
        case "ADD_TRACK_REJECTED":
            return state;
            break;
        case "SEEK":
            let t = Math.round(action.payload*state.duration);
            audiofile.currentTime = t;
            return{...state, time: t}
            break;
        case "PLAY_TRACK":
            state.audiofile.play();
            return{...state, status: "playing"};
            break;
        // case "MOVE_TRACK":
        //    return {...state, tracklist: update(state.tracklist, {$splice: [[action.payload.dragIndex, 1],[action.payload,0, state.tracklist[action.payload.dragIndex]]]})};
        //    break;
        case "LOAD_TRACK_FULFILLED":
            let index = state.tracklist.findIndex(e => e.id === action.id);
            audiofile.pause();
            audiofile.src = state.rootPath + state.tracklist[index].path;
            //play track
            audiofile.play();
            return {...state, audiofile: audiofile, status: "playing", currentTrack: index, cover: action.img};
            break;
        case "LOAD_TRACK_REJECTED":
            return state;
            break;
        case "LOAD_COVER_FULFILLED":
            return {...state, cover: action.payload};
            break;
        case "LOAD_COVER_REJECTED":
            return {...state, cover: null};
            break;
        case "PLAY_PAUSE":
            switch(state.status){
                case null: console.error("INFO no track in tracklist");
                    return state;
                    break;
                case "playing":
                    state.audiofile.pause();
                    return {...state, status: "paused"};
                    break;
                case "paused":
                    //load current track
                    state.audiofile.play();
                    return {...state, status: "playing"};
                    break;
            }
            break;
        case "TOGGLE_AUTO_DJ":
            return {...state, autoDj: !state.autoDj};
            break;
        case "FORWARD_FULFILLED":
            ct = state.currentTrack;
            audiofile.pause();
            audiofile.src = state.rootPath + state.tracklist[ct+1].path;
            audiofile.play();
            return {...state, audiofile: audiofile, status: "playing", currentTrack: ct+1, duration: audiofile.duration};
            break;
        case "FORWARD_REJECTED":
            console.error("INFO no next track to play");
            return state;
        case "BACKWARD_FULFILLED":
            ct = state.currentTrack;
            if(state.time > 10 || ct==0){
                audiofile.currentTime = 0;
                return {...state, time: 0};
            }if(ct>=1){ //if there is a previous track
                audiofile.pause();
                audiofile.src = state.rootPath + state.tracklist[ct-1].path;
                audiofile.play();
                return {...state, audiofile: audiofile, status: "playing", currentTrack: ct-1, duration: audiofile.duration};
            }else{
                console.error("INFO no previous track to play");
                return state;
            }
            break;
        case "MEDIA_STATUS_CHANGE":
            return {...state, status: action.payload};
            break;
        case "TIME_UPDATE":
            return {...state, time: action.payload};
            break;
        case "LOADED_META_DATA":
            return {...state, duration: audiofile.duration};
            break;
        }
        return state;
}
