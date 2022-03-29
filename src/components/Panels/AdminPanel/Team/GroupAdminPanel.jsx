import React, { useEffect, useState } from 'react'
import { RichCell, Avatar, Button, InfoRow, Header, FormItem, Group, Cell } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/dataTypes/common'
import TeamAdminList from './TeamAdminList'
import { setActiveMenuItem } from './../../../../store/mainMenuReducer';
import {setTournamentMode, getMyTournaments, publishTournament, deleteTournament, setSelectedTournament, resetTournament,} from './../../../../store/tournamentsReducer'
import {resetTeam, getMyTeams, setTeamMode, setSelectedTeam, deleteTeam, getTeamsInCity} from './../../../../store/teamsReducer'
import {connectTeamWithGroup} from './../../../../store/groupReducer'
import { connect } from 'react-redux';
import ButtonWithHistory from '../../Common/WithHistory/ButtonWithHistory'
import SimpleSearch from '../../Common/Search/SearchPanel';
import MatchListItem from '../Match/MatchListItem';


const GroupAdminPanel = (props) => {

	let teams = props.team.teams;
    let [showSearch, setShowSearch] = useState(false);

    let SetOurTeam = (teamId) => {
        props.connectTeamWithGroup(props.GroupId, teamId, props.myProfile);
        setShowSearch(false);
    }

let click = (match) => {

    props.ClickHandler(match)
}

    useEffect(() =>{
        
        //props.getMyTeams(props.myProfile.UserProfileId);
        props.getTeamsInCity(props.myProfile)
        
    }, props.myProfile)

        return (
            <>
                
                {
                    props.UserIsGroupAdmin
                    ?
                    <>
                        <FormItem top="Команда группы">
                            <RichCell
                                after={props.TeamId 
                                    ? <Button onClick={() => setShowSearch(true)}>Выбрать другую</Button> 
                                    : <Button onClick={() => setShowSearch(true)}>Выбрать</Button>}
                            >{props.TeamId 
                                ? teams.filter(x => x.Id == props.TeamId).length > 0 && teams.filter(x => x.Id == props.TeamId)[0].Name 
                                : "Не выбрана"}</RichCell>
                            
                        </FormItem>
                        {showSearch && 
                            <FormItem top="Выбрать команду этой группы">
                                <SimpleSearch List={teams}
                                ActionOnSelect={(teamId) => SetOurTeam(teamId)}
                                >

                                </SimpleSearch>
                            </FormItem>
                        }
                    </>
                    :
                    null
                }
                <>
                    <Group>
                        <Cell><h2 style={{color: '#888'}}>Команда {props.SelectedTeam.Name}</h2></Cell>
                        {props.matchesByTeam
                        .sort((a, b) => new Date(b.When).valueOf() - new Date(a.When).valueOf())
                        .map(match => {
                            return (
                            <MatchListItem
                                Match={match} Place={match.Place}
                                ClickHandler={() => click(match)}
                            ></MatchListItem>
                            )

                        })}
                    </Group>
                </>
                
            </>
        )
}

const mapStateToProps = (state) => {
	return {
		mainMenu: state.mainMenu,
		GroupId: state.groupEntity.GroupId,
		TeamId: state.groupEntity.TeamId,
		TeamName: state.groupEntity.TeamName,
        SelectedTeam: state.teamsEntity.selected,
		UserIsGroupAdmin: state.profileEntity.isGroupAdmin,
		myProfile: state.profileEntity.myProfile,
        tournament: state.tournamentsEntity,
		matchesByTeam: state.teamsEntity.matches,
        team: state.teamsEntity,
	}
}

export default connect(mapStateToProps, {
    resetTeam, getMyTeams, setTeamMode, setSelectedTeam, deleteTeam, connectTeamWithGroup, getTeamsInCity,
	setActiveMenuItem, setTournamentMode, getMyTournaments, publishTournament, deleteTournament, setSelectedTournament, resetTournament,
})(GroupAdminPanel);