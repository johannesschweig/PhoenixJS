import React , {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "../actions/index.js";

class Tracklist extends Component {
   //populates <li> with items from state
  createTracklist(){
    return this.props.tracklist.map((track) => {
      return(
          <li key={track.id} onClick={(e) => this.clickedTrack(track, e)} onContextMenu={(e) => this.clickedTrack(track, e)}>{track.title}</li>
      );
    });
  }

  //plays/deletes Track from tracklist
  clickedTrack(track, e){
     if(e.nativeEvent.which==1){ //left click
        this.props.playTrack(track);
     }else if (e.nativeEvent.which==3) { //right click
        this.props.deleteTrack(track.id);
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
        <button disabled="true" onClick={this.rebuildDb.bind(this)}>Rebuild database</button>
      </div>
    );
  }
}
//maps state (passed in) as props to components
function mapStateToProps(state){
  return {
    application: state.application,
    tracklist: state.tracklist
  };
}

//maps actions to props
function mapDispatchToProps(dispatch){
  return bindActionCreators(Actions, dispatch);
}

//Turn dump component into smart container
export default connect(mapStateToProps, mapDispatchToProps)(Tracklist);
