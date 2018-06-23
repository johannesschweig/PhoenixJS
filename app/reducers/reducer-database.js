const initialState = {
    databaseState: null,
    searchResults: [],
    lastSearch: null,
};

export function DatabaseReducer(state=initialState, action){
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
            // add the "selected" attribute to the array
            let sr = action.tracks.map((obj) => {
                obj.selected = false;
                return obj;
            });
            return { ...state, searchResults: sr, lastSearch: action.term};
            break;
        case "SEARCH_EMPTY":
            return {...state, searchResults: [], lastSearch: action.payload};
            break;
        case "SEARCH_REJECTED":
            console.log(action.payload);
            return state;
            break;
        case "SELECT_IN_MUSICCOLLECTION":
            return {...state, searchResults: state.searchResults.map((obj) => {
                if (action.indices.includes(obj.index)) {
                    obj.selected = true;
                } else {
                    if (action.exclusive) {
                        obj.selected = false;
                    }
                }
                return obj;
            })};
            break;
    }
    return state;
}
