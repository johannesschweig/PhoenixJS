import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';

const style = {
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "lightgrey",
};

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  },
};

@DropTarget("card", cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource("card", cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class Card extends Component {
   constructor(props){
      super(props);
      this.state = {hover: false};
  }

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    text: PropTypes.string.isRequired,
    moveCard: PropTypes.func.isRequired,
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
   const { text, isDragging, connectDragSource, connectDropTarget } = this.props;
   const opacity = isDragging ? 0 : 1;
   const fontWeight = this.props.active ? "bold" : "normal";
   //Delete style
   var hoverColor;
   if(this.state.hover){
      hoverColor = "red";
   }else{
      hoverColor = "white";
   }
   const delStyle = {
      float: "right",
      fontWeight: "bold",
      color: hoverColor,
      cursor: "pointer"
   }


    return connectDragSource(connectDropTarget(
      <div onClick={(e) => this.props.onClick(this.props.id, e)} style={{ ...style, opacity, fontWeight }}>
        {text}
        <div id="test" style={delStyle} onMouseEnter={this.hoverOn} onMouseLeave={this.hoverOff} onClick={() => this.props.onDelete(this.props.id, this.props.index)}>X</div>
      </div>,
    ));
  }
}
