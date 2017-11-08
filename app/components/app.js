import React  from "react";
import Tracklist from "./tracklist.js";
import Musiccollection from "./musiccollection.js";
import Controls from "./controls.js";
import {colors} from "../style.js";

const fontStyle = {
   fontFamily: "Roboto,sans-serif",
   color: colors.primaryTextColor,
};

const App = () => (
  <div style={fontStyle}>
    <Tracklist/>
    <Controls/>
    <Musiccollection/>
  </div>
);


export default App;
