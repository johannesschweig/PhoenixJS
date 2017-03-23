//Action creator
export const deleteTrack = (id) => {
  return {
    type: "DELETE_TRACK",
    payload: id
  };
};
