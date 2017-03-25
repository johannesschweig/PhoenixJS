const initialState = [
 {id: 1, title: "Zu spät"},
 {id: 2, title: "Hello"},
 {id: 3, title: "Hey Now"}
];

export function TracklistReducer(state=initialState, action){
   switch(action.type){
      case "DELETE_TRACK":
         const trackId = action.payload;
         return state.filter(track => track.id !== trackId);
         break;
      case "ADD_TRACK_FULFILLED":
         return state.concat(action.payload);
         break;
      case "ADD_TRACK_REJECTED":
         return state;
         break;
    }
    return state;
}
