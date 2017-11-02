import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Tile for individual tracks in tracklist
export default class Tile extends Component {
    constructor(props){
        super(props);
        this.state = {
            hover: false, // if whole tile is hovered
            delHover: false, // if delete button is hovered
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
            height: "60px",
            paddingLeft: "16px",
            fontSize: "13px",
            cursor: "pointer",
            color: this.props.active ? "#ff6600" : "#cccccc",
            backgroundColor: this.props.active ? "#32363f" : "transparent",
        };
        //Delete style
        const delStyle = {
            display: this.state.hover ? "block" : "none",
            float: "right",
            height: "24px",
            marginTop: "18px",
            marginRight: "16px",
        }


        return(
            <div onMouseEnter={this.hoverOn} onMouseLeave={this.hoverOff} style={style}>
                <div style={{float: "left", height: "100%"}} onClick={(e) => this.props.onClick(this.props.id, this.props.path, e)}>
                    <div style={{paddingTop: "16px"}}>{title}</div>
                    <div>{artist}</div>
                </div>
                <img style={delStyle} src="./img/ic_delete_white_36dp.png" onMouseEnter={this.hoverDelOn} onMouseLeave={this.hoverDelOff} onClick={() => this.props.onDelete(this.props.id, this.props.index)}></img>
                <div style={{float: "right", height: "1px", width: "100%", backgroundColor: "#32363f"}}></div>
            </div>
        );
    }
}

                // <img src={src} id="test" style={delStyle} onMouseEnter={this.hoverDelOn} onMouseLeave={this.hoverDelOff} onClick={() => this.props.onDelete(this.props.id, this.props.index)}></img>
