import update from 'immutability-helper';

const initialState = {
    status: null, //status: playing or paused
    autoDj: "random", //status of the autoDJ: enabled or disabled
    time: null, //currentTime
    duration: null,
    currentTrack: -1, //int of current track in tracklist 0-99
    cover: null, //cover of current track
    tracklist: [],
    musiccollectionVisible: false, // if musiccollection overlay is visible
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
                audiofile.pause();
                //check if new audiofile exists
                if(tl.length>1){ //switch to next track
                    if(tl.length-index>1){ //if there is a subsequent track
                        audiofile.src = rootPath + tl[ct+1].path;
                        return {...state, status: "paused", currentTrack: ct, tracklist: state.tracklist.filter(track => track.id !== id), time: null, duration: audiofile.duration};
                    }else{ // if there is previous track
                        audiofile.src = rootPath + tl[ct-1].path;
                        return {...state, status: "paused", currentTrack: ct-1, tracklist: state.tracklist.filter(track => track.id !== id), time: null, duration: audiofile.duration};
                    }
                }else{ //last track in tracklist
                    return {...state, status: null, currentTrack: -1, time: null, duration: null, tracklist: []};
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
            for (let obj of state.tracklist) {
                if(obj.id==action.payload.id){
                    existing = true;
                    break;
                }
            }
            if(!existing){ //if id is not in tracklist -> add
                return {...state, tracklist: state.tracklist.concat(action.payload)};
            }else{ //otherwise ignore
                console.log("INFO id is already in tracklist");
                return state;
            }
            break;
        case "ADD_TRACK_REJECTED":
            console.log(action.payload);
            return state;
            break;
        case "SEEK":
            let t = Math.round(action.payload*state.duration);
            audiofile.currentTime = t;
            return{...state, time: t}
            break;
        case "PLAY_TRACK":
            audiofile.play();
            return{...state, status: "playing"};
            break;
        case "LOAD_TRACK_FULFILLED":
            let index = state.tracklist.findIndex(e => e.id === action.id);
            audiofile.pause();
            audiofile.src = rootPath + state.tracklist[index].path;
            //play track
            audiofile.play();
            return {...state, status: "playing", currentTrack: index, cover: action.img};
            break;
        case "LOAD_COVER_FULFILLED":
            return {...state, cover: action.payload};
            break;
        case "LOAD_COVER_REJECTED":
            return {...state, cover: null};
            break;
        case "PLAY_PAUSE":
            switch(state.status){
                case null: console.log("INFO no track in tracklist");
                    return state;
                    break;
                case "playing":
                    audiofile.pause();
                    return {...state, status: "paused"};
                    break;
                case "paused":
                    //load current track
                    audiofile.play();
                    return {...state, status: "playing"};
                    break;
            }
            break;
        case "TOGGLE_AUTO_DJ":
            let aj;
            if (state.autoDj == "none") {
                aj = "random";
            } else if (state.autoDj == "random") {
                aj = "albumartist";
            } else if (state.autoDj == "albumartist") {
                aj = "none";
            }
            return {...state, autoDj: aj};
            break;
        case "FORWARD_FULFILLED":
            // load and play next track
            ct = state.currentTrack;
            audiofile.pause();
            audiofile.src = rootPath + state.tracklist[ct+1].path;
            audiofile.play();
            return {...state, status: "playing", currentTrack: ct+1, time: null, duration: audiofile.duration};
            break;
        case "FORWARD_REJECTED":
            console.log("INFO no next track to play");
            return state;
        case "BACKWARD_FULFILLED":
            ct = state.currentTrack;
            if(state.time > 10 || ct==0){
                audiofile.currentTime = 0;
                return {...state, time: 0};
            }if(ct>=1){ //if there is a previous track
                audiofile.pause();
                audiofile.src = rootPath + state.tracklist[ct-1].path;
                audiofile.play();
                return {...state, status: "playing", currentTrack: ct-1, time: null, duration: audiofile.duration};
            }else{
                console.log("INFO no previous track to play");
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
        case "SELECT_IN_TRACKLIST":
            return {...state, tracklist: state.tracklist.map((obj, index) => {
                if (action.indices.includes(index)) {
                    obj.selected = true;
                } else {
                    if (action.exclusive) {
                        obj.selected = false;
                    }
                }
                return obj;
            })};
            break;
        case "TOGGLE_MUSICCOLLECTION_OVERLAY":
            return {...state, musiccollectionVisible: action.payload};
            break;
        }
        return state;
}
