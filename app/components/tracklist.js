import React , {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {deleteTrack} from "../actions/index.js";

class Tracklist extends Component {

  createTracklist(){
    return this.props.tracklist.map((track) => {
      return(
          <li key={track.id} onClick={() => this.props.deleteTrack(track.id)}>{track.title}</li>
      );
    });
  }

  render(){
    return(
      <div>
        <h2>tracklist</h2>
        <ul>
          {this.createTracklist()}
        </ul>
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
  return bindActionCreators({deleteTrack}, dispatch);
}

//Turn dump component into smart container
export default connect(mapStateToProps, mapDispatchToProps)(Tracklist);
