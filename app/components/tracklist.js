import React , {Component} from "react"
import {bindActionCreators} from "redux"
import {connect} from "react-redux"
import {deleteSelectedTracks, changeTrack, play, selectInTracklist} from "../actions/actions-mediaplayer.js"
import Tile from "./tile.js"
import {colors, opacity} from "../style.js"

class Tracklist extends Component {

    constructor(props){
        super(props)
        this.state = {
            lastSelectedEntry: -1,
        }
        // not in the state, bc they should not cause it to update
        this.lastTracklistLength = -1
        this.lastCurrentTrack = -1
    }
    //populates <li> with items from state
    createTracklist(){
        return this.props.tracklist.map((track, i) => {
            let active = (i == this.props.currentTrack)
            return(
                <div ref={i} key={i}>
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
                    onDoubleClick={this.doubleClickedTrack.bind(this, i)}/>
                </div>
            )
        })
    }


    //delete selected tracks from tracklist
    deleteSelectedTracks(){
        this.props.deleteSelectedTracks()
        this.setState({lastSelectedEntry: -1})
    }
    //converts Uint8Array into base64 coding
    arrayBufferToBase64( buffer ) {
        var binary = ''
        var bytes = new Uint8Array( buffer )
        var len = bytes.byteLength
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] )
        }
        return window.btoa( binary )
    }

    // selects track
    clickedTrack(index, i, e){
        // if shift key is also down (range selection)
        if (e.shiftKey && this.state.lastSelectedEntry != -1) {
            let start = Math.min(this.state.lastSelectedEntry, index)
            let end = Math.max(this.state.lastSelectedEntry, index)
            this.props.selectInTracklist(Array(end - start + 1).fill().map((_, idx) => start + idx), false)
        } else if (e.ctrlKey) {
            this.props.selectInTracklist([index], false)
        } else {
            this.state.lastSelectedEntry = index
            this.props.selectInTracklist([index], true)
        }
    }

    //plays Track from tracklist
    doubleClickedTrack(index, id, path, e){ // weird order corresponds to passing order with bind(this...)
        if(e.nativeEvent.which == 1){ //left click
            this.props.changeTrack(index)
        }
    }

    render(){
        let img_path = this.props.cover==null ? "./img/cover.png" : ("data:image/jpg;base64," + this.arrayBufferToBase64(this.props.cover))

        const delStyle = {
            float: "right",
            padding: "10px 8px",
            cursor: this.state.lastSelectedEntry != -1 ? "pointer" : "auto",
            opacity: this.state.lastSelectedEntry != -1 ? 1 : .7,
        }

        return(
            <div style={{width: "700px", margin: "24px auto"}}>
                <img style={{float: "left", height: "300px", width: "300px"}} src={img_path}></img>
                <div style={{height: "300px", marginLeft: "300px"}}>
                    <div style={{height: "48px", fontSize: "20px", paddingLeft: "16px", lineHeight: "48px", backgroundColor: colors.primaryLightColor, opacity: opacity.primaryText, marginBottom: "4px"}}>
                        <div style={{float: "left"}}>Tracklist</div>
                        <img style={delStyle} onClick={this.deleteSelectedTracks.bind(this)} src="./img/ic_delete_white_24dp.png" data-tip='Delete tracks (Delete)' data-delay-show={constants.DELAY_TOOLTIP}></img>
                    </div>
                    <div style={{height: "252px", overflow: "auto"}}>
                        {this.createTracklist()}
                    </div>
                </div>
            </div>
        )
    }

    componentDidUpdate() {
        let len = this.props.tracklist.length
        let ct = this.props.currentTrack
        // if active track changed, scroll to it
        // i.e. tracklist length stayed the same (no deletion) and currentTrack changed
        if (len == this.lastTracklistLength && ct != -1 && ct != this.lastCurrentTrack) {
            this.refs[this.props.currentTrack].scrollIntoView({ behavior: "smooth" })
        }
        // update local state
        this.lastTracklistLength = len
        this.lastCurrentTrack = ct
    }
}



//maps state (passed in) as props to components
function mapStateToProps(state){
    return {
        tracklist: state.mediaplayer.tracklist,
        currentTrack: state.mediaplayer.currentTrack,
        cover: state.mediaplayer.cover,
    }
}

//maps actions to props
function mapDispatchToProps(dispatch){
    return bindActionCreators({deleteSelectedTracks, changeTrack, play, selectInTracklist}, dispatch)
}

//Turn dump component into smart container
export default connect(mapStateToProps, mapDispatchToProps)(Tracklist)
