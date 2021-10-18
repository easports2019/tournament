import {  setErrorMessage } from "./systemReducer";
import { BidTeamAPI, CityTournamentAdminAPI } from './../utils/api/api.js'
import { BidTeam } from './constants/commonConstants'
import { EmptyTournament } from './constants/commonConstants'


import { authQueryString } from './../utils/api/server';

let demoBidTeam = BidTeam;

const BID_TEAM_SET_TOURNAMENTS = "BID_TEAM_SET_TOURNAMENTS";
const BID_TEAM_SET_MY_BIDS = "BID_TEAM_SET_MY_BIDS";
const BID_TEAM_SET_SELECTED_TOURNAMENT_GROUPS = "BID_TEAM_SET_SELECTED_TOURNAMENT_GROUPS";
const BID_TEAM_SET_SELECTED_MODE = "BID_TEAM_SET_SELECTED_MODE";
const BID_TEAM_ADD_MY_BID = "BID_TEAM_ADD_MY_BID";
const BID_TEAM_DEL_MY_BID = "BID_TEAM_DEL_MY_BID";
const BID_TEAM_APPROVE_BID = "BID_TEAM_APPROVE_BID";


const currentDate = new Date();

const emptyBidTeam = BidTeam

export const BID_TEAM_SELECT_MODE_TOURNAMENTS = "tournaments"
export const BID_TEAM_SELECT_MODE_GROUPS = "groups"
export const BID_TEAM_MODE_VIEW = "view"

const initState = {
    tournaments: [], // все турниры
    selected: {...emptyBidTeam}, // выбранная для просмотра/создания/редактирования заявка
    selectedTournament: {...EmptyTournament},
    myBids: [], // те, что я создал
    mode: BID_TEAM_MODE_VIEW, // режим отображения турнира ("view" - просмотр, "add" - добавление, "edit" - редактирование)
    selectMode: BID_TEAM_SELECT_MODE_TOURNAMENTS // второй вариант - BID_TEAM_SELECT_MODE_GROUPS
}


let bidBidTeamReducer = (state = initState, action) => {
    switch (action.type) {
        case BID_TEAM_SET_TOURNAMENTS: {
            return {
                ...state,
                tournaments: [...action.tournaments],
            };
        }
        case BID_TEAM_SET_SELECTED_TOURNAMENT_GROUPS: {
            return {
                ...state,
                selectedTournament: {...state.selectedTournament, 
                    TournamentGroups: [...action.groups],
                },
            };
        }
        case BID_TEAM_SET_SELECTED_MODE: {
            return {
                ...state,
                selectMode: action.mode,
            };
        }
        case BID_TEAM_SET_MY_BIDS: {
            return {
                ...state,
                myBids: [...action.bids],
            };
        }
        case BID_TEAM_ADD_MY_BID: {
            //debugger
            return {
                ...state,
                myBids: [...state.myBids, action.bid],
            };
        }
        case BID_TEAM_DEL_MY_BID: {
            //debugger
            return {
                ...state,
                myBids: [...state.myBids.filter(x => x.Id != action.bid.Id)],
            };
        }
        case BID_TEAM_APPROVE_BID: {
            debugger
            return {
                ...state,
                
            };
        }
        
        default: {
            return state;
        }
    }
}

export const setTournaments = (tournaments) => {
    return {
        type: BID_TEAM_SET_TOURNAMENTS,
        tournaments
    }
}

export const setMyBids = (bids) => {
    return {
        type: BID_TEAM_SET_MY_BIDS,
        bids
    }
}

export const approveBid = (bid) => {
    return {
        type: BID_TEAM_APPROVE_BID,
        bid
    }
}

export const addMyBid = (bid) => {
    return {
        type: BID_TEAM_ADD_MY_BID,
        bid
    }
}

export const delMyBid = (bid) => {
    return {
        type: BID_TEAM_DEL_MY_BID,
        bid
    }
}

export const setBidTeamSelectedTournamentGroups = (groups) => {
    return {
        type: BID_TEAM_SET_SELECTED_TOURNAMENT_GROUPS,
        groups
    }
}

export const setBidTeamSelectedMode = (mode) => {
    return {
        type: BID_TEAM_SET_SELECTED_MODE,
        mode
    }
}

