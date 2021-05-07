import { setGlobalPopout, setErrorMessage } from "./systemReducer";
import { TeamAdminAPI } from './../utils/api/api.js'
import { TeamAdmins } from './constants/commonConstants'

import { authQueryString } from './../utils/api/server';

let demoCityTeamAdmins = TeamAdmins;

const TEAM_SET_ALL_TEAMS = "TEAM_SET_ALL_TEAMS";
const TEAM_SET_SELECTED_TEAM = "TEAM_SET_SELECTED_TEAM";
const TEAM_SET_MYTEAM = "TEAM_SET_MYTEAM";
const TEAM_ADD_MYTEAM = "TEAM_ADD_MYTEAM";
const TEAM_DELETE_MYTEAM = "TEAM_DELETE_MYTEAM";
const TEAM_SET_MODE = "TEAM_SET_MODE";
const TEAM_SET_ALL_CITYTEAMADMINS = "TEAM_SET_ALL_CITYTEAMADMINS";
const TEAM_SET_WHEN_BORN = "TEAM_SET_WHEN_BORN";
const TEAM_SET_NAME = "TEAM_SET_NAME";
const TEAM_SET_DETAILS = "TEAM_SET_DETAILS";
const TEAM_SET_REGLAMENT = "TEAM_SET_REGLAMENT";
const TEAM_DEL_GROUP = "TEAM_DEL_GROUP";
const TEAM_ADD_GROUP = "TEAM_ADD_GROUP";
const TEAM_SET_GROUP = "TEAM_RESET_TEAM";
const TEAM_RESET_TEAM = "TEAM_SET_GROUP";
const TEAM_PUBLISH = "TEAM_PUBLISH";
const TEAM_UNPUBLISH = "TEAM_UNPUBLISH";
const TEAM_SET_MY_TEAMS = "TEAM_SET_MY_TEAMS";
const TEAM_SET_TEAM_BY_ID = "TEAM_SET_TEAM_BY_ID";

const currentDate = new Date();

const emptyTeam = {
    Id : -1,
    Name: "",
    Year: 0,
    WhenBorn: {day: currentDate.getDay(), month: currentDate.getMonth()+1, year: currentDate.getFullYear()},
    Details: "",
    Logo: "",
    CityId: -1,
    TournamentGroups: [], 
    Admins: [],
    Matches: [],
    Players: [],
    Published: false,
    Deleted: false,
}

const initState = {
    teams: [], // все турниры
    selected: emptyTeam, // выбранный для просмотра/создания/редактирования турнир
    myTeams: [], // те, что я создал
    cityTeamAdmins: [], // админы текущего города
    mode: "view", // режим отображения турнира ("view" - просмотр, "add" - добавление, "edit" - редактирование)
}


let teamReducer = (state = initState, action) => {
    switch (action.type) {
        case TEAM_SET_ALL_TEAMS: {
            return {
                ...state,
                teams: [...action.teams],
            };
        }
        case TEAM_SET_MY_TEAMS: {
            debugger
            return {
                ...state,
                myTeams: [...action.myTeams],
            };
        }
        case TEAM_SET_MODE: {
            return {
                ...state,
                mode: action.mode,
            };
        }
        case TEAM_ADD_MYTEAM: {
            
            return {
                ...state,
                myTeams: [...state.myTeams, {...action.myteam}]
            };
        }
        case TEAM_SET_MYTEAM: {
            
            return {
                ...state,
                myTeams: [...state.myTeams.map(tour => {
                    
                    if (tour.Id == action.myteam.Id) {{
                        tour = {...action.myteam};
                    }}
                    return tour;
                })],
            };
        }
        case TEAM_DELETE_MYTEAM: {
            
            return {
                ...state,
                myTeams: [...state.myTeams.filter(tour => tour.Id != action.myteam.Id )],
            };
        }
        case TEAM_SET_SELECTED_TEAM: {
            let index = -1;
            return {
                ...state,
                selected: {...action.team,
                    WhenBegin: {day: new Date(action.team.WhenBegin).getDate(), 
                        month: new Date(action.team.WhenBegin).getMonth()+1, 
                        year: new Date(action.team.WhenBegin).getFullYear()},
                    WhenEnd: {day: new Date(action.team.WhenEnd).getDate(), 
                        month: new Date(action.team.WhenEnd).getMonth()+1, 
                        year: new Date(action.team.WhenEnd).getFullYear()},
                    TeamGroups: [...action.team.TeamGroups.map(item => {
                        return {...item, KeyId: ++index}
                    })]
                },
            };
        }
        case TEAM_RESET_TEAM: {
            return {
                ...state,
                selected: {...emptyTeam},
            };
        }
        case TEAM_SET_ALL_CITYTEAMADMINS: {
            return {
                ...state,
                cityTeamAdmins: [...action.cityTeamAdmins],
            };
        }
        case TEAM_SET_WHEN_BORN: {
            return {
                ...state,
                selected: {...state.selected, 
                    WhenBorn: action.when,
                },
            };
        }
        case TEAM_SET_NAME: {
            return {
                ...state,
                selected: {...state.selected, 
                    Name: action.value,
                },
            };
        }
        case TEAM_SET_REGLAMENT: {
            return {
                ...state,
                selected: {...state.selected, 
                    Reglament: action.value,
                },
            };
        }
        case TEAM_SET_DETAILS: {
            return {
                ...state,
                selected: {...state.selected, 
                    Details: action.value,
                },
            };
        }
        case TEAM_PUBLISH: {
            return {
                ...state,
                selected: {...state.selected, 
                    Published: true,
                },
            };
        }
        case TEAM_UNPUBLISH: {
            return {
                ...state,
                selected: {...state.selected, 
                    Published: false,
                },
            };
        }
        case TEAM_ADD_GROUP: {
            let max = -1;
            state.selected.TeamGroups.forEach(item => {
                if (item.KeyId != undefined){
                    if (item.KeyId > max)
                        max = item.KeyId;
                }
            });
            return {
                ...state,
                selected: {...state.selected, 
                    TeamGroups: [...state.selected.TeamGroups, 
                        {
                            KeyId: max + 1,    
                            Name: action.groupName
                        }],
                },
            };
        }
        case TEAM_SET_GROUP: {
            return {
                ...state,
                selected: {...state.selected, 
                    TeamGroups: state.selected.TeamGroups.map(item => {
                        if (item.Id == action.groupId)
                        {
                            item.Id = action.groupId;
                            item.KeyId = action.groupId;
                            item.Name = action.groupName;
                        }
                        return item;
                    }),
                },
            };
        }
        case TEAM_DEL_GROUP: {
            return {
                ...state,
                selected: {...state.selected, 
                    TeamGroups: state.selected.TeamGroups.filter(item => item.KeyId != action.groupId),
                },
            };
        }
        default: {
            return state;
        }
    }
}

