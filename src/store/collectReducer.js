import { setGlobalPopout, setErrorMessage } from "./systemReducer";
import { CollectAPI } from './../utils/api/api.js'
import { Match } from './constants/commonConstants'
import { EmptyTournament } from './constants/commonConstants'

import { authQueryString } from './../utils/api/server';


const MATCH_SET_ALL_SIMPLE_COLLECTS = "MATCH_SET_ALL_SIMPLE_COLLECTS";

Date.prototype.addDays = function(days) {
    var date = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
    date.setDate(date.getDate() + days);
    return date;
}

const currentDate = new Date();

const initState = {
    collects: [],
    selected: {},
}


let collectReducer = (state = initState, action) => {
    switch (action.type) {
        case MATCH_SET_ALL_SIMPLE_COLLECTS: {
            return {
                ...state,
                collects: [...action.simplecollects],
            };
        }
        default: {
            return state;
        }
    }
}

export const setAllSimpleCollects = (simplecollects) => {
    return {
        type: MATCH_SET_ALL_SIMPLE_COLLECTS,
        simplecollects
    }
}




// возвращает актуальные простые сборы города
export const getAllSimpleCollectsInCityByCityUmbracoId = (cityId = -1, userProfile = null) => {
    return dispatch => {
        if (cityId != -1) 
            {
                if (authQueryString && authQueryString.length > 0){
                
                    CollectAPI.getAllSimpleByCityUmbracoId(cityId)
                        .then(pl => {
                            debugger
                            if (pl && pl.data.length > 0) {
                                dispatch(setAllSimpleCollects(pl.data));
                                dispatch((pl.data));
                                dispatch(setGlobalPopout(false))
                            }
                            else {
                                dispatch(setErrorMessage("Не получены данные CollectAPI.getAllSimpleByCityUmbracoId"))
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



    export default collectReducer;