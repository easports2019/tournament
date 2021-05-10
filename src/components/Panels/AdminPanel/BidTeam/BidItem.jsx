import React, { useState , useEffect } from 'react'
import { RichCell, Avatar, FormLayout, FormItem, Input, InfoRow, Group, DatePicker, Textarea, File, CellButton, Button, Header, List, Cell } from '@vkontakte/vkui'
import { defaultPhotoPath } from '../../../../store/dataTypes/common'
import {
    setTournamentWhenBegin, setTournamentWhenEnd, setTournamentName, setTournamentReglament, setTournamentDetails, delGroupFromTournamentByKeyId,
    editGroupInTournament, addGroupToTournament, resetTournament, saveSelectedTournament
} from '../../../../store/tournamentsReducer'
import {getActualTournamentsInCity} from '../../../../store/bidTeamsReducer'
import {
    setTeamWhenBorn, setTeamDetails, setTeamName, saveSelectedTeam, 
} from '../../../../store/teamsReducer'
import { Icon24Camera, Icon28AddOutline } from '@vkontakte/icons';
import { connect } from 'react-redux';
import ListItem from '../ListItem/ListItem';
import { dateToString } from '../../../../utils/convertors/dateUtils';
import BidTeamTournamentList from '../BidTeam/BidTeamTournamentList';





const BidItem = (props) => {
    let currentDate = new Date();
    let [tempGroupName, setTempGroupName] = useState("");
    const teamDate = new Date(
        props.teams.selected.WhenBorn.year,
        props.teams.selected.WhenBorn.month-1,
        props.teams.selected.WhenBorn.day
        );

        useEffect(() =>{
            if (props.teams.selected != null){
                props.getActualTournamentsInCity(props.myProfile, props.teams.selected);
            }
        }, props.teams.selected)
        
    
    const MakeBid = (team, profile, tournamentgroup) => {
        //props.addGroupToTournament(id, name);
        //setTempGroupName("");
    }
    
    const SelectTournament = (tournament) => {
        //props.addGroupToTournament(id, name);
        //setTempGroupName("");
    }
    
    const CancelBid = (bid, profile) => {
        //props.addGroupToTournament(id, name);
        //setTempGroupName("");
    }

    switch (props.mode) {
        case "view": {
            return (
                <>
                    <FormItem top="Ваш город">
                        <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
                    </FormItem>
                    
                </>
            )
        }; break;
        case "add": {
            return (
                <Group>
                    <Header>Новая команда</Header>
                    <FormLayout>
                        <FormItem top="Ваш город">
                            <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
                        </FormItem>
                        <FormItem top="Название команды">
                            <Input type="text" defaultValue={props.teams.selected.Name} value={props.teams.selected.Name} onChange={e => props.setTeamName(e.currentTarget.value)} placeholder="Например, Ривер Плейт" />
                        </FormItem>
                        
                        <FormItem top="Подверждение">
                            <Button onClick={() => props.saveSelectedTeam(props.teams.selected, props.myProfile)}>Создать</Button>
                            <Button onClick={props.resetTeam} mode="secondary">Отмена</Button>
                        </FormItem>
                    </FormLayout>
                </Group>
            )
        }; break;
        case "edit": {
            return (
                <Group>
                    <Header>Управление командой</Header>
                    <FormLayout>
                        <FormItem top="Ваш город">
                            <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
                        </FormItem>
                        <FormItem top="Название команды">
                            <Input type="text" defaultValue={props.teams.selected.Name} value={props.teams.selected.Name} onChange={e => props.setTeamName(e.currentTarget.value)} placeholder="Например, Ривер Плейт" />
                        </FormItem>
                        
                        <FormItem top="Подверждение">
                            <Button onClick={() => props.saveSelectedTeam(props.teams.selected, props.myProfile)}>Внести изменения</Button>
                        </FormItem>
                    </FormLayout>
                </Group>
            )
        };break;
        default:{
            <Group>
                Не выбран режим отображения компонента (view, add, edit)
            </Group>
        };break;
        
    }


}

const mapStateToProps = (state) => {
    return {
        tournaments: state.tournamentsEntity,
        teams: state.teamsEntity,
        tournamentsForBids: state.bidTeamsEntity,
        SelectedName: state.teamsEntity.selected.Name,
        cities: state.cityEntity.cities,
        myProfile: state.profileEntity.myProfile,
    }
}

export default connect(mapStateToProps, {
    getActualTournamentsInCity,
    setTeamWhenBorn, setTeamDetails, setTeamName, saveSelectedTeam, 
    setTournamentWhenBegin, setTournamentWhenEnd, setTournamentName, setTournamentReglament, setTournamentDetails,
    delGroupFromTournamentByKeyId, editGroupInTournament, addGroupToTournament, resetTournament, saveSelectedTournament, 
})(BidItem)