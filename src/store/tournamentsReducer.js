import { setGlobalPopout, setErrorMessage } from "./systemReducer";
import { CityTournamentAdminAPI, BidTeamAPI, TournamentAPI } from './../utils/api/api.js'
import { cityTournamentAdmins } from './constants/commonConstants'
import { EmptyTournament } from './constants/commonConstants'

import { authQueryString } from './../utils/api/server';

let demoCityTournamentAdmins = cityTournamentAdmins;

const TOURNAMENT_SET_ALL_TOURNAMENTS = "TOURNAMENT_SET_ALL_TOURNAMENTS";
const TOURNAMENT_SET_SELECTED_TOURNAMENT = "TOURNAMENT_SET_SELECTED_TOURNAMENT";
const TOURNAMENT_MY_ADD_OR_EDIT = "TOURNAMENT_MY_ADD_OR_EDIT";
const TOURNAMENT_SET_TOURNAMENTGROUPS = "TOURNAMENT_SET_TOURNAMENTGROUPS";
const TOURNAMENT_SET_TOURNAMENTTEAMS = "TOURNAMENT_SET_TOURNAMENTTEAMS";
const TOURNAMENT_SET_MYTOURNAMENT = "TOURNAMENT_SET_MYTOURNAMENT";
const TOURNAMENT_DELETE_MYTOURNAMENT = "TOURNAMENT_DELETE_MYTOURNAMENT";
const TOURNAMENT_SET_MODE = "TOURNAMENT_SET_MODE";
const TOURNAMENT_MATCH_LENGTH = "TOURNAMENT_MATCH_LENGTH";
const TOURNAMENT_SET_ALL_CITYTOURNAMENTADMINS = "TOURNAMENT_SET_ALL_CITYTOURNAMENTADMINS";
const TOURNAMENT_SET_WHEN_BEGIN = "TOURNAMENT_SET_WHEN_BEGIN";
const TOURNAMENT_SET_WHEN_END = "TOURNAMENT_SET_WHEN_END";
const TOURNAMENT_SET_NAME = "TOURNAMENT_SET_NAME";
const TOURNAMENT_SET_DETAILS = "TOURNAMENT_SET_DETAILS";
const TOURNAMENT_SET_REGLAMENT = "TOURNAMENT_SET_REGLAMENT";
const TOURNAMENT_DEL_GROUP_BY_KEY_ID = "TOURNAMENT_DEL_GROUP_BY_KEY_ID";
const TOURNAMENT_DEL_GROUP_BY_ID = "TOURNAMENT_DEL_GROUP_BY_ID";
const TOURNAMENT_ADD_GROUP = "TOURNAMENT_ADD_GROUP";
const TOURNAMENT_SET_GROUP = "TOURNAMENT_RESET_TOURNAMENT";
const TOURNAMENT_RESET_TOURNAMENT = "TOURNAMENT_SET_GROUP";
const TOURNAMENT_PUBLISH = "TOURNAMENT_PUBLISH";
const TOURNAMENT_UNPUBLISH = "TOURNAMENT_UNPUBLISH";
const TOURNAMENT_SET_MY_TOURNAMENTS = "TOURNAMENT_SET_MY_TOURNAMENTS";
const TOURNAMENT_SET_TOURNAMENT_BY_ID = "TOURNAMENT_SET_TOURNAMENT_BY_ID";
const TOURNAMENT_SET_NEW_BIDS = "TOURNAMENT_SET_NEW_BIDS";
const TOURNAMENT_DEL_BID = "TOURNAMENT_DEL_BID";
const TOURNAMENT_SET_SELECTED_TOURNAMENT_TABLES = "TOURNAMENT_SET_SELECTED_TOURNAMENT_TABLES";

const currentDate = new Date();
const emptyTournament = EmptyTournament

