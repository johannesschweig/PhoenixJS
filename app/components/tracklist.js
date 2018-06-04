import React , {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {deleteSelectedTracks, loadTrack, playTrack, selectInTracklist} from "../actions/actions-mediaplayer.js";
import Tile from "./tile.js";
import {colors, opacity} from "../style.js";

class Tracklist extends Component {

    constructor(props){
        super(props);
        this.state = {
            lastSelectedEntry: -1,
        };
    }
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
                albumartist={track.albumartist}
                selected={track.selected}
                id={track.id}
                path={track.path}
                onClick={this.clickedTrack.bind(this, i)}
                onDoubleClick={this.doubleClickedTrack.bind(this, track.path)}/>
            );
        });
    }


    //delete selected tracks from tracklist
    deleteSelectedTracks(){
        this.props.deleteSelectedTracks();
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

    // selects track
    clickedTrack(index, i, e){
        // if shift key is also down (range selection)
        if (e.shiftKey) {
            let start = Math.min(this.state.lastSelectedEntry, index);
            let end = Math.max(this.state.lastSelectedEntry, index);
            this.props.selectInTracklist(Array(end - start + 1).fill().map((_, idx) => start + idx), false);
        } else if (e.ctrlKey) {
            this.props.selectInTracklist([index], false);
        } else {
            this.state.lastSelectedEntry = index;
            this.props.selectInTracklist([index], true);
        }
    }

    //plays Track from tracklist
    doubleClickedTrack(path, id, p, e){ //weird order corresponds to passing order with bind(this...)
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
                    <div style={{height: "48px", fontSize: "20px", paddingLeft: "16px", lineHeight: "48px", backgroundColor: colors.primaryLightColor, opacity: opacity.primaryText, marginBottom: "4px"}}>
                        <div style={{float: "left"}}>Tracklist</div>
                        <img style={{float: "right", padding: "10px 8px", cursor: "pointer"}} onClick={this.deleteSelectedTracks.bind(this)} src="./img/ic_delete_white_24dp.png"></img>
                    </div>
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
    return bindActionCreators({deleteSelectedTracks, loadTrack, playTrack, selectInTracklist}, dispatch);
}

//Turn dump component into smart container
export default connect(mapStateToProps, mapDispatchToProps)(Tracklist);
