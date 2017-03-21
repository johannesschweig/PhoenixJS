import React , {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

class NavBar extends Component {

  render(){
    return(
      <nav>{this.props.text}</nav>
    );
  }
}

//maps state (passed in) as props to components
function mapStateToProps(state){
  return {
    text: state.text
  };
}

export default connect(mapStateToProps)(NavBar);
