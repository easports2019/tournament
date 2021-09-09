import { setGlobalPopout, setErrorMessage } from "./systemReducer";
import { CollectAPI } from './../utils/api/api.js'
import { Match } from './constants/commonConstants'
import { EmptyTournament } from './constants/commonConstants'

import { authQueryString } from './../utils/api/server';


const COLLECTS_SET_ALL_SIMPLE_COLLECTS = "COLLECTS_SET_ALL_SIMPLE_COLLECTS";
const COLLECTS_SELECT_SIMPLE_COLLECT = "COLLECTS_SELECT_SIMPLE_COLLECT";

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
        case COLLECTS_SET_ALL_SIMPLE_COLLECTS: {
            return {
                ...state,
                collects: [...action.simplecollects],
            };
        }
        case COLLECTS_SELECT_SIMPLE_COLLECT: {
            return{
                ...state,
                selected: action.simplecollect,
            }
        }
        default: {
            return state;
        }
    }
}

export const setAllSimpleCollects = (simplecollects) => {
    return {
        type: COLLECTS_SET_ALL_SIMPLE_COLLECTS,
        simplecollects
    }
}

export const selectSimpleCollect = (simplecollect) => {
    return {
        type: COLLECTS_SELECT_SIMPLE_COLLECT,
        simplecollect
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
                            //debugger
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

                    //dispatch(setCityTournamentAdmins(demoCityTournamentAdmins))
                    dispatch(setGlobalPopout(false))

                }
            }
        
    }
}
// возвращает актуальные простые сборы города
export const DeleteMemberFromCollect = (userProfileId = -1, collect = null, reason = "") => {
    return dispatch => {
        if ((userProfileId != -1) && (collect != null))
            {
                if (authQueryString && authQueryString.length > 0)
                {
                        // CollectAPI.getAllSimpleByCityUmbracoId(cityId)
                        //     .then(pl => {
                        //         //debugger
                        //         if (pl && pl.data.length > 0) {
                        //             dispatch(setAllSimpleCollects(pl.data));
                        //             dispatch((pl.data));
                        //             dispatch(setGlobalPopout(false))
                        //         }
                        //         else {
                        //             dispatch(setErrorMessage("Не получены данные CollectAPI.getAllSimpleByCityUmbracoId"))
                        //             dispatch(setGlobalPopout(false))
                        //         }
                        //     })
                        //     .catch(error => {

                        //         dispatch(setErrorMessage(error))
                        //         dispatch(setGlobalPopout(false))
                        //     })
                }
                else {

                    //dispatch(setCityTournamentAdmins(demoCityTournamentAdmins))
                    dispatch(setGlobalPopout(false))

                }
            }
        
    }
}



    export default collectReducer;