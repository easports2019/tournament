import {  setErrorMessage } from "./systemReducer";
import { places } from './constants/commonConstants'
import { PlaceAPI } from './../utils/api/api.js'
import { authQueryString } from './../utils/api/server';

const demoPlaces = places;

const PLACES_SET_ALL_PLACES = "PLACES_SET_ALL_PLACES";
const PLACES_SET_PLACE_BY_UMBRACO_ID = "PLACES_SET_PLACE_BY_UMBRACO_ID";



const initState = {
    places: [],
}


let placeReducer = (state = initState, action) => {
    switch (action.type) {
        case PLACES_SET_ALL_PLACES: {
            return {
                ...state,
                places: [...action.places],
            };
        }
        case PLACES_SET_PLACE_BY_UMBRACO_ID: {
            return {
                ...state,
                places: [...action.places],
            };
        }
        default: {
            return state;
        }
    }
}

export const setPlaces = (places) => {
    return {
        type: PLACES_SET_ALL_PLACES,
        places
    }
}

export const setPlace = (placeId, placeData) => {
    return {
        type: PLACES_SET_PLACE_BY_UMBRACO_ID,
        placeId,
        placeData
    }
}


// все места
export const getAllPlaces = (startindex = 0) => {
    return dispatch => {

        
        if (authQueryString && authQueryString.length > 0)
            PlaceAPI.getAll(startindex)
                .then(pl => {
                    if (pl && pl.data.length > 0) {
                        debugger
                        dispatch(setPlaces(pl.data));
                        
                    }
                    else {
                        debugger
                        dispatch(setPlaces(demoPlaces))
                        
                    }
                })
                .catch(error => {
                    debugger
                    dispatch(setErrorMessage(error))
                    
                })
        else {
            debugger
            dispatch(setPlaces(demoPlaces))
            

        }
    }
}

// все места с сервера по UmbracoId города
export const getAllPlacesInCityByCityId = (cityId, startindex = 0) => {
    return dispatch => {

        if (authQueryString && authQueryString.length > 0)
            PlaceAPI.getAllInCityByCityUmbracoId(cityId, startindex)
                .then(pl => {
                    if (pl && pl.data.length > 0) {
                        dispatch(setPlaces(pl.data));
                        
                    }
                    else {
                        dispatch(setPlaces(demoPlaces))
                        

                    }
                })
                .catch(error => {
                    dispatch(setErrorMessage(error))
                    
                })
        else {
            dispatch(setPlaces(demoPlaces))
            

        }
    }
}


// место с сервера по Id
export const getPlaceById = (placeId) => {
    return dispatch => {

        if (authQueryString && authQueryString.length > 0)
            PlaceAPI.getById(placeId)
                .then(pl => {
                    if (pl && pl.data.length > 0)
                        dispatch(setPlace(placeId, pl.data));
                    

                })
                .catch(error => {
                    dispatch(setErrorMessage(error))
                    
                })
        else {
            
        }
    }
}


export default placeReducer;