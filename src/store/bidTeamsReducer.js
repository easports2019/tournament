import { setGlobalPopout, setErrorMessage } from "./systemReducer";
import { BidTeamAPI, CityTournamentAdminAPI } from './../utils/api/api.js'
import { BidTeam } from './constants/commonConstants'
import { EmptyTournament } from './constants/commonConstants'


import { authQueryString } from './../utils/api/server';

let demoBidTeam = BidTeam;

const BID_TEAM_SET_TOURNAMENTS = "BID_TEAM_SET_TOURNAMENTS";
const BID_TEAM_SET_SELECTED_TOURNAMENT_GROUPS = "BID_TEAM_SET_SELECTED_TOURNAMENT_GROUPS";
const BID_TEAM_SET_SELECTED_MODE = "BID_TEAM_SET_SELECTED_MODE";


const currentDate = new Date();

const emptyBidTeam = BidTeam

export const BID_TEAM_SELECT_MODE_TOURNAMENTS = "tournaments"
export const BID_TEAM_SELECT_MODE_GROUPS = "groups"
export const BID_TEAM_MODE_VIEW = "view"

const initState = {
    tournaments: [], // все турниры
    selected: {...emptyBidTeam}, // выбранный для просмотра/создания/редактирования турнир
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
            debugger
            return {
                ...state,
                selectMode: action.mode,
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

        dispatch(setGlobalPopout(true))
        if (authQueryString && authQueryString.length > 0)
            BidTeamAPI.getActualTournaments(userprofile, team)
                .then(pl => {
                    debugger
                    if (pl && pl.data.length > 0) {

                        dispatch(setTournaments(pl.data));
                        dispatch(setGlobalPopout(false))
                    }
                    else {

                        dispatch(setCityBidTeamAdmins(demoBidTeam))
                        dispatch(setGlobalPopout(false))
                    }
                })
                .catch(error => {

                    dispatch(setErrorMessage(error))
                    dispatch(setGlobalPopout(false))
                })
        else {

            dispatch(setCityBidTeamAdmins(demoBidTeam))
            dispatch(setGlobalPopout(false))

        }
    }
}



// запрос групп турнира
export const getTournamentGroups = (tournament = null) => {
    
    return dispatch => {
        if ((tournament != null) || (userprofile == null)){
            if (authQueryString && authQueryString.length > 0)
            CityTournamentAdminAPI.getTournamentGroups(tournament)
                    .then(pl => {
                        
                        if (pl) {
                            dispatch(setBidTeamSelectedTournamentGroups(pl.data))
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




export default bidBidTeamReducer;