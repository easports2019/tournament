import React, { useState, useEffect } from 'react'
import {
    RichCell, Avatar, FormLayout, FormItem, Input, InfoRow, Group, DatePicker, Textarea,
    File, CellButton, Button, Header, List, Cell, Select, CustomSelectOption, IconButton,
    CardGrid, Card, SplitLayout, SplitCol, Div, Radio, RangeSlider
} from '@vkontakte/vkui'
import { defaultPhotoPath } from './../../../../../store/dataTypes/common'
import { Icon24Camera, Icon28AddOutline } from '@vkontakte/icons';
import { connect } from 'react-redux';
import bridge from '@vkontakte/vk-bridge';
import {
    dateToString, dateTimeToTimeString, datesWithoutTimeIsSame, timeSlotsForSimpleCollects, timeToString,
    dateSelectorValueToJSDateValue, jSDateValueToDateSelectorValue, timeSlotsForCollects, addToTime
} from './../../../../../utils/convertors/dateUtils';
import {
    DeleteMemberFromCollect, AddSimpleCollect, setCollectItemMode, EditSimpleCollect,
    registerMemberToSimpleCollect, DelSimpleCollect, setSelectedMembers
} from './../../../../../store/collectReducer';
import { setSelectedRent } from './../../../../../store/rentReducer';
import { setSelectedSimplePlace } from './../../../../../store/simplePlaceReducer';
import { Checkbox } from '@vkontakte/vkui/dist/components/Checkbox/Checkbox';
import { myProfile } from '../../../../../store/constants/commonConstants';


