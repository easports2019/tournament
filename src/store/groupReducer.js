import {ampluaTypes, users} from './constants/commonConstants'
import { setActiveMenuItem } from "./mainMenuReducer";
import { setGlobalPopout, setErrorMessage, resetError } from "./systemReducer";

import { authQueryString } from './../utils/api/server';
import { GroupAPI, errorObj } from './../utils/api/api.js'

const ANY_ACTION_TYPE = "ANY_ACTION_TYPE";
const GROUP_SET_GROUP_TEAM = "GROUP_SET_GROUP_TEAM";
const GROUP_SET_GROUP = "GROUP_SET_GROUP";

const initState = {
    GroupId: null,
    TeamId: null,
    TeamName: null,
    IsTournament: false,
    TournamentId: -1,
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
                IsOranizator: action.isOrg,
                TournamentId: action.tournamentId,
            }
        }
        case GROUP_SET_GROUP: {
            return {
                ...state,
                GroupId: action.groupId,
            }
        }
        default: {
            return state;
        }
    }
}


export const setGroupTeam = (groupId, teamId, teamName, isOrg, tournamentId) => {
    return {
        type: GROUP_SET_GROUP_TEAM,
        groupId,
        teamId,
        teamName,
        isOrg,
        tournamentId
    }
}

export const setGroup = (groupId) => {
    return {
        type: GROUP_SET_GROUP,
        groupId,
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
                        dispatch(setGroupTeam(pl.data.GroupId, pl.data.TeamId, pl.data.TeamName, pl.data.IsOranizator, pl.data.TournamnentId));
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

// загрузка команды для группы вк
export const getGroupTeamInfo = (groupId, userProfile) => {
    return dispatch => {
        dispatch(setGlobalPopout(true))
        dispatch(resetError())

        if ((authQueryString && authQueryString.length > 0) && (groupId != "") && (userProfile != null))
        GroupAPI.getTeamGroupFromServer(groupId, userProfile)
                .then(pl => {
                    if (pl && pl.data) {
                        dispatch(setGroupTeam(pl.data.GroupId, pl.data.TeamId, pl.data.TeamName, pl.data.IsOranizator, pl.data.TournamnentId));
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