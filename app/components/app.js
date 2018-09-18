import React  from "react"
import ReactTooltip from 'react-tooltip'
import Tracklist from "./tracklist.js"
import Musiccollection from "./musiccollection.js"
import Controls from "./controls.js"
import {colors} from "../style.js"
import * as constants from '../constants/constants.js'

const fontStyle = {
   fontFamily: "Roboto,sans-serif",
   color: colors.primaryTextColor,
}

const App = () => (
  <div style={fontStyle}>
    <Tracklist/>
    <Controls/>
    <Musiccollection/>
    <ReactTooltip effect='solid' delayShow={constants.DELAY_TOOLTIP}/>
  </div>
)


export default App
