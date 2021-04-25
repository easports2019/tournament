import {ampluaTypes, users} from './constants/commonConstants'
import { setActiveMenuItem } from "./mainMenuReducer";

const ANY_ACTION_TYPE = "ANY_ACTION_TYPE";
const SYSTEM_PUSH_TO_HISTORY = "SYSTEM_PUSH_TO_HISTORY";
const SYSTEM_POP_FROM_HISTORY = "SYSTEM_POP_FROM_HISTORY";
const SYSTEM_SET_GLOBAL_POPOUT = "SYSTEM_SET_GLOBAL_POPOUT";
const SYSTEM_SET_ERROR_MESSAGE = "SYSTEM_SET_ERROR_MESSAGE";
const SYSTEM_RESET_ERROR = "SYSTEM_RESET_ERROR";
const SYSTEM_SET_SHOW_ADMIN_TOURNEY_TAB = "SYSTEM_SET_SHOW_ADMIN_TOURNEY_TAB";


const initState = {
    currentMenu: {},
    history: ["hot"],
    GlobalPopout: false,
    ErrorObject: {resultcode: 0, result: "Ok", data: null, message: ""},
    ShowAdminTourneyTab: false,

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
        case SYSTEM_SET_GLOBAL_POPOUT: {
            return {...state,
                GlobalPopout: action.on,
            };
        }
        case SYSTEM_SET_ERROR_MESSAGE: {
            return {...state,
                ErrorObject: {...action.errorObject},
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

export const setErrorMessage = (errorObject) => {
    return {
        type: SYSTEM_SET_ERROR_MESSAGE,
        errorObject
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

export default systemReducer;