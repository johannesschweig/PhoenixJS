import React , {Component} from "react"
var ReactDOM = require('react-dom')
import {bindActionCreators} from "redux"
import {connect} from "react-redux"
import {seek, backward, forward, toggleAutoDj, playPause} from "../actions/actions-mediaplayer.js"
import {toggleMusiccollectionOverlay} from '../actions/actions-application.js'
import {colors} from "../style.js"
import * as constants from '../constants/constants.js'

const smallIconStyle = {
    padding: "12px 4px",
    cursor: "pointer",
}
const bigIconStyle = {
    cursor: "pointer",
    padding: "6px 0",
}

const bgProgStyle = {
    backgroundColor: colors.primaryLightColor,
    height: "4px",
    flexGrow: 1,
    borderRadius: "2px",
    marginTop: "5px",
    marginBottom: "5px",
    cursor: "pointer",
}
const fgProgStyle = {
    marginTop: "-9px",
    backgroundColor: colors.secondaryColor,
    height: "4px",
    borderRadius: "2px",
    cursor: "pointer",
}
const progContStyle = {
    margin: "8px 24px 8px 24px",
    display: "flex",
}
const progBarContStyle = {
    height: "15px",
    width: "100%",
}
// style for time labels
const timeLabelStyle = {
    fontSize: "13px",
    opacity: 0.5,
}



class Controls extends Component {
    seek(e){
        let obj = ReactDOM.findDOMNode(this)
        // offsetX: x pos of click on element (0px far left, width px far right)
        // this.refs.bgProg.clientWidth: width of the element
        this.props.seek(e.nativeEvent.offsetX/this.refs.bgProg.clientWidth)
    }
    backward(){
        this.props.backward()
    }
    forward(){
        this.props.forward()
    }
    playpause(){
        this.props.playPause()
    }
    toggleAutoDj(){
        this.props.toggleAutoDj()
    }

    // shows the musiccollection overlay
    showMusiccollectionOverlay() {
        this.props.toggleMusiccollectionOverlay(true)
    }

    convertSecondsToCustomFormat(seconds){
        if(seconds){
            // return seconds in format m:ss
            return Math.floor(seconds/60) + ":" + ("0" + Math.floor(seconds%60)).slice(-2)
        }else{
            return null
        }
    }

    render(){
        let playPauseIcon
        if(this.props.playing){
            playPauseIcon = "./img/ic_pause_circle_filled_white_36dp.png"
        }else{
            playPauseIcon = "./img/ic_play_circle_filled_white_36dp.png"
        }
        // display autoDJ status
        let opac
        if (this.props.autoDj === constants.AUTODJ_OFF) {
            opac = .2
        } else if (this.props.autoDj === constants.AUTODJ_RANDOM) {
            opac = .6
        } else if (this.props.autoDj === constants.AUTODJ_ALBUM_ARTIST) {
            opac = 1
        }
        // compute progress in percent and round to integer
        let progress = 0
        if(this.props.time!=null && this.props.duration!=null){
           progress = Math.round(this.props.time/this.props.duration*1000)/10
        }

        // set border
        let b = (progress == 0) ? 0 : 1

        // determine margin left and right for progressbar (if no time is displayed, the margin between bar and label is not needed)
        let margL = this.props.time ? "8px" : "0"
        let margR = this.props.duration ? "8px" : "0"
        return(
            <div>
                <div style={progContStyle}>
                    <div style={timeLabelStyle}>{this.convertSecondsToCustomFormat(this.props.time)}</div>
                    <div style={{...progBarContStyle, marginLeft: margL, marginRight: margR}}>
                        <div ref="bgProg" style={bgProgStyle} onClick={this.seek.bind(this)}></div>
                        <div style={{...fgProgStyle, ...{width: progress+"%"}}} onClick={this.seek.bind(this)}></div>
                    </div>
                    <div style={timeLabelStyle}>{this.convertSecondsToCustomFormat(this.props.duration)}</div>
                </div>
                <div style={{height: "48px", paddingBottom: "8px"}}>
                    <div style={{float: "right", marginRight: "24px"}}>
                        <img onClick={this.showMusiccollectionOverlay.bind(this)} style={smallIconStyle} src="./img/ic_search_white_24dp.png"></img>
                        <img onClick={this.toggleAutoDj.bind(this)} style={{...smallIconStyle, opacity: opac}} src="./img/ic_add_to_queue_white_24dp.png"></img>
                    </div>
                    <div style={{margin: "0 auto", width: "150px"}}>
                        <img onClick={this.backward.bind(this)} style={smallIconStyle} src="./img/ic_skip_previous_white_24dp.png"></img>
                        <img onClick={this.playpause.bind(this)} style ={bigIconStyle} src={playPauseIcon}></img>
                        <img onClick={this.forward.bind(this)} style={smallIconStyle} src="./img/ic_skip_next_white_24dp.png"></img>
                    </div>
                </div>
            </div>
        )
   }
}
//maps state (passed in) as props to components
function mapStateToProps(state){
    return {
        playing: state.mediaplayer.playing,
        time: state.mediaplayer.time,
        duration: state.mediaplayer.duration,
        autoDj: state.mediaplayer.autoDj,
    }
}

//maps actions to props
function mapDispatchToProps(dispatch){
    return bindActionCreators({seek, backward, forward, toggleAutoDj, playPause, toggleMusiccollectionOverlay}, dispatch)
}

//Turn dump component into smart container
export default connect(mapStateToProps, mapDispatchToProps)(Controls)
