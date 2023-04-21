import { useEffect } from "react";

export default function SearchField(props){
    let _searchQueryElem;
    function searchEvent(){
        
    }

    useEffect(()=>{
        _searchQueryElem.value = props.searchQuery;
    });

    return (
        <div id="search-field">
            <input type="text" id="search-query" ref={(a)=>_searchQueryElem = a} style={{width:500}}/>
            <button id="search-button" onClick={searchEvent} className="btn btn-primary">Search</button>
        </div>
    );
}