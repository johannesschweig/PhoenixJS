import React  from "react"
import ReactTooltip from 'react-tooltip'
import TitleBar from './titlebar.js'
import Tracklist from "./tracklist.js"
import Musiccollection from "./musiccollection.js"
import Controls from "./controls.js"
import {colors} from "../style.js"
import * as constants from '../constants/constants.js'
import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu"
import {showInFileExplorer} from '../utils/index.js'

const fontStyle = {
   fontFamily: "Roboto,sans-serif",
   color: colors.primaryTextColor,
}

const App = () => (
  <div style={fontStyle}>
    <TitleBar/>
    <Tracklist/>
    <Controls/>
    <Musiccollection/>
    {/* Tooltips for buttons and icons */}
    <ReactTooltip effect='solid' delayShow={constants.DELAY_TOOLTIP}/>
    {/* ContextMenu for "Show in File Explorer" */}
    <ContextMenu id={constants.SHOW_IN_FILE_EXPLORER} style={{cursor: "pointer", padding: "8px 16px", backgroundColor: colors.primaryLightColor, fontSize: '14px'}}>
        <MenuItem onClick={showInFileExplorer}>Show in File Explorer</MenuItem>
    </ContextMenu>
  </div>
)


export default App
