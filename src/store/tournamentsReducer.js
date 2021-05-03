import { setGlobalPopout, setErrorMessage } from "./systemReducer";
import { CityTournamentAdminAPI } from './../utils/api/api.js'
import { cityTournamentAdmins } from './constants/commonConstants'

import { authQueryString } from './../utils/api/server';

let demoCityTournamentAdmins = cityTournamentAdmins;

const TOURNAMENT_SET_ALL_TOURNAMENTS = "TOURNAMENT_SET_ALL_TOURNAMENTS";
const TOURNAMENT_SET_MODE = "TOURNAMENT_SET_MODE";
const TOURNAMENT_SET_ALL_CITYTOURNAMENTADMINS = "TOURNAMENT_SET_ALL_CITYTOURNAMENTADMINS";
const TOURNAMENT_SET_WHEN_BEGIN = "TOURNAMENT_SET_WHEN_BEGIN";
const TOURNAMENT_SET_WHEN_END = "TOURNAMENT_SET_WHEN_END";
const TOURNAMENT_SET_NAME = "TOURNAMENT_SET_NAME";
const TOURNAMENT_SET_DETAILS = "TOURNAMENT_SET_DETAILS";
const TOURNAMENT_SET_REGLAMENT = "TOURNAMENT_SET_REGLAMENT";
const TOURNAMENT_DEL_GROUP = "TOURNAMENT_DEL_GROUP";
const TOURNAMENT_ADD_GROUP = "TOURNAMENT_ADD_GROUP";
const TOURNAMENT_SET_GROUP = "TOURNAMENT_RESET_TOURNAMENT";
const TOURNAMENT_RESET_TOURNAMENT = "TOURNAMENT_SET_GROUP";
const TOURNAMENT_PUBLISH = "TOURNAMENT_PUBLISH";
const TOURNAMENT_UNPUBLISH = "TOURNAMENT_UNPUBLISH";
const TOURNAMENT_SET_TOURNAMENT_BY_ID = "TOURNAMENT_SET_TOURNAMENT_BY_ID";

const currentDate = new Date();
const emptyTournament = {
    Id : -1,
    Name: "",
    Year: 0,
    WhenBegin: {day: currentDate.getDay(), month: currentDate.getMonth()+1, year: currentDate.getFullYear()},
    WhenEnd: {day: currentDate.getDay(), month: currentDate.getMonth()+1, year: currentDate.getFullYear()},
    Details: "",
    Reglament: "", 
    Logo: "",
    CityId: -1,
    TournamentGroups: [], 
    Admins: [],
    Published: false,
    Deleted: false,
}

const initState = {
    tournaments: [], // все турниры
    selected: emptyTournament, // выбранный для просмотра/создания/редактирования турнир
    myTournaments: [], // те, что я создал
    cityTournamentAdmins: [], // админы текущего города
    mode: "view", // режим отображения турнира ("view" - просмотр, "add" - добавление, "edit" - редактирование)
}


let tournamentReducer = (state = initState, action) => {
    switch (action.type) {
        case TOURNAMENT_SET_ALL_TOURNAMENTS: {
            return {
                ...state,
                tournaments: [...action.tournaments],
            };
        }
        case TOURNAMENT_SET_MODE: {
            return {
                ...state,
                mode: action.mode,
            };
        }
        case TOURNAMENT_RESET_TOURNAMENT: {
            return {
                ...state,
                selected: {...emptyTournament},
            };
        }
        case TOURNAMENT_SET_ALL_CITYTOURNAMENTADMINS: {
            return {
                ...state,
                cityTournamentAdmins: [...action.cityTournamentAdmins],
            };
        }
        case TOURNAMENT_SET_WHEN_BEGIN: {
            return {
                ...state,
                selected: {...state.selected, 
                    WhenBegin: action.when,
                },
            };
        }
        case TOURNAMENT_SET_WHEN_END: {
            return {
                ...state,
                selected: {...state.selected, 
                    WhenEnd: action.when,
                },
            };
        }
        case TOURNAMENT_SET_NAME: {
            return {
                ...state,
                selected: {...state.selected, 
                    Name: action.value,
                },
            };
        }
        case TOURNAMENT_SET_REGLAMENT: {
            return {
                ...state,
                selected: {...state.selected, 
                    Reglament: action.value,
                },
            };
        }
        case TOURNAMENT_SET_DETAILS: {
            return {
                ...state,
                selected: {...state.selected, 
                    Details: action.value,
                },
            };
        }
        case TOURNAMENT_PUBLISH: {
            return {
                ...state,
                selected: {...state.selected, 
                    Published: true,
                },
            };
        }
        case TOURNAMENT_UNPUBLISH: {
            return {
                ...state,
                selected: {...state.selected, 
                    Published: false,
                },
            };
        }
        case TOURNAMENT_ADD_GROUP: {
            return {
                ...state,
                selected: {...state.selected, 
                    TournamentGroups: [...state.selected.TournamentGroups, 
                        {
                            Id: state.selected.TournamentGroups.length,
                            Name: action.groupName
                        }],
                },
            };
        }
        case TOURNAMENT_SET_GROUP: {
            return {
                ...state,
                selected: {...state.selected, 
                    TournamentGroups: state.selected.TournamentGroups.map(item => {
                        if (item.Id == action.groupId)
                        {
                            item.Id = action.groupId;
                            item.Name = action.groupName;
                        }
                        return item;
                    }),
                },
            };
        }
        case TOURNAMENT_DEL_GROUP: {
            return {
                ...state,
                selected: {...state.selected, 
                    TournamentGroups: state.selected.TournamentGroups.filter(item => item.Id != action.groupId),
                },
            };
        }
        default: {
            return state;
        }
    }
}

