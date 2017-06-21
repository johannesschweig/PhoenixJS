import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class Card extends Component {
   constructor(props){
      super(props);
      this.state = {hover: false};
  }

  static propTypes = {
    index: PropTypes.number.isRequired,
    id: PropTypes.any.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired,
  };

   //toggle hover state on
   hoverOn = () => {
      this.setState({hover: true})
   }
   hoverOff = () => {
      this.setState({hover: false})
   }

  render() {
   //div style
   const { text } = this.props;
   const fontWeight = this.props.active ? "normal" : "lighter";
   const style = {
     padding: "0.5rem 1rem",
     marginBottom: ".5rem",
     border: "1px solid #32363f",
   };
   //Delete style
   var hoverColor;
   if(this.state.hover){
      hoverColor = "#ff6600";
   }else{
      hoverColor = "#cccccc";
   }
   const delStyle = {
      float: "right",
      fontWeight: "bold",
      color: hoverColor,
      cursor: "pointer"
   }


    return(
      <div onClick={(e) => this.props.onClick(this.props.id, e)} style={{ ...style, fontWeight }}>
        {text}
        <div id="test" style={delStyle} onMouseEnter={this.hoverOn} onMouseLeave={this.hoverOff} onClick={() => this.props.onDelete(this.props.id, this.props.index)}>X</div>
      </div>
    );
  }
}
