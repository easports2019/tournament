import React, { useEffect } from 'react'
import { RichCell, Avatar, Button, InfoRow, Header } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/dataTypes/common'
import TeamAdminList from '../Team/TeamAdminList'
import { setActiveMenuItem } from './../../../../store/mainMenuReducer';
import { cancelBidTeamToTournamentGroup,  } from './../../../../store/bidTeamsReducer'
import {setTournamentMode, getMyTournaments, publishTournament, deleteTournament, setSelectedTournament, resetTournament,} from './../../../../store/tournamentsReducer'
import {resetTeam, getMyTeams, setTeamMode, setSelectedTeam, deleteTeam} from './../../../../store/teamsReducer'

import { connect } from 'react-redux';
import ButtonWithHistory from '../../Common/WithHistory/ButtonWithHistory'
import BidList from './BidList';



const BidTeamAdminPanel = (props) => {

	// let [myTournaments, setMyTournaments] = useState([]);
    const PublishTeam = (team, publish) => {
        
        // props.publishTeam(team, props.myProfile, publish);
    }
   
    const DeleteTeam = (team) => {
        // props.deleteTeam(team, props.myProfile);
    }
    
    const CellClick = (item) => {
        
        // props.setSelectedTeam(item);
        // props.setTeamMode("edit");
    }

    const CancelBid = (item) => {
        
        props.cancelBidTeamToTournamentGroup(item, props.myProfile, props.team.selected);
        // props.setTeamMode("edit");
    }
    
    
    const ButtonNewClick = () => {
        // props.resetTeam();
        // props.setTeamMode("add");
    }

    useEffect(() =>{
        
        props.getMyTeams(props.myProfile.UserProfileId);
    }, props.myProfile)

        return (
            <>
                <InfoRow>При заявке указывается желаемая группа. Организатор в праве взять в другую группу</InfoRow>
                {/* <ButtonWithHistory handleClick={ButtonNewClick} toMenuName="teamitem" data-story="teamitem">Создать заявку</ButtonWithHistory> */}
                <BidList
                    CellClick={CellClick}
                    Button1Handle = {CancelBid}
                    //Button2Handle = {DeleteTeam}
                    List={props.tournamentsForBids.myBids}
                >
                    
                </BidList>
                
            </>
        )
}

const mapStateToProps = (state) => {
	return {
		mainMenu: state.mainMenu,
		myProfile: state.profileEntity.myProfile,
        tournament: state.tournamentsEntity,
        team: state.teamsEntity,
        tournamentsForBids: state.bidTeamsEntity,
	}
}

export default connect(mapStateToProps, {
    cancelBidTeamToTournamentGroup, 
    resetTeam, getMyTeams, setTeamMode, setSelectedTeam, deleteTeam,
	setActiveMenuItem, setTournamentMode, getMyTournaments, publishTournament, deleteTournament, setSelectedTournament, resetTournament,
})(BidTeamAdminPanel);