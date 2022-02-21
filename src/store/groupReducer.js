import {ampluaTypes, users} from './constants/commonConstants'
import { setActiveMenuItem } from "./mainMenuReducer";
import { setGlobalPopout, setErrorMessage, resetError } from "./systemReducer";

import { authQueryString } from './../utils/api/server';
import { GroupAPI, errorObj } from './../utils/api/api.js'

const ANY_ACTION_TYPE = "ANY_ACTION_TYPE";
const GROUP_SET_GROUP_TEAM = "GROUP_SET_GROUP_TEAM";

const initState = {
    GroupId: null,
    TeamId: null,
    TeamName: null,
}

export let groupReducer = (state = initState, action) => 
{
    
    switch (action.type){
        case GROUP_SET_GROUP_TEAM: {
            return {
                ...state,
                GroupId: action.groupId,
                TeamId: action.teamId,
                TeamName: action.teamName,
            }
        }
        default: {
            return state;
        }
    }
}


export const setGroupTeam = (groupId, teamId, teamName) => {
    return {
        type: GROUP_SET_GROUP_TEAM,
        groupId,
        teamId,
        teamName
    }
}

// проверка связи с сервисом
export const connectTeamWithGroup = (groupId, teamId = -1, userProfile) => {
    return dispatch => {
        dispatch(setGlobalPopout(true))
        dispatch(resetError())

        if ((authQueryString && authQueryString.length > 0) && (groupId != "") && (userProfile != null))
        GroupAPI.setTeamGroupToServer(groupId, teamId, userProfile)
                .then(pl => {
                    if (pl && pl.data) {
                        dispatch(setGroupTeam(pl.data.GroupId, pl.data.TeamId, pl.data.TeamName));
                        dispatch(setGlobalPopout(false))
                    }
                    else {
                        dispatch(setErrorMessage(errorObj("Ошибка при соединении с сервисом")))
                        dispatch(setGlobalPopout(false))

                    }
                })
                .catch(error => {
                    dispatch(setErrorMessage(error))
                    dispatch(setGlobalPopout(false))
                })
        else {
            dispatch(setErrorMessage(errorObj("Ошибка запуска приложения")))
            dispatch(setGlobalPopout(false))

        }
    }
}

// проверка связи с сервисом
export const getGroupTeamInfo = (groupId, userProfile) => {
    return dispatch => {
        dispatch(setGlobalPopout(true))
        dispatch(resetError())

        if ((authQueryString && authQueryString.length > 0) && (groupId != "") && (userProfile != null))
        GroupAPI.getTeamGroupFromServer(groupId, userProfile)
                .then(pl => {
                    if (pl && pl.data) {
                        dispatch(setGroupTeam(pl.data.GroupId, pl.data.TeamId));
                        dispatch(setGlobalPopout(false))
                    }
                    else {
                        dispatch(setErrorMessage(errorObj("Ошибка при соединении с сервисом")))
                        dispatch(setGlobalPopout(false))

                    }
                })
                .catch(error => {
                    dispatch(setErrorMessage(error))
                    dispatch(setGlobalPopout(false))
                })
        else {
            dispatch(setErrorMessage(errorObj("Ошибка запуска приложения")))
            dispatch(setGlobalPopout(false))

        }
    }
}

export default groupReducer;