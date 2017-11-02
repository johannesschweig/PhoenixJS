import React , {Component} from "react";
var ReactDOM = require('react-dom');
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "../actions/index.js";

const smallStyle = {
    padding: "5px 10px 5px 10px",
    cursor: "pointer",
}
const bigStyle = {
    cursor: "pointer",
}
const divStyle = {
    margin: "5px auto",
    width: "150px",
}
const bgProgStyle = {
    backgroundColor: "#32363f",
    height: "4px",
    borderRadius: "2px",
}
const fgProgStyle = {
    marginTop: "-4px",
    backgroundColor: "#ff6600",
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
        // console.log(e.nativeEvent.offsetX/(obj.getBoundingClientRect().width - 48));
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
    render(){
        let playPauseIcon;
        if(this.props.status=="playing"){
            playPauseIcon = "./img/pause.png";
        }else{
            playPauseIcon = "./img/play.png";
        }
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
                <div style={divStyle}>
                    <img  onClick={this.backward.bind(this)} style={smallStyle} src="./img/backward.png"></img>
                    <img  onClick={this.playpause.bind(this)} style ={bigStyle} src={playPauseIcon}></img>
                    <img  onClick={this.forward.bind(this)} style={smallStyle} src="./img/forward.png"></img>
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
    };
}

//maps actions to props
function mapDispatchToProps(dispatch){
    return bindActionCreators(Actions, dispatch);
}

//Turn dump component into smart container
export default connect(mapStateToProps, mapDispatchToProps)(Controls);
