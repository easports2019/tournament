import React, { useState , useEffect } from 'react'
import { RichCell, Avatar, FormLayout, FormItem, Input, InfoRow, Group, DatePicker, Textarea, File, CellButton, Button, Header, List, Cell } from '@vkontakte/vkui'
import { defaultPhotoPath } from '../../../../store/dataTypes/common'
import {
    setTournamentWhenBegin, setTournamentWhenEnd, setTournamentName, setTournamentReglament, setTournamentDetails, delGroupFromTournamentByKeyId,
    editGroupInTournament, addGroupToTournament, resetTournament, saveSelectedTournament
} from '../../../../store/tournamentsReducer'
import {getActualTournamentsInCity, getTournamentGroups, setBidTeamSelectedMode, getTeamBidsByTeam, 
    addBidTeamToTournamentGroup, cancelBidTeamToTournamentGroup,  } from '../../../../store/bidTeamsReducer'
import {
    setTeamWhenBorn, setTeamDetails, setTeamName, saveSelectedTeam, 
} from '../../../../store/teamsReducer'
import { Icon24Camera, Icon28AddOutline } from '@vkontakte/icons';
import { connect } from 'react-redux';
import ListItem from '../ListItem/ListItem';
import BidTeamList from '../BidTeam/BidList';
import { dateToString } from '../../../../utils/convertors/dateUtils';
import BidTeamTournamentList from '../BidTeam/BidTeamTournamentList';
import BidTeamTournamentGroupsList from '../BidTeam/BidTeamTournamentGroupsList';
import BidTeamAdminPanel from '../BidTeam/BidTeamAdminPanel'





