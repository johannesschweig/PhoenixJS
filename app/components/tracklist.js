import React , {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "../actions/index.js";
//DND
import {DragDropContext} from "react-dnd";
import ElectronBackend from "react-dnd-electron-backend";
import Card from './Card';

@DragDropContext(ElectronBackend)
class Tracklist extends Component {
   //populates <li> with items from state
  createTracklist(){
    return this.props.tracklist.map((track, i) => {
      return(
          <Card
          key={track.id}
          index={i}
          id={track.id}
          text={track.title}
          moveCard={this.moveTrack.bind(this)}
          onClick={this.clickedTrack.bind(this)}/>
      );
    });
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
        <ul>
          {this.createTracklist()}
        </ul>
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
    tracklist: state.mediaplayer.tracklist
  };
}

//maps actions to props
function mapDispatchToProps(dispatch){
  return bindActionCreators(Actions, dispatch);
}

//Turn dump component into smart container
export default connect(mapStateToProps, mapDispatchToProps)(Tracklist);
