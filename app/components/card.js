import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Card for individual tracks in tracklist
export default class Card extends Component {
   constructor(props){
      super(props);
      this.state = {
         hover: false,
         delHover: false,
      };
  }

  static propTypes = {
    index: PropTypes.number.isRequired,
    id: PropTypes.any.isRequired,
    path: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired,
  };

   //toggle delete hover state on
   hoverDelOn = () => {
      this.setState({delHover: true})
   }
   hoverDelOff = () => {
      this.setState({delHover: false})
   }

   hoverOn = () => {
      this.setState({hover: true})
   }
   hoverOff = () => {
      this.setState({hover: false})
   }

  render() {
   //div style
   const artist = this.props.artist;
   const title = this.props.title;

   const style = {
     padding: "0.5rem 1rem",
     borderBottomWidth: "1px",
     borderBottomColor: "#32363f",
     borderBottomStyle: "solid",
     fontSize: "14px",
     cursor: "pointer",
     fontWeight: this.props.active ? "normal" : "lighter",
     color: this.props.active ? "#ff6600" : "#cccccc",
     backgroundColor: this.props.active ? "#32363f" : "transparent",
   };
   //Delete style
   const src = this.state.delHover ? "./img/delete_hover.png" : "./img/delete.png";
   const delStyle = {
      display: this.state.hover ? "block" : "none",
      float: "right",
      height: "14px",
      padding: "2.5px 0 2.5px 0",
   }


    return(
      <div onMouseEnter={this.hoverOn} onMouseLeave={this.hoverOff} style={style}>
        <div style={{display: "inline"}} onClick={(e) => this.props.onClick(this.props.id, this.props.path, e)}>{title} - <i>{artist}</i></div>
        <img src={src} id="test" style={delStyle} onMouseEnter={this.hoverDelOn} onMouseLeave={this.hoverDelOff} onClick={() => this.props.onDelete(this.props.id, this.props.index)}></img>
      </div>
    );
  }
}
