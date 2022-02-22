import { setGlobalPopout, setErrorMessage } from "./systemReducer";
import { CityTournamentAdminAPI, MatchAPI } from './../utils/api/api.js'
import { Match } from './constants/commonConstants'
import { EmptyTournament } from './constants/commonConstants'

import { authQueryString } from './../utils/api/server';

let demoMatch = Match;

const MATCH_SET_ALL_MATCHES = "MATCH_SET_ALL_MATCHES";
const MATCH_SET_ALL_MATCHES_SELECTED_TEAM = "MATCH_SET_ALL_MATCHES_SELECTED_TEAM";
const MATCH_DEL_MATCH = "MATCH_DEL_MATCH";
const MATCH_SET_SELECTED = "MATCH_SET_SELECTED";
const MATCH_ADD_MATCH = "MATCH_ADD_MATCH";
const MATCH_SET_HOT_MATCHES = "MATCH_SET_HOT_MATCHES";
const MATCH_SET_ACCESS = "MATCH_SET_ACCESS";
const MATCH_SET_MODE = "MATCH_SET_MODE";
const MATCH_SET_PLAYED = "MATCH_SET_PLAYED";
const MATCH_SET_HOT_PANEL = "MATCH_SET_HOT_PANEL";

Date.prototype.addDays = function(days) {
    var date = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
    date.setDate(date.getDate() + days);
    return date;
}

const currentDate = new Date();
const emptyTournament = EmptyTournament

const initState = {
    matches: [],
    matchesBySelectedTeam: [],
    hot: {
        yesterday: [],
        today: [],
        tomorrow: [],
    },
    hotPanel: "today", // "yesterday", "tomorrow"
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
        case MATCH_SET_ALL_MATCHES_SELECTED_TEAM: {
            return {
                ...state,
                matchesBySelectedTeam: [...action.matches],
            };
        }
        case MATCH_SET_SELECTED: {
            return {
                ...state,
                selected: action.match,
            };
        }
        case MATCH_DEL_MATCH: {
            return {
                ...state,
                matches: [...state.matches.filter(m => m.Id != action.match.Id)],
            };
        }
        case MATCH_ADD_MATCH: {
            debugger
            if (state.matches != null && state.matches.filter(x => x.Id == action.match.Id).length > 0)
            {
                return {
                    ...state,
                    matches: [...state.matches.map(x => {
                        if (x.Id == action.match.Id){
                            return action.match
                        }
                        else
                        {
                            return x
                        }
                    })],
                }
            }
            else
            {
                return {
                    ...state,
                    matches: [...state.matches, action.match],
                }
            }
            
        }
        case MATCH_SET_HOT_MATCHES: {
            
            let date = new Date();
            let today = date.addDays(1).addDays(-1);
            let yesterday = date.addDays(-1);
            let tomorrow_begin = date.addDays(1);
            let tomorrow_end = date.addDays(2);

            let st = {
                ...state,
                hot: {
                    yesterday: [...action.matches.filter(match => {
                        
                        return ((new Date(match.When) >= yesterday) && (new Date(match.When) < today))
                    })],
                    today: [...action.matches.filter(match =>  {
                        
                        return ((new Date(match.When) >= today) && (new Date(match.When) < tomorrow_begin))
                    })],
                    tomorrow: [...action.matches.filter(match =>  {
                        
                        return ((new Date(match.When) >= tomorrow_begin) && (new Date(match.When) < tomorrow_end))
                    })],
                },
            };
            
            return st;
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
        case MATCH_SET_HOT_PANEL: {
            return {
                ...state,
                hotPanel: action.panelName,
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

export const setAllMatchesBySelectedTeam = (matches) => {
    return {
        type: MATCH_SET_ALL_MATCHES_SELECTED_TEAM,
        matches
    }
}

export const setHotMatches = (matches) => {
    return {
        type: MATCH_SET_HOT_MATCHES,
        matches
    }
}

export const delMatch = (match) => {
    return {
        type: MATCH_DEL_MATCH,
        match
    }
}

export const addMatch = (match) => {
    return {
        type: MATCH_ADD_MATCH,
        match
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

export const setHotPanel = (panelName) => {
    return {
        type: MATCH_SET_HOT_PANEL,
        panelName
    }
}

export const setSelectedMatch = (match) => {
    return {
        type: MATCH_SET_SELECTED,
        match
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

                                //dispatch(setCityTournamentAdmins(demoCityTournamentAdmins))
                                dispatch(setGlobalPopout(false))
                            }
                        })
                        .catch(error => {

                            dispatch(setErrorMessage(error))
                            dispatch(setGlobalPopout(false))
                        })
                else {

                    //dispatch(setCityTournamentAdmins(demoCityTournamentAdmins))
                    dispatch(setGlobalPopout(false))

                }
            }
        
    }
}

// добавить матч в турнир
export const addMatchToShedule = (match = null, userProfile = null, hours = 0, minutes = 0, seconds = 0) => {
    return dispatch => {

        dispatch(setGlobalPopout(true))

        if ((match != null) && (userProfile != null)) 
            {
                if (authQueryString && authQueryString.length > 0){
                
                    MatchAPI.addMatch(match, userProfile, Number(hours) > 21 ? 24-Number(hours) : Number(hours)+3 , minutes, seconds)
                        .then(pl => {
                            if (pl && pl.data) {
                                dispatch(addMatch(pl.data));
                                dispatch(setGlobalPopout(false))
                                dispatch(setErrorMessage("Успешно добавлено"))

                            }
                            else {

                                //dispatch(setCityTournamentAdmins(demoCityTournamentAdmins))
                                dispatch(setGlobalPopout(false))
                            }
                        })
                        .catch(error => {

                            dispatch(setErrorMessage(error))
                            dispatch(setGlobalPopout(false))
                        })
                    }
                else {

                    //dispatch(setCityTournamentAdmins(demoCityTournamentAdmins))
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
                            if (pl && pl.data) {
                                dispatch(delMatch(pl.data));
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
                            
                            if (pl && pl.data.length > 0) {
                                dispatch(setHotMatches(pl.data));
                                //dispatch((pl.data));
                                dispatch(setGlobalPopout(false))
                            }
                            else {
                                dispatch(setErrorMessage("Не получены данные MatchAPI.getCurrentMatchesByCity"))
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

// возвращает расписание матчей выбранной команды во всех турнирах города
export const getTeamSheduleByTeamId = (teamId, userProfile, groupId = -1) => {
    return dispatch => {
        if (userProfile != null) 
            {
                if (authQueryString && authQueryString.length > 0){
                
                    MatchAPI.getTeamSheduleByTeamId(groupId, teamId, userProfile)
                        .then(pl => {
                            if (pl && pl.data.length > 0) {
                                dispatch(setAllMatchesBySelectedTeam(pl.data));
                                dispatch(setGlobalPopout(false))
                            }
                            else {
                                dispatch(setErrorMessage("Не получены данные MatchAPI.getTeamSheduleByTeamId"))
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