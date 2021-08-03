import { setGlobalPopout, setErrorMessage } from "./systemReducer";
import { CityTournamentAdminAPI, MatchAPI } from './../utils/api/api.js'
import { Match } from './constants/commonConstants'
import { EmptyTournament } from './constants/commonConstants'

import { authQueryString } from './../utils/api/server';

let demoMatch = Match;

const MATCH_SET_ALL_MATCHES = "MATCH_SET_ALL_MATCHES";
const MATCH_SET_HOT_MATCHES = "MATCH_SET_HOT_MATCHES";
const MATCH_SET_ACCESS = "MATCH_SET_ACCESS";
const MATCH_SET_MODE = "MATCH_SET_MODE";
const MATCH_SET_PLAYED = "MATCH_SET_PLAYED";


const currentDate = new Date();
const emptyTournament = EmptyTournament

const initState = {
    matches: [],
    hot: [],
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
        case MATCH_SET_HOT_MATCHES: {
            debugger
            return {
                ...state,
                hot: [...action.matches],
            };
        }
        case MATCH_SET_ACCESS: {
            return {
                ...state,
                access: action.access,
            };
        }
        case MATCH_SET_PLAYED: {
            return {
                ...state,
                access: action.played,
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

export const setHotMatches = (matches) => {
    return {
        type: MATCH_SET_HOT_MATCHES,
        matches
    }
}

export const setAccess = (access) => {
    return {
        type: MATCH_SET_ACCESS,
        access
    }
}

export const setPlayed = (played) => {
    return {
        type: MATCH_SET_PLAYED,
        played
    }
}

export const setMode = (mode) => {
    return {
        type: MATCH_SET_MODE,
        mode
    }
}



// все матчи турнира
export const getAllMatchesByTournament = (tournament = null, userProfile = null, startindex = 0) => {
    return dispatch => {
        if ((tournament != null) && (userProfile != null)) 
            {
                if (authQueryString && authQueryString.length > 0)
                MatchAPI.getAllMatchesByTournament(tournament, userProfile)
                        .then(pl => {
                            
                            if (pl && pl.data && pl.data.length > 0) {
                                
                                dispatch(setAllMatches(pl.data));
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

// добавить матч в турнир
export const addMatchToShedule = (match = null, userProfile = null, hours = 0, minutes = 0) => {
    return dispatch => {
        if ((match != null) && (userProfile != null)) 
            {
                if (authQueryString && authQueryString.length > 0){
                
                    MatchAPI.addMatch(match, userProfile, Number(hours) > 21 ? 24-Number(hours) : Number(hours)+3 , minutes)
                        .then(pl => {
                            if (pl && pl.data.length > 0) {
                                dispatch(setAllMatches(pl.data));
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


// удалить матч из турнира
export const delMatchFromShedule = (match = null, userProfile = null, hours = 0, minutes = 0) => {
    return dispatch => {
        if ((match != null) && (userProfile != null)) 
            {
                if (authQueryString && authQueryString.length > 0){
                
                    MatchAPI.delMatch(match, userProfile, Number(hours) > 21 ? 24-Number(hours) : Number(hours)+3 , minutes)
                        .then(pl => {
                            if (pl && pl.data.length > 0) {
                                dispatch(setAllMatches(pl.data));
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

// возвращает актуальные матчи города
export const getMatchesInCurrentCity = (userProfile = null) => {
    return dispatch => {
        if (userProfile != null) 
            {
                if (authQueryString && authQueryString.length > 0){
                
                    MatchAPI.getCurrentMatchesByCity(userProfile)
                        .then(pl => {
                            debugger
                            if (pl && pl.data.length > 0) {
                                dispatch(setHotMatches(pl.data));
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