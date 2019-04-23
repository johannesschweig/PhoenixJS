import React , {Component} from "react"
import {colors} from "../style.js"

class TitleBar extends Component {

    // closes the application
    close() {
        const remote = require('electron').remote
        var window = remote.getCurrentWindow()
        window.close()
    }
    // minimizes the application
    minimize() {
        const remote = require('electron').remote
        var window = remote.getCurrentWindow()
        window.minimize();
    }

    render() {
        const style = {
            WebkitAppRegion: 'drag',
            backgroundColor: colors.primaryLightColor,
            height: '36px',
        }

        return(
            <div style={style}>
                <img width='24px' src='./img/icon.png' style={{padding: '6px', display: 'inline'}}></img>
                <div style={{verticalAlign: 'middle', display: 'inline-block', height: '36px', paddingBottom: '6px', paddingLeft: '2px'}}>PhoenixJS</div>
                <img src='./img/ic_close_white_24dp.png' onClick={this.close.bind(this)} style={{padding: '6px 4px 6px 2px', float: 'right', WebkitAppRegion: 'no-drag', cursor: 'pointer'}}></img>
                <img src='./img/baseline_minimize_white_24dp.png' onClick={this.minimize.bind(this)} style={{padding: '6px 2px', float: 'right', WebkitAppRegion: 'no-drag', cursor: 'pointer'}}></img>
            </div>
        )
    }
}

export default TitleBar
