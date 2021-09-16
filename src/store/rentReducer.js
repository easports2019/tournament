import { setGlobalPopout, setErrorMessage } from "./systemReducer";
import { rents } from './constants/commonConstants'
import { RentAPI } from './../utils/api/api.js'
import { authQueryString } from './../utils/api/server';
import { datesWithoutTimeIsSame } from './../utils/convertors/dateUtils'

const demoRents = rents;

const RENTS_SET_RENTS = "RENTS_SET_RENTS";
const RENTS_SET_SELECTED_RENT = "RENTS_SET_SELECTED_RENT";



const initState = {
    rents: [],
    selectedRent: {},
    selectedDayRents: [],
}


let rentReducer = (state = initState, action) => {
    switch (action.type) {
        case RENTS_SET_RENTS: {
            return {
                ...state,
                rents: [...action.rents],
            };
        }
        case RENTS_SET_SELECTED_RENT: {
            return {
                ...state,
                selectedDayRents: [...state.rents.filter(r => datesWithoutTimeIsSame(new Date(r.From),action.rentDate) && (r.SimplePlaceId == action.simplePlaceId))],
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

export const setSelectedRent = (simplePlaceId, rentDate) => {
    return {
        type: RENTS_SET_SELECTED_RENT,
        simplePlaceId,
        rentDate
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