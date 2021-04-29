import React, { useEffect } from 'react'
import { RichCell, Avatar } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/dataTypes/common'
import TournamentList from './TournamentList'


const TournamentListContainer = (props) => {

    let [tournamentList, setTournamentList] = useState((props.my) ? [...props.Tournaments.myTournaments] : [...props.Tournaments.tournaments]);

    // загрузка списка сборов текущего пользователя с сервера
    useEffect(() => {

    }, null)

        return (
            <>
                <TournamentList tournaments={tournamentList}></TournamentList>
            </>
        )
}

const mapStateToProps = (state) => {
    return {
        Tournaments: state.tournamentsEntity,
    }
}

export default connect(mapStateToProps, {

})(TournamentListContainer)