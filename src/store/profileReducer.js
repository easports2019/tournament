import {ampluaTypes, users} from './constants/commonConstants'
import { ProfileAPI, errorObj } from './../utils/api/api.js'
import { authQueryString } from './../utils/api/server';
import { setErrorMessage, resetError, globalPopoutOn, globalPopoutOff } from "./systemReducer";


const ANY_ACTION_TYPE = "ANY_ACTION_TYPE";
const PROFILE_SET_VK_PROFILE_INFO = "PROFILE_SET_VK_PROFILE_INFO";
const PROFILE_SET_USER_PROFILE = "PROFILE_SET_USER_PROFILE";
const PROFILE_SET_TRIED_TO_GET_PROFILE = "PROFILE_SET_TRIED_TO_GET_PROFILE";

let demoUser = users[0];

const initState = {
    myProfile: null,
    vkProfile: null,
    triedToGetProfile: false,

     // level 

}


export let profileReducer = (state = initState, action) => 
{
    switch (action.type){
        case PROFILE_SET_VK_PROFILE_INFO: {
            return {...state,
                vkProfile: {...action.user},
            };
        }
        case PROFILE_SET_USER_PROFILE: {
            return {...state,
                myProfile: {...action.user},
            };
        }
        case PROFILE_SET_TRIED_TO_GET_PROFILE: {
            return {...state,
                triedToGetProfile: action.tried,
            };
        }
        default: {
            return state;
        }
    }
}


export const setVkProfileInfo = (user) => {
    return {
        type: PROFILE_SET_VK_PROFILE_INFO,
        user
    }
}

export const setUserProfile = (user) => {
    return {
        type: PROFILE_SET_USER_PROFILE,
        user
    }
}

export const setTriedToGetProfile = (tried) => {
    return {
        type: PROFILE_SET_TRIED_TO_GET_PROFILE,
        tried
    }
}



// получение данных профиля (без авторегистрации)
export const getUserProfile = (vkUserData) => {
    return dispatch => {
        debugger
        dispatch(globalPopoutOn())
        dispatch(resetError())

        if (authQueryString && authQueryString.length > 0)
            ProfileAPI.getUserProfile(vkUserData)
                .then(pl => {
                    
                    if (pl && pl.data) {
                        dispatch(setUserProfile(pl.data));
                        dispatch(setTriedToGetProfile(false));
                        dispatch(globalPopoutOff())
                    }
                    else {
                        dispatch(setTriedToGetProfile(true))
                    }
                })
                .catch(error => {
                    dispatch(setErrorMessage(error))
                    //dispatch(globalPopoutOff())
                })
        else {
            dispatch(setErrorMessage(errorObj("Вы не авторизованы")))
            //dispatch(globalPopoutOff())
            //dispatch(setUserProfile(demoUser))
            //dispatch(setTriedToGetProfile(true))

        }
    }
}

// установка нового города пользователю
export const setUserProfileCity = (userProfile) => {
    return dispatch => {
        dispatch(globalPopoutOn())
        dispatch(resetError())
        debugger
        if (authQueryString && authQueryString.length > 0)
            ProfileAPI.setUserProfileCity(userProfile).then()
                .then(pl => {
                    debugger
                    if (pl && pl.data) {
                        dispatch(setUserProfile(pl.data));
                        dispatch(globalPopoutOff())
                    }
                    else {
                        dispatch(setErrorMessage(errorObj("Не получен ответ от сервера")))
                        //dispatch(globalPopoutOff())
                    }
                })
                .catch(error => {
                    dispatch(setErrorMessage(error))
                    dispatch(globalPopoutOff())
                })
        else {
            dispatch(setErrorMessage(errorObj("Вы не авторизованы")))
            dispatch(globalPopoutOff())
        }
    }
}


// авторизация (со встроенной регистрацией)
export const getAuthInfo = (vkProfileInfo) => {
    return dispatch => {
        dispatch(globalPopoutOn())
        dispatch(resetError())

        if (authQueryString && authQueryString.length > 0)
            ProfileAPI.getAuthInfo(vkProfileInfo)
                .then(pl => {
                    if (pl) {
                        dispatch(setUserProfile(pl.data));
                        dispatch(setTriedToGetProfile(false));
                        dispatch(globalPopoutOff())
                    }
                    else {
                        dispatch(setErrorMessage(errorObj("Ошибка при регистрации")))
                        dispatch(globalPopoutOff())

                    }
                })
                .catch(error => {
                    dispatch(setErrorMessage(error))
                    dispatch(globalPopoutOff())
                })
        else {
            dispatch(setErrorMessage(errorObj("Вы не авторизованы")))
            dispatch(globalPopoutOff())

        }
    }
}


export default profileReducer;