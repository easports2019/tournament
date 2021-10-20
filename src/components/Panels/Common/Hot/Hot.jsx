import React, { useEffect } from 'react'
import { RichCell, Avatar, InfoRow, Group, List, CellButton, Button, FormItem, CustomSelect, DatePicker, CustomSelectOption, Header, SimpleCell, Div } from '@vkontakte/vkui'
import Icon24ChevronRightWithHistory from '../../Common/WithHistory/Icon24ChevronRightWithHistory'
import { connect } from 'react-redux';
import {
    getTournamentTeams,
} from '../../../../store/tournamentsReducer'
import {
    setMode, setAccess, addMatchToShedule, getAllMatchesByTournament, delMatchFromShedule,
} from '../../../../store/matchReducer'
import { Checkbox } from '@vkontakte/vkui/dist/components/Checkbox/Checkbox';


// const SheduleContainer = (props) => {



//     return <Shedule props={...props}></Shedule>
// }


const Hot = (props) => {
    
    return (
        <FormItem>
            <Group header={props.Name}>
                <List>
                    {props.Matches && props.Matches.map(match => {
                        let date = new Date(match.When);
                        return (
                                <RichCell
                                    text={
                                        match.Played ?
                                            <span style={{ "color": "green" }}>Сыгран {`${date.toLocaleDateString()} в ${date.toLocaleTimeString()}`}</span> :
                                            <span style={{ "color": "blue" }}>Состоится {`${date.toLocaleDateString()} в ${date.toLocaleTimeString()}`}</span>
                                    }
                                    caption="Место не указано"
                                >
                                    {match.Played ?
                                        `${match.Team1Name} ${match.Team1Goals} - ${match.Team2Goals} ${match.Team2Name}` :
                                        `${match.Team1Name} - ${match.Team2Name}`
                                    }
                                </RichCell>
                        )
                    }
                    )}
                </List>
            </Group>
        </FormItem>
    )
                

}

let mapStateToProps = (state) => {
    return {
        tournaments: state.tournamentsEntity,
        mode: state.matches.mode,
        matches: state.matches.matches,
        //places: state.placeEntity.places,
        places: state.simplePlaceEntity.places,
        myProfile: state.profileEntity.myProfile,
        // пожалуй, нужно места загрузить сразу при запуске приложения и использовать их без изменения из хранилища, а не запрашивать каждый раз с сревера. они редко меняются.
        //access: state.matches.access,
    }
}

export default connect(mapStateToProps, {
    getTournamentTeams, setMode, setAccess, addMatchToShedule, getAllMatchesByTournament, delMatchFromShedule,
})(Hot)