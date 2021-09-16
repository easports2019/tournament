import { setGlobalPopout, setErrorMessage } from "./systemReducer";
import { rents } from './constants/commonConstants'
import { RentAPI } from './../utils/api/api.js'
import { authQueryString } from './../utils/api/server';

const demoRents = rents;

const RENTS_SET_RENTS = "RENTS_SET_RENTS";



const initState = {
    rents: [],
    selectedRent: {},
}


let rentReducer = (state = initState, action) => {
    switch (action.type) {
        case RENTS_SET_RENTS: {
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


export const setRents = (rents) => {
    return {
        type: RENTS_SET_RENTS,
        rents
    }
}


// все аренды с сервера по UmbracoId города
export const getAllRentsInCityByCityId = (cityId, startindex = 0) => {
    return dispatch => {

        if (authQueryString && authQueryString.length > 0)
            RentAPI.getAllRentsInCityByCityUmbracoId(cityId, startindex)
                .then(pl => {
                    if (pl && pl.data.length > 0) {
                        
                        dispatch(setRents(pl.data));
                        dispatch(setGlobalPopout(false))
                    }
                    else {
                        dispatch(setRents(demoRents))
                        dispatch(setGlobalPopout(false))

                    }
                })
                .catch(error => {
                    dispatch(setErrorMessage(error))
                    dispatch(setGlobalPopout(false))
                })
        else {
            dispatch(setRents(demoRents))
            dispatch(setGlobalPopout(false))

        }
    }
}



export default rentReducer;