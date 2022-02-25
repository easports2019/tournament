import React, { useEffect, useState } from 'react'
import {
    RichCell, Avatar, FormLayout, FormItem, Input, InfoRow, Group, DatePicker,
    Textarea, File, CellButton, Button, Header, List, Cell, TabsItem, Tabs, View, Panel,
    ActionSheet, ActionSheetItem, Gallery, Headline, Link, CardGrid, Card, Title, Caption, calcInitialsAvatarColor
} from '@vkontakte/vkui'
import { defaultPhotoPath } from '../../../../store/dataTypes/common'
import {
    setTournamentWhenBegin, setTournamentMode, setTournamentWhenEnd, setTournamentName, setTournamentReglament, 
    setTournamentDetails, delGroupFromTournamentByKeyId, deleteTournamentGroup,
    editGroupInTournament, addTournamentGroup, resetTournament, saveSelectedTournament, getTournamentNewBids, 
    acceptTeamToTournamentBid, declineTeamToTournamentBid,
    getTournamentTeams, getTournamentGroups, replaceTeam, deleteTeam, changeTournamentTeamBidTournamentGroup, 
    deleteTeamFromTournament, setTournamentMatchLength, getTournamentTablesByTournamentId,  setTournamentOrganizatorName, setTournamentLink, setTournamentLink2, 
    setTournamentOrganizatorNameShort, setTournamentLink2Name, 
} from '../../../../store/tournamentsReducer'
import {goToPanel} from '../../../../store/systemReducer'
import {
    getTeamInfo, setTeamMode,
} from '../../../../store/teamsReducer'
import { Icon24Camera, Icon28AddOutline } from '@vkontakte/icons';
import { connect } from 'react-redux';
import ListItem from '../ListItem/ListItem';
import BidListItem from '../ListItem/BidListItem';
import Icon24ChevronRightWithHistory from '../../Common/WithHistory/Icon24ChevronRightWithHistory';
import Shedule from '../../Common/Shedule/Shedule';
import ButtonWithNotify from '../../Common/WithNotify/ButtonWithNotify'

const w7percent = { width: '7%', textAlign: 'center', padding: '5px 0 5px 0' }
const w8percent = { width: '8%', textAlign: 'center', padding: '5px 0 5px 0'  }
const w20percent = { 
    maxWidth: '100%', 
    textAlign: 'left', 
    padding: '5px 0 5px 3px', 
    overflow: 'hidden',
    //whiteSpace: 'nowrap',
    display: "inline-block",
}


