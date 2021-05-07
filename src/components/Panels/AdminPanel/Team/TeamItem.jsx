import React, { useState } from 'react'
import { RichCell, Avatar, FormLayout, FormItem, Input, InfoRow, Group, DatePicker, Textarea, File, CellButton, Button, Header, List, Cell } from '@vkontakte/vkui'
import { defaultPhotoPath } from '../../../../store/dataTypes/common'
import {
    setTournamentWhenBegin, setTournamentWhenEnd, setTournamentName, setTournamentReglament, setTournamentDetails, delGroupFromTournamentByKeyId,
    editGroupInTournament, addGroupToTournament, resetTournament, saveSelectedTournament
} from '../../../../store/tournamentsReducer'
import {
    setTeamWhenBorn, setTeamDetails, setTeamName, 
} from '../../../../store/teamsReducer'
import { Icon24Camera, Icon28AddOutline } from '@vkontakte/icons';
import { connect } from 'react-redux';
import ListItem from '../ListItem/ListItem';
import { dateToString } from '../../../../utils/convertors/dateUtils';




const TeamItem = (props) => {
    let currentDate = new Date();
    let [tempGroupName, setTempGroupName] = useState("");
    const teamDate = new Date(
        props.teams.selected.WhenBorn.year,
        props.teams.selected.WhenBorn.month-1,
        props.teams.selected.WhenBorn.day
        );

    // const addToTournament = (id, name) => {
    //     props.addGroupToTournament(id, name);
    //     setTempGroupName("");
    // }

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
        // case "edit": {
        //     return (
        //         <Group>
        //             <Header>Управление турниром</Header>
        //             <FormLayout>
        //                 <FormItem top="Ваш город">
        //                     <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
        //                 </FormItem>
        //                 <FormItem top="Название турнира" bottom="Имя турнира должно быть уникальным">
        //                     <Input type="text" defaultValue={props.tournaments.selected.Name} onChange={e => props.setTournamentName(e.currentTarget.value)} placeholder="Например, II чемпионат города Истра 2023 года на призы..." />
        //                 </FormItem>
        //                 <FormItem top="Дата начала">
        //                     <DatePicker
        //                         min={{ day: 1, month: 1, year: currentDate.getFullYear() - 1 }}
        //                         max={{ day: 1, month: 1, year: currentDate.getFullYear() + 1 }}
        //                         defaultValue={props.tournaments.selected.WhenBegin}
        //                         value={props.tournaments.selected.WhenBegin}
        //                         onDateChange={value => props.setTournamentWhenBegin(value)}
        //                     />
        //                 </FormItem>
        //                 <FormItem top="Дата окончания">
        //                     <DatePicker
        //                         min={{ day: 1, month: 1, year: currentDate.getFullYear() - 1 }}
        //                         max={{ day: 1, month: 1, year: currentDate.getFullYear() + 1 }}
        //                         defaultValue={props.tournaments.selected.WhenEnd}
        //                         value={props.tournaments.selected.WhenBegin}
        //                         onDateChange={value => props.setTournamentWhenEnd(value)}
        //                     />
        //                 </FormItem>
        //                 <FormItem top="Описание турнира">
        //                     <Textarea defaultValue={props.tournaments.selected.Details} onChange={e => props.setTournamentDetails(e.currentTarget.value)} placeholder="Описание турнира" />
        //                 </FormItem>
        //                 <FormItem top="Регламент турнира">
        //                     <Textarea defaultValue={props.tournaments.selected.Reglament} placeholder="Регламент турнира" onChange={e => props.setTournamentReglament(e.currentTarget.value)} />
        //                 </FormItem>
        //                 {/* <FormItem top="Загрузите ваше фото">
        //                     <File before={<Icon24Camera />} controlSize="m">
        //                         Выбрать фото
        //                     </File>
        //                 </FormItem> */}
        //                 <Group header={<Header mode="secondary">Группы</Header>}>
        //                     {(props.tournaments.selected.TournamentGroups && props.tournaments.selected.TournamentGroups.length > 0) ?
        //                         <List>
        //                             {props.tournaments.selected.TournamentGroups.map((item) => <ListItem KeyId={item.KeyId} Delete={() => props.delGroupFromTournament(props.tournaments.selected.Id, item.KeyId)} Name={item.Name}></ListItem>)}
        //                         </List>
        //                         :
        //                         <FormItem>
        //                             <InfoRow>Нет групп</InfoRow>
        //                         </FormItem>
        //                     }
        //                 </Group>
        //                 <FormItem top="Новая группа/лига">
        //                     <Input type="text" defaultValue={tempGroupName} value={tempGroupName} onChange={e => setTempGroupName(e.currentTarget.value)} placeholder="Например, Лига 1" />
        //                     <CellButton onClick={() => addToTournament(props.tournaments.selected.Id, tempGroupName)} before={<Icon28AddOutline />}>Добавить группу</CellButton>
        //                 </FormItem>
        //                 <FormItem top="Подверждение">
        //                     <Button onClick={() => props.saveSelectedTournament(props.tournaments.selected, props.myProfile)}>Внести изменения</Button>
        //                     {/* <Button onClick={props.resetTournament} mode="secondary">Отмена</Button> */}
        //                 </FormItem>
        //             </FormLayout>
        //         </Group>
        //     )
        // }; break;
    }


}

const mapStateToProps = (state) => {
    return {
        tournaments: state.tournamentsEntity,
        teams: state.teamsEntity,
        SelectedName: state.teamsEntity.selected.Name,
        cities: state.cityEntity.cities,
        myProfile: state.profileEntity.myProfile,
    }
}

export default connect(mapStateToProps, {
    setTeamWhenBorn, setTeamDetails, setTeamName, 
    setTournamentWhenBegin, setTournamentWhenEnd, setTournamentName, setTournamentReglament, setTournamentDetails,
    delGroupFromTournamentByKeyId, editGroupInTournament, addGroupToTournament, resetTournament, saveSelectedTournament, 
})(TeamItem)