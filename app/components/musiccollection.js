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
        }
    }


    focusOff = () => {
        this.refs.searchText.value = "";
        this.setState({showSearchField: false});
    }

    searchClick = () => {
        this.setState({showSearchField: true});
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
            return(
                <div style={{fontSize: "13px", opacity: opacity.hintText, margin: "0 24px", height: "50px", lineHeight: "50px"}}>No Results</div>
            );
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
        this.props.rebuildDb(this.props.application.database);
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
            padding: "20px 0",
        }

        // <button style={buttonStyle} onClick={this.rebuildDb.bind(this)}>Rebuild database</button>
        return(
            <div>
                <div style={{display: "block", margin: "8px 0", padding: "0 24px", backgroundColor: colors.primaryLightColor, height: "64px"}}>
                    <div style={{float: "left", height: "inherit", lineHeight: "64px", fontSize: "20px"}}>Musiccollection</div>
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
