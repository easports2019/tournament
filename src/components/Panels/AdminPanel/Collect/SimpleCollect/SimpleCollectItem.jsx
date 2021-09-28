import React, { useState, useEffect } from 'react'
import {
    RichCell, Avatar, FormLayout, FormItem, Input, InfoRow, Group, DatePicker, Textarea,
    File, CellButton, Button, Header, List, Cell, Select, CustomSelectOption, IconButton,
    CardGrid, Card, SplitLayout, SplitCol, Div, Radio, RangeSlider
} from '@vkontakte/vkui'
import { defaultPhotoPath } from './../../../../../store/dataTypes/common'
import { Icon24Camera, Icon28AddOutline } from '@vkontakte/icons';
import { connect } from 'react-redux';
import {
    dateToString, dateTimeToTimeString, datesWithoutTimeIsSame, timeSlotsForSimpleCollects, timeToString,
    dateSelectorValueToJSDateValue, jSDateValueToDateSelectorValue, timeSlotsForCollects, addToTime
} from './../../../../../utils/convertors/dateUtils';
import { DeleteMemberFromCollect } from './../../../../../store/collectReducer';
import { setSelectedRent } from './../../../../../store/rentReducer';
import { setSelectedSimplePlace } from './../../../../../store/simplePlaceReducer';
import { Checkbox } from '@vkontakte/vkui/dist/components/Checkbox/Checkbox';





