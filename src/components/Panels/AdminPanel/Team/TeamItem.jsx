import React, { useState } from 'react'
import { RichCell, Avatar, FormLayout, FormItem, Input, InfoRow, Group, DatePicker, Textarea, File, CellButton, Button, Header, List, Cell } from '@vkontakte/vkui'
import { defaultPhotoPath } from '../../../../store/dataTypes/common'
import {
    setTournamentWhenBegin, setTournamentWhenEnd, setTournamentName, setTournamentReglament, setTournamentDetails, delGroupFromTournament,
    editGroupInTournament, addGroupToTournament, resetTournament, saveSelectedTournament
} from '../../../../store/tournamentsReducer'
import { Icon24Camera, Icon28AddOutline } from '@vkontakte/icons';
import { connect } from 'react-redux';
import ListItem from '../ListItem/ListItem';




const TeamItem = (props) => {
    let currentDate = new Date();
    let [tempGroupName, setTempGroupName] = useState("");

    const addToTournament = (id, name) => {
        props.addGroupToTournament(id, name);
        setTempGroupName("");
    }

    switch (props.mode) {
        case "view": {
            return (
                <>
                    <FormItem top="Ваш город">
                        <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
                    </FormItem>
                    <FormItem top="Название турнира" bottom="Имя турнира должно быть уникальным">
                        <InfoRow>{props.tournaments.selected.Name}</InfoRow>
                    </FormItem>
                    <FormItem top="Дата начала">
                        <InfoRow>{props.tournaments.selected.WhenBegin}</InfoRow>
                    </FormItem>
                    <FormItem top="Дата окончания">
                        <InfoRow>{props.tournaments.selected.WhenEnd}</InfoRow>
                    </FormItem>
                    <FormItem top="Описание турнира">
                        <InfoRow>{props.tournaments.selected.Details}</InfoRow>
                    </FormItem>
                    <FormItem top="Регламент турнира">
                        <InfoRow>{props.tournaments.selected.Reglament}</InfoRow>
                    </FormItem>
                    <Group header={<Header mode="secondary">Группы</Header>}>
                        {(props.tournaments.selected.TournamentGroups && props.tournaments.selected.TournamentGroups.length > 0) ?
                            <List>
                                {props.tournaments.selected.TournamentGroups.map((item) => <InfoRow>{item.Name}</InfoRow>)}
                            </List>
                            :
                            <FormItem>
                                <InfoRow>Нет групп</InfoRow>
                            </FormItem>
                        }
                    </Group>
                </>
            )
        }; break;
        case "add": {
            return (
                <Group>
                    <Header>Новый турнир</Header>
                    <FormLayout>
                        <FormItem top="Ваш город">
                            <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
                        </FormItem>
                        <FormItem top="Название турнира" bottom="Имя турнира должно быть уникальным">
                            <Input type="text" defaultValue={props.tournaments.selected.Name} value={props.tournaments.selected.Name} onChange={e => props.setTournamentName(e.currentTarget.value)} placeholder="Например, II чемпионат города Истра 2023 года на призы..." />
                        </FormItem>
                        <FormItem top="Дата начала">
                            <DatePicker
                                min={{ day: 1, month: 1, year: currentDate.getFullYear() - 1 }}
                                max={{ day: 1, month: 1, year: currentDate.getFullYear() + 1 }}
                                defaultValue={props.tournaments.selected.WhenBegin}
                                value={props.tournaments.selected.WhenBegin}
                                onDateChange={value => props.setTournamentWhenBegin(value)}
                            />
                        </FormItem>
                        <FormItem top="Дата окончания">
                            <DatePicker
                                min={{ day: 1, month: 1, year: currentDate.getFullYear() - 1 }}
                                max={{ day: 1, month: 1, year: currentDate.getFullYear() + 1 }}
                                defaultValue={props.tournaments.selected.WhenEnd}
                                value={props.tournaments.selected.WhenEnd}
                                onDateChange={value => props.setTournamentWhenEnd(value)}
                            />
                        </FormItem>
                        <FormItem top="Описание турнира">
                            <Textarea defaultValue={props.tournaments.selected.Details} value={props.tournaments.selected.Details} onChange={e => props.setTournamentDetails(e.currentTarget.value)} placeholder="Описание турнира" />
                        </FormItem>
                        <FormItem top="Регламент турнира">
                            <Textarea defaultValue={props.tournaments.selected.Reglament} value={props.tournaments.selected.Reglament} placeholder="Регламент турнира" onChange={e => props.setTournamentReglament(e.currentTarget.value)} />
                        </FormItem>
                        {/* <FormItem top="Загрузите ваше фото">
                            <File before={<Icon24Camera />} controlSize="m">
                                Выбрать фото
                            </File>
                        </FormItem> */}
                        <Group header={<Header mode="secondary">Группы</Header>}>
                            {(props.tournaments.selected.TournamentGroups && props.tournaments.selected.TournamentGroups.length > 0) ?
                                <List>
                                    {props.tournaments.selected.TournamentGroups.map((item) => <ListItem KeyId={-1} Delete={() => props.delGroupFromTournament(props.tournaments.selected.Id, item.KeyId)} Name={item.Name}></ListItem>)}
                                </List>
                                :
                                <FormItem>
                                    <InfoRow>Нет групп</InfoRow>
                                </FormItem>
                            }
                        </Group>
                        <FormItem top="Новая группа/лига">
                            <Input type="text" defaultValue={tempGroupName} value={tempGroupName} onChange={e => setTempGroupName(e.currentTarget.value)} placeholder="Название, например, Лига 1" />
                            <CellButton onClick={() => addToTournament(props.tournaments.selected.Id, tempGroupName)} before={<Icon28AddOutline />}>Добавить группу/лигу</CellButton>
                        </FormItem>
                        <FormItem top="Подверждение">
                            <Button onClick={() => props.saveSelectedTournament(props.tournaments.selected, props.myProfile)}>Сохранить</Button>
                            <Button onClick={props.resetTournament} mode="secondary">Отмена</Button>
                        </FormItem>
                    </FormLayout>
                </Group>
            )
        }; break;
        case "edit": {
            return (
                <Group>
                    <Header>Управление турниром</Header>
                    <FormLayout>
                        <FormItem top="Ваш город">
                            <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
                        </FormItem>
                        <FormItem top="Название турнира" bottom="Имя турнира должно быть уникальным">
                            <Input type="text" defaultValue={props.tournaments.selected.Name} onChange={e => props.setTournamentName(e.currentTarget.value)} placeholder="Например, II чемпионат города Истра 2023 года на призы..." />
                        </FormItem>
                        <FormItem top="Дата начала">
                            <DatePicker
                                min={{ day: 1, month: 1, year: currentDate.getFullYear() - 1 }}
                                max={{ day: 1, month: 1, year: currentDate.getFullYear() + 1 }}
                                defaultValue={props.tournaments.selected.WhenBegin}
                                value={props.tournaments.selected.WhenBegin}
                                onDateChange={value => props.setTournamentWhenBegin(value)}
                            />
                        </FormItem>
                        <FormItem top="Дата окончания">
                            <DatePicker
                                min={{ day: 1, month: 1, year: currentDate.getFullYear() - 1 }}
                                max={{ day: 1, month: 1, year: currentDate.getFullYear() + 1 }}
                                defaultValue={props.tournaments.selected.WhenEnd}
                                value={props.tournaments.selected.WhenBegin}
                                onDateChange={value => props.setTournamentWhenEnd(value)}
                            />
                        </FormItem>
                        <FormItem top="Описание турнира">
                            <Textarea defaultValue={props.tournaments.selected.Details} onChange={e => props.setTournamentDetails(e.currentTarget.value)} placeholder="Описание турнира" />
                        </FormItem>
                        <FormItem top="Регламент турнира">
                            <Textarea defaultValue={props.tournaments.selected.Reglament} placeholder="Регламент турнира" onChange={e => props.setTournamentReglament(e.currentTarget.value)} />
                        </FormItem>
                        {/* <FormItem top="Загрузите ваше фото">
                            <File before={<Icon24Camera />} controlSize="m">
                                Выбрать фото
                            </File>
                        </FormItem> */}
                        <Group header={<Header mode="secondary">Группы</Header>}>
                            {(props.tournaments.selected.TournamentGroups && props.tournaments.selected.TournamentGroups.length > 0) ?
                                <List>
                                    {props.tournaments.selected.TournamentGroups.map((item) => <ListItem KeyId={item.KeyId} Delete={() => props.delGroupFromTournament(props.tournaments.selected.Id, item.KeyId)} Name={item.Name}></ListItem>)}
                                </List>
                                :
                                <FormItem>
                                    <InfoRow>Нет групп</InfoRow>
                                </FormItem>
                            }
                        </Group>
                        <FormItem top="Новая группа/лига">
                            <Input type="text" defaultValue={tempGroupName} value={tempGroupName} onChange={e => setTempGroupName(e.currentTarget.value)} placeholder="Например, Лига 1" />
                            <CellButton onClick={() => addToTournament(props.tournaments.selected.Id, tempGroupName)} before={<Icon28AddOutline />}>Добавить группу</CellButton>
                        </FormItem>
                        <FormItem top="Подверждение">
                            <Button onClick={() => props.saveSelectedTournament(props.tournaments.selected, props.myProfile)}>Внести изменения</Button>
                            {/* <Button onClick={props.resetTournament} mode="secondary">Отмена</Button> */}
                        </FormItem>
                    </FormLayout>
                </Group>
            )
        }; break;
    }


}

const mapStateToProps = (state) => {
    return {
        tournaments: state.tournamentsEntity,
        SelectedName: state.tournamentsEntity.selected.Name,
        cities: state.cityEntity.cities,
        myProfile: state.profileEntity.myProfile,
    }
}

export default connect(mapStateToProps, {
    setTournamentWhenBegin, setTournamentWhenEnd, setTournamentName, setTournamentReglament, setTournamentDetails,
    delGroupFromTournament, editGroupInTournament, addGroupToTournament, resetTournament, saveSelectedTournament, 
})(TeamItem)