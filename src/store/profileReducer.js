import {ampluaTypes, myProfile, users} from './constants/commonConstants'
import { ProfileAPI, errorObj } from './../utils/api/api.js'
import { authQueryString } from './../utils/api/server';
import { setGlobalPopout, setErrorMessage, resetError, setTriedToLoadOblakoProfile,
    setOblakoProfileLoaded, setVkProfileLoaded, setTriedToLoadVkProfile, 
    setVkProfileBirthDateLoaded, setVkProfileBirthYearLoaded, setVkProfileCityLoaded,
} from "./systemReducer";


const ANY_ACTION_TYPE = "ANY_ACTION_TYPE";
const PROFILE_SET_VK_PROFILE_INFO = "PROFILE_SET_VK_PROFILE_INFO";
const PROFILE_SET_USER_PROFILE = "PROFILE_SET_USER_PROFILE";
const PROFILE_SET_TRIED_TO_GET_PROFILE = "PROFILE_SET_TRIED_TO_GET_PROFILE";
const PROFILE_SET_MY_TOTAL_EXP = "PROFILE_SET_MY_TOTAL_EXP";
const PROFILE_SET_MY_NAME = "PROFILE_SET_MY_NAME";
const PROFILE_SET_MY_BIRTH = "PROFILE_SET_MY_BIRTH";
const PROFILE_SET_MY_SURNAME = "PROFILE_SET_MY_SURNAME";
const PROFILE_SET_USER_IS_GROUP_ADMIN = "PROFILE_SET_USER_IS_GROUP_ADMIN";
const PROFILE_SET_USER_IS_FIRST_START = "PROFILE_SET_USER_IS_FIRST_START";

let demoUser = users[0];

const initState = {
    myProfile: null,
    vkProfile: null,
    isGroupAdmin: false,
    isFirstStart: false,
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
        case PROFILE_SET_USER_IS_GROUP_ADMIN: {
            return {...state,
                isGroupAdmin: action.isAdmin,
            };
        }
        case PROFILE_SET_USER_IS_FIRST_START: {
            return {...state,
                isFirstStart: action.val,
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

export const setUserIsGroupAdmin = (isAdmin) => {
    return {
        type: PROFILE_SET_USER_IS_GROUP_ADMIN,
        isAdmin
    }
}

export const setIsFirstStart = (val) => {
    return {
        type: PROFILE_SET_USER_IS_FIRST_START,
        val
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
                    debugger
                    if (pl && pl.data) {
                        dispatch(setUserProfile(pl.data));
                        dispatch(setTriedToLoadOblakoProfile(0));
                        dispatch(setOblakoProfileLoaded(true));
                        dispatch(setGlobalPopout(false))
                    }
                    else {
                        dispatch(setTriedToLoadOblakoProfile(1))
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


// установка флагов загрузки пользователя ВК
export const setVkProfileInfoAndSetFlags = (userProfile) => {
    return dispatch => {
        debugger
        dispatch(setVkProfileInfo(userProfile));

        if (userProfile.bdate != undefined){
            dispatch(setVkProfileBirthYearLoaded(true));
            if (userProfile.bdate.split('.').length > 2)
                dispatch(setVkProfileBirthDateLoaded(true));
        }

        if ((userProfile.city != null) && (userProfile.city.id != 0))
            dispatch(setVkProfileCityLoaded(true));

        dispatch(setVkProfileLoaded(true));
        dispatch(setTriedToLoadVkProfile(0));
    }
}

// установка нового города пользователю
export const setUserProfileCity = (userProfile) => {
    return dispatch => {
        dispatch(setGlobalPopout(true))
        dispatch(resetError())
        if (authQueryString && authQueryString.length > 0)
            ProfileAPI.setUserProfileCity(userProfile).then()
                .then(pl => {
                    debugger
                    if (pl && pl.data) {
                        dispatch(setUserProfile(pl.data));
                        if (pl.data.CityUmbracoId >= 0)
                            dispatch(setOblakoProfileCityLoaded(true));
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
//export const getAuthInfo = (vkProfileInfo) => {
export const registerUser = (vkProfileInfo) => {
    return dispatch => {
        dispatch(setGlobalPopout(true))
        dispatch(resetError())

        if (authQueryString && authQueryString.length > 0)
            ProfileAPI.registerUser(vkProfileInfo)
                .then(pl => {
                    debugger
                    if (pl) {
                        dispatch(setUserProfile(pl.data));
                        dispatch(setTriedToLoadOblakoProfile(0));
                        dispatch(setOblakoProfileLoaded(true));
                        dispatch(setIsFirstStart(true)); // установить флаг зарегистрирован
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
                        dispatch(setTriedToLoadOblakoProfile(0));
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