const TournamentItem = (props) => {
    let currentDate = new Date();
    let [tempGroupName, setTempGroupName] = useState("");
    let [currentTab, setCurrentTab] = useState(props.Tab ? props.Tab : "info");
    let [activePopout, setActivePopout] = useState(null);
    // let [slideIndex, setSlideIndex] = useState(0);
    // let [isDraggable, setIsDraggable] = useState(true);
    // let [showArrows, setShowArrows] = useState(true);

    

    const CardResultStyle = {
        display: "flex", 
        height: "100px", 
        justifyContent: "center", 
        alignItems: "center",
        overflow: "hidden",
        flexWrap: "wrap",
    }

    const CardStyle = {
        ...CardResultStyle,

        flexWrap: "no-wrap",
        alignSelf: "center",
        alignContent: "center",
    }

    const subCardStyle = {
        ...CardResultStyle,

        height: 'auto',
        flexDirection: "column",
    }

    const centering = {
        textAlign: "center",
    }


    // это надо потом удалить. я вручную задал отображение вкладки расписания при открытии в режиме просмотра (для пользователей)

    useEffect(() => {
        props.getTournamentNewBids(props.tournaments.selected, props.myProfile)
        props.getTournamentGroups(props.tournaments.selected)
        props.getTournamentTablesByTournamentId(props.tournaments.selected.Id)

    }, props.tournaments.selected)

    
    useEffect(() => {
        props.mode == "view" ? setCurrentTab("shedule") : setCurrentTab("info")
    }, props.mode)

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

        props.deleteTeamFromTournament(team, tg, props.myProfile, "Ваша команда удалена из турнира")
    }

    const SelectTournamentGroup = (newGroup, oldGroup, team) => {
        props.changeTournamentTeamBidTournamentGroup(team, newGroup, oldGroup, props.myProfile)
    }


    const SaveTournament = () => {
        //props.resetTournament();
//debugger
        props.saveSelectedTournament(props.tournaments.selected, props.myProfile)
        //props.goToPanel("tournamentadmin", false); // закрываем текущий турнир и выводим все турниры
        props.setTournamentMode("view");
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
                        return (
                            <ActionSheetItem
                                onClick={() => {

                                    SelectTournamentGroup(newTg, oldTg, team)
                                }}
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
                    <CardGrid size="l">
                        {/* <Card style={CardStyle}>
                            <div  style={centering}>

                            </div>
                        </Card> */}
                        <Card style={CardStyle} mode="shadow">
                            <div style={subCardStyle}>
                                <Title level="2" weight="semibold">
                                    {props.tournaments.selected.Name}
                                </Title>
                                <Caption level="3" weight="bold">
                                    <Link target="blank" href={props.tournaments.selected.Link}>{props.tournaments.selected.OrganizatorName}</Link> ({props.tournaments.selected.OrganizatorNameShort})
                                </Caption>
                                {props.tournaments.selected.Link2Name &&
                                    <Caption level="4" weight="regular">
                                        <Link href={props.tournaments.selected.Link2}>{props.tournaments.selected.Link2Name}</Link>
                                    </Caption>
                                }
                            </div>
                            
                        </Card>
                    </CardGrid>
                    <FormItem></FormItem>
                    <View popout={activePopout} activePanel={currentTab}>
                        <Panel id="shedule">
                            <Tabs mode="buttons">
                                <TabsItem onClick={() => setCurrentTab("shedule")}><Title level="3" weight="bold">Матчи</Title></TabsItem>
                                <TabsItem onClick={() => setCurrentTab("tables")}><Title level="3" weight="regular">Таблицы</Title></TabsItem>
                                <TabsItem onClick={() => setCurrentTab("info")}><Title level="3" weight="regular">О турнире</Title></TabsItem>
                            </Tabs>
                            <Group>
                                <Shedule access="user" tournament={props.tournaments.selected} todayIs={new Date()}></Shedule>
                            </Group>
                        </Panel>
                        <Panel id="info">
                            <Group>
                                <Tabs mode="buttons">
                                    <TabsItem onClick={() => setCurrentTab("shedule")}><Title level="3" weight="regular">Матчи</Title></TabsItem>
                                    <TabsItem onClick={() => setCurrentTab("tables")}><Title level="3" weight="regular">Таблицы</Title></TabsItem>
                                    <TabsItem onClick={() => setCurrentTab("info")}><Title level="3" weight="bold">О турнире</Title></TabsItem>
                                </Tabs>
                                <FormItem top="Ваш город">
                                    <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
                                </FormItem>
                                <FormItem top="Организатор">
                                    <InfoRow><Link href={props.tournaments.selected.Link}>{props.tournaments.selected.OrganizatorName}</Link> ({props.tournaments.selected.OrganizatorNameShort})</InfoRow>
                                </FormItem>
                                <FormItem top="Название турнира">
                                    <InfoRow>{props.tournaments.selected.Name}</InfoRow>
                                </FormItem>
                                <FormItem top="Проводится">
                                    <InfoRow>с {new Date(
                                        props.tournaments.selected.WhenBegin.year,
                                        props.tournaments.selected.WhenBegin.month - 1,
                                        props.tournaments.selected.WhenBegin.day).toLocaleDateString()} 
                                        <span> по </span>{new Date(
                                        props.tournaments.selected.WhenEnd.year,
                                        props.tournaments.selected.WhenEnd.month - 1,
                                        props.tournaments.selected.WhenEnd.day).toLocaleDateString()}</InfoRow>
                                </FormItem>
                                <FormItem top="Описание турнира">
                                    <InfoRow>{props.tournaments.selected.Details}</InfoRow>
                                </FormItem>
                                <FormItem top="Регламент турнира">
                                    <InfoRow>{props.tournaments.selected.Reglament}</InfoRow>
                                </FormItem>
                                {props.tournaments.selected.Link2Name &&
                                <FormItem top={props.tournaments.selected.Link2Name}>
                                    <InfoRow><Link href={props.tournaments.selected.Link2}>{props.tournaments.selected.Link2}</Link></InfoRow>
                                </FormItem>
                                }
                                    <FormItem top="Группы/лиги">
                                        <Group>
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
                                    </FormItem>
                                </Group>
                        </Panel>
                        <Panel id="tables">
                            <Group>
                                <Tabs mode="buttons">
                                <TabsItem onClick={() => setCurrentTab("shedule")}><Title level="3" weight="regular">Матчи</Title></TabsItem>
                                <TabsItem onClick={() => setCurrentTab("tables")}><Title level="3" weight="bold">Таблицы</Title></TabsItem>
                                <TabsItem onClick={() => setCurrentTab("info")}><Title level="3" weight="regular">О турнире</Title></TabsItem>
                                </Tabs>
                                {/* <FormItem top="Ваш город">
                                    <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
                                </FormItem> */}
                                <Group>
                                    {(props.tournaments.selected.TournamentGroups && props.tournaments.selected.TournamentGroups.length > 0) ?
                                        
                                            <List>
                                                {props.tournaments.selected.TournamentGroups.map((item) => {
                                                    if (item.Name != "") {
                                                        let table = props.tournaments.selectedTables.filter(tT => tT.TournamentGroupId == item.Id);
                                                        table.sort((firstItem, secondItem) => firstItem.Place - secondItem.Place);
                                                        let chet = false;
                                                        return (
                                                            <>
                                                                <FormItem top={item.Name}>
                                                                    {/* <Headline>{}</Headline> */}
                                                                <table style={{width: '100%'}}>
                                                                    <tr>
                                                                        <th style={w7percent}><Caption weight="bold" level="3">М</Caption></th>
                                                                        <th style={w20percent}><Caption weight="bold" level="3">Команда</Caption></th>
                                                                        <th style={w8percent}><Caption weight="bold" level="3">И</Caption></th>
                                                                        <th style={w8percent}><Caption weight="bold" level="3">В</Caption></th>
                                                                        <th style={w8percent}><Caption weight="bold" level="3">П</Caption></th>
                                                                        <th style={w8percent}><Caption weight="bold" level="3">Н</Caption></th>
                                                                        <th style={w8percent}><Caption weight="bold" level="3">МЗ</Caption></th>
                                                                        <th style={w8percent}><Caption weight="bold" level="3">МП</Caption></th>
                                                                        <th style={w8percent}><Caption weight="bold" level="3">МР</Caption></th>
                                                                        <th style={w8percent}><Caption weight="bold" level="3">О</Caption></th>
                                                                    </tr>
                                                                    {
                                                                        table.map((row) => {
                                                                            chet = !chet;
                                                                            return (
                                                                                <tr style={chet ? {backgroundColor: 'lightgray', color: 'black'} : {backgroundColor: 'white', color: 'black'}}>
                                                                                    <td style={w7percent}><Caption weight="regular" level="1">{row.Place}</Caption></td>
                                                                                    <td style={w20percent}>
                                                                                        <Caption weight="regular" level="3">
                                                                                        {row.TeamName}
                                                                                        </Caption>
                                                                                    </td>
                                                                                    <td style={w8percent}><Caption weight="regular" level="1">{row.Games}</Caption></td>
                                                                                    <td style={w8percent}><Caption weight="regular" level="1">{row.Wins}</Caption></td>
                                                                                    <td style={w8percent}><Caption weight="regular" level="1">{row.Loses}</Caption></td>
                                                                                    <td style={w8percent}><Caption weight="regular" level="1">{row.Draws}</Caption></td>
                                                                                    <td style={w8percent}><Caption weight="regular" level="1">{row.GoalsScored}</Caption></td>
                                                                                    <td style={w8percent}><Caption weight="regular" level="1">{row.GoalsMissed}</Caption></td>
                                                                                    <td style={w8percent}><Caption weight="regular" level="1">{row.GoalsDifference}</Caption></td>
                                                                                    <td style={w8percent}><Caption weight="regular" level="1">{row.Points}</Caption></td>
                                                                                </tr>
                                                                            )

                                                                        }

                                                                        )}
                                                                </table>
                                                                <br />
                                                                <br />
                                                                </FormItem>
                                                            </>

                                                        )
                                                    }
                                                    else
                                                        return null;
                                                })
                                                }
                                            </List>
                                        
                                        :
                                        <FormItem>
                                            <InfoRow>Нет групп</InfoRow>
                                        </FormItem>
                                    }
                                </Group>
                            </Group>
                        </Panel>

                    </View>
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
                        <FormItem top="Название организатора">
                            <Input type="text" defaultValue={props.tournaments.selected.OrganizatorName} value={props.tournaments.selected.OrganizatorName} onChange={e => props.setTournamentOrganizatorName(e.currentTarget.value)} placeholder="Например, Федерация..." />
                        </FormItem>
                        <FormItem top="Сокращенное название организатора">
                            <Input type="text" defaultValue={props.tournaments.selected.OrganizatorNameShort} 
                            value={props.tournaments.selected.OrganizatorNameShort} 
                            onChange={e => props.setTournamentOrganizatorNameShort(e.currentTarget.value)} 
                            placeholder="Например, ФФК" />
                        </FormItem>
                        <FormItem top="Ссылка на ресурс организатора">
                            <Input type="text" defaultValue={props.tournaments.selected.Link} value={props.tournaments.selected.Link} onChange={e => props.setTournamentLink(e.currentTarget.value)} placeholder="Например, yandex.ru" />
                        </FormItem>
                        <FormItem top="Дополнительная ссылка">
                            <Input type="text" defaultValue={props.tournaments.selected.Link2} value={props.tournaments.selected.Link2} onChange={e => props.setTournamentLink2(e.currentTarget.value)} placeholder="Например, info@mail.ru" />
                        </FormItem>
                        <FormItem top="Название дополнительной ссылки">
                            <Input type="text" defaultValue={props.tournaments.selected.Link2Name} 
                            value={props.tournaments.selected.Link2Name} 
                            onChange={e => props.setTournamentLink2Name(e.currentTarget.value)} 
                            placeholder="Например, email" />
                        </FormItem>
                        <FormItem top="Дата начала">
                            <DatePicker
                                min={{ day: 1, month: 1, year: currentDate.getFullYear() - 1 }}
                                max={{ day: 1, month: 1, year: currentDate.getFullYear() + 1 }}
                                defaultValue={props.tournaments.selected.WhenBegin}
                                //value={props.tournaments.selected.WhenBegin}
                                onDateChange={value => props.setTournamentWhenBegin(value)}
                            />
                        </FormItem>
                        <FormItem top="Дата окончания">
                            <DatePicker
                                min={{ day: 1, month: 1, year: currentDate.getFullYear() - 1 }}
                                max={{ day: 1, month: 1, year: currentDate.getFullYear() + 1 }}
                                defaultValue={props.tournaments.selected.WhenEnd}
                                //value={props.tournaments.selected.WhenEnd}
                                onDateChange={value => props.setTournamentWhenEnd(value)}
                            />
                        </FormItem>
                        <FormItem top="Описание турнира">
                            <Textarea defaultValue={props.tournaments.selected.Details} value={props.tournaments.selected.Details} onChange={e => props.setTournamentDetails(e.currentTarget.value)} placeholder="Описание турнира" />
                        </FormItem>
                        <FormItem top="Регламент турнира">
                            <Textarea defaultValue={props.tournaments.selected.Reglament} value={props.tournaments.selected.Reglament} placeholder="Регламент турнира" onChange={e => props.setTournamentReglament(e.currentTarget.value)} />
                        </FormItem>
                        <FormItem top="Длительность матча, минут">
                            <Input type="Number"
                                defaultValue={props.tournaments.selected.MatchLength}
                                value={props.tournaments.selected.MatchLength}
                                placeholder="60"
                                onChange={e => props.setTournamentMatchLength(e.currentTarget.value)}
                            ></Input>
                        </FormItem>
                        {/* <FormItem top="Загрузите ваше фото">
                            <File before={<Icon24Camera />} controlSize="m">
                                Выбрать фото
                            </File>
                        </FormItem> */}
                        
                        <FormItem top="Подверждение">
                            <ButtonWithNotify Message="Создать новый турнир?" Yes={SaveTournament}>Создать</ButtonWithNotify>
                            <ButtonWithNotify Message="Не создавать турнир?" Yes={props.resetTournament} mode="secondary">Отмена</ButtonWithNotify>
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
                                <TabsItem onClick={() => setCurrentTab("shedule")}>Расписание</TabsItem>
                            </Tabs>
                            <FormLayout>
                                <FormItem top="Ваш город">
                                    <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
                                </FormItem>
                                <FormItem top="Название турнира">
                                    <Input type="text" defaultValue={props.tournaments.selected.Name} onChange={e => props.setTournamentName(e.currentTarget.value)} placeholder="Например, II чемпионат города Истра 2023 года на призы..." />
                                </FormItem>
                                <FormItem top="Название организатора">
                                    <Input type="text" defaultValue={props.tournaments.selected.OrganizatorName} onChange={e => props.setTournamentOrganizatorName(e.currentTarget.value)} placeholder="Например, Федерация..." />
                                </FormItem>
                                <FormItem top="Сокращенное название организатора">
                                    <Input type="text" defaultValue={props.tournaments.selected.OrganizatorNameShort} 
                                    value={props.tournaments.selected.OrganizatorNameShort} 
                                    onChange={e => props.setTournamentOrganizatorNameShort(e.currentTarget.value)} 
                                    placeholder="Например, ФФК" />
                                </FormItem>
                                <FormItem top="Ссылка на ресурс организатора">
                                    <Input type="text" defaultValue={props.tournaments.selected.Link} onChange={e => props.setTournamentLink(e.currentTarget.value)} placeholder="Например, yandex.ru" />
                                </FormItem>
                                <FormItem top="Дополнительная ссылка">
                                    <Input type="text" defaultValue={props.tournaments.selected.Link2} onChange={e => props.setTournamentLink2(e.currentTarget.value)} placeholder="Например, info@mail.ru" />
                                </FormItem>
                                <FormItem top="Название дополнительной ссылки">
                                    <Input type="text" defaultValue={props.tournaments.selected.Link2Name} 
                                    onChange={e => props.setTournamentLink2Name(e.currentTarget.value)} 
                                    placeholder="Например, email" />
                                </FormItem>
                                <FormItem top="Дата начала">
                                    <DatePicker
                                        min={{ day: 1, month: 1, year: currentDate.getFullYear() - 1 }}
                                        max={{ day: 1, month: 1, year: currentDate.getFullYear() + 1 }}
                                        defaultValue={props.tournaments.selected.WhenBegin}
                                        //value={props.tournaments.selected.WhenBegin}
                                        onDateChange={(value) => props.setTournamentWhenBegin(value)}
                                        //dayPlaceholder="ДД"
                                        //monthPlaceholder="ММММ"
                                        //yearPlaceholder="ГГГГ"
                                    />
                                </FormItem>
                                <FormItem top="Дата окончания">
                                    <DatePicker
                                        min={{ day: 1, month: 1, year: currentDate.getFullYear() - 1 }}
                                        max={{ day: 1, month: 1, year: currentDate.getFullYear() + 1 }}
                                        defaultValue={props.tournaments.selected.WhenEnd}
                                        //value={props.tournaments.selected.WhenBegin}
                                        onDateChange={value => props.setTournamentWhenEnd(value)}
                                    />
                                </FormItem>
                                <FormItem top="Описание турнира">
                                    <Textarea defaultValue={props.tournaments.selected.Details} onChange={e => props.setTournamentDetails(e.currentTarget.value)} placeholder="Описание турнира" />
                                </FormItem>
                                <FormItem top="Регламент турнира">
                                    <Textarea defaultValue={props.tournaments.selected.Reglament} placeholder="Регламент турнира" onChange={e => props.setTournamentReglament(e.currentTarget.value)} />
                                </FormItem>
                                <FormItem top="Длительность матча, минут">
                                    <Input type="Number"
                                        defaultValue={props.tournaments.selected.MatchLength}
                                        value={props.tournaments.selected.MatchLength}
                                        placeholder="60"
                                        onChange={e => props.setTournamentMatchLength(e.currentTarget.value)}
                                    ></Input>
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
                                    <ButtonWithNotify Message="Внести изменения в турнир?" Yes={() => props.saveSelectedTournament(props.tournaments.selected, props.myProfile)}>Внести изменения</ButtonWithNotify>
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
                            <TabsItem onClick={() => setCurrentTab("shedule")}>Расписание</TabsItem>
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
                            <TabsItem onClick={() => setCurrentTab("shedule")}>Расписание</TabsItem>
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
                                                                        <ButtonWithNotify  Message="Удалить команду из турнира?" Yes={() => DeleteTeam(team, tg)} mode="destructive">Удалить</ButtonWithNotify>
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
                    <Panel id="shedule">
                        <Header>Расписание</Header>
                        <Tabs mode="buttons">
                            <TabsItem onClick={() => setCurrentTab("info")}>Основное</TabsItem>
                            <TabsItem onClick={() => setCurrentTab("bids")}>Заявки</TabsItem>
                            <TabsItem onClick={() => setCurrentTab("teams")}>Команды</TabsItem>
                            <TabsItem onClick={() => setCurrentTab("shedule")}>Расписание</TabsItem>
                        </Tabs>
                        <FormLayout>
                            <FormItem top="Ваш город">
                                <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
                            </FormItem>
                            <Group header={<Header mode="secondary">Матчи</Header>}>
                                <Shedule access="admin" tournament={props.tournaments.selected} todayIs={new Date()}></Shedule>
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
        TournamentTables: state.tournamentsEntity.selectedTables,
        cities: state.cityEntity.cities,
        myProfile: state.profileEntity.myProfile,
    }
}

export default connect(mapStateToProps, {setTournamentMode, goToPanel, setTournamentOrganizatorName, setTournamentLink, setTournamentLink2, 
    setTournamentOrganizatorNameShort, setTournamentLink2Name, 
    getTournamentTeams, getTournamentGroups, replaceTeam, deleteTeam, getTeamInfo, setTeamMode, changeTournamentTeamBidTournamentGroup, deleteTeamFromTournament, setTournamentMatchLength,
    setTournamentWhenBegin, setTournamentWhenEnd, setTournamentName, setTournamentReglament, setTournamentDetails, acceptTeamToTournamentBid, declineTeamToTournamentBid,
    delGroupFromTournamentByKeyId, deleteTournamentGroup, editGroupInTournament, addTournamentGroup, resetTournament, saveSelectedTournament, getTournamentNewBids, getTournamentTablesByTournamentId,
})(TournamentItem)