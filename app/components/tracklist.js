import React , {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "../actions/index.js";
import Tile from "./tile.js";
import {colors, opacity} from "../style.js";

class Tracklist extends Component {
    //populates <li> with items from state
    createTracklist(){
        return this.props.tracklist.map((track, i) => {
            let active = (i == this.props.currentTrack);
            return(
                <Tile
                key={track.id}
                index={i}
                active={active}
                title={track.title}
                artist={track.artist}
                id={track.id}
                path={track.path}
                onClick={this.clickedTrack.bind(this, track.path)}
                onDelete={this.deleteTrack.bind(this)}/>
            );
        });
    }
    //delete tile with track
    deleteTrack(id, index){
        this.props.deleteTrack(id, index);
    }
    //converts Uint8Array into base64 coding
    arrayBufferToBase64( buffer ) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    }

    //move tile with track
    // moveTrack(dragIndex, hoverIndex){
    //    this.props.moveTrack(dragIndex, hoverIndex);
    //  }

    //plays/deletes Track from tracklist
    clickedTrack(path, id, p, e){ //weird order corresponds to passing order with bind(this...)
        // console.log(path, id, p, e);
        if(e.nativeEvent.which==1){ //left click
            this.props.loadTrack(id, path);
            this.props.playTrack();
        }
    }

    render(){
        let img_path = this.props.cover==null ? "./img/cover.png" : ("data:image/jpg;base64," + this.arrayBufferToBase64(this.props.cover));
        return(
            <div style={{width: "700px", margin: "24px auto"}}>
                <img style={{float: "left", height: "300px", width: "300px"}} src={img_path}></img>
                <div style={{height: "300px", marginLeft: "300px"}}>
                    <div style={{height: "48px", fontSize: "20px", paddingLeft: "16px", lineHeight: "48px", backgroundColor: colors.primaryLightColor, opacity: opacity.primaryText, marginBottom: "4px"}}>Tracklist</div>
                    <div style={{height: "252px", overflow: "auto"}}>
                        {this.createTracklist()}
                    </div>
                </div>
            </div>
        );
    }
}
//maps state (passed in) as props to components
function mapStateToProps(state){
    return {
        tracklist: state.mediaplayer.tracklist,
        currentTrack: state.mediaplayer.currentTrack,
        cover: state.mediaplayer.cover,
    };
}

//maps actions to props
function mapDispatchToProps(dispatch){
    return bindActionCreators(Actions, dispatch);
}

//Turn dump component into smart container
export default connect(mapStateToProps, mapDispatchToProps)(Tracklist);
