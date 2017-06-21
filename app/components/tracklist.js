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
      let t = track.title+" - "+track.artist;
      return(
          <Card
          key={track.id}
          index={i}
          active={active}
          text={t}
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
  moveTrack(dragIndex, hoverIndex){
     this.props.moveTrack(dragIndex, hoverIndex);
   }

  //plays/deletes Track from tracklist
  clickedTrack(id, e){
     if(e.nativeEvent.which==1){ //left click
        this.props.playTrack(id);
     }
 }
  //search Track from the searchfield
  search(){
     this.props.search(this.refs.searchText.value);
 }

   //rebuild the database
   rebuildDb(){
      this.props.rebuildDb(this.props.application.database);
   }

   handleKeyPress = (event) => {
      if(event.key == "Enter"){
         event.preventDefault(); //consumes the event
         this.search();
      }
   }

   render(){
      return(
         <div>
           <h2>tracklist</h2>
           <div>
             {this.createTracklist()}
           </div>
           <textarea ref="searchText" onKeyPress={this.handleKeyPress}/>
           <button onClick={this.rebuildDb.bind(this)}>Rebuild database</button>
         </div>
    );
  }
}
//maps state (passed in) as props to components
function mapStateToProps(state){
   return {
      application: state.application,
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
