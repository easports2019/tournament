import React, { useEffect } from 'react'
import { RichCell, Avatar, Button, InfoRow, Header } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/dataTypes/common'
import TeamAdminList from './TeamAdminList'
import { setActiveMenuItem } from './../../../../store/mainMenuReducer';
import {setTournamentMode, getMyTournaments, publishTournament, deleteTournament, setSelectedTournament, resetTournament,} from './../../../../store/tournamentsReducer'
import {resetTeam, getMyTeams, setTeamMode, setSelectedTeam, deleteTeam} from './../../../../store/teamsReducer'
import { connect } from 'react-redux';
import ButtonWithHistory from '../../Common/WithHistory/ButtonWithHistory'


const TeamAdminPanel = (props) => {

	// let [myTournaments, setMyTournaments] = useState([]);
    const PublishTeam = (team, publish) => {
        
        props.publishTeam(team, props.myProfile, publish);
    }
   
    const DeleteTeam = (team) => {
        props.deleteTeam(team, props.myProfile);
    }
    
    const CellClick = (item) => {
        
        props.setSelectedTeam(item);
        props.setTeamMode("edit");
    }
    
    
    const ButtonNewClick = () => {
        props.resetTeam();
        props.setTeamMode("add");
    }

    useEffect(() =>{
        debugger
        props.getMyTeams(props.myProfile.UserProfileId);
        
    }, props.myProfile)

        return (
            <>
                <Header>Мои команды</Header>
                <InfoRow>При заявке указывается желаемая группа. Организатор в праве взять в другую группу</InfoRow>
                <ButtonWithHistory handleClick={ButtonNewClick} toMenuName="teamitem" data-story="teamitem">Создать команду</ButtonWithHistory>
                <TeamAdminList 
                    CellClick={CellClick}
                    Button1Handle = {PublishTeam}
                    Button2Handle = {DeleteTeam}
                    List={props.team.myTeams}
                >
                    
                </TeamAdminList>
            </>
        )
}

const mapStateToProps = (state) => {
	return {
		mainMenu: state.mainMenu,
		myProfile: state.profileEntity.myProfile,
        tournament: state.tournamentsEntity,
        team: state.teamsEntity,
	}
}

export default connect(mapStateToProps, {
    resetTeam, getMyTeams, setTeamMode, setSelectedTeam, deleteTeam,
	setActiveMenuItem, setTournamentMode, getMyTournaments, publishTournament, deleteTournament, setSelectedTournament, resetTournament,
})(TeamAdminPanel);