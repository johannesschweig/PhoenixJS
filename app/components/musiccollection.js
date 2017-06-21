import React , {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "../actions/index.js";

class Musiccollection extends Component {
   //populates <li> with items from state
  createResults(style){
   return this.props.results.map((item) => {
      return(
         <tr  key={item._id} onClick={(e) => this.clickedTrack(item, e)}>
            <td style={style}>{item.title}</td>
            <td style={style}>{item.artist}</td>
         </tr>
      );
    });
  }

  clickedTrack(item, e){
     this.props.addTrack(item);
 }

  render(){
   const tableStyle = {
      border: "1px solid #32363f",
      borderCollapse: "collapse",
   };

   return(
      <div>
         <h2>results</h2>
         <table style={tableStyle}>
            <tbody>
               <tr>
                  <th style={tableStyle}>title</th>
                  <th style={tableStyle}>artist</th>
               </tr>
               {this.createResults(tableStyle)}
            </tbody>
         </table>
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
