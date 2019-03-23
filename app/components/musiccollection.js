import React , {Component} from "react"
import {bindActionCreators} from "redux"
import {connect} from "react-redux"
import {addSelectedTracks, search, rebuildDb, selectInMusiccollection} from "../actions/actions-database.js"
import {addTracks} from "../actions/actions-mediaplayer.js"
import {toggleMusiccollectionOverlay} from "../actions/actions-application.js"
import {colors, opacity} from "../style.js"
import {ContextMenuTrigger} from "react-contextmenu"


class Musiccollection extends Component {
    constructor(props){
        super(props)
        this.state = {
            hoverMore: false,
            lastSelectedEntry: -1, // last selected entry, -1 none
        }
    }

    componentDidUpdate(prevProps, prevState) {
        this.refs.searchText.value = ""
        this.refs.searchText.focus()
    }

    hoverMoreOn = () => {
        this.setState({hoverMore: true})
    }
    hoverMoreOff = () => {
        this.setState({hoverMore: false})
    }

    createRows(){
        const style = {
            borderWidth: "1px 0",
            borderStyle: "solid",
            borderColor: colors.primaryLightColor,
            borderCollapse: "collapse",
            fontSize: "13px",
            height: "48px",
        }

        return this.props.database.searchResults.map((item) => {
            const rowStyle = {
                cursor: "pointer",
                backgroundColor: item.selected ? colors.primaryLightColor : "transparent",
            }
            return(
                <ContextMenuTrigger id={constants.SHOW_IN_FILE_EXPLORER} renderTag='tbody' attributes={{'path': item.path}} disableIfShiftIsPressed={true} key={item._id}>
                    <tr onClick={(e) => this.clickedTrack(item.index, e)} onDoubleClick={(e) => this.doubleClickedTrack(item, e)} style={rowStyle}>
                    <td style={{...style, paddingLeft: "24px"}}>{item.title}</td>
                    <td style={{...style, paddingRight: "56px"}}>{item.albumartist}</td>
                    <td style={{...style, paddingRight: "56px"}}>{item.album}</td>
                    <td style={{...style, paddingRight: "56px"}}>{item.year}</td>
                    <td style={{...style, paddingRight: "56px"}}>{item.track}</td>
                    <td style={{...style, paddingRight: "24px"}}>{this.createRating(item.rating)}</td>
                    </tr>
                </ContextMenuTrigger>
            )
        })
    }

    //create rating images from numeric rating
    createRating(rating){
        const starStyle = {
            float: "left",
            height: "inherit",
        }
        //rating
        return(
            <div style={{height: "13px"}}>
                <img style={starStyle} src={rating > 0 ? "./img/ic_star_white_18dp.png" : "./img/ic_star_border_white_18dp.png"}></img>
                <img style={starStyle} src={rating > 1 ? "./img/ic_star_white_18dp.png" : "./img/ic_star_border_white_18dp.png"}></img>
                <img style={starStyle} src={rating > 2 ? "./img/ic_star_white_18dp.png" : "./img/ic_star_border_white_18dp.png"}></img>
                <img style={starStyle} src={rating > 3 ? "./img/ic_star_white_18dp.png" : "./img/ic_star_border_white_18dp.png"}></img>
                <img style={starStyle} src={rating > 4 ? "./img/ic_star_white_18dp.png" : "./img/ic_star_border_white_18dp.png"}></img>
            </div>
        )
    }

    //create a table from results
    createTable(){
        const headerStyle = {
            fontSize: "12px",
            opacity: opacity.secondaryText,
            textAlign: "left",
        }

        if(this.props.database.searchResults.length==0){
            if(!this.props.database.databaseState){ // database has not started yet or was not found
                return( <div style={{fontSize: "13px", opacity: opacity.hintText, margin: "0 24px", height: "50px", lineHeight: "50px"}}>No connection to database</div> )
            }else if(this.props.database.lastSearch){ // nothing was found on search
                return( <div style={{fontSize: "13px", opacity: opacity.hintText, margin: "0 24px", height: "50px", lineHeight: "50px"}}>No results for "{this.props.database.lastSearch}"</div> )
            }else{ // no last search, startup
                return( <div style={{fontSize: "13px", opacity: opacity.hintText, margin: "0 24px", height: "50px", lineHeight: "50px"}}>Start a search to view results</div> )
            }

        }else{
            return(
                <table style={{borderCollapse: "collapse", width: "100%"}}>
                    <thead>
                        <tr style={{height: "56px"}}>
                            <th style={{...headerStyle, paddingLeft: "24px"}}>Title</th>
                            <th style={headerStyle}>Albumartist</th>
                            <th style={headerStyle}>Album</th>
                            <th style={headerStyle}>Year</th>
                            <th style={headerStyle}>Track</th>
                            <th style={{...headerStyle, paddingRight: "24px", minWidth: "66px"}}>Rating</th>
                        </tr>
                    </thead>
                    {this.createRows()}
                </table>
            )
        }
    }

