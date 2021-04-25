import { setGlobalPopout, setErrorMessage } from "./systemReducer";
import { CityTournamentAdminAPI } from './../utils/api/api.js'
import { cityTournamentAdmins } from './constants/commonConstants'

import { authQueryString } from './../utils/api/server';

let demoCityTournamentAdmins = cityTournamentAdmins;

const TOURNAMENT_SET_ALL_TOURNAMENTS = "TOURNAMENT_SET_ALL_TOURNAMENTS";
const TOURNAMENT_SET_ALL_CITYTOURNAMENTADMINS = "TOURNAMENT_SET_ALL_CITYTOURNAMENTADMINS";
const TOURNAMENT_SET_TOURNAMENT_BY_ID = "TOURNAMENT_SET_TOURNAMENT_BY_ID";



const initState = {
    tournaments: [],
    cityTournamentAdmins: [],
}


let tournamentReducer = (state = initState, action) => {
    switch (action.type) {
        case TOURNAMENT_SET_ALL_TOURNAMENTS: {
            return {
                ...state,
                tournaments: [...action.tournaments],
            };
        }
        case TOURNAMENT_SET_ALL_CITYTOURNAMENTADMINS: {
            return {
                ...state,
                cityTournamentAdmins: [...action.cityTournamentAdmins],
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


export const setCityTournamentAdmins = (cityTournamentAdmins) => {
    return {
        type: TOURNAMENT_SET_ALL_CITYTOURNAMENTADMINS,
        cityTournamentAdmins
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




export default tournamentReducer;