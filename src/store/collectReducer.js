import { setGlobalPopout, setErrorMessage } from "./systemReducer";
import { CollectAPI } from './../utils/api/api.js'
import { Match } from './constants/commonConstants'
import { EmptyTournament } from './constants/commonConstants'

import { authQueryString } from './../utils/api/server';


const COLLECTS_SET_ALL_SIMPLE_COLLECTS = "COLLECTS_SET_ALL_SIMPLE_COLLECTS";
const COLLECTS_SELECT_SIMPLE_COLLECT = "COLLECTS_SELECT_SIMPLE_COLLECT";
const COLLECTS_SET_COLLECT_ITEM_MODE = "COLLECTS_SET_COLLECT_ITEM_MODE";
const COLLECTS_DEL_SIMPLE_COLLECT = "COLLECTS_DEL_SIMPLE_COLLECT";
const COLLECTS_ADD_SIMPLE_COLLECT = "COLLECTS_ADD_SIMPLE_COLLECT";
const COLLECTS_DELETE_MEMBER_FROM_SIMPLE_COLLECTS = "COLLECTS_DELETE_MEMBER_FROM_SIMPLE_COLLECTS";
const COLLECTS_ADD_MEMBER_TO_SELECTED_SIMPLE_COLLECT = "COLLECTS_ADD_MEMBER_TO_SELECTED_SIMPLE_COLLECT";

Date.prototype.addDays = function(days) {
    var date = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
    date.setDate(date.getDate() + days);
    return date;
}

const currentDate = new Date();

const initState = {
    collects: [],
    selected: {},
    mode: "view",
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
        case COLLECTS_SET_COLLECT_ITEM_MODE: {
            return{
                ...state,
                mode: action.mode,
            }
        }
        case COLLECTS_ADD_SIMPLE_COLLECT: {
            return{
                ...state,
                collects: [...state.collects, action.collect],
            }
        }
        case COLLECTS_DEL_SIMPLE_COLLECT: {
            let res = {
                ...state,
                collects: [...state.collects.filter(col => col.Id != action.collect.Id) ],
                selected: {...state.selected,
                    Published: false,
                    Deleted: true,
            }
            }
            return res;
        }
        case COLLECTS_DELETE_MEMBER_FROM_SIMPLE_COLLECTS: {
            
            return{
                ...state,
                collects: [...state.collects.filter(m => m.Id != state.selected.Id),
                    {...state.selected,
                        Members: [...state.selected.Members.filter(m => m.Id != action.member.Id)],
                    }
                ],
                selected: {
                    ...state.selected,
                    Members: [...state.selected.Members.filter(m => m.Id != action.member.Id)],
                },
            }
        }
        case COLLECTS_ADD_MEMBER_TO_SELECTED_SIMPLE_COLLECT: {
            debugger
            return{
                ...state,
                collects: [...state.collects.filter(m => m.Id != state.selected.Id),
                    {...state.selected,
                        Members: [...state.selected.Members, action.member],
                    }
                ],
                selected: {
                    ...state.selected,
                    Members: [...state.selected.Members, action.member],
                },
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

export const deleteMemberFromSimpleCollect = (member) => {
    return {
        type: COLLECTS_DELETE_MEMBER_FROM_SIMPLE_COLLECTS,
        member
    }
}

export const addMemberToSelectedSimpleCollect = (member) => {
    return {
        type: COLLECTS_ADD_MEMBER_TO_SELECTED_SIMPLE_COLLECT,
        member
    }
}

export const selectSimpleCollect = (simplecollect) => {
    return {
        type: COLLECTS_SELECT_SIMPLE_COLLECT,
        simplecollect
    }
}

export const setCollectItemMode = (mode) => {
    return {
        type: COLLECTS_SET_COLLECT_ITEM_MODE,
        mode
    }
}

export const delSimpleCollect = (collect) => {
    return {
        type: COLLECTS_DEL_SIMPLE_COLLECT,
        collect
    }
}

export const addSimpleCollect = (collect) => {
    return {
        type: COLLECTS_ADD_SIMPLE_COLLECT,
        collect
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

// отказ участника сбора
export const DeleteMemberFromCollect = (userProfileId = -1, collect = null, simpleMember=null, reason = "") => {
    return dispatch => {
        if ((userProfileId != -1) && (collect != null) &&  (simpleMember != null))
            {
                if (authQueryString && authQueryString.length > 0)
                {
                        CollectAPI.deleteMemberFromSimpleCollect(userProfileId, collect, simpleMember, reason)
                            .then(pl => {
                                //debugger
                                if (pl && pl.data) {
                                    dispatch(deleteMemberFromSimpleCollect(pl.data));
                                    dispatch((pl.data));
                                    dispatch(setGlobalPopout(false))
                                }
                                else {
                                    dispatch(setErrorMessage("Не получены данные CollectAPI.deleteMemberFromSimpleCollect"))
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

// добавление сбора
export const AddSimpleCollect = (userProfileId = -1, collect = null) => {
    return dispatch => {
        if ((userProfileId != -1) && (collect != null))
            {
                if (authQueryString && authQueryString.length > 0)
                {
                        CollectAPI.addSimpleCollect(userProfileId, collect)
                            .then(pl => {
                                //debugger
                                if (pl && pl.data) {
                                    dispatch(addSimpleCollect(pl.data));
                                    dispatch((pl.data));
                                    dispatch(setGlobalPopout(false))
                                }
                                else {
                                    dispatch(setErrorMessage("Не получены данные CollectAPI.addSimpleCollect"))
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

// отмена сбора
export const DelSimpleCollect = (userProfileId = -1, collect = null) => {
    return dispatch => {
        if ((userProfileId != -1) && (collect != null))
            {
                if (authQueryString && authQueryString.length > 0)
                {
                        CollectAPI.delSimpleCollect(userProfileId, collect)
                            .then(pl => {
                                //debugger
                                if (pl && pl.data) {
                                    dispatch(delSimpleCollect(pl.data));
                                    dispatch((pl.data));
                                    dispatch(setGlobalPopout(false))
                                }
                                else {
                                    dispatch(setErrorMessage("Не получены данные CollectAPI.delSimpleCollect"))
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

// регистрация участника на сбор
export const registerMemberToSimpleCollect = (userProfileId = -1, collect = null) => {
    return dispatch => {
        if ((userProfileId != -1) && (collect != null))
            {
                if (authQueryString && authQueryString.length > 0)
                {
                        CollectAPI.registerSimpleMemberToSimpleCollect(userProfileId, collect)
                            .then(pl => {
                                //debugger
                                if (pl && pl.data) {

                                    dispatch(addMemberToSelectedSimpleCollect(pl.data));
                                    dispatch((pl.data));
                                    dispatch(setGlobalPopout(false))
                                }
                                else {
                                    dispatch(setErrorMessage("Не получены данные CollectAPI.addSimpleCollect"))
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



    export default collectReducer;