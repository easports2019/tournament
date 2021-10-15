import { setGlobalPopout, setErrorMessage, resetError } from "./systemReducer";
import { simplePlaces } from './constants/commonConstants'
import { SimplePlaceAPI } from './../utils/api/api.js'
import { authQueryString } from './../utils/api/server';

const demoPlaces = simplePlaces;

const PLACES_SET_ALL_PLACES = "PLACES_SET_ALL_PLACES";
const PLACES_SET_PLACE_BY_UMBRACO_ID = "PLACES_SET_PLACE_BY_UMBRACO_ID";
const PLACES_SET_SELECTED_PLACE = "PLACES_SET_SELECTED_PLACE";



const initState = {
    places: [],
    selectedPlace: {},
}


let simplePlaceReducer = (state = initState, action) => {
    switch (action.type) {
        case PLACES_SET_ALL_PLACES: {
            return {
                ...state,
                places: [...action.places],
            };
        }
        case PLACES_SET_SELECTED_PLACE: {
            return {
                ...state,
                selectedPlace: state.places.find(x => x.Id == action.placeId),
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

export const setSelectedSimplePlace = (placeId) => {
    return {
        type: PLACES_SET_SELECTED_PLACE,
        placeId
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
        dispatch(setGlobalPopout(true))
        dispatch(resetError())

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



export default simplePlaceReducer;