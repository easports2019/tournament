import React, { useEffect } from 'react'
import { RichCell, Avatar, Button, InfoRow, Header } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/dataTypes/common'
import TournamentAdminList from './TournamentAdminList'
import { setActiveMenuItem } from './../../../../store/mainMenuReducer';
import {setTournamentMode, getMyTournaments, publishTournament} from './../../../../store/tournamentsReducer'
import { connect } from 'react-redux';
import ButtonWithHistory from './../../Common/ButtonWithHistory/ButtonWithHistory'


const TournamentAdminPanel = (props) => {

	// let [myTournaments, setMyTournaments] = useState([]);
    const PublishTournament = (tour, publish) => {
        
        props.publishTournament(tour, props.myProfile, publish);
    }
   
    const DeleteTournament = (tour) => {

    }

    useEffect(() =>{
        
        props.getMyTournaments(props.myProfile.UserProfileId);
    }, props.myProfile)

        return (
            <>
                <Header>Мои турниры</Header>
                <TournamentAdminList 
                    Button1Handle = {PublishTournament}
                    Button2Handle = {DeleteTournament}
                    List={props.tournament.myTournaments}
                >
                    
                </TournamentAdminList>
                
                <ButtonWithHistory handleClick={() => props.setTournamentMode("add")} toMenuName="tournamentitem" data-story="tournamentitem">Создать турнир</ButtonWithHistory>
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
	setActiveMenuItem, setTournamentMode, getMyTournaments, publishTournament, 
})(TournamentAdminPanel);