const initState = {
    tournaments: [], // все турниры
    bidsNew: [], // новые заявки на турниры
    selectedForView: {}, // выбранный турнир для просмотра в пользовательском режиме (а надо ли?)
    selected: emptyTournament, // выбранный для просмотра/создания/редактирования турнир
    selectedTables: [],  // турнирные таблицы выбранного турнира для просмотра пользователями
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
        case TOURNAMENT_SET_MY_TOURNAMENTS: {
            return {
                ...state,
                myTournaments: [...action.myTournaments],
            };
        }
        case TOURNAMENT_SET_MODE: {
            return {
                ...state,
                mode: action.mode,
            };
        }
        case TOURNAMENT_SET_MYTOURNAMENT: {
            
            return {
                ...state,
                myTournaments: [...state.myTournaments.map(tour => {
                    
                    if (tour.Id == action.mytournament.Id) {{
                        tour = {...action.mytournament};
                    }}
                    return tour;
                })],
            };
        }
        case TOURNAMENT_DELETE_MYTOURNAMENT: {
            
            return {
                ...state,
                myTournaments: [...state.myTournaments.filter(tour => tour.Id != action.mytournament.Id )],
            };
        }
        case TOURNAMENT_SET_SELECTED_TOURNAMENT_TABLES: {
            
            return {
                ...state,
                selectedTables: [...action.tables],
            };
        }
        case TOURNAMENT_SET_SELECTED_TOURNAMENT: {
            let index = -1;
            let max = -1;
            
            

            state.selected.TournamentGroups.forEach(item => {
                if (item.KeyId != undefined){
                    if (item.KeyId > max)
                        max = item.KeyId;
                }
            });


            return {
                ...state,
                selected: {...action.tournament,
                    WhenBegin: {day: new Date(action.tournament.WhenBegin).getDate(), 
                        month: new Date(action.tournament.WhenBegin).getMonth()+1, 
                        year: new Date(action.tournament.WhenBegin).getFullYear()},
                    WhenEnd: {day: new Date(action.tournament.WhenEnd).getDate(), 
                        month: new Date(action.tournament.WhenEnd).getMonth()+1, 
                        year: new Date(action.tournament.WhenEnd).getFullYear()},
                    TournamentGroups: [...action.tournament.TournamentGroups.map(item => {
                        return {...item, KeyId: ++max}
                    })]
                },
            };
        }
        case TOURNAMENT_RESET_TOURNAMENT: {
            return {
                ...state,
                selected: {...emptyTournament},
            };
        }
        case TOURNAMENT_MY_ADD_OR_EDIT: {
            debugger
            let newTourn = state.myTournaments.filter(t => t.Id == action.tournament.Id)
            if (newTourn){
                return {
                    ...state,
                    myTournaments: [
                        ...state.myTournaments.map(t => {
                            if (t.Id == action.tournament.Id){
                                t = {...t.tournament}
                            }
                            return t;
                        })
                    ],
                };
            }
            else{
                return {
                    ...state,
                    myTournaments: [
                        ...state.myTournaments, action.tournament
                    ],
                };
            }
        }
        case TOURNAMENT_MATCH_LENGTH: {
            return {
                ...state,
                selected: {...state.selected, 
                MatchLength: action.value,
                },
            };
        }
        case TOURNAMENT_SET_ALL_CITYTOURNAMENTADMINS: {
            return {
                ...state,
                cityTournamentAdmins: [...action.cityTournamentAdmins],
            };
        }
        case TOURNAMENT_SET_NEW_BIDS: {
            return {
                ...state,
                bidsNew: [...action.bids],
            };
        }
        case TOURNAMENT_DEL_BID: {
            return {
                ...state,
                bidsNew: [...state.bidsNew.filter(x => x.Id != action.bid.Id)],
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
            let max = -1;
            debugger
            

            state.selected.TournamentGroups.forEach(item => {
                if (item.KeyId != undefined){
                    if (item.KeyId > max)
                        max = item.KeyId;
                }
            });

            // if (action.group.Id < 0)
            //     return {
            //         ...state,
            //         selected: {...state.selected, 
            //             TournamentGroups: [...state.selected.TournamentGroups, 
            //                 {
            //                     KeyId: max + 1,    
            //                     Name: action.group.Name
            //                 }],
            //         },
            //     };
            // else
                return {
                    ...state,
                    selected: {...state.selected, 
                        TournamentGroups: [...state.selected.TournamentGroups, 
                            {
                                ...action.group,
                                KeyId: max + 1,    
                                Id: action.group.Id,
                                Name: action.group.Name
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
                            item.KeyId = action.groupId;
                            item.Name = action.groupName;
                        }
                        return item;
                    }),
                },
            };
        }
        case TOURNAMENT_SET_TOURNAMENTGROUPS: {
            return {
                ...state,
                selected: {...state.selected, 
                    TournamentGroups: [...action.groups],
                },
            };
        }
        case TOURNAMENT_SET_TOURNAMENTTEAMS: {

            let newTGroups = [];
            

            // clear tournament groups
            state.selected.TournamentGroups.forEach(tg => {
                tg.Teams = [];
            })

            // заполнение групп
            action.bidsWithTeamsAndGroups.forEach(bid => {
                
                newTGroups = state.selected.TournamentGroups.map(tg => {
                    
                    if (tg.Id == bid.TournamentGroupId)
                    {
                        bid.Team.Name = bid.TeamName;
                        tg.Teams = [...tg.Teams, bid.Team];
                    }
                    return tg;
                })
            });
            
            return {
                ...state,
                selected: {...state.selected, 
                    TournamentGroups: [...newTGroups],
                },
            };
        }
        case TOURNAMENT_DEL_GROUP_BY_KEY_ID: {
            return {
                ...state,
                selected: {...state.selected, 
                    TournamentGroups: state.selected.TournamentGroups.filter(item => item.KeyId != action.groupId),
                },
            };
        }
        case TOURNAMENT_DEL_GROUP_BY_ID: {
            debugger
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

export const setTournamentTables = (tables) => {
    return {
        type: TOURNAMENT_SET_SELECTED_TOURNAMENT_TABLES,
        tables
    }
}

export const setMyTournament = (mytournament) => {
    return {
        type: TOURNAMENT_SET_MYTOURNAMENT,
        mytournament
    }
}

export const addOrEditTournament = (tournament) => {
    return {
        type: TOURNAMENT_MY_ADD_OR_EDIT,
        tournament
    }
}

export const setSelectedTournament = (tournament) => {
    return {
        type: TOURNAMENT_SET_SELECTED_TOURNAMENT,
        tournament
    }
}

export const deleteMyTournament = (mytournament) => {
    return {
        type: TOURNAMENT_DELETE_MYTOURNAMENT,
        mytournament
    }
}

export const setMyTournaments = (myTournaments) => {
    return {
        type: TOURNAMENT_SET_MY_TOURNAMENTS,
        myTournaments
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

export const setTournamentMatchLength = (value) => {
    return {
        type: TOURNAMENT_MATCH_LENGTH,
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

export const setTournamentNewBids = (bids) => {
    return {
        type: TOURNAMENT_SET_NEW_BIDS,
        bids
    }
}

export const setCityTournamentAdmins = (cityTournamentAdmins) => {
    return {
        type: TOURNAMENT_SET_ALL_CITYTOURNAMENTADMINS,
        cityTournamentAdmins
    }
}

export const setSelectedTournamentGroups = (groups) => {
    return {
        type: TOURNAMENT_SET_TOURNAMENTGROUPS,
        groups
    }
}

export const setTournamentTeams = (bidsWithTeamsAndGroups) => {
    return {
        type: TOURNAMENT_SET_TOURNAMENTTEAMS,
        bidsWithTeamsAndGroups
    }
}

export const delGroupFromTournamentByKeyId = (tournamentId, groupId) => {
    return {
        type: TOURNAMENT_DEL_GROUP_BY_KEY_ID,
        tournamentId,
        groupId
    }
}

export const delGroupFromTournamentById = (tournamentId, groupId) => {
    debugger
    return {
        type: TOURNAMENT_DEL_GROUP_BY_ID,
        tournamentId,
        groupId
    }
}

export const addGroupToTournament = (group) => {
    return {
        type: TOURNAMENT_ADD_GROUP,
        group
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

export const deleteTournamentBid = (bid) => {
    return {
        type: TOURNAMENT_DEL_BID,
        bid
    }
}

// перемещение заявки от команды в другую группу по команде
export const replaceTeam = (team, tOldGoup, tNewGroup) => {
    
} 

// отмена заявки от команды (удаление из турнира) по команде
export const deleteTeam = (team, tGoup) => {

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

// сохраняет (добавляет) в базу новый турнир
export const saveSelectedTournament = (tournament = null, userprofile = null) => {
    return dispatch => {
        if (tournament != null){
            if (authQueryString && authQueryString.length > 0)
                CityTournamentAdminAPI.saveTournament(tournament, userprofile)
                    .then(pl => {
                        debugger
                        if (pl && pl.data) {
                            dispatch(addOrEditTournament(pl.data))
                            //dispatch(resetTournament());
                            //dispatch(setGlobalPopout(false))
                        }
                        else {
                            //dispatch(setErrorMessage("Не удалось сохранить турнир"))
                            //dispatch(setGlobalPopout(false))
                        }
                    })
                    .catch(error => {
                        //dispatch(setErrorMessage("Не удалось сохранить турнир: " + error))
                        //dispatch(setGlobalPopout(false))
                    })
            else {
                //dispatch(setErrorMessage("Не удалось сохранить турнир"))
                //dispatch(setGlobalPopout(false))

            }
        }
        else {
            //dispatch(setErrorMessage("Не удалось сохранить турнир, в функцию передан null"))
            //dispatch(setGlobalPopout(false))

        }
    }
}

// опубликовывает турнир
export const publishTournament = (tournament = null, userprofile = null, publish = false) => {
    
    return dispatch => {
        if ((tournament != null) || (userprofile == null)){
            if (authQueryString && authQueryString.length > 0)
                CityTournamentAdminAPI.publishTournament(tournament, userprofile, publish)
                    .then(pl => {
                        
                        if (pl) {
                            // изменить полученный турнир в списке
                            dispatch(setMyTournament(pl.data))
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
export const deleteTournament = (tournament = null, userprofile = null) => {
    
    return dispatch => {
        if ((tournament != null) || (userprofile == null)){
            if (authQueryString && authQueryString.length > 0)
                CityTournamentAdminAPI.deleteTournament(tournament, userprofile)
                    .then(pl => {
                        if (pl) {
                            // изменить полученный турнир в списке
                            dispatch(deleteMyTournament(pl.data))
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

// запрашивает новые заявки в турнир
export const getTournamentNewBids = (tournament = null, userprofile = null) => {
    
    return dispatch => {
        if ((tournament != null) && (userprofile != null)){
            if (authQueryString && authQueryString.length > 0)
            BidTeamAPI.getTeamBidsByTournament(userprofile, tournament)
                    .then(pl => {
                        if (pl) {
                            // изменить полученный турнир в списке
                            dispatch(setTournamentNewBids(pl.data))
                            dispatch(setGlobalPopout(false))
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось загрузить заявки турнира"))
                            dispatch(setGlobalPopout(false))
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось загрузить заявки турнира: " + error))
                        dispatch(setGlobalPopout(false))
                    })
            else {
                dispatch(setErrorMessage("Не удалось загрузить заявки турнира"))
                dispatch(setGlobalPopout(false))

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось загрузить заявки турнира, в функцию передан null"))
            dispatch(setGlobalPopout(false))

        }
    }
}

// запрашивает группы и заявленные команды турнира
export const getTournamentTeams = (tournament = null, userprofile = null) => {
    
    return dispatch => {
        if ((tournament != null) && (userprofile != null)){
            if (authQueryString && authQueryString.length > 0)
                CityTournamentAdminAPI.getTournamentTeamsByTournament(userprofile, tournament)
                    .then(pl => {
                        if (pl) {
                            
                            dispatch(setTournamentTeams(pl.data))
                            dispatch(setGlobalPopout(false))
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось загрузить группы и команды турнира"))
                            dispatch(setGlobalPopout(false))
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось загрузить группы и команды турнира: " + error))
                        dispatch(setGlobalPopout(false))
                    })
            else {
                dispatch(setErrorMessage("Не удалось загрузить группы и команды турнира"))
                dispatch(setGlobalPopout(false))

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось загрузить группы и команды турнира, в функцию передан null"))
            dispatch(setGlobalPopout(false))

        }
    }
}

// изменяет группу команды в турнире
export const changeTournamentTeamBidTournamentGroup = (team = null, newgroup = null, oldgroup = null, userprofile = null) => {
    debugger
    return dispatch => {
        if ((team != null) && (userprofile != null) && (newgroup != null) && (oldgroup != null)) {
            
            if (authQueryString && authQueryString.length > 0)
            
                CityTournamentAdminAPI.changeTeamTournamentGroup(team, newgroup, oldgroup, userprofile)
                    .then(pl => {
                        if (pl) {
                            
                            dispatch(setTournamentTeams(pl.data))
                            dispatch(setGlobalPopout(false))
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось сменить группу"))
                            dispatch(setGlobalPopout(false))
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось сменить группу: " + error))
                        dispatch(setGlobalPopout(false))
                    })
            else {
                dispatch(setErrorMessage("Не удалось сменить группу"))
                dispatch(setGlobalPopout(false))

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось сменить группу, в функцию передан null"))
            dispatch(setGlobalPopout(false))

        }
    }
}

// запрос групп турнира
export const getTournamentGroups = (tournament = null) => {
    
    return dispatch => {
        if (tournament != null){
            if (authQueryString && authQueryString.length > 0)
            CityTournamentAdminAPI.getTournamentGroups(tournament)
                    .then(pl => {
                        
                        if (pl) {
                           // debugger
                            dispatch(setSelectedTournamentGroups(pl.data))
                            dispatch(setGlobalPopout(false))
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось получить список групп турнира"))
                            dispatch(setGlobalPopout(false))
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось получить список групп турнира: " + error))
                        dispatch(setGlobalPopout(false))
                    })
            else {
                dispatch(setErrorMessage("Не удалось получить список групп турнира"))
                dispatch(setGlobalPopout(false))

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось получить список групп турнира, в функцию передан null"))
            dispatch(setGlobalPopout(false))

        }
    }
}

// Подтверждает заявку в турнир
export const acceptTeamToTournamentBid = (bid = null, tournament = null, userprofile = null, admintext = "") => {
    
    return dispatch => {
        if ((tournament != null) && (userprofile != null)  && (bid != null)){
            if (authQueryString && authQueryString.length > 0)
            BidTeamAPI.acceptTeamToTournamentBid(bid, userprofile, tournament, admintext)
                    .then(pl => {
                        if (pl) {
                            // изменить полученный турнир в списке
                            debugger
                            dispatch(deleteTournamentBid(pl.data))
                            dispatch(setGlobalPopout(false))
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось подтвердить заявку от команды в турнир"))
                            dispatch(setGlobalPopout(false))
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось подтвердить заявку от команды в турнир: " + error))
                        dispatch(setGlobalPopout(false))
                    })
            else {
                dispatch(setErrorMessage("Не удалось подтвердить заявку от команды в турнир"))
                dispatch(setGlobalPopout(false))

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось подтвердить заявку от команды в турнир, в функцию передан null"))
            dispatch(setGlobalPopout(false))

        }
    }
}

// Отклоняет заявку в турнир
export const declineTeamToTournamentBid = (bid = null, tournament = null, userprofile = null, admintext = "") => {
    
    return dispatch => {
        if ((tournament != null) && (userprofile != null)  && (bid != null)){
            if (authQueryString && authQueryString.length > 0)
            BidTeamAPI.declineTeamToTournamentBid(bid, userprofile, tournament, admintext)
                    .then(pl => {
                        if (pl) {
                            // изменить полученный турнир в списке
                            debugger
                            dispatch(deleteTournamentBid(pl.data))
                            dispatch(setGlobalPopout(false))
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось подтвердить заявку от команды в турнир"))
                            dispatch(setGlobalPopout(false))
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось подтвердить заявку от команды в турнир: " + error))
                        dispatch(setGlobalPopout(false))
                    })
            else {
                dispatch(setErrorMessage("Не удалось подтвердить заявку от команды в турнир"))
                dispatch(setGlobalPopout(false))

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось подтвердить заявку от команды в турнир, в функцию передан null"))
            dispatch(setGlobalPopout(false))

        }
    }
}

// Удаляет команду из турнира
export const deleteTeamFromTournament = (team = null, tournamentGroup = null, userprofile = null, admintext = "") => {
    
    return dispatch => {
        if ((tournamentGroup != null) && (userprofile != null)  && (team != null)){
            if (authQueryString && authQueryString.length > 0)
                CityTournamentAdminAPI.deleteTeamFromTournamentByTeam(team, tournamentGroup, userprofile, admintext)
                    .then(pl => {
                        if (pl && pl.data) {
                            // изменить полученный турнир в списке
                            debugger
                            dispatch(setTournamentTeams(pl.data))
                            dispatch(setGlobalPopout(false))
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось удалить команду из турнира"))
                            dispatch(setGlobalPopout(false))
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось удалить команду из турнира: " + error))
                        dispatch(setGlobalPopout(false))
                    })
            else {
                dispatch(setErrorMessage("Не удалось удалить команду из турнира"))
                dispatch(setGlobalPopout(false))

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось удалить команду из турнира, в функцию передан null"))
            dispatch(setGlobalPopout(false))

        }
    }
}

// удаляет группу турнира
export const deleteTournamentGroup = (tournament = null, userprofile = null, tournamentGroupId = -1) => {
    debugger
    return dispatch => {
        if ((tournament != null) || (userprofile == null)){
            if (authQueryString && authQueryString.length > 0){
                if (tournamentGroupId < 0)
                {
                    debugger
                    dispatch(delGroupFromTournamentById(tournament.Id, tournamentGroupId));
                    dispatch(setGlobalPopout(false))
                }
                else
                {
                    CityTournamentAdminAPI.deleteTournamentGroup(tournament, userprofile, tournamentGroupId)
                    .then(pl => {
                        if (pl) {
                            debugger
                            dispatch(delGroupFromTournamentById(tournament.Id, pl.data.Id))
                            dispatch(setGlobalPopout(false))
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось удалить группу турнира"))
                            dispatch(setGlobalPopout(false))
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось удалить группу турнира: " + error))
                        dispatch(setGlobalPopout(false))
                    })
                }
            }
            else {
                dispatch(setErrorMessage("Не удалось удалить группу турнира"))
                dispatch(setGlobalPopout(false))

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось удалить группу турнира, в функцию передан null"))
            dispatch(setGlobalPopout(false))

        }
    }
}

// добавляет группу турнира
export const addTournamentGroup = (tournament = null, userprofile = null, tournamentGroup = null) => {
    debugger
    return dispatch => {
        if ((tournament != null) || (userprofile == null)){
            if (authQueryString && authQueryString.length > 0){
                if (tournament.Id < 0)
                {
                    debugger
                    dispatch(addGroupToTournament(tournamentGroup));
                    dispatch(setGlobalPopout(false))
                }
                else
                {
                    CityTournamentAdminAPI.addTournamentGroup(tournament, userprofile, tournamentGroup)
                    .then(pl => {
                        if (pl) {
                            debugger
                            dispatch(addGroupToTournament(pl.data))
                            dispatch(setGlobalPopout(false))
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось удалить группу турнира"))
                            dispatch(setGlobalPopout(false))
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось удалить группу турнира: " + error))
                        dispatch(setGlobalPopout(false))
                    })
                }
            }
            else {
                dispatch(setErrorMessage("Не удалось удалить группу турнира"))
                dispatch(setGlobalPopout(false))

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось удалить группу турнира, в функцию передан null"))
            dispatch(setGlobalPopout(false))

        }
    }
}


// возвращает с сервера все турниры для админа по его UserProfileId
export const getMyTournaments = (userProfileId = -1) => {
    return dispatch => {
        if (userProfileId != null){
            if (authQueryString && authQueryString.length > 0)
            
                
                CityTournamentAdminAPI.getAllByAdminProfileId(userProfileId)
                    .then(pl => {
                        if (pl && pl.data.length > 0) {
                            
                            dispatch(setMyTournaments(pl.data));
                            dispatch(setGlobalPopout(false))
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось загрузить турниры"))
                            dispatch(setGlobalPopout(false))
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось загрузить турниры: " + error))
                        dispatch(setGlobalPopout(false))
                    })
            
            else {
                dispatch(setErrorMessage("Не удалось загрузить турниры"))
                dispatch(setGlobalPopout(false))

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось загрузить турниры, в функцию передан null"))
            dispatch(setGlobalPopout(false))

        }
    }
}

// возвращает с сервера все турниры города для пользователя
export const getTournamentsByCityId = (cityUmbId = -1) => {
    return dispatch => {
        if (cityUmbId != null){
            if (authQueryString && authQueryString.length > 0)
            
                
            TournamentAPI.getAllTournamentsInCityByCityUmbracoId(cityUmbId)
                    .then(pl => {
                        if (pl && pl.data.length > 0) {
                            
                            dispatch(setTournaments(pl.data));
                            dispatch(setGlobalPopout(false))
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось загрузить турниры"))
                            dispatch(setGlobalPopout(false))
                        }
                    })
                    .catch(error => {
                        debugger
                        dispatch(setErrorMessage("Не удалось загрузить турниры: " + error))
                        dispatch(setGlobalPopout(false))
                    })
            
            else {
                dispatch(setErrorMessage("Не удалось загрузить турниры"))
                dispatch(setGlobalPopout(false))

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось загрузить турниры, в функцию передан null"))
            dispatch(setGlobalPopout(false))

        }
    }
}

// возвращает с сервера турнирные таблицы групп/лиг выбранного турнира
export const getTournamentTablesByTournamentId = (tournamentId = -1) => {
    return dispatch => {
        if (tournamentId != null){
            if (authQueryString && authQueryString.length > 0)
            
                
            TournamentAPI.getTournamentTablesByTournamentId(tournamentId)
                    .then(pl => {
                        if (pl && pl.data.length > 0) {
                            
                            dispatch(setTournamentTables(pl.data));
                            dispatch(setGlobalPopout(false))
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось загрузить турнирные таблицы"))
                            dispatch(setGlobalPopout(false))
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось загрузить турнирные таблицы: " + error))
                        dispatch(setGlobalPopout(false))
                    })
            
            else {
                dispatch(setErrorMessage("Не удалось загрузить турнирные таблицы"))
                dispatch(setGlobalPopout(false))

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось загрузить турнирные таблицы, в функцию передан null"))
            dispatch(setGlobalPopout(false))

        }
    }
}




export default tournamentReducer;