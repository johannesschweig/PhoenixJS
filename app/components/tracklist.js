import React , {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "../actions/index.js";
import Card from "./card.js";

class Tracklist extends Component {
   //populates <li> with items from state
  createTracklist(){
    return this.props.tracklist.map((track, i) => {
      let active = (i == this.props.currentTrack);
      return(
          <Card
          key={track.id}
          index={i}
          active={active}
          title={track.title}
          artist={track.artist}
          id={track.id}
          onClick={this.clickedTrack.bind(this)}
          onDelete={this.deleteTrack.bind(this)}/>
      );
    });
  }
  //delet TrackCard
  deleteTrack(id, index){
     this.props.deleteTrack(id, index);
 }

  //move TrackCard
  // moveTrack(dragIndex, hoverIndex){
  //    this.props.moveTrack(dragIndex, hoverIndex);
  //  }

  //plays/deletes Track from tracklist
  clickedTrack(id, e){
     if(e.nativeEvent.which==1){ //left click + double
        this.props.loadTrack(id);
        this.props.playTrack();
     }
 }

   render(){
      return(
         <div>
           <h2 style={{fontWeight: "normal"}}>tracklist</h2>
           <div style={{paddingBottom: "1rem"}}>
             {this.createTracklist()}
           </div>
         </div>
    );
  }
}
//maps state (passed in) as props to components
function mapStateToProps(state){
   return {
      tracklist: state.mediaplayer.tracklist,
      currentTrack: state.mediaplayer.currentTrack,
  };
}

//maps actions to props
function mapDispatchToProps(dispatch){
  return bindActionCreators(Actions, dispatch);
}

//Turn dump component into smart container
export default connect(mapStateToProps, mapDispatchToProps)(Tracklist);
