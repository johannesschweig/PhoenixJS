const initialState = {
    databaseState: null,
    searchResults: [],
    lastSearch: null,
};

export function ApplicationReducer(state=initialState, action){
    switch(action.type){
        case "START_DB":
            return { ...state, databaseState: "running" };
            break;
        case "REBUILD_DB_FULFILLED":
            if (action.mode == "full") {
                console.log("INFO full update done");
            } else {
                console.log("INFO added folder " + action.folder + " to the database")
            }
            return state;
            break;
        case "REBUILD_DB_REJECTED":
            return state;
            break;
        case "SEARCH_FULFILLED":
            return { ...state, searchResults: action.tracks, lastSearch: action.term };
            break;
        case "SEARCH_EMPTY":
            return {...state, searchResults: [], lastSearch: action.payload};
            break;
        case "SEARCH_REJECTED":
            console.log(action.payload);
            return state;
            break;
    }
    return state;
}
