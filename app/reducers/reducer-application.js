const initialState = [
   {databaseState: null}
];

export function ApplicationReducer(state=initialState, action){
   switch(action.type){
      case "START_DB":
         return Object.assign({}, state, { databaseState: "running"});
         break;
      case "REBUILD_DB_FULFILLED":
         return state;
         break;
      case "REBUILD_DB_REJECTED":
         return state;
         break;
    }
    return state;
}
