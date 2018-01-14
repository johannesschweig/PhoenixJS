import React , {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "../actions/index.js";
import {colors, opacity} from "../style.js";

class Musiccollection extends Component {
    constructor(props){
        super(props);
        this.state = {
            showSearchField: false,
            hoverMore: false,
        }
    }


    focusOff = () => {
        this.refs.searchText.value = "";
        this.setState({showSearchField: false});
    }

    searchClick = () => {
        this.setState({showSearchField: true});
    }

    hoverMoreOn = () => {
        this.setState({hoverMore: true});
    }
    hoverMoreOff = () => {
        this.setState({hoverMore: false});
    }

    createRows(){
        const style = {
            borderWidth: "1px 0",
            borderStyle: "solid",
            borderColor: colors.primaryLightColor,
            borderCollapse: "collapse",
            fontSize: "13px",
            height: "48px",
        };
        const rowStyle = {
            cursor: "pointer",
        };

        return this.props.application.searchResults.map((item) => {
            return(
                <tr  key={item._id} style={rowStyle} onClick={(e) => this.clickedTrack(item, e)}>
                <td style={{...style, paddingLeft: "24px"}}>{item.title}</td>
                <td style={{...style, paddingRight: "56px"}}>{item.artist}</td>
                <td style={{...style, paddingRight: "56px"}}>{item.album}</td>
                <td style={{...style, paddingRight: "56px"}}>{item.year}</td>
                <td style={{...style, paddingRight: "56px"}}>{item.track}</td>
                <td style={{...style, paddingRight: "24px"}}>{this.createRating(item.rating)}</td>
                </tr>
            );
        });
    }

    //create rating images from numeric rating
    createRating(rating){
        const starStyle = {
            float: "left",
            height: "inherit",
        };
        //rating
        //0:0
        //1:1-51
        //2:52-103, 64
        //3:104-155, 118,128
        //4:156-211, 186,196
        //5:211-255, 252,255
        return(
            <div style={{height: "13px"}}>
                <img style={starStyle} src={rating > 0 ? "./img/ic_star_white_18dp.png" : "./img/ic_star_border_white_18dp.png"}></img>
                <img style={starStyle} src={rating > 50 ? "./img/ic_star_white_18dp.png" : "./img/ic_star_border_white_18dp.png"}></img>
                <img style={starStyle} src={rating > 100 ? "./img/ic_star_white_18dp.png" : "./img/ic_star_border_white_18dp.png"}></img>
                <img style={starStyle} src={rating > 150 ? "./img/ic_star_white_18dp.png" : "./img/ic_star_border_white_18dp.png"}></img>
                <img style={starStyle} src={rating > 196 ? "./img/ic_star_white_18dp.png" : "./img/ic_star_border_white_18dp.png"}></img>
            </div>
        );
    }

    //create a table from results
    createTable(){
        const headerStyle = {
            fontSize: "12px",
            opacity: opacity.secondaryText,
            textAlign: "left",
        };

        if(this.props.application.searchResults.length==0){
            if(!this.props.application.databaseState){ // database has not started yet or was not found
                return( <div style={{fontSize: "13px", opacity: opacity.hintText, margin: "0 24px", height: "50px", lineHeight: "50px"}}>No connection to database</div> );
            }else if(this.props.application.lastSearch){ // nothing was found on search
                return( <div style={{fontSize: "13px", opacity: opacity.hintText, margin: "0 24px", height: "50px", lineHeight: "50px"}}>No results for "{this.props.application.lastSearch}"</div> );
            }else{ // no last search, startup
                return( <div style={{fontSize: "13px", opacity: opacity.hintText, margin: "0 24px", height: "50px", lineHeight: "50px"}}>Start a search to view results</div> );
            }

        }else{
            return(
                <table style={{borderCollapse: "collapse", width: "100%"}}>
                    <thead>
                    <tr style={{height: "56px"}}>
                    <th style={{...headerStyle, paddingLeft: "24px"}}>Title</th>
                    <th style={headerStyle}>Artist</th>
                    <th style={headerStyle}>Album</th>
                    <th style={headerStyle}>Year</th>
                    <th style={headerStyle}>Track</th>
                    <th style={{...headerStyle, paddingRight: "24px"}}>Rating</th>
                    </tr>
                    </thead>
                    <tbody>{this.createRows()}</tbody>
                </table>
            );
        }
    }

    clickedTrack = (item, e) => {
        this.props.addTrack(item);
    }

    //search Track from the searchfield
    search(event){
        if(event.key == "Enter"){
            event.preventDefault(); //consumes the event
            this.props.search(this.refs.searchText.value);
            this.focusOff();
        }
    }

    //rebuild the database
    rebuildDb(){
        this.props.rebuildDb();
    }
    // adds a folder to the database
    addToDb(){
        const {dialog} = require('electron').remote;
        let folder = dialog.showOpenDialog({title: "Select folder", properties: ['openFile', 'openDirectory']});
        // if folder is valid
        if(folder) this.props.rebuildDb("partial", folder + "/");
    }

    render(){
        const textStyle = {
            backgroundColor: "transparent",
            border: "none",
            color: colors.primaryTextColor,
            opacity: opacity.primaryText,
            width: "20vh",
            height: "20px",
            fontFamily: "inherit",
            fontSize: "16px",
            padding: "22px 0",
            // no glowing broder on focus
            outline: "none",
            // right, not resizable
            resize: "none",
            float: "right",
            display: this.state.showSearchField ? "block" : "none",
        };

        const buttonStyle = {
            backgroundColor: colors.primaryLightColor,
            color: colors.primaryTextColor,
            border: "none",
            outline: "none",
            cursor: "pointer",
            float: "right",
        };

        const imgStyle = {
            float: "right",
            cursor: "pointer",
            margin: "20px 2px",
        }
        const menuStyle = {
            display: this.state.hoverMore ? "block" : "none",
            position: "absolute",
            zIndex: "1",
            right: "0",
            top: "64px"
        }

        const menuItemStyle = {
            cursor: "pointer",
            padding: "8px 16px",
            backgroundColor: colors.primaryLightColor,
        }

        return(
            <div>
                <div style={{display: "block", margin: "8px 0", padding: "0 24px", backgroundColor: colors.primaryLightColor, height: "64px"}}>
                    <div style={{float: "left", height: "inherit", lineHeight: "64px", fontSize: "20px"}}>Musiccollection</div>
                    <div style={{float: "right", position: "relative", display: "inline-block"}} onMouseEnter={this.hoverMoreOn} onMouseLeave={this.hoverMoreOff}>
                        <img style={{cursor: "pointer", padding: "20px 2px"}} src="./img/ic_more_vert_white_24dp.png"></img>
                        <div style={menuStyle}>
                            <div style={menuItemStyle} onClick={this.rebuildDb.bind(this)}>Rebuild database</div>
                            <div style={menuItemStyle} onClick={this.addToDb.bind(this)}>Add folder to database</div>
                        </div>
                    </div>
                    <img onClick={this.searchClick} style={imgStyle} src="./img/ic_search_white_24dp.png"></img>
                    <textarea ref="searchText" onBlur={this.focusOff} placeholder="Search"  onKeyPress={this.search.bind(this)} style={textStyle}/>
                </div>
                <div style={{overflowX: "hidden", overflowY: "auto", height: "50vh"}}> {this.createTable()} </div>
            </div>
        );
    }
}
//maps state (passed in) as props to components
function mapStateToProps(state){
    return {
        application: state.application,
    };
}

//maps actions to props
function mapDispatchToProps(dispatch){
    return bindActionCreators(Actions, dispatch);
}

//Turn dump component into smart container
export default connect(mapStateToProps, mapDispatchToProps)(Musiccollection);
