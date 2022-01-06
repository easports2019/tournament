import {ampluaTypes, myProfile, users} from './constants/commonConstants'
import { ProfileAPI, errorObj } from './../utils/api/api.js'
import { authQueryString } from './../utils/api/server';
import { setGlobalPopout, setErrorMessage, resetError } from "./systemReducer";


const ANY_ACTION_TYPE = "ANY_ACTION_TYPE";
const PROFILE_SET_VK_PROFILE_INFO = "PROFILE_SET_VK_PROFILE_INFO";
const PROFILE_SET_USER_PROFILE = "PROFILE_SET_USER_PROFILE";
const PROFILE_SET_TRIED_TO_GET_PROFILE = "PROFILE_SET_TRIED_TO_GET_PROFILE";
const PROFILE_SET_MY_TOTAL_EXP = "PROFILE_SET_MY_TOTAL_EXP";
const PROFILE_SET_MY_NAME = "PROFILE_SET_MY_NAME";
const PROFILE_SET_MY_BIRTH = "PROFILE_SET_MY_BIRTH";
const PROFILE_SET_MY_SURNAME = "PROFILE_SET_MY_SURNAME";

let demoUser = users[0];

const initState = {
    myProfile: null,
    vkProfile: null,
    triedToGetProfile: 0,

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
            let birth = action.user.Birth ? `${new Date(action.user.Birth).getDate()}.${new Date(action.user.Birth).getMonth()}.${new Date(action.user.Birth).getYear()}` : null;

            return {...state,
                myProfile: {...action.user},
                vkProfile: {...state.vkProfile,
                bdate: birth
                }
            };
        }
        case PROFILE_SET_TRIED_TO_GET_PROFILE: {
            return {...state,
                triedToGetProfile: action.tried,
            };
        }
        case PROFILE_SET_MY_TOTAL_EXP: {

            return {...state,
                myProfile: {...state.myProfile,
                    TotalExpirience: Math.round(action.exp),
                }
            };
        }
        case PROFILE_SET_MY_NAME: {
            return {...state,
                myProfile: {...state.myProfile,
                    Name: action.name,
                }
            };
        }
        case PROFILE_SET_MY_SURNAME: {
            return {...state,
                myProfile: {...state.myProfile,
                    Surname: action.surname,
                }
            };
        }
        case PROFILE_SET_MY_BIRTH: {
            return {...state,
                myProfile: {...state.myProfile,
                    Birth: new Date(action.birthDate.year, action.birthDate.month-1, action.birthDate.day+1),
                }
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

// установка опыта
export const setMyTotalExpirience = (exp) => {
    
    //let exp = e.CurrentTarget.value
    return {
        type: PROFILE_SET_MY_TOTAL_EXP,
        exp
    }
}

// установка имени
export const setUserName = (e) => {

    return {
        type: PROFILE_SET_MY_NAME,
        name: e.currentTarget.value
    }
}

// установка фамилии
export const setUserSurName = (e) => {

    return {
        type: PROFILE_SET_MY_SURNAME,
        surname: e.currentTarget.value
    }
}

// установка даты рождения
export const setBirthDate = (birthDate) => {
    return {
        type: PROFILE_SET_MY_BIRTH,
        birthDate
    }
}

// получение данных профиля (без авторегистрации)
export const getUserProfile = (vkUserData) => {
    return dispatch => {
        dispatch(setGlobalPopout(true))
        dispatch(resetError())

        if (authQueryString && authQueryString.length > 0)
            ProfileAPI.getUserProfile(vkUserData)
                .then(pl => {
                    
                    if (pl && pl.data) {
                        dispatch(setUserProfile(pl.data));
                        dispatch(setTriedToGetProfile(0));
                        dispatch(setGlobalPopout(false))
                    }
                    else {
                        dispatch(setTriedToGetProfile(1))
                    }
                })
                .catch(error => {
                    dispatch(setErrorMessage(error))
                    dispatch(setGlobalPopout(false))
                })
        else {
            dispatch(setErrorMessage(errorObj("Вы не авторизованы")))
            dispatch(setGlobalPopout(false))
            //dispatch(setUserProfile(demoUser))
            //dispatch(setTriedToGetProfile(true))

        }
    }
}


// установка нового города пользователю
export const setUserProfileCity = (userProfile) => {
    return dispatch => {
        dispatch(setGlobalPopout(true))
        dispatch(resetError())
        debugger
        if (authQueryString && authQueryString.length > 0)
            ProfileAPI.setUserProfileCity(userProfile).then()
                .then(pl => {
                    debugger
                    if (pl && pl.data) {
                        dispatch(setUserProfile(pl.data));
                        dispatch(setGlobalPopout(false))
                    }
                    else {
                        dispatch(setErrorMessage(errorObj("Не получен ответ от сервера")))
                        //dispatch(setGlobalPopout(false))
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


// авторизация (со встроенной регистрацией)
export const getAuthInfo = (vkProfileInfo) => {
    return dispatch => {
        dispatch(setGlobalPopout(true))
        dispatch(resetError())

        if (authQueryString && authQueryString.length > 0)
            ProfileAPI.getAuthInfo(vkProfileInfo)
                .then(pl => {
                    if (pl) {
                        dispatch(setUserProfile(pl.data));
                        dispatch(setTriedToGetProfile(0));
                        dispatch(setGlobalPopout(false))
                    }
                    else {
                        dispatch(setErrorMessage(errorObj("Ошибка при регистрации")))
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

// сохранение профиля
export const saveUserProfile = (ProfileInfo) => {
    return dispatch => {
        dispatch(setGlobalPopout(true))
        dispatch(resetError())

        if (authQueryString && authQueryString.length > 0)
            ProfileAPI.saveUserProfile(ProfileInfo)
                .then(pl => {
                    if (pl) {
                        dispatch(setUserProfile(pl.data));
                        dispatch(setTriedToGetProfile(0));
                        dispatch(setGlobalPopout(false))
                    }
                    else {
                        dispatch(setErrorMessage(errorObj("Ошибка при сохранении профиля")))
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


export default profileReducer;