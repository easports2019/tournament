import React, { useEffect } from 'react'
import { RichCell, Avatar, Button, InfoRow, Header } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/dataTypes/common'
import TeamAdminList from './TeamAdminList'
import { setActiveMenuItem } from './../../../../store/mainMenuReducer';
import {setTournamentMode, getMyTournaments, publishTournament, deleteTournament, setSelectedTournament, resetTournament,} from './../../../../store/tournamentsReducer'
import { connect } from 'react-redux';
import ButtonWithHistory from './../../Common/ButtonWithHistory/ButtonWithHistory'
import TeamItem from './TeamItem';


const TeamAdminPanel = (props) => {

	// let [myTournaments, setMyTournaments] = useState([]);
    const PublishTeam = (team, publish) => {
        
        props.publishTeam(team, props.myProfile, publish);
    }
   
    // const DeleteTournament = (tour) => {
    //     props.deleteTournament(tour, props.myProfile);
    // }
    
    // const CellClick = (item) => {
        
    //     props.setSelectedTournament(item);
    //     props.setTournamentMode("edit");
    // }
    
    
    const ButtonNewClick = () => {
        props.resetTeam();
        props.setTeamMode("add");
    }

    useEffect(() =>{
        
        props.getMyTournaments(props.myProfile.UserProfileId);
    }, props.myProfile)

        return (
            <>
                <Header>Моя команда</Header>
                <TeamItem></TeamItem>
                {/* <ButtonWithHistory handleClick={ButtonNewClick} toMenuName="teamitem" data-story="teamitem">Создать команду</ButtonWithHistory> */}
                {/* <TeamAdminList 
                    CellClick={CellClick}
                    Button1Handle = {PublishTournament}
                    Button2Handle = {DeleteTournament}
                    List={props.tournament.myTournaments}
                >
                    
                </TeamAdminList> */}
            </>
        )
}

const mapStateToProps = (state) => {
	return {
		mainMenu: state.mainMenu,
		myProfile: state.profileEntity.myProfile,
        tournament: state.tournamentsEntity,
	}
}

export default connect(mapStateToProps, {
	setActiveMenuItem, setTournamentMode, getMyTournaments, publishTournament, deleteTournament, setSelectedTournament, resetTournament,
})(TeamAdminPanel);