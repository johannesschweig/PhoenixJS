import React  from "react";
import Tracklist from "./tracklist.js";
import Musiccollection from "./musiccollection.js";
import Controls from "./controls.js";

const fontStyle = {
   fontFamily: "Roboto,sans-serif",
   color: "#cccccc",
};

const App = () => (
  <div style={fontStyle}>
    <Tracklist/>
    <Controls/>
    <Musiccollection/>
  </div>
);


export default App;