const TeamItem = (props) => {
    let currentDate = new Date();
    let [teamNameOnTournament, SetTeamNameOnTournament] = useState(props.teams.selected.Name);

    const teamDate = new Date(
        props.teams.selected.WhenBorn.year,
        props.teams.selected.WhenBorn.month-1,
        props.teams.selected.WhenBorn.day
        );

        useEffect(() =>{
            if (props.teams.selected != null){
                props.getActualTournamentsInCity(props.myProfile, props.teams.selected);
                props.getTeamBidsByTeam(props.myProfile, props.teams.selected);
            }
        }, props.teams.selected)
        
    
    const MakeBid = (tournamentgroup) => {
        props.addBidTeamToTournamentGroup(tournamentgroup, props.myProfile, props.teams.selected, teamNameOnTournament);
        props.setBidTeamSelectedMode("tournaments")
        //setTempGroupName("");
    }

    const CancelBid = (tournamentgroup) => {
        props.cancelBidTeamToTournamentGroup(tournamentgroup, props.myProfile, props.teams.selected)
        props.setBidTeamSelectedMode("tournaments")
        //setTempGroupName("");
    }
    
    const SelectTournament = (tournament) => {
        props.getTournamentGroups(tournament)
        props.getTeamBidsByTeam(props.myProfile, props.teams.selected)
        props.setBidTeamSelectedMode("groups")
    }
    
    const BackToTournaments = () => {
        props.setBidTeamSelectedMode("tournaments")
    }

    switch (props.mode) {
        case "view": {
            return (
                <>
                    <FormItem top="Ваш город">
                        <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
                    </FormItem>
                    <FormItem top="Название команды" bottom="Имя турнира должно быть уникальным">
                        <InfoRow>{props.teams.selected.Name}</InfoRow>
                    </FormItem>
                    <FormItem top="Дата основания">
                        <InfoRow>{dateToString(teamDate)}</InfoRow>
                    </FormItem>
                    <FormItem top="Описание турнира">
                        <InfoRow>{props.teams.selected.Details}</InfoRow>
                    </FormItem>
                    <FormItem top="Логотип">
                        <InfoRow>{props.teams.selected.Logo}</InfoRow>
                    </FormItem>
                    {/* <Group header={<Header mode="secondary">Группы</Header>}>
                        {(props.tournaments.selected.TournamentGroups && props.tournaments.selected.TournamentGroups.length > 0) ?
                            <List>
                                {props.tournaments.selected.TournamentGroups.map((item) => <InfoRow>{item.Name}</InfoRow>)}
                            </List>
                            :
                            <FormItem>
                                <InfoRow>Нет групп</InfoRow>
                            </FormItem>
                        }
                    </Group> */}
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
                        <FormItem top="Дата основания">
                            <DatePicker
                                min={{ day: 1, month: 1, year: currentDate.getFullYear() - 50 }}
                                max={{ day: 1, month: 1, year: currentDate.getFullYear() }}
                                defaultValue={props.teams.selected.WhenBorn}
                                value={props.teams.selected.WhenBorn}
                                onDateChange={value => props.setTeamWhenBorn(value)}
                            />
                        </FormItem>
                        <FormItem top="Описание команды">
                            <Textarea defaultValue={props.teams.selected.Details} value={props.teams.selected.Details} onChange={e => props.setTeamDetails(e.currentTarget.value)} placeholder="Описание команды" />
                        </FormItem>
                        {/* <FormItem top="Загрузите ваше фото">
                            <File before={<Icon24Camera />} controlSize="m">
                                Выбрать фото
                            </File>
                        </FormItem> */}
                        {/* <Group header={<Header mode="secondary">Группы</Header>}>
                            {(props.tournaments.selected.TournamentGroups && props.tournaments.selected.TournamentGroups.length > 0) ?
                                <List>
                                    {props.tournaments.selected.TournamentGroups.map((item) => <ListItem KeyId={-1} Delete={() => props.delGroupFromTournament(props.tournaments.selected.Id, item.KeyId)} Name={item.Name}></ListItem>)}
                                </List>
                                :
                                <FormItem>
                                    <InfoRow>Нет групп</InfoRow>
                                </FormItem>
                            }
                        </Group> */}
                        {/* <FormItem top="Новая группа/лига">
                            <Input type="text" defaultValue={tempGroupName} value={tempGroupName} onChange={e => setTempGroupName(e.currentTarget.value)} placeholder="Название, например, Лига 1" />
                            <CellButton onClick={() => addToTournament(props.tournaments.selected.Id, tempGroupName)} before={<Icon28AddOutline />}>Добавить группу/лигу</CellButton>
                        </FormItem> */}
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
                        <FormItem top="Дата основания">
                            <DatePicker
                                min={{ day: 1, month: 1, year: currentDate.getFullYear() - 50 }}
                                max={{ day: 1, month: 1, year: currentDate.getFullYear() }}
                                defaultValue={props.teams.selected.WhenBorn}
                                value={props.teams.selected.WhenBorn}
                                onDateChange={value => props.setTeamWhenBorn(value)}
                            />
                        </FormItem>
                        <FormItem top="Описание команды">
                            <Textarea defaultValue={props.teams.selected.Details} value={props.teams.selected.Details} onChange={e => props.setTeamDetails(e.currentTarget.value)} placeholder="Описание команды" />
                        </FormItem>
                        {/* <FormItem top="Загрузите ваше фото">
                            <File before={<Icon24Camera />} controlSize="m">
                                Выбрать фото
                            </File>
                        </FormItem> */}
                        {/* <Group header={<Header mode="secondary">Группы</Header>}>
                            {(props.tournaments.selected.TournamentGroups && props.tournaments.selected.TournamentGroups.length > 0) ?
                                <List>
                                    {props.tournaments.selected.TournamentGroups.map((item) => <ListItem KeyId={-1} Delete={() => props.delGroupFromTournament(props.tournaments.selected.Id, item.KeyId)} Name={item.Name}></ListItem>)}
                                </List>
                                :
                                <FormItem>
                                    <InfoRow>Нет групп</InfoRow>
                                </FormItem>
                            }
                        </Group> */}
                        {/* <FormItem top="Новая группа/лига">
                            <Input type="text" defaultValue={tempGroupName} value={tempGroupName} onChange={e => setTempGroupName(e.currentTarget.value)} placeholder="Название, например, Лига 1" />
                            <CellButton onClick={() => addToTournament(props.tournaments.selected.Id, tempGroupName)} before={<Icon28AddOutline />}>Добавить группу/лигу</CellButton>
                        </FormItem> */}
                        <FormItem top="Заявки на турнир">
                            <BidTeamAdminPanel></BidTeamAdminPanel>
                        </FormItem>
                        <FormItem top="Куда можно заявиться">
                            {props.tournamentsForBids.selectMode == "tournaments" ?
                                <BidTeamTournamentList
                                    CellClick={SelectTournament}
                                    // Button1Handle = {MakeBid}
                                    // Button2Handle = {CancelBid}
                                    List={props.tournamentsForBids.tournaments}
                                ></BidTeamTournamentList>
                        :
                                <BidTeamTournamentGroupsList
                                    CellClick={BackToTournaments}
                                    Button1Handle = {MakeBid}
                                    Button2Handle = {CancelBid}
                                    List={props.tournamentsForBids.selectedTournament.TournamentGroups}
                                    TeamName={teamNameOnTournament}
                                    SetTeamName={SetTeamNameOnTournament}
                                ></BidTeamTournamentGroupsList>
                        }
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
        bidTeams: state.bidTeamsEntity,
        tournamentsForBids: state.bidTeamsEntity,
        SelectedName: state.teamsEntity.selected.Name,
        bidSelectMode: state.bidTeamsEntity.selectMode, 
        cities: state.cityEntity.cities,
        myProfile: state.profileEntity.myProfile,
    }
}

export default connect(mapStateToProps, {
    getActualTournamentsInCity, getTournamentGroups, setBidTeamSelectedMode, getTeamBidsByTeam, addBidTeamToTournamentGroup, cancelBidTeamToTournamentGroup,
    setTeamWhenBorn, setTeamDetails, setTeamName, saveSelectedTeam, 
    setTournamentWhenBegin, setTournamentWhenEnd, setTournamentName, setTournamentReglament, setTournamentDetails,
    delGroupFromTournamentByKeyId, editGroupInTournament, addGroupToTournament, resetTournament, saveSelectedTournament, 
})(TeamItem)