// все админы турниров города
export const getActualTournamentsInCity = (userprofile = null, team = null) => {
    return dispatch => {

        
        if (authQueryString && authQueryString.length > 0)
            BidTeamAPI.getActualTournaments(userprofile, team)
                .then(pl => {
                    //debugger
                    if (pl && pl.data.length > 0) {

                        dispatch(setTournaments(pl.data));
                        
                    }
                    else {

                        dispatch(setCityBidTeamAdmins(demoBidTeam))
                        
                    }
                })
                .catch(error => {

                    dispatch(setErrorMessage(error))
                    
                })
        else {

            dispatch(setCityBidTeamAdmins(demoBidTeam))
            

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
                            dispatch(setBidTeamSelectedTournamentGroups(pl.data))
                            
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось получить список групп турнира"))
                            
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось получить список групп турнира: " + error))
                        
                    })
            else {
                dispatch(setErrorMessage("Не удалось получить список групп турнира"))
                

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось получить список групп турнира, в функцию передан null"))
            

        }
    }
}

// запрос заявок команды
export const getTeamBidsByTeam = (userprofile = null, team = null) => {
    
    return dispatch => {
        if ((team != null) && (userprofile != null)){
            if (authQueryString && authQueryString.length > 0)
            BidTeamAPI.getTeamBidsByTeam(userprofile, team)
                    .then(pl => {
                        
                        if (pl) {
                            dispatch(setMyBids(pl.data))
                            
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось получить список заявок команды"))
                            
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось получить список заявок команды: " + error))
                        
                    })
            else {
                dispatch(setErrorMessage("Не удалось получить список заявок команды"))
                

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось получить список заявок команды, в функцию передан null"))
            

        }
    }
}

// добавление заявки от команды
export const addBidTeamToTournamentGroup = (tournamentgroup = null, userprofile = null, team = null , teamName = "",) => {
    
    return dispatch => {
        if ((tournamentgroup != null) && (userprofile != null) && (team != null)){
            if (authQueryString && authQueryString.length > 0)
            BidTeamAPI.addBidTeamToTournament(tournamentgroup, userprofile, team, teamName)
                    .then(pl => {
                        
                        if (pl) {
                            dispatch(addMyBid(pl.data))
                            
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось добавить заявку команды"))
                            
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось добавить заявку команды: " + error))
                        
                    })
            else {
                dispatch(setErrorMessage("Не удалось добавить заявку команды"))
                

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось добавить заявку команды, в функцию передан null"))
            

        }
    }
}

// удаление заявки от команды
export const cancelBidTeamToTournamentGroup = (bid = null, userprofile = null, team = null) => {
    
    return dispatch => {
        if ((team != null) && (userprofile != null) && (bid != null)){
            if (authQueryString && authQueryString.length > 0)
            BidTeamAPI.delBidTeamToTournament(bid, userprofile, team)
            .then(pl => {
                        
                if ((pl) && (pl.data) && (pl.data.Deleted)) {
                            dispatch(delMyBid(pl.data))
                            
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось удалить заявку команды"))
                            
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось удалить заявку команды: " + error))
                        
                    })
                    else {
                        dispatch(setErrorMessage("Не удалось удалить заявку команды"))
                        
                        
                    }
        }
        else {
            dispatch(setErrorMessage("Не удалось удалить заявку команды, в функцию передан null"))
            
            
        }
    }
}


// согласование/отмена заявки от команды
export const approveBidTeamToTournament = (bid = null, userprofile = null, tournament = null, approve = false , comment = "",) => {
    
    return dispatch => {
        if ((tournamentgroup != null) && (userprofile != null) && (team != null)){
            if (authQueryString && authQueryString.length > 0)
            BidTeamAPI.approveBidTeamToTournament(bid, userprofile, tournament, approve, comment)
                    .then(pl => {
                        
                        if (pl) {
                            dispatch(approveBid(pl.data))
                            
                        }
                        else {
                            dispatch(setErrorMessage("Не удалось согласовать заявку команды"))
                            
                        }
                    })
                    .catch(error => {
                        dispatch(setErrorMessage("Не удалось согласовать заявку команды: " + error))
                        
                    })
            else {
                dispatch(setErrorMessage("Не удалось согласовать заявку команды"))
                

            }
        }
        else {
            dispatch(setErrorMessage("Не удалось согласовать заявку команды, в функцию передан null"))
            

        }
    }
}



export default bidBidTeamReducer;