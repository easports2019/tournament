import {timeSlotsInOneHour} from '../../store/constants/commonConstants'

export function isDate(str) {
    return (Object.prototype.toString.call(new Date(str)) === "[object Date]");
  }
 
export const getAge = (date) => {
    if (date != undefined) 
        return Math.trunc((Date.now() - date.getTime()) / 31536000000);
    else
        return 0;
    
}

export const timeToString = (hours, minutes, seconds) => {
    
    let h = ((hours != undefined) ? (hours < 10? "0" + hours.toString(): hours.toString()) : "");
    let m = ((minutes != undefined) ? (minutes < 10? "0" + minutes.toString(): minutes.toString()) : "");
    let s = ((seconds != undefined) ? (seconds < 10 ? "0" + seconds.toString(): seconds.toString()) : "");
    let res = "";

    if (h.length > 0 && m.length > 0 && s.length > 0)
        res = h + ":" + m + ":" + s;
    else if (h.length > 0 && m.length > 0 && s.length == 0)
        res = h + ":" + m;
    else if (h.length > 0 && m.length == 0 && s.length == 0)
        res = h;
    else if (h.length == 0 && m.length > 0 && s.length > 0)
        res = m + ":" + s;
    else if (h.length == 0 && m.length == 0 && s.length > 0)
        res = s;
    else if (h.length == 0 && m.length > 0 && s.length == 0)
        res = m;
    else if (h.length > 0 && m.length == 0 && s.length > 0)
        res = h + ":" + s;
    else
        res = "";
    return res;
}

export const dateTimeToTimeString = (datetime) => {
    return timeToString(new Date(datetime).getHours(), new Date(datetime).getMinutes())
}

export const dateToString = (date, ...args) => {
    if (typeof date == "string")
        date = new Date(date);

    let newDate = date;
    let dateOptions = {
        // era: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        // timezone: 'UTC',
        // hour: 'numeric',
        // minute: 'numeric',
        // second: 'numeric'
    };

    if (args[0])
        newDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + args[0])

    if (args[1])
        newDate = new Date(newDate.getFullYear(), newDate.getMonth() + args[1], newDate.getDate())

    if (args[2])
        newDate = new Date(newDate.getFullYear() + args[2], newDate.getMonth(), newDate.getDate())

    return newDate.toLocaleString("ru", dateOptions)
}

// прибавляет к дате переданное в параметрах количество дней, месяцев, лет. первый параметр -дни, второй- месяцы и т.д.
export const addToDate = (date, ...args) => {
        
    if (typeof date == "string")
        date = new Date(date);
    
    let newDate = date;
    
    if (args[0]) // добавить дни
        newDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + args[0])

    if (args[1]) // добавить месяцы
        newDate = new Date(newDate.getFullYear(), newDate.getMonth() + args[1], newDate.getDate())

    if (args[2]) // добавить годы
        newDate = new Date(newDate.getFullYear() + args[2], newDate.getMonth(), newDate.getDate())

    return newDate;
}

// прибавляет к дате переданное в параметрах количество часов, минут, секунд. первый параметр -часы, второй- минуты и т.д.
export const addToTime = (date, ...args) => {
     
    if (typeof date == "string")
        date = new Date(date);
    
    let newDate = date;
    
    if (args[0]) // добавить часы
        newDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), newDate.getHours() + args[0])

    if (args[1]) // добавить минуты
        newDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), newDate.getHours(), newDate.getMinutes() + args[1])

    if (args[2]) // добавить секунды
        newDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), newDate.getHours(), newDate.getMinutes(), newDate.getSeconds() + args[2])

    return newDate;
}

// сравнение двух дат только по дате без времени. true - равны, false- не равны
export const datesWithoutTimeIsSame = (date1, date2) => {
    return (date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate())
}

// сравнение двух дат только по времени (часы и минуты) без даты. true - равны, false- не равны
export const timesWithoutDateHourMinuteIsSame = (date1, date2) => {
    return (date1.getHours() == date2.getHours() && date1.getMinutes() == date2.getMinutes())
}

// преобразование значения dateSelector из пакета vk ui в нативную дату JS
export const dateSelectorValueToJSDateValue = (dsValue) => {
    //{day: currentDate.getDate(), month: currentDate.getMonth()+1, year: currentDate.getFullYear()}
    return new Date(dsValue.year, dsValue.month-1, dsValue.day)
}

// преобразование нативной даты JS в значение dateSelector из пакета vk ui
export const jSDateValueToDateSelectorValue = (jsDate) => {
    
    return {day: jsDate.getDate(), month: jsDate.getMonth()+1, year: jsDate.getFullYear()}
}

// hours - количество часов в дне (по умолчанию 24 часа в сутках), slotsInHours - количество слотов под сбор в часу. по умолчанию 2 (каждые 30 минут)
export const timeSlotsForCollects = (hours=24, slotsInHour=timeSlotsInOneHour()) => {
    let slotsNumber = hours * slotsInHour;  // сколько слотов в дне
    let oneSlotMinutes = 60 / slotsInHour;  // сколько минут один слот
    let slots = [] // слоты
    
    for (let i = 0; i < slotsNumber; i++){
        slots.push({Hours: Math.trunc(i / slotsInHour), Minutes: Math.round((i / slotsInHour - Math.trunc(i / slotsInHour)) * 60), SlotMinutes: oneSlotMinutes})
    }
    
    return slots
}

export const timeSlotsForSimpleCollects = (slotsNumber, slotsInHour=timeSlotsInOneHour(), startHour) => {
    
    let oneSlotMinutes = 60 / slotsInHour;  // сколько минут один слот
    let slots = [] // слоты
    for (let i = 0; i < slotsNumber; i++)
    {
        slots.push({
            Hours: Math.trunc(i / slotsInHour) + startHour, 
            Minutes: Math.round((i / slotsInHour - Math.trunc(i / slotsInHour)) * 60), 
            SlotMinutes: oneSlotMinutes,
            Enabled: true,
            Rented: false,}
            )
    }
    
    return slots

}