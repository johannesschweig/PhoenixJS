//Action creator
export const deleteTrack = (id) => {
  return {
    type: "DELETE_TRACK",
    payload: id
  };
};

export const addTrack = (track) => {
   return {
      type: "ADD_TRACK",
      payload: track
   }
}
