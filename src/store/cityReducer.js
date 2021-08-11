import { ProfileAPI, CityAPI, errorObj } from './../utils/api/api.js'
import { authQueryString } from './../utils/api/server';
import { setGlobalPopout, setErrorMessage, resetError } from "./systemReducer";
import { setUserProfile } from "./profileReducer";

const CITY_GET_ALL_FROM_SERVER = "CITY_GET_ALL_FROM_SERVER";


const initState = {
    cities: [],
}


let cityReducer = (state = initState, action) => 
{
    switch (action.type){
        case CITY_GET_ALL_FROM_SERVER: {
            return {...state,
                cities: [...action.cities],
            };
        }
        default: {
            return state;
        }
    }
}


export const setCities = (cities) => {
    return {
        type: CITY_GET_ALL_FROM_SERVER,
        cities
    }
}

export const getAllCitiesFromServer = () => {
    return dispatch => {
        if (authQueryString && authQueryString.length > 0)
            CityAPI.getAll().then()
                .then(pl => {
                    
                    if (pl && pl.data) {
                        dispatch(setCities(pl.data));
                        dispatch(setGlobalPopout(false))
                    }
                    else {
                        dispatch(setErrorMessage(errorObj("Не получен ответ от сервера")))
                        dispatch(setGlobalPopout(false))
                    }
                })
                .catch(error => {
                    
                    dispatch(setErrorMessage(error))
                    dispatch(setGlobalPopout(false))
                })
        else {
            
            dispatch(setErrorMessage(errorObj("Вы не авторизованы")))
            dispatch(setGlobalPopout(false))
        }
    }
}






export default cityReducer;