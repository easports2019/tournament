import { ProfileAPI, CityAPI, errorObj, VKAPI } from './../utils/api/api.js'
import { authQueryString } from './../utils/api/server';
import {  setErrorMessage, resetError } from "./systemReducer";
import { setUserProfile } from "./profileReducer";

const CITY_GET_ALL_FROM_SERVER = "CITY_GET_ALL_FROM_SERVER";
const VK_SET_SELECTED_USER = "VK_SET_SELECTED_USER";


const initState = {
    selectedUser: {},
    cities: [],
}


let vkReducer = (state = initState, action) => 
{
    switch (action.type){
        case CITY_GET_ALL_FROM_SERVER: {
            return {...state,
                cities: [...action.cities],
            };
        }
        case VK_SET_SELECTED_USER:{
            return {...state,
                selectedUser: {...action.user},
            };
        }
        default: {
            return state;
        }
    }
}



export const setSelectedUser = (user) => {
    return {
        type: VK_SET_SELECTED_USER,
        user
    }
}

export const setCities = (cities) => {
    return {
        type: CITY_GET_ALL_FROM_SERVER,
        cities
    }
}

export const getUser = (id) => {
    return dispatch => {
        if (authQueryString && authQueryString.length > 0)
            VKAPI.getUser(id)
                .then(pl => {
                    debugger
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






export default vkReducer;