export const setTeams = (teams) => {
    return {
        type: TEAM_SET_ALL_TEAMS,
        teams
    }
}

export const setMyTeam = (myteam) => {
    return {
        type: TEAM_SET_MYTEAM,
        myteam
    }
}

export const addMyTeam = (myteam) => {
    return {
        type: TEAM_ADD_MYTEAM,
        myteam
    }
}

export const setSelectedTeam = (team) => {
    return {
        type: TEAM_SET_SELECTED_TEAM,
        team
    }
}

export const deleteMyTeam = (myteam) => {
    return {
        type: TEAM_DELETE_MYTEAM,
        myteam
    }
}

export const setMyTeams = (myTeams) => {
    return {
        type: TEAM_SET_MY_TEAMS,
        myTeams
    }
}

export const teamPublish = () => {
    return {
        type: TEAM_PUBLISH,
    }
}

export const teamUnpublish = () => {
    return {
        type: TEAM_UNPUBLISH,
    }
}

export const resetTeam = () => {
    return {
        type: TEAM_RESET_TEAM
    }
}

export const setTeamWhenBorn = (when) => {
    return {
        type: TEAM_SET_WHEN_BORN,
        when
    }
}


export const setTeamMode = (mode) => {
    return {
        type: TEAM_SET_MODE,
        mode
    }
}

export const setTeamName = (value) => {
    return {
        type: TEAM_SET_NAME,
        value
    }
}

export const setTeamDetails = (value) => {
    return {
        type: TEAM_SET_DETAILS,
        value
    }
}

export const setTeamReglament = (value) => {
    return {
        type: TEAM_SET_REGLAMENT,
        value
    }
}



export const setCityTeamAdmins = (cityTeamAdmins) => {
    return {
        type: TEAM_SET_ALL_CITYTEAMADMINS,
        cityTeamAdmins
    }
}

export const delGroupFromTeam = (teamId, groupId) => {
    return {
        type: TEAM_DEL_GROUP,
        teamId,
        groupId
    }
}

export const addGroupToTeam = (teamId, groupName) => {
    return {
        type: TEAM_ADD_GROUP,
        teamId,
        groupName
    }
}

export const editGroupInTeam = (teamId, groupId, groupName) => {
    return {
        type: TEAM_SET_GROUP,
        teamId,
        groupId,
        groupName
    }
}


// все админы турниров города
export const getAllCityTeamAdmins = (startindex = 0) => {
    return dispatch => {

        dispatch(setGlobalPopout(true))
        if (authQueryString && authQueryString.length > 0)
        TeamAdminAPI.getAll(startindex)
                .then(pl => {
                    if (pl && pl.data.length > 0) {
                        
                        dispatch(setCityTeamAdmins(pl.data));
                        dispatch(setGlobalPopout(false))
                    }
                    else {
                        
                        dispatch(setCityTeamAdmins(demoCityTeamAdmins))
                        dispatch(setGlobalPopout(false))
                    }
                })
                .catch(error => {
                    
                    dispatch(setErrorMessage(error))
                    dispatch(setGlobalPopout(false))
                })
        else {
            
            dispatch(setCityTeamAdmins(demoCityTeamAdmins))
            dispatch(setGlobalPopout(false))

        }
    }
}