export const setTournaments = (tournaments) => {
    return {
        type: TOURNAMENT_SET_ALL_TOURNAMENTS,
        tournaments
    }
}

export const tournamentPublish = () => {
    return {
        type: TOURNAMENT_PUBLISH,
    }
}

export const tournamentUnpublish = () => {
    return {
        type: TOURNAMENT_UNPUBLISH,
    }
}

export const resetTournament = () => {
    return {
        type: TOURNAMENT_RESET_TOURNAMENT
    }
}

export const setTournamentWhenBegin = (when) => {
    return {
        type: TOURNAMENT_SET_WHEN_BEGIN,
        when
    }
}

export const setTournamentWhenEnd = (when) => {
    return {
        type: TOURNAMENT_SET_WHEN_END,
        when
    }
}

export const setTournamentMode = (mode) => {
    return {
        type: TOURNAMENT_SET_MODE,
        mode
    }
}

export const setTournamentName = (value) => {
    return {
        type: TOURNAMENT_SET_NAME,
        value
    }
}

export const setTournamentDetails = (value) => {
    return {
        type: TOURNAMENT_SET_DETAILS,
        value
    }
}

export const setTournamentReglament = (value) => {
    return {
        type: TOURNAMENT_SET_REGLAMENT,
        value
    }
}



export const setCityTournamentAdmins = (cityTournamentAdmins) => {
    return {
        type: TOURNAMENT_SET_ALL_CITYTOURNAMENTADMINS,
        cityTournamentAdmins
    }
}

export const delGroupFromTournament = (tournamentId, groupId) => {
    return {
        type: TOURNAMENT_DEL_GROUP,
        tournamentId,
        groupId
    }
}

export const addGroupToTournament = (tournamentId, groupName) => {
    return {
        type: TOURNAMENT_ADD_GROUP,
        tournamentId,
        groupName
    }
}

export const editGroupInTournament = (tournamentId, groupId, groupName) => {
    return {
        type: TOURNAMENT_SET_GROUP,
        tournamentId,
        groupId,
        groupName
    }
}


// все админы турниров города
export const getAllCityTournamentAdmins = (startindex = 0) => {
    return dispatch => {

        dispatch(setGlobalPopout(true))
        if (authQueryString && authQueryString.length > 0)
            CityTournamentAdminAPI.getAll(startindex)
                .then(pl => {
                    if (pl && pl.data.length > 0) {
                        
                        dispatch(setCityTournamentAdmins(pl.data));
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

// все админы города с сервера по Id города
export const getAllCityTournamentAdminsByCityId = (cityTournamentId, startindex = 0) => {
    return dispatch => {

        if (authQueryString && authQueryString.length > 0)
            CityTournamentAdminAPI.getAllInCityByCityId(cityTournamentId, startindex)
                .then(pl => {
                    if (pl && pl.data.length > 0) {
                        
                        dispatch(setCityTournamentAdmins(pl.data));
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

// все админы города с сервера по Id города
export const saveSelectedTournament = (tournament = null, userprofile = null) => {
    return dispatch => {
        if (tournament != null){
            if (authQueryString && authQueryString.length > 0)
                CityTournamentAdminAPI.saveTournament(tournament, userprofile)
                    .then(pl => {
                        if (pl && pl.data.length > 0) {
                            
                            dispatch(resetTournament());
                            dispatch(setGlobalPopout(false))
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось сохранить турнир"))
                            dispatch(setGlobalPopout(false))
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось сохранить турнир: " + error))
                        dispatch(setGlobalPopout(false))
                    })
            else {
                dispatch(setErrorMessage("Не удалось сохранить турнир"))
                dispatch(setGlobalPopout(false))

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось сохранить турнир, в функцию передан null"))
            dispatch(setGlobalPopout(false))

        }
    }
}




export default tournamentReducer;