// включить защиту от создания сбора на прошедшее время! 


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


    useEffect(() => {
        if (props.collect.selected && props.collect.selected.Members && props.collect.selected.Members != undefined && props.collect.selected.Members.length > 0) {

            let vkids = "";
            let memberPhotos = props.collect.selected.Members.map(m => {
                vkids += m.UserProfile.UserVkId.slice(2) + ","
                return { id: m.UserProfile.UserVkId.slice(2), photo: "" }
            });

            //
            const params = bridge.send("VKWebAppGetAuthToken", { "app_id": 7161115, "scope": "" }).then(res => {
                bridge.send("VKWebAppCallAPIMethod",
                    {
                        "method": "users.get",
                        "request_id": "userphotorequest",
                        "params": {
                            "user_ids": vkids,
                            "fields": "photo_100",
                            "v": "5.131",
                            "access_token": res.access_token
                        }
                    })
                    .then(us => {



                        let members = props.collect.selected.Members.map(m => {
                            let photo = us.response.filter(p => (("id" + p.id) == m.UserProfile.UserVkId));
                            if (photo && photo[0] != undefined) {
                                m.UserProfile.PhotoPath = photo[0].photo_100;
                            }
                            return m;

                        })

                        props.setSelectedMembers(members);
                        //m.UserProfile.PhotoPath = us.photo_100;
                        //props.setSelectedUser(us);
                    })

                    // bridge.send("VKWebAppOpenPayForm", {
                    //     "app_id": 7161115, 
                    //     "action": "pay-to-service", 
                    //     "params": {
                    //         "amount": 1.5,
                    //         "data": {
                    //                 "currency": "RUB",
                    //                 "merchant_data": "eyJvcmRlcl9pZCI6IjI1NTMxIiwidHMiOiIxNTM5MzI5NzcwIiwiYW1vdW50IjoxLjUsImN1cnJlbmN5IjoiUlVCIn0=",
                    //                 "merchant_sign": "63d5dce9d2c9d29198ba12ba3f8e270e6606a221",
                    //                 "order_id": "25531",
                    //                 "ts": "1539329770"
                    //                 },
                    //         "description": "Test Payment",
                    //         "action": "pay-to-service",
                    //         "merchant_id": 617001,
                    //                 "version": 2,
                    //         "sign": res.access_token
                    //     }
                    // });
            })

            
        }

    }, props.collect.selected.Id)

    //debugger
    let youAreMember = (props.collect.selected.Members && props.collect.selected.Members.length > 0)
        ?
        (props.collect.selected.Members.filter(m => m.UserProfileId == props.myProfile.UserProfileId).length > 0 ? true : false)
        :
        false;
    let youAreOrganizer = (props.collect.selected && props.collect.selected != undefined && props.myProfile && props.myProfile != undefined) ?
        props.collect.selected.CreatorId == props.myProfile.UserProfileId :
        false;

    //let [youAreMember, setYouAreMember] = useState(yam);

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

    let gotoProfile = (profileId) => {
        window.open("https://vk.com/" + profileId, '_blank');
    }


    const CancelMember = () => {
        let member = {
            UserProfileId: props.myProfile.UserProfileId,
            SimpleCollectId: props.collect.selected.Id,
        }
        props.DeleteMemberFromCollect(props.myProfile.UserProfileId, props.collect.selected, member, cancelReason);
        setAcceptBeMember(false);
        setShowPanelBeMember(false);
        setShowCancelMemberForm(false);
        setCancelReason("");
        youAreMember = false;
        //setYouAreMember(false);
    }

    const deleteMember = (memberUserProfile) => {
        
        let member = {
            UserProfileId: memberUserProfile.UserProfileId,
            SimpleCollectId: props.collect.selected.Id,
        }
        props.DeleteMemberFromCollect(props.myProfile.UserProfileId, props.collect.selected, member, cancelReason);
        setAcceptBeMember(false);
        setShowPanelBeMember(false);
        setShowCancelMemberForm(false);
        setCancelReason("Удален организатором");
        youAreMember = false;
        //setYouAreMember(false);
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

    const registerToCollect = () => {

        props.registerMemberToSimpleCollect(props.myProfile.UserProfileId, props.collect.selected);
    }

    const createCollect = () => {

        let collect = {
            Name: props.selectedPlace.Name,
            // +"_"+selectedDate.year.toString()+"."+selectedDate.month.toString()+"."+selectedDate.day.toString()+"_"+props.myProfile.UserProfileId+"_"+ new Date().getMinutes().toString()+"-"+ new Date().getSeconds().toString(),
            When: new Date(
                selectedDate.year,
                selectedDate.month - 1,
                selectedDate.day,
                selectedTimeRanges[0].Hours + 3, // прибавил 3 часа (разница от UTC)
                selectedTimeRanges[0].Minutes),
            DurationMinutes: selectedTimeRanges[0].SlotMinutes,
            Details: details,
            FullPrice: costAll,
            Comment: "",
            Cost: costMembers /*selectedTimeRanges[0].PricePerSlot*/,
            NeedMembers: +needMembers,
            SimplePlaceId: props.selectedPlace.Id,
            CreatorId: props.myProfile.UserProfileId,
        }
        props.AddSimpleCollect(props.myProfile.UserProfileId, collect)
        props.setCollectItemMode("view");
    }

    const saveChanges = () => {

        let collect = {
            Id: props.collect.selected.Id,
            Name: props.selectedPlace.Name,
            // +"_"+selectedDate.year.toString()+"."+selectedDate.month.toString()+"."+selectedDate.day.toString()+"_"+props.myProfile.UserProfileId+"_"+ new Date().getMinutes().toString()+"-"+ new Date().getSeconds().toString(),
            When: props.collect.selected.When,
            DurationMinutes: props.collect.selected.DurationMinutes,
            Details: details,
            FullPrice: props.collect.selected.FullPrice,
            Comment: props.collect.selected.Comment,
            Cost: costMembers /*selectedTimeRanges[0].PricePerSlot*/,
            NeedMembers: +needMembers,
            SimplePlaceId: props.collect.selected.SimplePlaceId,
            CreatorId: props.collect.selected.CreatorId,
        }
        props.EditSimpleCollect(props.myProfile.UserProfileId, collect)
        props.setCollectItemMode("view");
    }

    const cancelCollect = () => {
        props.DelSimpleCollect(props.myProfile.UserProfileId, props.collect.selected);
    }

    const changeCollect = () => {

        setDetails(props.collect.selected.Details);
        setCostAll(props.collect.selected.FullPrice);
        setNeedMembers(props.collect.selected.NeedMembers);
        setCostMembers(props.collect.selected.Cost);

        setPlus((props.collect.selected.Cost * props.collect.selected.NeedMembers) - props.collect.selected.FullPrice);

        props.setCollectItemMode("edit");
    }

    const cancelSave = () => {

        setDetails(props.collect.selected.Details ? props.collect.selected.Details : "");
        setCostAll(props.collect.selected.FullPrice);
        setNeedMembers(props.collect.selected.NeedMembers);
        setCostMembers(props.collect.selected.Cost);

        setPlus((props.collect.selected.Cost * props.collect.selected.NeedMembers) - props.collect.selected.FullPrice);

        props.setCollectItemMode("view");
    }

    // строим контрол выбора времени
    // если место и время выборано
    if ((props.selectedPlace) && (props.selectedPlace.Worktime != null) && (props.selectedPlace.Worktime != undefined)) {
        //debugger
        // собираем все слоты из расписания, которые совпадают с выбранной датой
        let worktimeSlots = props.selectedPlace.Worktime.filter(wt => {
            //selectedDate, wt, rents
            let selectedDT = new Date(dateSelectorValueToJSDateValue(selectedDate)) // selected in box
            let from = new Date(wt.FromTime) // current item date and start time
            let to = new Date(wt.ToTime) // current item date and end time
            if (datesWithoutTimeIsSame(from, selectedDT))
                return true;
            else
                return false;
        }).sort((a, b) => new Date(a.FromTime).valueOf() - new Date(b.FromTime).valueOf())

        // если выборка дала данные (слоты)
        if (worktimeSlots && worktimeSlots != undefined && worktimeSlots.length > 0 && worktimeSlots[0] != undefined) {
            // если верменной слот найден, производим с ним модификации по формированию и покраске кнопок, а также назначения им действий

            let fromTmp = new Date(worktimeSlots[0].FromTime); // берем время ОТ первого слота
            let toTmp = new Date(worktimeSlots[worktimeSlots.length - 1].ToTime);  // берем время ДО последнего слота
            let slotsNumber = (toTmp.valueOf() - fromTmp.valueOf()) / (minutesOneSlot * 60 * 1000); // общее количество слотов
            let numberOfCols = slotsNumber < 4 ? slotsNumber : 4; // количество колонок
            let numberOfRows = Math.trunc(slotsNumber / numberOfCols) == slotsNumber / numberOfCols ? slotsNumber / numberOfCols : Math.trunc(slotsNumber / numberOfCols) + 1; // количество строк

            let slots = timeSlotsForSimpleCollects(slotsNumber, 60 / minutesOneSlot, fromTmp.getHours()); // получили общее время работы с разбивкой по диапазонам (обычно по 30 минут на каждую ячейку)

            // бежим по массиву слотов расписаний
            slots = slots.map((slot, slotCurrentIndex) => {

                
                worktimeSlots.forEach(worktimeSlot => {
                    
                    let curentWorktimeSlotFromTime = new Date(worktimeSlot.FromTime);
                    let curentWorktimeSlotToTime = new Date(worktimeSlot.ToTime);
                    let currentSlotTime = new Date(
                        curentWorktimeSlotFromTime.getFullYear(), 
                        curentWorktimeSlotFromTime.getMonth(), 
                        curentWorktimeSlotFromTime.getDate(), 
                        slot.Hours, slot.Minutes);


                    if ((worktimeSlot != null) 
                        && (worktimeSlot != undefined) 
                        && (curentWorktimeSlotFromTime <= currentSlotTime && curentWorktimeSlotToTime > currentSlotTime)
                        ) {
                        // расставляем перерывы. 
                        // пробегаем по массиву перерывов, сверяя время с текущим слотом. если совпало, значит маркируем в слот-массиве этот слот как недоступный
                        if (worktimeSlot.Breaks && worktimeSlot.Breaks.length > 0) {
                            worktimeSlot.Breaks.forEach(brek => {

                                let from = new Date(brek.FromTime);
                                let to = new Date(brek.ToTime);

                                let brekTime = new Date(from.getFullYear(), from.getMonth(), from.getDate(), slot.Hours, slot.Minutes);

                                if (from <= brekTime && (to > brekTime)) {
                                    slot.Enabled = false;
                                }
                            });
                        }

                        // расставляем аренды
                        // пробегаем по массиву арендованного времени, сверяя время с текущим слотом. если совпало, значит маркируем в слот-массиве этот слот как занятый
                        props.rent.selectedDayRents.forEach(rnt => {

                            let from = new Date(rnt.From);
                            let to = addToTime(from, 0, rnt.DurationMinutes);

                            let rentTime = new Date(from.getFullYear(), from.getMonth(), from.getDate(), slot.Hours, slot.Minutes);
                            

                            if (from <= rentTime && (to > rentTime)) {

                                if (rnt.Published)
                                    slot.Rented = true;
                            }
                        });

                        // расставляем выбранные слоты
                        if (selectedSlots && Array.isArray(selectedSlots) && selectedSlots.length > 0) {

                            selectedSlots.forEach(slt => {

                                let from = new Date(`01.01.2000 ${slt.Hours}:${slt.Minutes}`);
                                let to = addToTime(from, 0, minutesOneSlot);

                                let selectedTime = new Date(from.getFullYear(), from.getMonth(), from.getDate(), slot.Hours, slot.Minutes);

                                if (from <= selectedTime && (to > selectedTime)) {

                                    slt.PricePerSlot = worktimeSlot.CostPerHour / (60 / minutesOneSlot);
                                    slot.PricePerSlot = worktimeSlot.CostPerHour / (60 / minutesOneSlot);
                                    slot.Selected = true;
                                }
                            });
                        }
                    }
                    else {
                        workoutSelector = <InfoRow>Расписания нет</InfoRow>
                    }
                });

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


    }
    else
        workoutSelector = <InfoRow>Расписания нет</InfoRow>






    switch (props.collect.mode) {
        case "view": {
            if (props.collect.selected.Deleted != undefined && props.collect.selected.Deleted == true) {
                return (
                    <>
                        <FormItem>
                            <InfoRow><strong>Этот сбор был отменен</strong></InfoRow>
                        </FormItem>
                        <FormItem top="Дата и время">
                            <InfoRow>{props.collect.selected.When && props.collect.selected.When != undefined ? dateToString(props.collect.selected.When) + " в " : " "}
                                {props.collect.selected.When && props.collect.selected.When != undefined ? dateTimeToTimeString(props.collect.selected.When) : " "}</InfoRow>
                        </FormItem>
                        <FormItem top="Место">
                            <RichCell caption={props.collect.selected.Place && props.collect.selected.Place.Address != undefined ? props.collect.selected.Place.Address : ""}>
                                {props.collect.selected.Place && props.collect.selected.Place.Name != undefined ? props.collect.selected.Place.Name : ""}</RichCell>
                        </FormItem>
                        <FormItem top="Информация" disabled>
                            <InfoRow>{props.collect.selected.Details}</InfoRow>
                        </FormItem>
                    </>
                )
            }
            else {
                return (
                    <>
                        {props.collect.selected && props.collect.selected != undefined ?
                            <>

                                <FormItem top="Ваш город">
                                    <InfoRow>{(props.myProfile && props.myProfile.CityUmbracoName) ? props.myProfile.CityUmbracoName : ""}</InfoRow>
                                </FormItem>
                                <FormItem top="Дата и время">
                                    <InfoRow>{props.collect.selected.When && props.collect.selected.When != undefined ? dateToString(props.collect.selected.When) + " в " : " "}
                                        {props.collect.selected.When && props.collect.selected.When != undefined ? dateTimeToTimeString(props.collect.selected.When) : " "}</InfoRow>
                                </FormItem>
                                <FormItem top="Место">
                                    <RichCell caption={props.collect.selected.Place && props.collect.selected.Place.Address != undefined ? props.collect.selected.Place.Address : ""}>
                                        {props.collect.selected.Place && props.collect.selected.Place.Name != undefined ? props.collect.selected.Place.Name : ""}</RichCell>
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
                                                {props.collect.selected.Members.map((item) => {

                                                    return <RichCell
                                                    text={`${item.UserProfile.Name} ${item.UserProfile.Surname} ${item.UserProfileId == props.collect.selected.Creator.UserProfileId ? " (Организатор)" : ""}`}
                                                        before={item.UserProfile.PhotoPath && item.UserProfile.PhotoPath != undefined ?
                                                            <Avatar size={72} src={item.UserProfile.PhotoPath} />
                                                            :
                                                            null
                                                        }
                                                        actions={
                                                        props.myProfile.UserProfileId == props.collect.selected.Creator.UserProfileId ? 
                                                            <Group>
                                                                {item.UserProfile.UserProfileId != props.collect.selected.Creator.UserProfileId && 
                                                                    <Button mode="destructive" onClick={() => deleteMember(item.UserProfile)}>Исключить</Button>}
                                                                {item.UserProfile.UserProfileId != props.myProfile.UserProfileId && 
                                                                    <Button onClick={() => gotoProfile(item.UserProfile.UserVkId)}>Профиль ВК</Button>}
                                                            </Group>
                                                            :
                                                            <>
                                                                {item.UserProfile.UserProfileId != props.myProfile.UserProfileId && 
                                                                    <Button onClick={() => gotoProfile(item.UserProfile.UserVkId)}>Профиль ВК</Button>}
                                                            </>

                                                    }
                                                    >
                                                    </RichCell>
                                                }

                                                )

                                                }
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
                                                    (props.collect.selected.Members.length < props.collect.selected.NeedMembers) ?
                                                    ((!showPanelBeMember) ?
                                                        <FormItem top="Участие">
                                                            <CellButton onClick={() => setShowPanelBeMember(!showPanelBeMember)}>Стать участником</CellButton>
                                                        </FormItem>
                                                        :
                                                        <FormItem top="Стать участником">
                                                            {(acceptBeMember) &&
                                                                <CellButton onClick={registerToCollect}>Зарегистрироваться на сбор</CellButton>
                                                            }
                                                            <Checkbox checked={acceptBeMember} onChange={AcceptRights}>
                                                                {`Подтверждаю, что готов прибыть на сбор в ${props.collect.selected.Place.Name} в 
                                    ${dateToString(props.collect.selected.When)} к ${dateTimeToTimeString(props.collect.selected.When)}
                                    и оплатить взнос в размере ${props.collect.selected.Cost} рублей`}
                                                            </Checkbox>
                                                        </FormItem>)
                                                        :
                                                        <FormItem top="Участие">
                                                            <InfoRow>Регистрация закончена. Народ набран.</InfoRow>
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
                                                    <InfoRow>{(!youAreOrganizer) ? `Вы подтвердили участие в сборе` : `Вы организатор сбора`}</InfoRow>
                                                    {(!showCancelMemberForm) ?
                                                        ((!youAreOrganizer) ?
                                                            <RichCell actions={<Button mode="destructive" onClick={() => setShowCancelMemberForm(true)}>Отказаться от участия</Button>}></RichCell> :
                                                            <RichCell actions={
                                                                <>
                                                                    <Button mode="primary"
                                                                        onClick={changeCollect}
                                                                    >Изменить сбор</Button>
                                                                    <Button mode="destructive"
                                                                        onClick={cancelCollect}
                                                                    >Отменить сбор</Button>
                                                                </>
                                                            }></RichCell>

                                                        )
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
                            :
                            <></>
                        }
                    </>
                )
            }
        }; break;
        case "add": {
            return (
                <>
                    <FormItem top="Ваш город">
                        <InfoRow>{(props.myProfile && props.myProfile.CityUmbracoName) ? props.myProfile.CityUmbracoName : ""}</InfoRow>
                    </FormItem>
                    <FormItem top="Место">
                        <Select
                            placeholder="Не выбрано"
                            value={(props.selectedPlace && props.selectedPlace.Id) ? props.selectedPlace.Id : null}
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
                                            <InfoRow style={{ "color": "red" }}>Вы отметили {selectedTimeRanges.length} диапазона(ов) времени: <br />
                                                {ranges}
                                                В таком режиме вы можете только арендовать всё выбранное время.
                                                Чтобы создать сбор, необходимо выбрать только один диапазон подряд идущего времени, например,
                                                18:00, 18:30 и 19:00 (с 18:00 до 19:30 - 1.5 часа)</InfoRow>
                                            : <></>
                                    }
                                    {(selectedTimeRanges && selectedTimeRanges.length > 1) ?
                                        <Group>
                                            <Radio name="collect" value="1" checked={collectType == 1 ? true : false} onChange={() => changeCollectType(1)} description={`вы отметили ${selectedTimeRanges.length} сбора(ов)`} disabled>Оплатить потом создать</Radio>
                                            <Radio name="collect" value="2" checked={collectType == 2 ? true : false} onChange={() => changeCollectType(2)} description={`вы отметили ${selectedTimeRanges.length} сбора(ов)`} disabled>Создать потом оплатить</Radio>
                                            <Radio name="collect" value="3" checked={collectType == 3 ? true : false} onChange={() => changeCollectType(3)} description="Без создания сбора">Просто оплатить выбранное время</Radio>
                                        </Group>
                                        :
                                        <Group>
                                            <Radio name="collect" value="1" checked={collectType == 1 ? true : false} onChange={() => changeCollectType(1)} description="После оплаты аренда закреплена за вами">Оплатить потом создать сбор</Radio>
                                            <Radio name="collect" value="2" checked={collectType == 2 ? true : false} onChange={() => changeCollectType(2)} description="Закрепление аренды будет только после оплаты">Создать сбор потом оплатить</Radio>
                                            <Radio name="collect" value="3" checked={collectType == 3 ? true : false} onChange={() => changeCollectType(3)} description="Без создания сбора">Просто оплатить выбранное время</Radio>
                                        </Group>

                                    }

                                </Group>
                            </FormItem>
                            {collectType != 3 &&
                                <>
                                    <FormItem top="Информация по сбору">
                                        <Textarea defaultValue={details} value={details} onChange={e => setDetails(e.currentTarget.value)}
                                            placeholder="Укажите здесь важную информацию для участников сбора" />
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
                                                actions={<Button onClick={createCollect}>Создать сбор</Button>}
                                            >
                                            </RichCell> :
                                            <RichCell
                                                caption="Оплатить выбранное время без создания сбора"
                                                actions={<Button>Оплатить</Button>}
                                            >
                                            </RichCell>)
                                ) :
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
        case "edit": {
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


                    <FormItem top="Информация по сбору">
                        <Textarea defaultValue={details} value={details} onChange={e => setDetails(e.currentTarget.value)} placeholder="Сделать чтобы можно было покупать аренду без сбора. сбор опционально делается" />
                    </FormItem>
                    <FormItem top="Сколько человек нужно"
                    bottom={
                        props.collect.mode == "edit" 
                    && props.collect.selected.Members 
                    && props.collect.selected.Members != undefined 
                    && props.collect.selected.Members.length > 0 
                    && (needMembers < props.collect.selected.Members.length) ?
                    <CellButton mode="danger">Нельзя указывать меньше, чем зарегистрированных участников</CellButton>
                    : ""
                    }
                    >
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

                    <FormItem top="Сохранение">
                        <RichCell
                            actions={
                                <Group>
                                    <Button
                                        onClick={cancelSave}
                                    >Отменить изменения</Button>
                                    {
                                        props.collect.mode == "edit" 
                                        && props.collect.selected.Members 
                                        && props.collect.selected.Members != undefined 
                                        && props.collect.selected.Members.length > 0 
                                        && (needMembers >= props.collect.selected.Members.length) ?
                                        <Button
                                        onClick={saveChanges}
                                    >Сохранить изменения</Button>
                                        :
                                        <Button disabled>Исправьте ошибки...</Button>
                                }
                                </Group>
                            }
                        >
                        </RichCell>
                    </FormItem>


                </>
            )
        }; break;
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
    DeleteMemberFromCollect, setSelectedSimplePlace, setSelectedRent, AddSimpleCollect, registerMemberToSimpleCollect,
    DelSimpleCollect, setCollectItemMode, EditSimpleCollect, setSelectedMembers,
})(SimpleCollectItem)