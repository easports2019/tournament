import React, { useEffect } from 'react'
import { RichCell, Avatar, Button, InfoRow, Header, FormItem } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/dataTypes/common'
import TournamentAdminList from './TournamentAdminList'
import { setActiveMenuItem } from './../../../../store/mainMenuReducer';
import {setTournamentMode, getMyTournaments, publishTournament, deleteTournament, 
    setSelectedTournament, resetTournament,} from './../../../../store/tournamentsReducer'
import { connect } from 'react-redux';
import ButtonWithHistory from '../../Common/WithHistory/ButtonWithHistory'


const TournamentAdminPanel = (props) => {

	// let [myTournaments, setMyTournaments] = useState([]);
    const PublishTournament = (tour, publish) => {

        props.publishTournament(tour, props.myProfile, publish);
    }
   
    const DeleteTournament = (tour) => {
        props.deleteTournament(tour, props.myProfile);
    }
    
    const CellClick = (item) => {
        
        props.setTournamentMode("edit");
        props.setSelectedTournament(item);
    }
    
    
    const ButtonNewClick = () => {
        props.resetTournament();
        props.setTournamentMode("add");
    }

    useEffect(() =>{
        
        props.getMyTournaments(props.myProfile.UserProfileId);
    }, props.myProfile)

        return (
            <>
                <FormItem>
                    <ButtonWithHistory handleClick={ButtonNewClick} toMenuName="tournamentitem" data-story="tournamentitem">Создать турнир</ButtonWithHistory>
                </FormItem>
                <TournamentAdminList 
                    CellClick={CellClick}
                    Button1Handle = {PublishTournament}
                    Button2Handle = {DeleteTournament}
                    List={props.tournament.myTournaments}
                >
                    
                </TournamentAdminList>
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
})(TournamentAdminPanel);