const SimpleCollectItem = (props) => {
    let currentDate = new Date();
    let maxCollectDate = new Date();
    let workoutSelector = "";
    let totalCost = 0;
    let ranges = "";

    let minutesOneSlot = 30; // количество минут в таймслоте
    let minTimeSlotToRent = 2; // минимальный таймслот для аренды (в таймслотах, а не в минутах меряем)

    let [acceptBeMember, setAcceptBeMember] = useState(false)
    let [showPanelBeMember, setShowPanelBeMember] = useState(false)
    let [showCancelMemberForm, setShowCancelMemberForm] = useState(false)
    let [cancelReason, setCancelReason] = useState("")
    let [details, setDetails] = useState("")
    let [collectType, setCollectType] = useState(3)
    let [needMembers, setNeedMembers] = useState(10)
    let [selectedDate, setSelectedDate] = useState(jSDateValueToDateSelectorValue(currentDate))
    let [costMembers, setCostMembers] = useState(200)
    let [costAll, setCostAll] = useState(2000)
    let [plus, setPlus] = useState(costAll - (costMembers * needMembers))
    let [selectedSlots, setSelectedSlots] = useState(new Array()) //  тут отдельные выбранные ячейки
    let selectedTimeRanges = new Array() // тут сгруппированные выбранные ячейки отдельными диапазонами

    let [youAreMember, setYouAreMember] = useState((props.collect.selected.Members && props.collect.selected.Members.length > 0)
        ?
        props.collect.selected.Members.filter(m => m.UserProfileId == props.myProfile.UserProfileId).length > 0
        :
        false);

    let simplePlaces = props.simplePlace.places;

    let changePlace = (e) => {

        props.setSelectedSimplePlace(+e.currentTarget.value);
        props.setSelectedRent(+e.currentTarget.value, dateSelectorValueToJSDateValue(selectedDate));
        setSelectedSlots([])
    }

    let changeDate = (value) => {
        setSelectedDate(value);
        setSelectedSlots([])

    }

    let changeCollectType = (type) => {
        setCollectType(type)
    }

    let selectSlot = (value) => {
        // взять минимальное количество слотов и сделать проверку на послеющие ячейки
        // и это же самое нужно сделать на сервере! чтобы исключить двойную аренду
        // проверить следующий слот (не конец смены, следующий не арендован, не перерыв)
        let tmpSelectedSlot = [];

        // выявили выбранное время
        let res = selectedSlots.filter(ss => (ss.Hours == value.Hours && ss.Minutes == value.Minutes));
        if (res.length != 0)
            tmpSelectedSlot = selectedSlots.filter(ss => (ss.Hours != value.Hours || ss.Minutes != value.Minutes));
        else
            tmpSelectedSlot = [...selectedSlots, value];

        // сортировка
        tmpSelectedSlot.sort((a, b) => {
            let i1 = a.Hours * (60 / minutesOneSlot * minutesOneSlot) + a.Minutes;
            let i2 = b.Hours * (60 / minutesOneSlot * minutesOneSlot) + b.Minutes;

            return (i1 - i2)
        })



        setSelectedSlots(tmpSelectedSlot);
    }

    let gotoCollect = (value) => {


    }


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
        let costMem = Math.round(costall / needMembers);
        setCostMembers(costMem);

        setPlus((costMem * needMembers) - costall);
    }

    const calculateNeedMembers = (need) => {
        setNeedMembers(need);
        setCostMembers(Math.round(costAll / need));
        setPlus((Math.round(costAll / need) * need) - costAll);
    }

    const calculateCostMembers = (membercost) => {
        setCostMembers(membercost);
        setPlus((membercost * needMembers) - costAll);
    }

    // строим контрол выбора времени
    // если место и время выборано
    if ((props.selectedPlace) && (props.selectedPlace.Worktime != null) && (props.selectedPlace.Worktime != undefined)) {

        // берем временной слот (один) из расписания именно тот, который совпадает с выбранной датой
        let worktimeSlot = props.selectedPlace.Worktime.find(wt => {
            //selectedDate, wt, rents
            let selectedDT = new Date(dateSelectorValueToJSDateValue(selectedDate)) // selected in box
            let from = new Date(wt.FromTime) // current item date and start time
            let to = new Date(wt.ToTime) // current item date and end time
            if (datesWithoutTimeIsSame(from, selectedDT))
                return true;
            else
                return false;
        })

        // если верменной слот найден, производим с ним модификации по формированию и покраске кнопок, а также назначения им действий
        if (worktimeSlot != null && worktimeSlot != undefined) {
            let from = new Date(worktimeSlot.FromTime) // current item date and start time
            let to = new Date(worktimeSlot.ToTime) // current item date and end time

            // если выбранная дата и дата текущего расписания совпадает, тогда 
            let selectedDayRents = props.rent.selectedDayRents;

            let slotsNumber = (to.valueOf() - from.valueOf()) / (minutesOneSlot * 60 * 1000); // общее количество слотов
            let numberOfCols = slotsNumber < 4 ? slotsNumber : 4; // количество колонок
            let numberOfRows = Math.trunc(slotsNumber / numberOfCols) == slotsNumber / numberOfCols ? slotsNumber / numberOfCols : Math.trunc(slotsNumber / numberOfCols) + 1; // количество строк

            let slots = timeSlotsForSimpleCollects(slotsNumber, 60 / minutesOneSlot, from.getHours()); // получили общее время работы с разбивкой по диапазонам (обычно по 30 минут на каждую ячейку)

            // модификаторы. (вносим перерывы, аренды, выделенные ячейки в массив slots)
            
            slots = slots.map((slot, slotCurrentIndex) => 
            {
                // расставляем перерывы
                if (worktimeSlot.Breaks && worktimeSlot.Breaks.length > 0) {
                    worktimeSlot.Breaks.forEach(brek => {

                        let from = new Date(brek.FromTime);
                        let to = new Date(brek.ToTime);

                        let slotFromTime = new Date(from.getFullYear(), from.getMonth(), from.getDate(), slot.Hours, slot.Minutes);
                        let slotToTime = new Date(from.getFullYear(),
                            from.getMonth(),
                            from.getDate(),
                            slot.Hours,
                            slot.Minutes);

                        if (from <= slotFromTime && (to > slotToTime)) {
                            slot.Enabled = false;
                        }
                    });
                }

                // расставляем аренды
                props.rent.selectedDayRents.forEach(rnt => {

                    let from = new Date(rnt.From);
                    let to = addToTime(from, 0, rnt.DurationMinutes);

                    let slotFromTime = new Date(from.getFullYear(), from.getMonth(), from.getDate(), slot.Hours, slot.Minutes);
                    let slotToTime = new Date(from.getFullYear(),
                        from.getMonth(),
                        from.getDate(),
                        slot.Hours,
                        slot.Minutes);

                    if (from <= slotFromTime && (to > slotToTime)) {

                        if (rnt.Published)
                            slot.Rented = true;
                    }
                });

                // расставляем выбранные слоты
                if (selectedSlots && Array.isArray(selectedSlots) && selectedSlots.length > 0) {

                    selectedSlots.forEach(slt => {

                        let from = new Date(`01.01.2000 ${slt.Hours}:${slt.Minutes}`);
                        let to = addToTime(from, 0, minutesOneSlot);

                        let slotFromTime = new Date(from.getFullYear(), from.getMonth(), from.getDate(), slot.Hours, slot.Minutes);
                        let slotToTime = new Date(from.getFullYear(),
                            from.getMonth(),
                            from.getDate(),
                            slot.Hours,
                            slot.Minutes);

                        if (from <= slotFromTime && (to > slotToTime)) {

                            slt.PricePerSlot = worktimeSlot.CostPerHour / (60 / minutesOneSlot);
                            slot.PricePerSlot = worktimeSlot.CostPerHour / (60 / minutesOneSlot);
                            slot.Selected = true;
                        }
                    });
                }


                return slot;
            }
            )

            

            // маркируем доступное и недоступное время и создаем результирующий массив кнопок
            let iButtons = slots.map(x => {
                if (x.Enabled) {
                    if (x.Rented) {
                        return <Div>
                            <Button onClick={() => gotoCollect(x)} mode="destructive">{`${x.Hours <= 9 ? "0" + x.Hours.toString() : x.Hours.toString()}:${x.Minutes <= 9 ? "0" + x.Minutes.toString() : x.Minutes.toString()}`}</Button>
                        </Div>
                    }
                    else {
                        if (x.Selected) {
                            return <Div>
                                <Button onClick={() => selectSlot(x)} mode="primary">{`${x.Hours <= 9 ? "0" + x.Hours.toString() : x.Hours.toString()}:${x.Minutes <= 9 ? "0" + x.Minutes.toString() : x.Minutes.toString()}`}</Button>
                            </Div>
                        }
                        else {
                            return <Div>
                                <Button onClick={() => selectSlot(x)} mode="commerce">{`${x.Hours <= 9 ? "0" + x.Hours.toString() : x.Hours.toString()}:${x.Minutes <= 9 ? "0" + x.Minutes.toString() : x.Minutes.toString()}`}</Button>
                            </Div>
                        }
                    }

                }
                else {
                    if (x.Rented) {
                        return <Div>
                            <Button mode="destructive">{`${x.Hours <= 9 ? "0" + x.Hours.toString() : x.Hours.toString()}:${x.Minutes <= 9 ? "0" + x.Minutes.toString() : x.Minutes.toString()}`}</Button>
                        </Div>
                    }
                    else {
                        return <Div>
                            <Button mode="secondary">{`${x.Hours <= 9 ? "0" + x.Hours.toString() : x.Hours.toString()}:${x.Minutes <= 9 ? "0" + x.Minutes.toString() : x.Minutes.toString()}`}</Button>
                        </Div>
                    }
                }
            })

            //selectedTimeRanges = new Array()
            // вычисляем выбранные временные промежутки и выводим их в список
            for (let i = 0; i < selectedSlots.length; i++) {
                if (selectedSlots[i - 1] != null && selectedSlots[i - 1] != undefined) {

                    let i1 = selectedSlots[i].Hours * (60 / minutesOneSlot * minutesOneSlot) + selectedSlots[i].Minutes;
                    let i2 = selectedSlots[i - 1].Hours * (60 / minutesOneSlot * minutesOneSlot) + selectedSlots[i - 1].Minutes;

                    if ((i1 - i2) <= minutesOneSlot) {
                        selectedTimeRanges[selectedTimeRanges.length - 1].SlotMinutes += selectedSlots[i].SlotMinutes;
                        selectedTimeRanges[selectedTimeRanges.length - 1].PricePerSlot += selectedSlots[i].PricePerSlot;
                    }
                    else {
                        selectedTimeRanges.push(
                            {
                                Hours: selectedSlots[i].Hours,
                                Minutes: selectedSlots[i].Minutes,
                                SlotMinutes: selectedSlots[i].SlotMinutes,
                                Enabled: selectedSlots[i].Enabled,
                                Selected: selectedSlots[i].Selected,
                                Rented: selectedSlots[i].Rented,
                                PricePerSlot: selectedSlots[i].PricePerSlot,
                            }
                        )
                    }
                }
                else {

                    selectedTimeRanges.push(
                        {
                            Hours: selectedSlots[i].Hours,
                            Minutes: selectedSlots[i].Minutes,
                            SlotMinutes: selectedSlots[i].SlotMinutes,
                            Enabled: selectedSlots[i].Enabled,
                            Selected: selectedSlots[i].Selected,
                            Rented: selectedSlots[i].Rented,
                            PricePerSlot: selectedSlots[i].PricePerSlot,
                        }
                    )
                }

            }


            // если изменилась цена, перезапишем ее в состоянии
            totalCost = selectedTimeRanges.reduce((acc, cur) => acc += cur.PricePerSlot, 0);
            if (totalCost != costAll)
                calculateCostAll(selectedTimeRanges.reduce((acc, cur) => acc += cur.PricePerSlot, 0))

            let splitCols = []

            // разбиваем кнопки по колонкам для наиболее удобного отображения 
            for (let i = 0; i < numberOfCols; i++)//4
            {
                let sCol = []
                for (let j = 0; j < numberOfRows; j++)//5
                {
                    sCol.push(iButtons[i * numberOfRows + j])
                }
                splitCols.push(<SplitCol width="25%">{sCol}</SplitCol>)
            }

            ranges = (selectedTimeRanges && selectedTimeRanges.length > 0) ? selectedTimeRanges.map(tr => {
                let until = addToTime(new Date(`01.01.2000 ${tr.Hours}:${tr.Minutes}`), 0, tr.SlotMinutes);
                return <InfoRow>с {timeToString(tr.Hours, tr.Minutes)} до {timeToString(until.getHours(), until.getMinutes())}  ({tr.PricePerSlot} руб.) </InfoRow>


            }) :
                "Время не выбрано"
            

            // записываем полученную иерархию контролов в единый селектор
            workoutSelector =
                <SplitLayout>
                    {splitCols}
                </SplitLayout>

        }
        else {
            workoutSelector = <InfoRow>Расписания нет</InfoRow>
        }
    }
    else
        workoutSelector = <InfoRow>Расписания нет</InfoRow>






    switch (props.collect.mode) {
        case "view": {
            return (
                <>
                    <FormItem top="Ваш город">
                        <InfoRow>{(props.myProfile && props.myProfile.CityUmbracoName) ? props.myProfile.CityUmbracoName : ""}</InfoRow>
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
                            options={simplePlaces.map(place => ({
                                label: place.Name, value: place.Id
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
                            max={{ day: currentDate.getDate(), month: currentDate.getMonth() + 2, year: currentDate.getFullYear() }}
                            defaultValue={selectedDate}
                            onDateChange={(value) => { changeDate(value) }}
                        />
                        {/* <InfoRow>{dateToString(props.collect.selected.When)} в {dateTimeToTimeString(props.collect.selected.When)}</InfoRow> */}
                    </FormItem>
                    <FormItem>
                        {workoutSelector}

                    </FormItem>
                    <FormItem top="Выранное время">
                        {ranges}
                    </FormItem>
                    {selectedTimeRanges && selectedTimeRanges.length > 0 ? 
                    <Group>

                    
                        <FormItem>
                            <InfoRow>
                                <br />
                                Вы можете сначала собрать людей и после оплатить. <br />
                                Либо вы можете сначала оплатить, а потом собирать людей. <br />
                                Аренда площадки гарантируется только после её оплаты.
                            </InfoRow>
                        </FormItem>

                        <FormItem>
                            <Group>
                                {
                                    (selectedTimeRanges && selectedTimeRanges.length > 1) ?
                                    <InfoRow style={{"color": "red"}}>Вы отметили {selectedTimeRanges.length} диапазона(ов) времени: <br/>
                                    {ranges}
                                    В таком режиме вы можете только арендовать всё выбранное время. 
                                    Чтобы создать сбор, необходимо выбрать только один диапазон подряд идущего времени, например, 
                                    18:00, 18:30 и 19:00 (с 18:00 до 19:30 - 1.5 часа)</InfoRow>
                                    : <></>    
                                }
                                { (selectedTimeRanges && selectedTimeRanges.length > 1) ?
                                    <Group>
                                        <Radio name="collect" value="1" checked={collectType == 1 ? true : false} onChange={() => changeCollectType(1)} description={`вы отметили ${selectedTimeRanges.length} сбора(ов)`} disabled>Оплатить потом создать</Radio>
                                        <Radio name="collect" value="2" checked={collectType == 2 ? true : false} onChange={() => changeCollectType(2)} description={`вы отметили ${selectedTimeRanges.length} сбора(ов)`} disabled>Создать потом оплатить</Radio>
                                        <Radio name="collect" value="3" checked={collectType == 3 ? true : false} onChange={() => changeCollectType(3)} description="Без создания сбора">Просто оплатить выбранное время</Radio>
                                    </Group>
                                    :
                                    <Group>
                                        <Radio name="collect" value="1" checked={collectType == 1 ? true : false} onChange={() => changeCollectType(1)} >Оплатить потом создать сбор</Radio>
                                        <Radio name="collect" value="2" checked={collectType == 2  ? true : false} onChange={() => changeCollectType(2)} >Создать сбор потом оплатить</Radio>
                                        <Radio name="collect" value="3" checked={collectType == 3 ? true : false} onChange={() => changeCollectType(3)} description="Без создания сбора">Просто оплатить выбранное время</Radio>
                                    </Group>

                                }

                            </Group>
                        </FormItem>
                    {collectType != 3 &&
                        <>
                            <FormItem top="Информация по сбору">
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
                            <FormItem top="Стоимость выбранного времени (не видно участникам)">
                                <InfoRow>{costAll}</InfoRow>
                                {/* <Input type="Number"
                                    defaultValue={costAll}
                                    value={costAll}
                                    placeholder="2000"
                                    onChange={e => calculateCostAll(e.currentTarget.value)}
                                ></Input> */}
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
                        </>
                    }
                        <FormItem top="Публикация">
                            {selectedTimeRanges && selectedTimeRanges.length > 0 ? (
                            collectType == 1 ? <RichCell
                                caption="Оплатить и создать сбор"
                                actions={<Button>Оплатить и создать сбор</Button>}
                                >
                            </RichCell> :
                            (collectType == 2 ? 
                            <RichCell
                                caption="Создать сбор и оплатить"
                                actions={<Button>Создать сбор</Button>}
                                >
                            </RichCell> :
                            <RichCell
                                caption="Оплатить выбранное время без создания сбора"
                                actions={<Button>Оплатить</Button>}
                                >
                            </RichCell>)
                            ): 
                            <RichCell
                                caption="Выберите место, дату и время занятий">
                            </RichCell>}
                        </FormItem>
                    </Group>
                    :
                    <></>    
    }
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
        rent: state.rentEntity,
        myProfile: state.profileEntity.myProfile,
    }
}

export default connect(mapStateToProps, {
    DeleteMemberFromCollect, setSelectedSimplePlace, setSelectedRent,
})(SimpleCollectItem)