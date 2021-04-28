import React from 'react'
import { RichCell, Avatar, Button } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/datatypes/common'
import TournamentList from './TournamentList'
import { setActiveMenuItem } from './../../../../store/mainMenuReducer';
import {setTournamentMode} from './../../../../store/tournamentsReducer'
import { connect } from 'react-redux';
import ButtonWithHistory from './../../Common/ButtonWithHistory/ButtonWithHistory'


const TournamentAdminPanel = (props) => {

	const changeView = (e) => {
        
		
	}


        return (
            <>
                <div>Мои турниры</div>
                <TournamentList></TournamentList>
                <div>Кнопка Создать турнир</div>
                <ButtonWithHistory handleClick={() => props.setTournamentMode("add")} toMenuName="tournamentitem" data-story="tournamentitem">Новый турнир</ButtonWithHistory>
            </>
        )
}

const mapStateToProps = (state) => {
	return {
		mainMenu: state.mainMenu,
	}
}

export default connect(mapStateToProps, {
	setActiveMenuItem, setTournamentMode,
})(TournamentAdminPanel);