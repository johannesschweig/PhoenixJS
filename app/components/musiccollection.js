import React , {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "../actions/index.js";

class Musiccollection extends Component {
   createRows(){
      const style = {
         border: "1px solid #32363f",
         borderCollapse: "collapse",
         fontSize: "14px",
         padding: "0.4rem",
      };

      return this.props.application.searchResults.map((item) => {
         return(
            <tr  key={item._id} style={{cursor: "pointer"}} onClick={(e) => this.clickedTrack(item, e)}>
               <td style={style}>{item.title}</td>
               <td style={style}>{item.artist}</td>
               <td style={style}>{item.album}</td>
               <td style={style}>{item.year}</td>
               <td style={style}>{item.track}</td>
            </tr>
         );
      });
   }

   //create a table from results
   createTable(){
      const fontWeight = "normal";
      const fontSize = "16px";

      if(this.props.application.searchResults.length==0){
         return(
            <div style={{fontSize}}>No Results</div>
         );
      }else{
         return(
            <table style={{borderCollapse: "collapse", width: "100%"}}>
               <tbody>
                  <tr>
                     <th style={{fontWeight, fontSize}}>title</th>
                     <th style={{fontWeight, fontSize}}>artist</th>
                     <th style={{fontWeight, fontSize}}>album</th>
                     <th style={{fontWeight, fontSize}}>year</th>
                     <th style={{fontWeight, fontSize}}>track</th>
                  </tr>
                  {this.createRows()}
               </tbody>
            </table>
         );
      }
   }

   clickedTrack = (item, e) => {
      this.props.addTrack(item);
   }

   //search Track from the searchfield
   search(event){
      if(event.key == "Enter"){
         event.preventDefault(); //consumes the event
         this.props.search(this.refs.searchText.value);
      }
   }

   //rebuild the database
   rebuildDb(){
      this.props.rebuildDb(this.props.application.database);
   }

  render(){
   const textStyle = {
      backgroundColor: "transparent",
      border: "1px solid #32363f",
      color: "inherit",
      width: "100%",
      fontFamily: "inherit",
      fontWeight: "inherit",
      fontSize: "inherit",
      outline: "none",
   };
   const buttonStyle = {
      backgroundColor: "#cccccc",
      color: "#32363f",
      border: "none",
      outline: "none",
      cursor: "pointer",
   };
   return(
      <div>
         <textarea placeholder="search..."style={textStyle} ref="searchText" onKeyPress={this.search.bind(this)}/>
         <button style={buttonStyle} onClick={this.rebuildDb.bind(this)}>Rebuild database</button>
         <h2 style={{fontWeight: "normal"}}>results</h2>
         {this.createTable()}
      </div>
      );
   }
}
//maps state (passed in) as props to components
function mapStateToProps(state){
  return {
     application: state.application,
  };
}

//maps actions to props
function mapDispatchToProps(dispatch){
  return bindActionCreators(Actions, dispatch);
}

//Turn dump component into smart container
export default connect(mapStateToProps, mapDispatchToProps)(Musiccollection);
