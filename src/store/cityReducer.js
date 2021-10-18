import { ProfileAPI, CityAPI, errorObj } from './../utils/api/api.js'
import { authQueryString } from './../utils/api/server';
import { setErrorMessage, resetError } from "./systemReducer";

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
            CityAPI.getAll()
                .then(pl => {
                    
                    if (pl && pl.data) {
                        dispatch(setCities(pl.data));
                        
                    }
                    else {
                        dispatch(setErrorMessage(errorObj("Не получен ответ от сервера")))
                        
                    }
                })
                .catch(error => {
                    
                    dispatch(setErrorMessage(error))
                    
                })
        else {
            
            dispatch(setErrorMessage(errorObj("Вы не авторизованы")))
            
        }
    }
}






export default cityReducer;