import React, { useState, useEffect } from 'react'
import { RichCell, Avatar, FormLayout, FormItem, Input, InfoRow, Group, DatePicker, Textarea,
     File, CellButton, Button, Header, List, Cell, Select, CustomSelectOption, IconButton,
      CardGrid, Card, SplitLayout, SplitCol } from '@vkontakte/vkui'
import { defaultPhotoPath } from './../../../../../store/dataTypes/common'
import { Icon24Camera, Icon28AddOutline } from '@vkontakte/icons';
import { connect } from 'react-redux';
import { dateToString, dateTimeToTimeString, dateSelectorValueToJSDateValue, jSDateValueToDateSelectorValue } from './../../../../../utils/convertors/dateUtils';
import { DeleteMemberFromCollect } from './../../../../../store/collectReducer';
import { setSelectedSimplePlace } from './../../../../../store/simplePlaceReducer';
import { Checkbox } from '@vkontakte/vkui/dist/components/Checkbox/Checkbox';





const SimpleCollectItem = (props) => {
    let currentDate = new Date();
    let  maxCollectDate = new Date();
    let workoutSelector = "";

    let [acceptBeMember, setAcceptBeMember] = useState(false)
    let [showPanelBeMember, setShowPanelBeMember] = useState(false)
    let [showCancelMemberForm, setShowCancelMemberForm] = useState(false)
    let [cancelReason, setCancelReason] = useState("")
    let [details, setDetails] = useState("")
    let [needMembers, setNeedMembers] = useState(10)
    let [selectedDate, setSelectedDate] = useState(jSDateValueToDateSelectorValue(currentDate))
    let [costMembers, setCostMembers] = useState(200)
    let [costAll, setCostAll] = useState(2000)
    let [plus, setPlus] = useState(costAll - (costMembers * needMembers))
    
    let [youAreMember, setYouAreMember] = useState((props.collect.selected.Members && props.collect.selected.Members.length > 0)
        ?
        props.collect.selected.Members.filter(m => m.UserProfileId == props.myProfile.UserProfileId).length > 0
        :
        false);
        
    let simplePlaces = props.simplePlace.places;

    let changePlace = (e) => {
        debugger
        props.setSelectedSimplePlace(+e.currentTarget.value);
    }

    let changeDate = (value) => {
        setSelectedDate(value);
        
    }

    if ((props.selectedPlace) && (props.selectedPlace.Worktime != null) && (props.selectedPlace.Worktime != undefined))
        workoutSelector = props.selectedPlace.Worktime.map(wt => {
            //selectedDate, wt, rents;jSDateValueToDateSelectorValue
            let selectedDT = new Date(dateSelectorValueToJSDateValue(selectedDate)) // selected in box
            let from = new Date(wt.FromTime)
            let to = new Date(wt.ToTime)
            debugger
            let slotsBy30min = (to.valueOf() - from.valueOf()) / (30*60*1000);
            let cols = slotsBy30min / 12;

            
        })
    else
        workoutSelector =  <SplitLayout>
        <SplitCol width="25%">
            <IconButton>08:00</IconButton>
            <IconButton>08:30</IconButton>
            <IconButton>09:00</IconButton>
            <IconButton>09:30</IconButton>
            <IconButton>10:00</IconButton>
            <IconButton>10:30</IconButton>
            <IconButton>11:00</IconButton>
            <IconButton>11:30</IconButton>
        </SplitCol>
    </SplitLayout>

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

    const calculateCostAll = (costall) => {
        setCostAll(costall);
        let costMem = Math.round(costall/needMembers);
        setCostMembers(costMem);

        setPlus((costMem * needMembers) - costall);
    }

    const calculateNeedMembers = (need) => {
        setNeedMembers(need);
        setCostMembers(Math.round(costAll/need));
        setPlus((Math.round(costAll/need) * need) - costAll);
    }

    const calculateCostMembers = (membercost) => {
        setCostMembers(membercost);
        setPlus((membercost * needMembers) - costAll);
    }


    switch (props.collect.mode) {
        case "view": {
            return (
                <>
                    <FormItem top="Ваш город">
                        <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
                    </FormItem>
                    <FormItem top="Дата и время">
                        <InfoRow>{dateToString(props.collect.selected.When)} в {dateTimeToTimeString(props.collect.selected.When)}</InfoRow>
                    </FormItem>
                    <FormItem top="Место">
                        <RichCell caption={props.collect.selected.Place.Address}>{props.collect.selected.Place.Name}</RichCell>
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
                        <Select
                        placeholder="Не выбрано" 
                        onChange={e => changePlace(e)}
                        options={simplePlaces.map(place => ({ label: place.Name, value: place.Id 
                            // , avatar: user.photo_100 
                        }))}
                        renderOption={({ option, ...restProps }) => (
                          <CustomSelectOption {...restProps} 
                        //   before={<Avatar size={24} src={option.avatar} />} 
                          />
                        )}
                        />
                        {/* <RichCell caption={props.collect.selected.Place.Address}>{props.collect.selected.Place.Name}</RichCell> */}
                    </FormItem>
                    <FormItem top="Дата">
                        <DatePicker
                            min={jSDateValueToDateSelectorValue(currentDate)}
                            max={{day: currentDate.getDate(), month: currentDate.getMonth()+2, year: currentDate.getFullYear()}}
                            defaultValue={selectedDate}
                            onDateChange={(value) => {changeDate(value)}}
                        />
                        {/* <InfoRow>{dateToString(props.collect.selected.When)} в {dateTimeToTimeString(props.collect.selected.When)}</InfoRow> */}
                    </FormItem>
                    <FormItem>
                        {workoutSelector}
                    
                    </FormItem>
                    <FormItem top="Информация">
                        <Textarea defaultValue={details} value={details} onChange={e => setDetails(e.currentTarget.value)} placeholder="Сделать чтобы можно было покупать аренду без сбора. сбор опционально делается" />
                    </FormItem>
                    <FormItem top="Сколько человек нужно">
                        <Input type="Number"
                            defaultValue={needMembers}
                            value={needMembers}
                            placeholder="10"
                            onChange={e => calculateNeedMembers(e.currentTarget.value)}
                        ></Input>

                    </FormItem>
                    <FormItem top="Стоимость аренды (не видно участникам)">
                        <Input type="Number"
                            defaultValue={costAll}
                            value={costAll}
                            placeholder="2000"
                            onChange={e => calculateCostAll(e.currentTarget.value)}
                        ></Input>
                    </FormItem>
                    <FormItem top="Стоимость на 1 человека (эту цену увидят участники)">
                        <Input type="Number"
                            defaultValue={costMembers}
                            value={costMembers}
                            placeholder="200"
                            onChange={e => calculateCostMembers(e.currentTarget.value)}
                        ></Input>
                    </FormItem>
                    <FormItem top="Остаток после оплаты">
                        <InfoRow>{plus} руб</InfoRow>
                    </FormItem>
                    <FormItem top="Публикация">
                        {/* <InfoRow>{props.collect.selected.Cost}</InfoRow> */}
                        <CellButton>Создать сбор</CellButton>
                        <CellButton>Перейти к оплате сбора (соберу людей сам)</CellButton>
                    </FormItem>
                </>
            )
        }; break;
        // case "edit": {
        
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
        simplePlace: state.simplePlaceEntity,
        selectedPlace: state.simplePlaceEntity.selectedPlace,
        selectedRent: state.rentEntity.selectedRent,
        myProfile: state.profileEntity.myProfile,
    }
}

export default connect(mapStateToProps, {
    DeleteMemberFromCollect, setSelectedSimplePlace,
})(SimpleCollectItem)