import React, { useState, useEffect } from 'react'
import { RichCell, Avatar, FormLayout, FormItem, Input, InfoRow, Group, DatePicker, Textarea, File, CellButton, Button, Header, List, Cell, Select } from '@vkontakte/vkui'
import { defaultPhotoPath } from './../../../../../store/dataTypes/common'
import { Icon24Camera, Icon28AddOutline } from '@vkontakte/icons';
import { connect } from 'react-redux';
import { dateToString, dateTimeToTimeString } from './../../../../../utils/convertors/dateUtils';
import { DeleteMemberFromCollect } from './../../../../../store/collectReducer';
import { Checkbox } from '@vkontakte/vkui/dist/components/Checkbox/Checkbox';





const SimpleCollectItem = (props) => {
    let currentDate = new Date();
    let [acceptBeMember, setAcceptBeMember] = useState(false)
    let [showPanelBeMember, setShowPanelBeMember] = useState(false)
    let [showCancelMemberForm, setShowCancelMemberForm] = useState(false)
    let [cancelReason, setCancelReason] = useState("")
    
    let [youAreMember, setYouAreMember] = useState((props.collect.selected.Members && props.collect.selected.Members.length > 0)
        ?
        props.collect.selected.Members.filter(m => m.UserProfileId == props.myProfile.UserProfileId).length > 0
        :
        false);
    //let Places = props.Places;

    const collectDate = new Date(props.collect.selected.When
        // props.collect.selected.When.year,
        // props.collect.selected.When.month-1,
        // props.collect.selected.When.day
    );

    const CancelMember = () => {
        props.DeleteMemberFromCollect(props.myProfile.UserProfileId, props.collect.selected.Id, cancelReason);
        setAcceptBeMember(false);
        setShowPanelBeMember(false);
        setShowCancelMemberForm(false);
        setCancelReason("");
        setYouAreMember(false);
    }

    const AcceptRights = () => {
        setAcceptBeMember(!acceptBeMember);
    }


    switch (props.Mode) {
        case "view": {
            return (
                <>
                    <FormItem top="Ваш город">
                        <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
                    </FormItem>
                    <FormItem top="Место">
                        <RichCell caption={props.collect.selected.Place.Address}>{props.collect.selected.Place.Name}</RichCell>
                    </FormItem>
                    <FormItem top="Дата и время">
                        <InfoRow>{dateToString(props.collect.selected.When)} в {dateTimeToTimeString(props.collect.selected.When)}</InfoRow>
                    </FormItem>
                    <FormItem top="Информация">
                        <InfoRow>{props.collect.selected.Details}</InfoRow>
                    </FormItem>
                    <FormItem top="Сколько человек нужно">
                        <InfoRow>{props.collect.selected.NeedMembers}
                            {(props.collect.selected.Members && props.collect.selected.Members.length > 0) &&
                                ` (нужно еще ${props.collect.selected.NeedMembers - props.collect.selected.Members.length} чел.)`
                            }
                        </InfoRow>

                    </FormItem>
                    <FormItem top="Стоимость на 1 человека">
                        <InfoRow>{props.collect.selected.Cost}</InfoRow>
                    </FormItem>
                    <Group header={<Header mode="secondary">Участники</Header>}>
                        {(props.collect.selected.Members && props.collect.selected.Members.length > 0) ?
                            <FormItem>
                                <List>
                                    {props.collect.selected.Members.map((item) => <InfoRow>{item.UserProfile.Name} {item.UserProfile.Surname} {item.UserProfileId == props.collect.selected.Creator.UserProfileId && " (Организатор)"}</InfoRow>)}
                                </List>
                            </FormItem>
                            :
                            <FormItem>
                                <InfoRow>Пока нет участников. Стань первым.</InfoRow>
                            </FormItem>
                        }
                    </Group>
                    {
                        (!youAreMember) ?
                            (
                                (new Date(props.collect.selected.When) > new Date()) ?
                                    (
                                        (!showPanelBeMember) ?
                                            <FormItem top="Участие">
                                                <CellButton onClick={() => setShowPanelBeMember(!showPanelBeMember)}>Стать участником</CellButton>
                                            </FormItem>
                                            :
                                            <FormItem top="Стать участником">
                                                {(acceptBeMember) &&
                                                    <CellButton>Зарегистрироваться на сбор</CellButton>
                                                }
                                                <Checkbox checked={acceptBeMember} onChange={AcceptRights}>
                                                    {`Подтверждаю, что готов прибыть на сбор в ${props.collect.selected.Place.Name} в 
                                ${dateToString(props.collect.selected.When)} к ${dateTimeToTimeString(props.collect.selected.When)}
                                и оплатить взнос в размере ${props.collect.selected.Cost} рублей`}
                                                </Checkbox>
                                            </FormItem>
                                    )
                                    :
                                    <FormItem top="Участие">
                                        <InfoRow>Регистрация закончена</InfoRow>
                                    </FormItem>
                            )
                            :
                            <FormItem top="Участие">
                                {(new Date(props.collect.selected.When) > new Date()) ? 
                                <>
                                    <InfoRow>Вы подтвердили участвуете в сборе</InfoRow>
                                    {(!showCancelMemberForm) ? 
                                        <RichCell actions={<Button mode="destructive" onClick={() => setShowCancelMemberForm(true)}>Отказаться от участия</Button>}></RichCell>
                                        :
                                        <Group>
                                            <FormItem>
                                                <b>Вы хотите отказаться от участия? Укажите причину отказа</b>
                                            </FormItem>
                                            <FormItem>
                                                <Input type="text" value={cancelReason} onChange={(e) => setCancelReason(e.currentTarget.value)} defaultValue="" />
                                            </FormItem>
                                            <FormItem>
                                                <Button onClick={() => setShowCancelMemberForm(false)}>Не отказываться</Button>
                                                {cancelReason.length > 4 && <Button onClick={CancelMember} mode="destructive">Отказаться</Button>}
                                            </FormItem>
                                        </Group>
                                    }
                                </>
                                :
                                <InfoRow>Вы участвовали в сборе</InfoRow>
                            }
                            </FormItem>
                    }
                </>
            )
        }; break;
        case "add": {
            return (
                <>
                    <FormItem top="Ваш город">
                        <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
                    </FormItem>
                    <FormItem top="Место">
                        {/* <Select
                        placeholder="Не выбран" 
                        options={getRandomUsers(10).map(user => ({ label: user.name, value: user.id, avatar: user.photo_100 }))}
                        renderOption={({ option, ...restProps }) => (
                          <CustomSelectOption {...restProps} before={<Avatar size={24} src={option.avatar} />} />
                        )}
                        /> */}
                        <RichCell caption={props.collect.selected.Place.Address}>{props.collect.selected.Place.Name}</RichCell>
                    </FormItem>
                    <FormItem top="Дата и время">
                        <InfoRow>{dateToString(props.collect.selected.When)} в {dateTimeToTimeString(props.collect.selected.When)}</InfoRow>
                    </FormItem>
                    <FormItem top="Информация">
                        <InfoRow>{props.collect.selected.Details}</InfoRow>
                    </FormItem>
                    <FormItem top="Сколько человек нужно">
                        <InfoRow>{props.collect.selected.NeedMembers}
                            {(props.collect.selected.Members && props.collect.selected.Members.length > 0) &&
                                ` (нужно еще ${props.collect.selected.NeedMembers - props.collect.selected.Members.length} чел.)`
                            }
                        </InfoRow>

                    </FormItem>
                    <FormItem top="Стоимость на 1 человека">
                        <InfoRow>{props.collect.selected.Cost}</InfoRow>
                    </FormItem>
                    <Group header={<Header mode="secondary">Участники</Header>}>
                        {(props.collect.selected.Members && props.collect.selected.Members.length > 0) ?
                            <FormItem>
                                <List>
                                    {props.collect.selected.Members.map((item) => <InfoRow>{item.UserProfile.Name} {item.UserProfile.Surname} {item.UserProfileId == props.collect.selected.Creator.UserProfileId && " (Организатор)"}</InfoRow>)}
                                </List>
                            </FormItem>
                            :
                            <FormItem>
                                <InfoRow>Пока нет участников. Стань первым.</InfoRow>
                            </FormItem>
                        }
                    </Group>
                    {
                        (!youAreMember) ?
                            (
                                (new Date(props.collect.selected.When) > new Date()) ?
                                    (
                                        (!showPanelBeMember) ?
                                            <FormItem top="Участие">
                                                <CellButton onClick={() => setShowPanelBeMember(!showPanelBeMember)}>Стать участником</CellButton>
                                            </FormItem>
                                            :
                                            <FormItem top="Стать участником">
                                                {(acceptBeMember) &&
                                                    <CellButton>Зарегистрироваться на сбор</CellButton>
                                                }
                                                <Checkbox checked={acceptBeMember} onChange={AcceptRights}>
                                                    {`Подтверждаю, что готов прибыть на сбор в ${props.collect.selected.Place.Name} в 
                                ${dateToString(props.collect.selected.When)} к ${dateTimeToTimeString(props.collect.selected.When)}
                                и оплатить взнос в размере ${props.collect.selected.Cost} рублей`}
                                                </Checkbox>
                                            </FormItem>
                                    )
                                    :
                                    <FormItem top="Участие">
                                        <InfoRow>Регистрация закончена</InfoRow>
                                    </FormItem>
                            )
                            :
                            <FormItem top="Участие">
                                {(new Date(props.collect.selected.When) > new Date()) ? 
                                <>
                                    <InfoRow>Вы подтвердили участвуете в сборе</InfoRow>
                                    {(!showCancelMemberForm) ? 
                                        <RichCell actions={<Button mode="destructive" onClick={() => setShowCancelMemberForm(true)}>Отказаться от участия</Button>}></RichCell>
                                        :
                                        <Group>
                                            <FormItem>
                                                <b>Вы хотите отказаться от участия? Укажите причину отказа</b>
                                            </FormItem>
                                            <FormItem>
                                                <Input type="text" value={cancelReason} onChange={(e) => setCancelReason(e.currentTarget.value)} defaultValue="" />
                                            </FormItem>
                                            <FormItem>
                                                <Button onClick={() => setShowCancelMemberForm(false)}>Не отказываться</Button>
                                                {cancelReason.length > 4 && <Button onClick={CancelMember} mode="destructive">Отказаться</Button>}
                                            </FormItem>
                                        </Group>
                                    }
                                </>
                                :
                                <InfoRow>Вы участвовали в сборе</InfoRow>
                            }
                            </FormItem>
                    }
                </>
            )
        }; break;
        // case "edit": {
        //     return (
        //         <Group>
        //             <Header>Управление командой</Header>
        //             <FormLayout>
        //                 <FormItem top="Ваш город">
        //                     <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
        //                 </FormItem>
        //                 <FormItem top="Название команды">
        //                     <Input type="text" defaultValue={props.teams.selected.Name} value={props.teams.selected.Name} onChange={e => props.setTeamName(e.currentTarget.value)} placeholder="Например, Ривер Плейт" />
        //                 </FormItem>
        //                 <FormItem top="Дата основания">
        //                     <DatePicker
        //                         min={{ day: 1, month: 1, year: currentDate.getFullYear() - 50 }}
        //                         max={{ day: 1, month: 1, year: currentDate.getFullYear() }}
        //                         defaultValue={props.teams.selected.WhenBorn}
        //                         value={props.teams.selected.WhenBorn}
        //                         onDateChange={value => props.setTeamWhenBorn(value)}
        //                     />
        //                 </FormItem>
        //                 <FormItem top="Описание команды">
        //                     <Textarea defaultValue={props.teams.selected.Details} value={props.teams.selected.Details} onChange={e => props.setTeamDetails(e.currentTarget.value)} placeholder="Описание команды" />
        //                 </FormItem>
        //                 {/* <FormItem top="Загрузите ваше фото">
        //                     <File before={<Icon24Camera />} controlSize="m">
        //                         Выбрать фото
        //                     </File>
        //                 </FormItem> */}
        //                 {/* <Group header={<Header mode="secondary">Группы</Header>}>
        //                     {(props.tournaments.selected.TournamentGroups && props.tournaments.selected.TournamentGroups.length > 0) ?
        //                         <List>
        //                             {props.tournaments.selected.TournamentGroups.map((item) => <ListItem KeyId={-1} Delete={() => props.delGroupFromTournament(props.tournaments.selected.Id, item.KeyId)} Name={item.Name}></ListItem>)}
        //                         </List>
        //                         :
        //                         <FormItem>
        //                             <InfoRow>Нет групп</InfoRow>
        //                         </FormItem>
        //                     }
        //                 </Group> */}
        //                 {/* <FormItem top="Новая группа/лига">
        //                     <Input type="text" defaultValue={tempGroupName} value={tempGroupName} onChange={e => setTempGroupName(e.currentTarget.value)} placeholder="Название, например, Лига 1" />
        //                     <CellButton onClick={() => addToTournament(props.tournaments.selected.Id, tempGroupName)} before={<Icon28AddOutline />}>Добавить группу/лигу</CellButton>
        //                 </FormItem> */}
        //                 <FormItem top="Заявки на турнир">
        //                     <BidTeamAdminPanel></BidTeamAdminPanel>
        //                 </FormItem>
        //                 <FormItem top="Куда можно заявиться">
        //                     {props.tournamentsForBids.selectMode == "tournaments" ?
        //                         <BidTeamTournamentList
        //                             CellClick={SelectTournament}
        //                             // Button1Handle = {MakeBid}
        //                             // Button2Handle = {CancelBid}
        //                             Bids = {props.tournamentsForBids.myBids}
        //                             List={props.tournamentsForBids.tournaments}
        //                         ></BidTeamTournamentList>
        //                 :
        //                         <BidTeamTournamentGroupsList
        //                             CellClick={BackToTournaments}
        //                             Button1Handle = {MakeBid}
        //                             Button2Handle = {CancelBid}
        //                             List={props.tournamentsForBids.selectedTournament.TournamentGroups}
        //                             Bids = {props.tournamentsForBids.myBids}
        //                             TeamName={teamNameOnTournament}
        //                             SetTeamName={SetTeamNameOnTournament}
        //                         ></BidTeamTournamentGroupsList>
        //                 }
        //                 </FormItem>
        //                 <FormItem top="Подверждение">
        //                     <Button onClick={() => props.saveSelectedTeam(props.teams.selected, props.myProfile)}>Внести изменения</Button>
        //                 </FormItem>
        //             </FormLayout>
        //         </Group>
        //     )
        // };break;
        default: {
            <Group>
                Не выбран режим отображения компонента (view, add, edit)
            </Group>
        }; break;

    }


}

const mapStateToProps = (state) => {
    return {
        collect: state.collectEntity,
        myProfile: state.profileEntity.myProfile,
    }
}

export default connect(mapStateToProps, {
    DeleteMemberFromCollect,
})(SimpleCollectItem)