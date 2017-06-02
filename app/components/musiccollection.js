import React , {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "../actions/index.js";

class Musiccollection extends Component {
   //populates <li> with items from state
  createResults(){
    return this.props.results.map((item) => {
      return(
          <li key={item._id} onClick={(e) => this.clickedTrack(item, e)}>{item.title} - {item.artist}</li>
      );
    });
  }

  clickedTrack(item, e){
     this.props.addTrack(item);
 }

  render(){
    return(
      <div>
         <h2>Results</h2>
         <ul>
           {this.createResults()}
         </ul>
      </div>
    );
  }
}
//maps state (passed in) as props to components
function mapStateToProps(state){
  return {
    results: state.application.searchResults
  };
}

//maps actions to props
function mapDispatchToProps(dispatch){
  return bindActionCreators(Actions, dispatch);
}

//Turn dump component into smart container
export default connect(mapStateToProps, mapDispatchToProps)(Musiccollection);
