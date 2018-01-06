import React , {Component} from "react";
var ReactDOM = require('react-dom');
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "../actions/index.js";
import {colors} from "../style.js";

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
    borderRadius: "2px",
}
const fgProgStyle = {
    marginTop: "-4px",
    backgroundColor: colors.secondaryColor,
    height: "4px",
    borderRadius: "2px",
}
const progContStyle = {
    height: "4px",
    borderRadius: "2px",
    cursor: "pointer",
    margin: "8px 24px 8px 24px",
}



class Controls extends Component {
    seek(e){
        let obj = ReactDOM.findDOMNode(this);
        this.props.seek(e.nativeEvent.offsetX/(obj.getBoundingClientRect().width - 48));
    }
    backward(){
        this.props.backward();
    }
    forward(){
        this.props.forward();
    }
    playpause(){
        this.props.playPause();
    }
    autoDj(){
        this.props.toggleAutoDj();
    }

    render(){
        let playPauseIcon;
        if(this.props.status=="playing"){
            playPauseIcon = "./img/ic_pause_circle_filled_white_36dp.png";
        }else{
            playPauseIcon = "./img/ic_play_circle_filled_white_36dp.png";
        }
        // display autoDJ status
        let c = this.props.autoDjStatus ? colors.primaryLightColor : "transparent";
        // compute progress in percent and round to integer
        let progress = 0;
        if(this.props.time!=null && this.props.duration!=null){
           progress = Math.round(this.props.time/this.props.duration*1000)/10;
        }

        //set border
        let b = (progress == 0) ? 0 : 1;

        return(
            <div>
                <div style={progContStyle}>
                    <div ref="bgProg" style={bgProgStyle} onClick={this.seek.bind(this)}></div>
                    <div style={{...fgProgStyle, ...{width: progress+"%"}}} onClick={this.seek.bind(this)}></div>
                </div>
                <div style={{height: "48px"}}>
                    <img onClick={this.autoDj.bind(this)} style={{...smallIconStyle, backgroundColor: c, float: "right", marginRight: "24px"}} src="./img/ic_queue_play_next_white_24dp.png"></img>
                    <div style={{margin: "0 auto", width: "150px"}}>
                        <img onClick={this.backward.bind(this)} style={smallIconStyle} src="./img/ic_skip_previous_white_24dp.png"></img>
                        <img onClick={this.playpause.bind(this)} style ={bigIconStyle} src={playPauseIcon}></img>
                        <img onClick={this.forward.bind(this)} style={smallIconStyle} src="./img/ic_skip_next_white_24dp.png"></img>
                    </div>
                </div>
            </div>
        );
   }
}
//maps state (passed in) as props to components
function mapStateToProps(state){
    return {
        status: state.mediaplayer.status,
        time: state.mediaplayer.time,
        duration: state.mediaplayer.duration,
        autoDjStatus: state.mediaplayer.autoDj,
    };
}

//maps actions to props
function mapDispatchToProps(dispatch){
    return bindActionCreators(Actions, dispatch);
}

//Turn dump component into smart container
export default connect(mapStateToProps, mapDispatchToProps)(Controls);
