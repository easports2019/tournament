import {ampluaTypes, users} from './constants/commonConstants'
import { setActiveMenuItem } from "./mainMenuReducer";
import { authQueryString } from './../utils/api/server';
import { ServiceAPI, errorObj } from './../utils/api/api.js'

const ANY_ACTION_TYPE = "ANY_ACTION_TYPE";
const SYSTEM_SET_LOADING = "SYSTEM_SET_LOADING";
const SYSTEM_CHECK_LOADING = "SYSTEM_CHECK_LOADING";
const SYSTEM_SET_CONNECTED = "SYSTEM_SET_CONNECTED";
const SYSTEM_SET_DISCONNECTED = "SYSTEM_SET_DISCONNECTED";
const SYSTEM_PUSH_TO_HISTORY = "SYSTEM_PUSH_TO_HISTORY";
const SYSTEM_SET_CURRENT_MODAL_WINDOW = "SYSTEM_SET_CURRENT_MODAL_WINDOW";
const SYSTEM_POP_FROM_HISTORY = "SYSTEM_POP_FROM_HISTORY";
const SYSTEM_SET_GLOBAL_POPOUT = "SYSTEM_SET_GLOBAL_POPOUT";
const SYSTEM_SET_ERROR_MESSAGE = "SYSTEM_SET_ERROR_MESSAGE";
const SYSTEM_RESET_ERROR = "SYSTEM_RESET_ERROR";
const SYSTEM_SET_SHOW_ADMIN_TOURNEY_TAB = "SYSTEM_SET_SHOW_ADMIN_TOURNEY_TAB";
const SYSTEM_SET_SHOW_GROUP_TAB = "SYSTEM_SET_SHOW_GROUP_TAB";


const initState = {
    currentMenu: {},
    Connected: false,
    history: ["hot"],
    GlobalPopout: false,
    CurrentModalWindow: null,
    //ErrorObject: {resultcode: 0, result: "Ok", data: null, message: ""},
    ErrorObject: "",
    ShowAdminTourneyTab: false,
    ShowAdminTeamTab: false,
    ShowGroupTab: false,
    Loading: true,
    CheckLoading: new Date(),
     // level 

}


export let systemReducer = (state = initState, action) => 
{
    
    switch (action.type){
        case ANY_ACTION_TYPE: {
            return state;
        }
        case SYSTEM_PUSH_TO_HISTORY: {
            return {...state,
                history: [...state.history, action.item]
            };
        }
        case SYSTEM_CHECK_LOADING: {
            return {...state,
                CheckLoading: new Date(),
            };
        }
        case SYSTEM_SET_CONNECTED: {
            
            return {...state,
                Connected: true,
            };
        }
        case SYSTEM_SET_DISCONNECTED: {
            
            return {...state,
                Connected: false,
            };
        }
        case SYSTEM_SET_GLOBAL_POPOUT: {
            return {...state,
                GlobalPopout: action.on,
            };
        }
        case SYSTEM_SET_CURRENT_MODAL_WINDOW: {
            return {...state,
                CurrentModalWindow: action.modal,
            };
        }
        case SYSTEM_SET_LOADING: {
            return {...state,
                Loading: action.loading,
                GlobalPopout: action.loading,
            };
        }
        case SYSTEM_SET_ERROR_MESSAGE: {
            
            return {...state,
                ErrorObject: {...action.errorMessage},
                // че-то ошибочки начинают какие-то левые вылезать, если делать все как тут нужно
                // ErrorObject: {...state.ErrorObject,
                //     message: action.errorMessage,
                //     resultcode: -1, 
                //     result: "",
                // }
            };
        }
        case SYSTEM_RESET_ERROR: {
            
            return {...state,
                ErrorObject: {...initState.ErrorObject},
            };
        }
        case SYSTEM_POP_FROM_HISTORY: {
            
            return {...state,
                history: state.history.length > 1 ? [...state.history.slice(0, state.history.length-1)] : [...state.history]
            };
        }
        case SYSTEM_SET_SHOW_ADMIN_TOURNEY_TAB: {
            
            return {...state,
                ShowAdminTourneyTab: action.showAdminTourneyTab
            };
        }
        case SYSTEM_SET_SHOW_GROUP_TAB: {
            
            return {...state,
                ShowGroupTab: action.showGroupTab
            };
        }
        default: {
            return state;
        }
    }
}


export const anyActionCreator = (val) => {
    return {
        type: ANY_ACTION_TYPE,
        anyVal: val
    }
}

export const setLoading = (loading) => {
    return {
        type: SYSTEM_SET_LOADING,
        loading
    }
}

export const updateLoading = () => {
    return {
        type: SYSTEM_CHECK_LOADING
    }
}

export const setConnected = () => {
    return {
        type: SYSTEM_SET_CONNECTED
    }
}

export const setDisconnected = () => {
    return {
        type: SYSTEM_SET_DISCONNECTED
    }
}

export const pushToHistory = (val) => {
    return {
        type: SYSTEM_PUSH_TO_HISTORY,
        item: val
    }
}

export const setShowAdminTourneyTab = (val) => {
    return {
        type: SYSTEM_SET_SHOW_ADMIN_TOURNEY_TAB,
        showAdminTourneyTab: val
    }
}

export const setShowGroupTab = (val) => {
    return {
        type: SYSTEM_SET_SHOW_GROUP_TAB,
        showGroupTab: val
    }
}

export const popFromHistory = (val) => {
    return {
        type: SYSTEM_POP_FROM_HISTORY,
        item: val
    }
}

export const setGlobalPopout = (on) => {
    return {
        type: SYSTEM_SET_GLOBAL_POPOUT,
        on
    }
}

export const setCurrentModalWindow = (modal) => {
    return {
        type: SYSTEM_SET_CURRENT_MODAL_WINDOW,
        modal
    }
}

export const setErrorMessage = (errorMessage) => {
    return {
        type: SYSTEM_SET_ERROR_MESSAGE,
        errorMessage
    }
}

export const resetError = () => {
    return {
        type: SYSTEM_RESET_ERROR
    }
}

// export const setLastFromHistoryMenuItem = (val) => {
//     return {
//         type: POP_FROM_HISTORY,
//         item: val
//     }
// }

export const goToPanel = (nextPanel, back) => {
    return (dispatch, getState) => {
        
        if (back){
            let preLast = getState().system.history.length > 1 ? getState().system.history[getState().system.history.length - 2] : (getState().system.history.length == 1 && getState().system.history[0]);
            dispatch(setActiveMenuItem(preLast));
            dispatch(popFromHistory(nextPanel));
        }
        else{
            dispatch(pushToHistory(nextPanel));
            dispatch(setActiveMenuItem(nextPanel));
        }
        
    }
}


// проверка связи с сервисом
export const checkConnection = () => {
    return dispatch => {
        dispatch(setGlobalPopout(true))
        dispatch(resetError())

        if (authQueryString && authQueryString.length > 0)
        ServiceAPI.checkConnection()
                .then(pl => {
                    
                    if (pl && pl.result == "Ok") {
                        dispatch(setConnected());
                        dispatch(setGlobalPopout(false))
                    }
                    else {
                        dispatch(setErrorMessage(errorObj("Ошибка при соединении с сервисом")))
                        dispatch(setDisconnected());
                        dispatch(setGlobalPopout(false))

                    }
                })
                .catch(error => {
                    dispatch(setErrorMessage(error))
                    dispatch(setGlobalPopout(false))
                })
        else {
            dispatch(setErrorMessage(errorObj("Ошибка запуска приложения")))
            dispatch(setGlobalPopout(false))

        }
    }
}

export default systemReducer;