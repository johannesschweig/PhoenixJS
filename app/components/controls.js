import React , {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "../actions/index.js";

class Controls extends Component {
   createControls(){
      return(<div><div>Previous</div><div>PlayPause</div><div>Next</div></div>);
   }

   render(){
    return(
      <div>
         {this.createControls()}
      </div>
    );
  }
}
//maps state (passed in) as props to components
// function mapStateToProps(state){
//   return {
//     results: state.application.searchResults
//   };
// }

//maps actions to props
function mapDispatchToProps(dispatch){
  return bindActionCreators(Actions, dispatch);
}

//Turn dump component into smart container
export default connect(mapDispatchToProps)(Controls);
