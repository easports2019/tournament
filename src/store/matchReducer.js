import { setGlobalPopout, setErrorMessage } from "./systemReducer";
import { CityTournamentAdminAPI, MatchAPI } from './../utils/api/api.js'
import { Match } from './constants/commonConstants'
import { EmptyTournament } from './constants/commonConstants'

import { authQueryString } from './../utils/api/server';

let demoMatch = Match;

const MATCH_SET_ALL_MATCHES = "MATCH_SET_ALL_MATCHES";
const MATCH_SET_ACCESS = "MATCH_SET_ACCESS";
const MATCH_SET_MODE = "MATCH_SET_MODE";


const currentDate = new Date();
const emptyTournament = EmptyTournament

const initState = {
    matches: [],
    selected: {},
    access: "user",
    mode: "list", // режим отображения турнира ("list" - список, "view" - просмотр, "add" - добавление, "edit" - редактирование)
}


let matchReducer = (state = initState, action) => {
    switch (action.type) {
        case MATCH_SET_ALL_MATCHES: {
            return {
                ...state,
                matches: [...action.matches],
            };
        }
        case MATCH_SET_ACCESS: {
            return {
                ...state,
                access: action.access,
            };
        }
        case MATCH_SET_MODE: {
            return {
                ...state,
                mode: action.mode,
            };
        }

        default: {
            return state;
        }
    }
}

export const setAllMatches = (matches) => {
    return {
        type: MATCH_SET_ALL_MATCHES,
        matches
    }
}

export const setAccess = (access) => {
    return {
        type: MATCH_SET_ACCESS,
        access
    }
}

export const setMode = (mode) => {
    return {
        type: MATCH_SET_MODE,
        mode
    }
}



// все админы турниров города
export const getAllMatchesByTournament = (tournament = null, userProfile = null, startindex = 0) => {
    return dispatch => {
        if ((tournament != null) && (userprofile != null)) 
            {
                if (authQueryString && authQueryString.length > 0)
                    CityTournamentAdminAPI.getAll(startindex)
                        .then(pl => {
                            if (pl && pl.data.length > 0) {

                                dispatch((pl.data));
                                dispatch(setGlobalPopout(false))
                            }
                            else {

                                dispatch(setCityTournamentAdmins(demoCityTournamentAdmins))
                                dispatch(setGlobalPopout(false))
                            }
                        })
                        .catch(error => {

                            dispatch(setErrorMessage(error))
                            dispatch(setGlobalPopout(false))
                        })
                else {

                    dispatch(setCityTournamentAdmins(demoCityTournamentAdmins))
                    dispatch(setGlobalPopout(false))

                }
            }
        
    }
}


export const addMatchToShedule = (match = null, userProfile = null, hours = 0, minutes = 0) => {
    return dispatch => {
        if ((match != null) && (userProfile != null)) 
            {
                if (authQueryString && authQueryString.length > 0){
                debugger
                    MatchAPI.addMatch(match, userProfile, Number(hours) > 21 ? 24-Number(hours) : Number(hours)+3 , minutes)
                        .then(pl => {
                            if (pl && pl.data.length > 0) {

                                dispatch((pl.data));
                                dispatch(setGlobalPopout(false))
                            }
                            else {

                                dispatch(setCityTournamentAdmins(demoCityTournamentAdmins))
                                dispatch(setGlobalPopout(false))
                            }
                        })
                        .catch(error => {

                            dispatch(setErrorMessage(error))
                            dispatch(setGlobalPopout(false))
                        })
                    }
                else {

                    dispatch(setCityTournamentAdmins(demoCityTournamentAdmins))
                    dispatch(setGlobalPopout(false))

                }
            }
        
    }
}




    export default matchReducer;