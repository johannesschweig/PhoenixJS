import React , {Component} from "react";
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
class Controls extends Component {
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
      return(
         <div style={divStyle}>
            <img  onClick={this.backward.bind(this)} style={smallStyle} src="./img/backward.png"></img>
            <img  onClick={this.playpause.bind(this)} style ={bigStyle} src={playPauseIcon}></img>
            <img  onClick={this.forward.bind(this)} style={smallStyle} src="./img/forward.png"></img>
         </div>
      );
   }
}
//maps state (passed in) as props to components
function mapStateToProps(state){
   return {
      status: state.mediaplayer.status,
  };
}

//maps actions to props
function mapDispatchToProps(dispatch){
  return bindActionCreators(Actions, dispatch);
}

//Turn dump component into smart container
export default connect(mapStateToProps, mapDispatchToProps)(Controls);
