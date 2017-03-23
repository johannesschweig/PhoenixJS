import React , {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "../actions/index.js";

class Tracklist extends Component {
   //populates <li> with items from state
  createTracklist(){
    return this.props.tracklist.map((track) => {
      return(
          <li key={track.id} onClick={() => this.props.deleteTrack(track.id)}>{track.title}</li>
      );
    });
  }

  //adds Track from the searchfield
  addTrack(){
     this.props.addTrack({id: Math.floor(Math.random() * 1000), title: this.refs.searchText.value});
 }

  render(){
    return(
      <div>
        <h2>tracklist</h2>
        <ul>
          {this.createTracklist()}
        </ul>
        <textarea ref="searchText"/>
        <button onClick={this.addTrack.bind(this)}>Add</button>
      </div>
    );
  }
}
//maps state (passed in) as props to components
function mapStateToProps(state){
  return {
    tracklist: state.tracklist
  };
}

//maps actions to props
function mapDispatchToProps(dispatch){
  return bindActionCreators(Actions, dispatch);
}

//Turn dump component into smart container
export default connect(mapStateToProps, mapDispatchToProps)(Tracklist);