// все админы города с сервера по Id города
export const getAllCityTeamAdminsByCityId = (cityTeamId, startindex = 0) => {
    return dispatch => {

        if (authQueryString && authQueryString.length > 0)
        TeamAdminAPI.getAllInCityByCityId(cityTeamId, startindex)
                .then(pl => {
                    if (pl && pl.data.length > 0) {
                        
                        dispatch(setCityTeamAdmins(pl.data));
                        dispatch(setGlobalPopout(false))
                    }
                    else {
                        dispatch(setCityTeamAdmins(demoCityTeamAdmins))
                        dispatch(setGlobalPopout(false))

                    }
                })
                .catch(error => {
                    dispatch(setErrorMessage(error))
                    dispatch(setGlobalPopout(false))
                })
        else {
            dispatch(setCityTeamAdmins(demoCityTeamAdmins))
            dispatch(setGlobalPopout(false))

        }
    }
}

// сохраняет (добавляет) в базу новую команду
export const saveSelectedTeam = (team = null, userprofile = null) => {
    return dispatch => {
        if (team != null){
            if (authQueryString && authQueryString.length > 0)
            TeamAdminAPI.saveTeam(team, userprofile)
                    .then(pl => {
                        if (pl && pl.data.length > 0) {
                            dispatch(addMyTeam(pl.data));
                            dispatch(resetTeam());
                            dispatch(setGlobalPopout(false))
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось сохранить команду"))
                            dispatch(setGlobalPopout(false))
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось сохранить команду: " + error))
                        dispatch(setGlobalPopout(false))
                    })
            else {
                dispatch(setErrorMessage("Не удалось сохранить команду"))
                dispatch(setGlobalPopout(false))

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось сохранить команду, в функцию передан null"))
            dispatch(setGlobalPopout(false))

        }
    }
}

// опубликовывает турнир
export const publishTeam = (team = null, userprofile = null, publish = false) => {
    
    return dispatch => {
        if ((team != null) || (userprofile == null)){
            if (authQueryString && authQueryString.length > 0)
            TeamAdminAPI.publishTeam(team, userprofile, publish)
                    .then(pl => {
                        
                        if (pl) {
                            // изменить полученный турнир в списке
                            dispatch(setMyTeam(pl.data))
                            dispatch(setGlobalPopout(false))
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось опубликовать турнир"))
                            dispatch(setGlobalPopout(false))
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось опубликовать турнир: " + error))
                        dispatch(setGlobalPopout(false))
                    })
            else {
                dispatch(setErrorMessage("Не удалось опубликовать турнир"))
                dispatch(setGlobalPopout(false))

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось опубликовать турнир, в функцию передан null"))
            dispatch(setGlobalPopout(false))

        }
    }
}

// удаляет турнир
export const deleteTeam = (team = null, userprofile = null) => {
    
    return dispatch => {
        if ((team != null) || (userprofile == null)){
            if (authQueryString && authQueryString.length > 0)
            TeamAdminAPI.deleteTeam(team, userprofile)
                    .then(pl => {
                        if (pl) {
                            // изменить полученный турнир в списке
                            dispatch(deleteMyTeam(pl.data))
                            dispatch(setGlobalPopout(false))
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось удалить турнир"))
                            dispatch(setGlobalPopout(false))
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось удалить турнир: " + error))
                        dispatch(setGlobalPopout(false))
                    })
            else {
                dispatch(setErrorMessage("Не удалось удалить турнир"))
                dispatch(setGlobalPopout(false))

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось удалить турнир, в функцию передан null"))
            dispatch(setGlobalPopout(false))

        }
    }
}


// возвращает с сервера все турниры для админа по его UserProfileId
export const getMyTeams = (userProfileId = -1) => {
    return dispatch => {
        if (userProfileId != null){
            if (authQueryString && authQueryString.length > 0)
            
                
            TeamAdminAPI.getAllByAdminProfileId(userProfileId)
                    .then(pl => {
                        if (pl && pl.data.length > 0) {
                            
                            dispatch(setMyTeams(pl.data));
                            dispatch(setGlobalPopout(false))
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось загрузить команды"))
                            dispatch(setGlobalPopout(false))
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось загрузить команды: " + error))
                        dispatch(setGlobalPopout(false))
                    })
            
            else {
                dispatch(setErrorMessage("Не удалось загрузить команды"))
                dispatch(setGlobalPopout(false))

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось загрузить команды, в функцию передан null"))
            dispatch(setGlobalPopout(false))

        }
    }
}




export default teamReducer;