import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {opacity, colors} from "../style.js";

// Tile for individual tracks in tracklist
export default class Tile extends Component {
    constructor(props){
        super(props);
    }

    static propTypes = {
        index: PropTypes.number.isRequired,
        id: PropTypes.any.isRequired,
        path: PropTypes.string.isRequired,
        artist: PropTypes.string,
        title: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        onDoubleClick: PropTypes.func.isRequired,
        active: PropTypes.bool.isRequired,
        selected: PropTypes.bool.isRequired,
    };

    render() {
        //div style
        const artist = this.props.artist;
        const title = this.props.title;

        const style = {
            height: "60px",
            paddingLeft: "16px",
            fontSize: "13px",
            cursor: "pointer",
            color: this.props.active ? colors.secondaryColor : colors.primaryTextColor,
            backgroundColor: this.props.selected ? colors.primaryLightColor : "transparent",
        };



        return(
            <div style={style} onClick ={(e) => this.props.onClick(this.props.index, e)} onDoubleClick={(e) => this.props.onDoubleClick(this.props.id, this.props.path, e)}>
                <div style={{float: "left", height: "100%"}} >
                    <div style={{opacity: opacity.primaryText, paddingTop: "16px"}}>{title}</div>
                    <div style={{opacity: opacity.secondaryText}}>{artist}</div>
                </div>
                <div style={{float: "right", height: "1px", width: "100%", backgroundColor: "#32363f"}}></div>
            </div>
        );
    }
}
