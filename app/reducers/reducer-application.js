const initialState = {
   databaseState: null,
   searchResults: []
};

export function ApplicationReducer(state=initialState, action){
   switch(action.type){
      case "START_DB":
         return { ...state, databaseState: "running" };
         break;
      case "REBUILD_DB_FULFILLED":
         return state;
         break;
      case "REBUILD_DB_REJECTED":
         return state;
         break;
      case "SEARCH_FULFILLED":
         return { ...state, searchResults: action.payload };
         break;
      case "SEARCH_REJECTED":
         return state;
         break;
    }
    return state;
}
