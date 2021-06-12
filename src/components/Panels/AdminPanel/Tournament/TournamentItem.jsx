import React, { useEffect, useState } from 'react'
import { RichCell, Avatar, FormLayout, FormItem, Input, InfoRow, Group, DatePicker, 
    Textarea, File, CellButton, Button, Header, List, Cell, TabsItem, Tabs, View, Panel, 
    ActionSheet, ActionSheetItem, Gallery } from '@vkontakte/vkui'
import { defaultPhotoPath } from '../../../../store/dataTypes/common'
import {
    setTournamentWhenBegin, setTournamentWhenEnd, setTournamentName, setTournamentReglament, setTournamentDetails, delGroupFromTournamentByKeyId, deleteTournamentGroup,
    editGroupInTournament, addTournamentGroup, resetTournament, saveSelectedTournament, getTournamentNewBids, acceptTeamToTournamentBid, declineTeamToTournamentBid,
    getTournamentTeams, getTournamentGroups,  replaceTeam, deleteTeam, changeTournamentTeamBidTournamentGroup, deleteTeamFromTournament, 
} from '../../../../store/tournamentsReducer'
import {
    getTeamInfo, setTeamMode, 
} from '../../../../store/teamsReducer'
import { Icon24Camera, Icon28AddOutline } from '@vkontakte/icons';
import { connect } from 'react-redux';
import ListItem from '../ListItem/ListItem';
import BidListItem from '../ListItem/BidListItem';
import Icon24ChevronRightWithHistory from '../../Common/WithHistory/Icon24ChevronRightWithHistory';