    clickedTrack = (index, e) => {
        // if shift key is also down (range selection)
        if (e.shiftKey && this.state.lastSelectedEntry != -1) {
            let start = Math.min(this.state.lastSelectedEntry, index)
            let end = Math.max(this.state.lastSelectedEntry, index)
            this.props.selectInMusiccollection(Array(end - start + 1).fill().map((_, idx) => start + idx), false)
        } else if (e.ctrlKey) {
            this.props.selectInMusiccollection([index], false)
        } else {
            this.state.lastSelectedEntry = index
            this.props.selectInMusiccollection([index], true)
        }
    }

    // adds track(s) to tracklist when add button is clicked
    addClick = () => {
        this.props.addSelectedTracks()
    }

    // adds a track to tracklist on doubleclick
    doubleClickedTrack = (item, e) => {
        this.props.addTracks([item])
    }

    //search Track from the searchfield
    search(event){
        if(event.key == "Enter"){
            event.preventDefault() //consumes the event
            this.setState({lastSelectedEntry: -1})
            this.props.search(this.refs.searchText.value)
        }
    }

    //rebuild the database
    rebuildDb(){
        this.props.rebuildDb("full")
    }

    // adds a folder to the database
    addToDb(){
        const {dialog} = require('electron').remote
        let folder = dialog.showOpenDialog({title: "Select folder", properties: ['openFile', 'openDirectory']})
        // if folder is valid
        if(folder) this.props.rebuildDb("partial", folder + "/")
    }

    // closes the overlay
    closeOverlay() {
        this.props.toggleMusiccollectionOverlay(false)
    }

    render(){
        const textStyle = {
            backgroundColor: "transparent",
            border: "none",
            color: colors.primaryTextColor,
            opacity: opacity.primaryText,
            width: "50vh",
            height: "20px",
            fontFamily: "inherit",
            fontSize: "16px",
            padding: "24px 8px 20px 8px",
            // no glowing broder on focus
            outline: "none",
            resize: "none",
        }

        const buttonStyle = {
            backgroundColor: colors.primaryLightColor,
            color: colors.primaryTextColor,
            border: "none",
            outline: "none",
            cursor: "pointer",
            float: "right",
        }

        const menuStyle = {
            display: this.state.hoverMore ? "block" : "none",
            position: "absolute",
            zIndex: "1",
            right: "0",
            top: "64px",
        }

        const menuItemStyle = {
            cursor: "pointer",
            padding: "8px 16px",
            backgroundColor: colors.primaryLightColor,
        }

        return(
            <div style={{position: "fixed", top: this.props.visible ? "0px" : "500px", width: "100%", height: "100%", transition: "top 0.5s ease-in-out"}}>
                {/* top bar containing searchbox and actions */}
                <div style={{display: "block", padding: "0 24px", backgroundColor: colors.primaryLightColor, height: "64px"}}>
                    {/* search icon and searchbox*/}
                    <div style={{display: "inline", height: "inherit", lineHeight: "64px", fontSize: "20px"}}>
                        <img style={{margin: "20px 4px"}} src="./img/ic_search_white_24dp.png"></img>
                        <textarea ref="searchText" placeholder="Search" onKeyPress={this.search.bind(this)} style={textStyle}/>
                    </div>
                    {/* actions: add, more, close */}
                    <div style={{float: "right", position: "relative", display: "inline-block"}}>
                        <img onClick={this.addClick} style={{padding: "20px 4px", opacity: this.state.lastSelectedEntry == -1 ? .7 : 1, cursor: this.state.lastSelectedEntry == -1 ? "auto" : "pointer"}} src="./img/ic_playlist_add_white_24dp.png" data-tip='Add to tracklist' data-delay-show={constants.DELAY_TOOLTIP}></img>
                        <img style={{cursor: "pointer", padding: "20px 2px"}} src="./img/ic_more_vert_white_24dp.png"  onMouseEnter={this.hoverMoreOn} onMouseLeave={this.hoverMoreOff}></img>
                        {/* hover menu */}
                        <div style={menuStyle} onMouseEnter={this.hoverMoreOn} onMouseLeave={this.hoverMoreOff}>
                            <div style={menuItemStyle} onClick={this.rebuildDb.bind(this)}>Rebuild database</div>
                            <div style={menuItemStyle} onClick={this.addToDb.bind(this)}>Add folder to database</div>
                        </div>
                        <img style={{cursor: "pointer", padding: "20px 2px"}} src="./img/ic_close_white_24dp.png" onClick={this.closeOverlay.bind(this)} data-tip='Close search (Esc)' data-delay-show={constants.DELAY_TOOLTIP}></img>
                    </div>
                </div>
                {/* Table */}
                <div style={{position: "fixed", overflowX: "hidden", overflowY: "auto", backgroundColor: colors.primaryColor, height: "calc(100vh - 64px)", width: "100%"}}> {this.createTable()} </div>
            </div>
        )
    }
}
//maps state (passed in) as props to components
function mapStateToProps(state){
    return {
        database: state.database,
        visible: state.application.musiccollectionVisible,
    }
}

//maps actions to props
function mapDispatchToProps(dispatch){
    return bindActionCreators({addSelectedTracks, search, rebuildDb, addTracks, selectInMusiccollection, toggleMusiccollectionOverlay}, dispatch)
}

//Turn dump component into smart container
export default connect(mapStateToProps, mapDispatchToProps)(Musiccollection)
