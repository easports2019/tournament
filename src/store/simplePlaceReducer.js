import { setGlobalPopout, setErrorMessage } from "./systemReducer";
import { simplePlaces } from './constants/commonConstants'
import { SimplePlaceAPI } from './../utils/api/api.js'
import { authQueryString } from './../utils/api/server';

const demoPlaces = simplePlaces;

const PLACES_SET_ALL_PLACES = "PLACES_SET_ALL_PLACES";
const PLACES_SET_PLACE_BY_UMBRACO_ID = "PLACES_SET_PLACE_BY_UMBRACO_ID";
const PLACES_SET_RENTS = "PLACES_SET_RENTS";



const initState = {
    places: [],
    rents: [],
}


let simplePlaceReducer = (state = initState, action) => {
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
        case PLACES_SET_RENTS: {
            return {
                ...state,
                rents: [...action.rents],
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

export const setRents = (rents) => {
    return {
        type: PLACES_SET_RENTS,
        rents
    }
}

export const setPlace = (placeId, placeData) => {
    return {
        type: PLACES_SET_PLACE_BY_UMBRACO_ID,
        placeId,
        placeData
    }
}


// все места с сервера по UmbracoId города
export const getAllSimplePlacesInCityByCityId = (cityId, startindex = 0) => {
    return dispatch => {

        if (authQueryString && authQueryString.length > 0)
            SimplePlaceAPI.getAllInCityByCityUmbracoId(cityId, startindex)
                .then(pl => {
                    if (pl && pl.data.length > 0) {
                        
                        dispatch(setPlaces(pl.data));
                        dispatch(setGlobalPopout(false))
                    }
                    else {
                        dispatch(setPlaces(demoPlaces))
                        dispatch(setGlobalPopout(false))

                    }
                })
                .catch(error => {
                    dispatch(setErrorMessage(error))
                    dispatch(setGlobalPopout(false))
                })
        else {
            dispatch(setPlaces(demoPlaces))
            dispatch(setGlobalPopout(false))

        }
    }
}

// все аренды с сервера по UmbracoId города
export const getAllRentsInCityByCityId = (cityId, startindex = 0) => {
    return dispatch => {

        if (authQueryString && authQueryString.length > 0)
            SimplePlaceAPI.getAllRentsInCityByCityUmbracoId(cityId, startindex)
                .then(pl => {
                    if (pl && pl.data.length > 0) {
                        
                        dispatch(setRents(pl.data));
                        dispatch(setGlobalPopout(false))
                    }
                    else {
                        dispatch(setPlaces(demoPlaces))
                        dispatch(setGlobalPopout(false))

                    }
                })
                .catch(error => {
                    dispatch(setErrorMessage(error))
                    dispatch(setGlobalPopout(false))
                })
        else {
            dispatch(setPlaces(demoPlaces))
            dispatch(setGlobalPopout(false))

        }
    }
}



export default simplePlaceReducer;