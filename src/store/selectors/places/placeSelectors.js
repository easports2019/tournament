
// принимает место, дату, время, длительность. возвращает массив со статусами на каждый промежуток времени. Статусы: [занято, доступно, закрыто, выбрано]
export const getPlaceWorkout = (place, collectsOnThisDate, date, time, durationMinutes, timeSlotTable) => {
    
    // let collectsItems = workoutTable.map(item => {
    //     let slotTime = item.hours*60 + item.minutes; // текущий проверяемый слот времени в расписании дня

    //     // пробегаем по всем сборам, если есть совпадение с текущим слотом, значит выставляем флаг "занято"
    //     let busyList = undefined;
    //     if (props.place.worktime.breakTimes && Array.isArray(props.place.worktime.breakTimes) && props.place.worktime.breakTimes.length > 0)
    //         busyList = collectsPerDay
    //         .find(itm => {
    //             let startTime = itm.hour*60 + itm.minute;  // время начала текущего проверяемого слота
    //             let endTime = itm.hour*60 + itm.minute + itm.durationMinutes; // время окончания текущего проверяемого слота
                
    //             return (startTime <= slotTime && slotTime < endTime)            
    //         })

    //     // пробегаем по списку перерывов площадки, ищем совпадение с текущим слотом
    //     let breakList = undefined;
    //     if (props.place.worktime.breakTimes && Array.isArray(props.place.worktime.breakTimes) && props.place.worktime.breakTimes.length > 0)
    //         breakList = props.place.worktime.breakTimes
    //         .find(itm => {
    //             let startTime = itm.fromHour*60 + itm.fromMinute;  // время начала текущего проверяемого слота
    //             let endTime = itm.toHour*60 + itm.toMinute; // время окончания текущего проверяемого слота
                
    //             return (startTime <= slotTime && slotTime < endTime)            
    //         })

    //     // расчет времени начала и окончания работы площадки
    //     let placeWorkoutDayStart = placeWorkout.fromHour*60 + placeWorkout.fromMinute; // время начала работы площадки
    //     let placeWorkoutDayEnd = placeWorkout.toHour*60 + placeWorkout.toMinute; // время окончания работы площадки

    //     if (hours != -1 && minutes != -1){
            
    //         if (hours == item.hours && minutes == item.minutes && datesWithoutTimeIsSame(date, currentDate))
    //             return <Div><Cell key={+(item.hours.toString() + item.minutes.toString())} before={<Icon28DoneOutline/>}>{item.hours}:{item.minutes} Выбрано</Cell></Div>}
        
    //     // создание листа для отрисовки текущего расписания
    //     if (busyList != undefined) // текущий слот забронирован кем-то
    //         return <Div><Cell before={<Icon28GameOutline/>}>{item.hours}:{item.minutes} занято</Cell></Div>
    //     else
    //         if (placeWorkoutDayStart > slotTime || placeWorkoutDayEnd <= slotTime ) // проверка не находится ли текущий слот в нерабочем времени площадки
    //             return <Div><Cell key={+(item.hours.toString() + item.minutes.toString())} before={<Icon28BlockOutline/>}>{item.hours}:{item.minutes} закрыто</Cell></Div>
    //         else
    //             if (breakList != undefined)
    //                 return <Div><Cell key={+(item.hours.toString() + item.minutes.toString())} before={<Icon28LockOutline/>}>{item.hours}:{item.minutes} перерыв</Cell></Div>
                    
    //             else
    //                 return <Div> {props.canSelect ? <Button key={+(item.hours.toString() + item.minutes.toString())} onClick={() => props.onChange(item.hours, item.minutes)}>{item.hours}:{item.minutes} Выбрать</Button> :
    //                     <Cell key={+(item.hours.toString() + item.minutes.toString())} before={<Icon28ChevronRightCircleOutline/>}>{item.hours}:{item.minutes} Свободно</Cell>
    //                 }</Div>
    // })
}

export const nextTimeSlotIsAvailable = (collectList, time, durationMinutes, place) => {

    
    let commonResult = true;
    let hours = time.hours;
    let minutes = time.minutes;
    let placeWorkout = place.worktime;


    // подсказка по структуре данных
    // place.worktime: {fromHour: 8, fromMinute: 0, toHour: 23, toMinute: 0, works24: false, noBreaks: false, 
    // place.worktime.breakTimes: [{fromHour: 13, fromMinute: 0, toHour: 14, toMinute: 0,}]},
    // time:  {hours: props.selectedCollect.hours, minutes: props.selectedCollect.minutes}
    // collectList [{hour: 9, minute: 0, durationMinutes: 90,}]


    // проверяем расписание работы места, не попадаем ли вне времени работы
    if (hours * 60 + minutes + durationMinutes > placeWorkout.toHour*60 + placeWorkout.toMinute ||
        hours * 60 + minutes + durationMinutes <= placeWorkout.fromHour*60 + placeWorkout.fromMinute)
        return false;

    // проверка расписания перерывов, не попадаем ли на перерыв
    if (placeWorkout.breakTimes && placeWorkout.breakTimes.length > 0)
        placeWorkout.breakTimes.forEach(breaktime => {
            if (breaktime.fromHour*60 + breaktime.fromMinute < hours * 60 + minutes + durationMinutes && 
             breaktime.toHour*60 + breaktime.toMinute >= hours * 60 + minutes + durationMinutes)
                commonResult = false;
        });
        
        
    // проверка по списку согласованных сборов, не попадаем ли мы на время какого-то из них
    if (collectList && collectList.length > 0)
        collectList.forEach(collect => {
            if (collect.hour*60 + collect.minute < hours * 60 + minutes + durationMinutes && 
                collect.hour*60 + collect.minute + collect.durationMinutes >= hours * 60 + minutes + durationMinutes)
                   commonResult = false;
        });

    
// проверить совпадение выбранного времени плюс длительность с границами часов работы, перерывами и занятыми часами

    


    return commonResult;
}