const TournamentItem = (props) => {
    let currentDate = new Date();
    let [tempGroupName, setTempGroupName] = useState("");
    let [currentTab, setCurrentTab] = useState("info");
    let [activePopout, setActivePopout] = useState(null);
    // let [slideIndex, setSlideIndex] = useState(0);
    // let [isDraggable, setIsDraggable] = useState(true);
    // let [showArrows, setShowArrows] = useState(true);

    

    useEffect(() => {
        props.getTournamentNewBids(props.tournaments.selected, props.myProfile)
        props.getTournamentGroups(props.tournaments.selected)
        
    }, props.tournaments.selected)

    useEffect(() => {
        props.getTournamentTeams(props.tournaments.selected, props.myProfile)
    }, props.tournaments.selected.TournamentGroups)

    const addToTournament = () => {
        
        if (tempGroupName.trim() != "") {
            //addGroupToTournament
            props.addTournamentGroup(props.tournaments.selected, props.myProfile, { Id: -1, Name: tempGroupName });
            setTempGroupName("");
        }
    }

    const DelGroupFromTournament = (keyId, groupId) => {
        //props.tournaments.selected.Id, item.KeyId, item.Id
        
        if (groupId < 0)
            props.delGroupFromTournamentByKeyId(props.tournaments.selected.Id, keyId); // (эту можно удалить пока локально без сервера)
        else
            props.deleteTournamentGroup(props.tournaments.selected, props.myProfile, groupId); // это летит на сервер, т.к. оно уже записано в БД (существующий турнир)
    }
    
    const AcceptBid = (item) => {
        props.acceptTeamToTournamentBid(item, props.tournaments.selected, props.myProfile)
        
    }

    const DeclineBid = (item, text) => {
        props.declineTeamToTournamentBid(item, props.tournaments.selected, props.myProfile, text);
        
    }

    const CellClick = (item) => {
        
        props.getTeamInfo(item);
        props.setTeamMode("view");
    }

    // удаление команды из турнира
    const DeleteTeam = (team, tg) => {
        
        props.deleteTeamFromTournament(team, tg, props.myProfile,"Ваша команда удалена из турнира")
    }

    const SelectTournamentGroup = (newGroup, oldGroup, team) => {
        props.changeTournamentTeamBidTournamentGroup(team, newGroup, oldGroup, props.myProfile)
    }
    
    
    const SetPopup = (team, oldTg) => {
        
        setActivePopout(
        <ActionSheet 
            onClose={() => setActivePopout(null)}
            iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
            //toggleRef={this.baseTargetRef.current}
          >
            {
                props.tournaments.selected.TournamentGroups.map(newTg => {
                    return(
                        <ActionSheetItem 
                            onClick={() => {
                                
                                SelectTournamentGroup(newTg, oldTg, team)}}
                            autoclose
                        >
                            {newTg.Name}
                        </ActionSheetItem>
                    )
                })
            }
            <ActionSheetItem autoclose>Отмена</ActionSheetItem>
          </ActionSheet>)
        
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
                        <FormItem top="Название турнира">
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
                        {/* <Group header={<Header mode="secondary">Группы</Header>}>
                            {(props.tournaments.selected.TournamentGroups && props.tournaments.selected.TournamentGroups.length > 0) ?
                                <List>
                                    {props.tournaments.selected.TournamentGroups.map((item) => <ListItem KeyId={-1} Delete={() => DelGroupFromTournament(item.KeyId, item.Id)} Name={item.Name}></ListItem>)}
                                </List>
                                :
                                <FormItem>
                                    <InfoRow>Нет групп</InfoRow>
                                </FormItem>
                            }
                        </Group>
                        <FormItem top="Новая группа/лига">
                            <Input type="text" defaultValue={tempGroupName} value={tempGroupName} onChange={e => setTempGroupName(e.currentTarget.value)} placeholder="Название, например, Лига 1" />
                            <CellButton onClick={addToTournament} before={<Icon28AddOutline />}>Добавить группу/лигу</CellButton>
                        </FormItem> */}
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
                <View popout={activePopout} activePanel={currentTab}>
                    <Panel id="info">
                        <Group>
                            <Header>Управление турниром</Header>
                            <Tabs mode="buttons">
                                <TabsItem onClick={() => setCurrentTab("info")}>Основное</TabsItem>
                                <TabsItem onClick={() => setCurrentTab("bids")}>Заявки</TabsItem>
                                <TabsItem onClick={() => setCurrentTab("teams")}>Команды</TabsItem>
                            </Tabs>
                            <FormLayout>
                                <FormItem top="Ваш город">
                                    <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
                                </FormItem>
                                <FormItem top="Название турнира">
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
                                            {props.tournaments.selected.TournamentGroups.map((item) => <ListItem KeyId={item.KeyId} Delete={() => DelGroupFromTournament(item.KeyId, item.Id)} Name={item.Name}></ListItem>)}
                                        </List>
                                        :
                                        <FormItem>
                                            <InfoRow>Нет групп</InfoRow>
                                        </FormItem>
                                    }
                                </Group>
                                <FormItem top="Новая группа/лига">
                                    <Input type="text" defaultValue={tempGroupName} value={tempGroupName} onChange={e => setTempGroupName(e.currentTarget.value)} placeholder="Например, Лига 1" />
                                    <CellButton onClick={addToTournament} before={<Icon28AddOutline />}>Добавить группу</CellButton>
                                </FormItem>
                                <FormItem top="Подверждение">
                                    <Button onClick={() => props.saveSelectedTournament(props.tournaments.selected, props.myProfile)}>Внести изменения</Button>
                                    {/* <Button onClick={props.resetTournament} mode="secondary">Отмена</Button> */}
                                </FormItem>
                            </FormLayout>
                        </Group>
                    </Panel>
                    <Panel id="bids">
                        <Header>Заявки от команд</Header>
                        <Tabs mode="buttons">
                            <TabsItem onClick={() => setCurrentTab("info")}>Основное</TabsItem>
                            <TabsItem onClick={() => setCurrentTab("bids")}>Заявки</TabsItem>
                            <TabsItem onClick={() => setCurrentTab("teams")}>Команды</TabsItem>
                        </Tabs>
                        <FormLayout>
                            <FormItem top="Ваш город">
                                <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
                            </FormItem>
                            <Group header={<Header mode="secondary">Заявки</Header>}>
                                {(props.tournaments.bidsNew && props.tournaments.bidsNew.length > 0) ?
                                    <List>
                                        {props.tournaments.bidsNew.map((item) => 
                                        <BidListItem
                                            KeyId={item.KeyId} 
                                            Accept={AcceptBid}
                                            Decline={DeclineBid}
                                            Item={item}
                                            >

                                        </BidListItem>)}
                                    </List>
                                    :
                                    <FormItem>
                                        <InfoRow>Нет новых заявок</InfoRow>
                                    </FormItem>
                                }
                            </Group>
                        </FormLayout>
                    </Panel>
                    <Panel id="teams">
                        <Header>Команды по группам</Header>
                        <Tabs mode="buttons">
                            <TabsItem onClick={() => setCurrentTab("info")}>Основное</TabsItem>
                            <TabsItem onClick={() => setCurrentTab("bids")}>Заявки</TabsItem>
                            <TabsItem onClick={() => setCurrentTab("teams")}>Команды</TabsItem>
                        </Tabs>
                        <FormLayout>
                            <FormItem top="Ваш город">
                                <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
                            </FormItem>
                            <Group header={<Header mode="secondary">Группы</Header>}>
                                {props.tournaments.selected.TournamentGroups.map(tg => {
                                    
                                    return (
                                        <Group header={<Header>{tg.Name}</Header>}>
                                        <List>
                                            {
                                                tg.Teams.map(team => {
                                                    
                                                    return (
                                                        <RichCell
                                                            caption={team.Details}
                                                            after={<Icon24ChevronRightWithHistory
                                                                handleClick={() => CellClick(team)} 
                                                                toMenuName="teamitem" 
                                                                data-story="teamitem"
                                                            ></Icon24ChevronRightWithHistory>
                                                                }
                                                            actions={
                                                                <>
                                                                    <Button onClick={() => SetPopup(team, tg)} mode="primary">Переместить</Button>
                                                                    <Button onClick={() => DeleteTeam(team, tg)} mode="destructive">Удалить</Button>
                                                                </>
                                                            }
                                                        >{team.Name}</RichCell>
                                                    )
                                                })
                                            }
                                        </List>
                                   </Group>)

                                })}

                                {/* {(props.tournaments.bidsNew && props.tournaments.bidsNew.length > 0) ?
                                    <List>
                                        {props.tournaments.bidsNew.map((item) => 
                                        <BidListItem
                                            KeyId={item.KeyId} 
                                            Accept={AcceptBid}
                                            Decline={DeclineBid}
                                            Item={item}
                                            >

                                        </BidListItem>)}
                                    </List>
                                    :
                                    <FormItem>
                                        <InfoRow>Нет новых заявок</InfoRow>
                                    </FormItem>
                                } */}
                            </Group>
                        </FormLayout>
                    </Panel>
                </View>
                // <Tabs>
                //     <TabsItem>

                //     </TabsItem>
                // </Tabs>

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
    getTournamentTeams, getTournamentGroups, replaceTeam, deleteTeam, getTeamInfo, setTeamMode, changeTournamentTeamBidTournamentGroup, deleteTeamFromTournament,
    setTournamentWhenBegin, setTournamentWhenEnd, setTournamentName, setTournamentReglament, setTournamentDetails, acceptTeamToTournamentBid, declineTeamToTournamentBid, 
    delGroupFromTournamentByKeyId, deleteTournamentGroup, editGroupInTournament, addTournamentGroup, resetTournament, saveSelectedTournament, getTournamentNewBids, 
})(TournamentItem)