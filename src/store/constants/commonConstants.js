const currentDate = new Date();


// таймслотов в одном часе
export const timeSlotsInOneHour = () => {
    return +2
}

export const getMaxNumberOfMembersInCollect = () => {
    return +30
}

export const getMinNumberOfMembersInCollect = () => {
    return +2
}

export const accessTypes = [
    {Id: 0, Name: "public"},
    {Id: 1, Name: "private"},
    {Id: 2, Name: "moderate"},
]

// тип участия в сборе
export const memberingCollectTypes = {
    Invite: 0, // приглашен
    Member: 1, // уже подтвержден (участник)
    Organizator: 2, // организатор
    Participate: 3, // попросился
    All: 4, // без фильтрации, все сборы
}

export const cityTournamentAdmins = 
[
    {
        Id: 0, Name: "Тестовый админ", UserProfileId: 49, CityId: 71, ErrorMessage: "", Published: true, Deleted: false, 
    },
]

export const TeamAdmins = 
[
    {
        Id : 0,
        Name: "Тестовая команда",
        Year: 2021,
        WhenBorn: {day: 1, month: 2, year: 2021},
        Details: "Системная",
        Logo: "",
        CityId: -1,
        TournamentGroups: [], 
        Admins: [],
        Matches: [],
        Players: [],
        Published: true,
        Deleted: false,
    },
]

export const BidTeam = {
    Id: -1,
    AdminTournamentComment: "",
    TeamName: "",
    When: { day: currentDate.getDay(), month: currentDate.getMonth() + 1, year: currentDate.getFullYear() },
    TeamId: -1, 
    Team: [],
    TournamentGroupId: -1,
    TournamentGroup: [],
    UserProfileId: -1,
    UserProfile: {},
    Approved: false,
    Deleted: false,
    Published: false,

}

export const Match = {
    Id: -1,
    Name: "Матч",
    Description: "Описание матча",
    Picture: "",
    When: { day: currentDate.getDay(), month: currentDate.getMonth() + 1, year: currentDate.getFullYear() },
    TournamentGroup: {},
    TournamentGroupId: -1,
    Place: {},
    PlaceId: -1,
    Team1: {},
    Team1Id: -1,
    Team2: {},
    Team2Id: -1,
    Team1Goals: 0,
    Team2Goals: 0,
    MatchEvents: [],
    Deleted: false,
    Published: false,
    ErrorMessage: "",

}

export const EmptyTournament = {
    Id : -1,
    Name: "",
    Year: 0,
    WhenBegin: {day: currentDate.getDay(), month: currentDate.getMonth()+1, year: currentDate.getFullYear()},
    WhenEnd: {day: currentDate.getDay(), month: currentDate.getMonth()+1, year: currentDate.getFullYear()},
    Details: "",
    Reglament: "", 
    Logo: "",
    CityId: -1,
    TournamentGroups: [], 
    Admins: [],
    Published: false,
    Deleted: false,
}


export const geo = {
    Cities: [
        {
            Id: 0,
            Name: "Кострома",
            Geo: {Latitude: 0.0000, Longitude: 0.0000},
            Population: 250000, // население города
            //users: 0, // сколько футболистов в городе
            //places: 0, // сколько мест для аренды
        },
        {
            Id: 1,
            Name: "Иваново",
            Geo: {Latitude: 1.0000, Longitude: 1.0000},
            Population: 800000, // население города
            //users: 0, // сколько футболистов в городе
            //places: 0, // сколько мест для аренды
        },
    ],
    Owners: [
        {
            Id: 0, 
            Name: "Владелец 1",
        },
        {
            Id: 1, 
            Name: "Владелец 2",
        }
    ],
}

export const places =  [
        {
            PlaceId: 0,
            Name: "Динамо", /* placename*/
            get Owner() { return geo.Owners[0]},
            set Owner(val) { geo.Owners[0] = val},
            get City() { return geo.Cities[0]},
            set City(val) { geo.Cities[0] = val},
            Address: {Index: 0, Street: "Профсоюзная", SubjectType: 'ул.', House: ""},
            Geo: "",
            //mainpicture: [{id: 0, name: "", path: ""},],  главная картинка
            Photo: [{Id: 0, Name: "", Path: ""},], // убрать свойство main
            Stages: 0,
            Parking: true,
            BicycleParking: false, // велопарковка
            Worktime: {FromHour: 8, FromMinute: 0, ToHour: 23, ToMinute: 0, Works24: false, NoBreaks: false, BreakTimes: [{FromHour: 13, FromMinute: 0, ToHour: 14, ToMinute: 0,}]},
            DressingRooms: [
                { Id: 0, RoomNumber: "", Shower: true, HotWater: true, },
                { Id: 1, RoomNumber: "", Shower: false, HotWater: false, },
            ],
            Areas: [
                { Id: 0, name: "", Width: 50, Length: 30, Height: 10, CapacitySport: 10, CapacityViewers: 30, Price: 2000 },
                { Id: 1, name: "", Width: 0, Length: 0, Height: 0, CapacitySport: 0, CapacityViewers: 0, Price: 2000 },
            ],
            Price: 2000, // цена за час занятий  (перенести в игровые зоны)
            Enabled: true,
            Access: {},
            
        },
        {
            PlaceId: 1,
            Name: "МЧС",  /* placename*/
            get Owner() {return geo.Owners[0]},
            set Owner(val) {geo.Owners[0] = val},
            get City() {return geo.Cities[0]},
            set City(val) {geo.Cities[0] = val},
            Address: {Index: 0, Street: "Вертолетчиков", SubjectType: 'городок ', House: ""},
            Geo: "",
            Photo: [{Id: 0, Name: "", Path: "", Main: true},],
            Stages: 0,
            Parking: true,
            BicycleParking: false, // велопарковка
            Worktime: {FromHour: 9, FromMinute: 0, ToHour: 22, ToMinute: 0, Works24: false, NoBreaks: false, BreakTimes: [{FromHour: 13, FromMinute: 30, ToHour: 14, ToMinute: 30,}]},
            DressingRooms: [
                { id: 0, RoomNumber: "", Shower: true, HotWater: true, },
                { id: 1, RoomNumber: "", Shower: false, HotWater: false, },
            ],
            Areas: [
                { Id: 0, Name: "", /* areaname */ Width: 0, Length: 0, Height: 0, CapacitySport: 0, CapacityViewers: 0, Price: 1800  },
                { Id: 1, Name: "", Width: 0, Length: 0, Height: 0, CapacitySport: 0, CapacityViewers: 0, Price: 1800  },
            ],
            Price: 1800, /* цена за час занятий, перенести в areas */
            Enabled: true,
            Access: {},
            
        },
        {   
            PlaceId: 2,
            Name: "КГТУ",  /* placename*/
            get Owner() {return geo.Owners[0]},
            set Owner(val) {geo.Owners[0] = val},
            get City() {return geo.Cities[0]},
            set City(val) {geo.Cities[0] = val},
            Address: {Index: 0, Street: "Дзжержинского", SubjectType: 'улица ', House: "12"},
            Geo: "",
            Photo: [{Id: 0, Name: "", Path: "", Main: true},],
            Stages: 0,
            Parking: true,
            BicycleParking: false, // велопарковка
            Worktime: {FromHour: 9, FromMinute: 0, ToHour: 22, ToMinute: 0, Works24: false, NoBreaks: false, BreakTimes: [{FromHour: 13, FromMinute: 30, ToHour: 14, ToMinute: 30,}]},
            DressingRooms: [
                { id: 0, RoomNumber: "", Shower: true, HotWater: true, },
                { id: 1, RoomNumber: "", Shower: false, HotWater: false, },
            ],
            Areas: [
                { Id: 0, Name: "", /* areaname */ Width: 0, Length: 0, Height: 0, CapacitySport: 0, CapacityViewers: 0, Price: 1800  },
                { Id: 1, Name: "", Width: 40, Length: 20, Height: 0, CapacitySport: 0, CapacityViewers: 0, Price: 1800  },
            ],
            Price: 1800, /* цена за час занятий, перенести в areas */
            Enabled: true,
            Access: {},
            
        }
    ]

    export const ampluaCathegoryTypes = [
        {Id: 0, Name: "Вратарь"},
        {Id: 1, Name: "Защитник"},
        {Id: 2, Name: "Полузащитник"},
        {Id: 3, Name: "Нападающий"},
        {Id: 4, Name: "Тренер"},
        {Id: 5, Name: "Административный персонал"},
        {Id: 6, Name: "Игрок"},
    ]
     
    export const ampluaTypes = [
        {Id: 0, Name: "Вратарь", IsPlayer: true, AmpluaCathegory: ampluaCathegoryTypes[0]},
        {Id: 1, Name: "Правый защитник", IsPlayer: true, AmpluaCathegory: ampluaCathegoryTypes[1]},
        {Id: 2, Name: "Левый защитник", IsPlayer: true, AmpluaCathegory: ampluaCathegoryTypes[1]},
        {Id: 3, Name: "Центральный защитник", IsPlayer: true, AmpluaCathegory: ampluaCathegoryTypes[1]},
        {Id: 4, Name: "Передний защитник", IsPlayer: true, AmpluaCathegory: ampluaCathegoryTypes[1]},
        {Id: 5, Name: "Последний защитник", IsPlayer: true, AmpluaCathegory: ampluaCathegoryTypes[1]},
        {Id: 6, Name: "Правый полузащитник", IsPlayer: true, AmpluaCathegory: ampluaCathegoryTypes[2]},
        {Id: 7, Name: "Левый полузащитник", IsPlayer: true, AmpluaCathegory: ampluaCathegoryTypes[2]},
        {Id: 8, Name: "Центральный полузащитник", IsPlayer: true, AmpluaCathegory: ampluaCathegoryTypes[2]},
        {Id: 9, Name: "Атакующий полузащитник", IsPlayer: true, AmpluaCathegory: ampluaCathegoryTypes[2]},
        {Id: 10, Name: "Опорный полузащитник", IsPlayer: true, AmpluaCathegory: ampluaCathegoryTypes[2]},
        {Id: 11, Name: "Левый вингер", IsPlayer: true, AmpluaCathegory: ampluaCathegoryTypes[2]},
        {Id: 12, Name: "Правый вингер", IsPlayer: true, AmpluaCathegory: ampluaCathegoryTypes[2]},
        {Id: 13, Name: "Левый нападающий", IsPlayer: true, AmpluaCathegory: ampluaCathegoryTypes[3]},
        {Id: 14, Name: "Правый нападающий", IsPlayer: true, AmpluaCathegory: ampluaCathegoryTypes[3]},
        {Id: 15, Name: "Центральный нападающий", IsPlayer: true, AmpluaCathegory: ampluaCathegoryTypes[3]},
        {Id: 16, Name: "Игрок под нападающими", IsPlayer: true, AmpluaCathegory: ampluaCathegoryTypes[3]},
        {Id: 17, Name: "Тренер", IsPlayer: false, AmpluaCathegory: ampluaCathegoryTypes[4]},
        {Id: 18, Name: "Помощник тренера", IsPlayer: false, AmpluaCathegory: ampluaCathegoryTypes[4]},
        {Id: 19, Name: "Администратор команды", IsPlayer: false, AmpluaCathegory: ampluaCathegoryTypes[5]},
        {Id: 20, Name: "Организатор сбора", IsPlayer: false, AmpluaCathegory: ampluaCathegoryTypes[5]},
        {Id: 21, Name: "Игрок", IsPlayer: true, AmpluaCathegory: ampluaCathegoryTypes[6]},
        {Id: 22, Name: "", IsPlayer: false, AmpluaCathegory: ampluaCathegoryTypes[0]},
    ]


export const users = [
    {
        Id: 0,
        FirstName: "Александр",
        SurName: "Смирнов",
        FatherName: "Евгеньевич",
        NickName: "easports",
        Photo: "/img/users/kostroma/alexsmirnov290587-01.jpg",
        Datebirth: new Date("05.29.1987"),
        Leg: 0, // 0-both, 1-left, 2-right
        CityFrom: {...geo.Cities[0] },
        CityNow: {...geo.Cities[0] },
        Level: {Total: 100, ShotStrong: 100, LongShotAccuracy: 100, ShortShotAccuracy: 100, RunSpeed: 100, ShortPassingSpeed: 100, LongPassingSpeed: 100,
                ShortPassingAccuracy: 100, LongPassingAccuracy: 100, 
                Stamina: 100, // выносливость
                Feints: 100, // финты
                Reaction: 100, // реакция
                ScoringFlair: 100, // голевое чутье
                Intellect: 100, // ум
                Rejection: 100, // отбор мяча
                SlideEffect: 100, // игра в подкате
                Header: 100, // игра головой
                Creativity: 100, // креативность
                Dribble: 100, // дрибблинг
                Opening: 100, // открывание под пас
                Charisma: 100, // харизма
                BallTaking: 100, // прием мяча
                FieldVision: 100, // видение поля
                BallWorkTime: 100, // время работы с мячом (передерживает или сразу отдает передачу)
                OneTouchGameAccuracy: 100, // точность игры в одно касание
                OneTouchGameFrequency: 100, // частота игры в одно касание (всегда человек отдает сразу ли редко играет в одно касание),
                PsichologyStability: 100, // психическая устойчивость (чем выше, тем стабильнее и спокойнее человек, чем ниже, тем взрывнее, вспыльчивее)
        },
        CurrentPhisicalForm: 100, // текущая физическая форма
        Injury: {WhenInjuried: new Date(), Comment: ""},
        Amplua: [{
            Id: 0, 
            Amplua: {...ampluaTypes[0] }, //  амплуа 
            KeyValuePercent: 90 // выборка из 100% насколько это моя ключевая позиция (в совокупности все поля не могут превышать 100%)
        }, {id: 3, amplua: {...ampluaTypes[1] }, KeyValuePercent: 10}],
        KeyFunctions: [{Id: 2, Name: "Монстр выходов", Comment: "Идеальная игра на выходах"}, 
                        {Id: 8, Name: "Вырвинога", Comment: "Не жалеет соперника, играет всегда до конца"}], // прозвища, характеризующие стиль игры человека, дают другие пользователи, 

    },
    {
        Id: 1,
        FirstName: "Евгений",
        SurName: "Иванов",
        FatherName: "Валерьевич",
        NickName: "eivanov",
        Photo: "/img/users/kostroma/eivanov010180-01.jpg",
        Datebirth: new Date("28.02.1983"),
        Leg: 1, // 0-both, 1-left, 2-right
        CityFrom: {...geo.Cities[0] },
        CityNow: {...geo.Cities[0] },
        Level: {Total: 100, ShotStrong: 100, LongShotAccuracy: 100, ShortShotAccuracy: 100, RunSpeed: 100, ShortPassingSpeed: 100, LongPassingSpeed: 100,
            ShortPassingAccuracy: 100, LongPassingAccuracy: 100, 
            Stamina: 100, // выносливость
            Feints: 100, // финты
            Reaction: 100, // реакция
            ScoringFlair: 100, // голевое чутье
            Intellect: 100, // ум
            Rejection: 100, // отбор мяча
            SlideEffect: 100, // игра в подкате
            Header: 100, // игра головой
            Creativity: 100, // креативность
            Dribble: 100, // дрибблинг
            Opening: 100, // открывание под пас
            Charisma: 100, // харизма
            BallTaking: 100, // прием мяча
            FieldVision: 100, // видение поля
            BallWorkTime: 100, // время работы с мячом (передерживает или сразу отдает передачу)
            OneTouchGameAccuracy: 100, // точность игры в одно касание
            OneTouchGameFrequency: 100, // частота игры в одно касание (всегда человек отдает сразу ли редко играет в одно касание),
            PsichologyStability: 100, // психическая устойчивость (чем выше, тем стабильнее и спокойнее человек, чем ниже, тем взрывнее, вспыльчивее)
    },
        CurrentPhisicalForm: 100, // текущая физическая форма
        Injury: {WhenInjuried: new Date(), Comment: ""},
        Amplua: [{
            Id: 0, 
            Amplua: {...ampluaTypes[0] }, //  амплуа 
            KeyValuePercent: 90 // выборка из 100% насколько это моя ключевая позиция (в совокупности все поля не могут превышать 100%)
        }, {Id: 3, Amplua: {...ampluaTypes[1] }, KeyValuePercent: 10}],
        KeyFunctions: [{Id: 2, Name: "Монстр выходов", Comment: "Идеальная игра на выходах"}, 
                        {Id: 8, Name: "Вырвинога", Comment: "Не жалеет соперника, играет всегда до конца"}], // прозвища, характеризующие стиль игры человека, дают другие пользователи, 

    },
    {
        Id: 2,
        FirstName: "Фёдор",
        SurName: "Смолов",
        FatherName: "Валерьевич",
        NickName: "fsmolov",
        Photo: "/img/users/kostroma/fsmolov010189-01.jpg",
        Datebirth: new Date("01.01.1989"),
        Leg: 0, // 0-both, 1-left, 2-right
        CityFrom: {...geo.Cities[0] },
        CityNow: {...geo.Cities[0] },
        Level: {Total: 100, ShotStrong: 100, LongShotAccuracy: 100, ShortShotAccuracy: 100, RunSpeed: 100, ShortPassingSpeed: 100, LongPassingSpeed: 100,
            ShortPassingAccuracy: 100, LongPassingAccuracy: 100, 
            Stamina: 100, // выносливость
            Feints: 100, // финты
            Reaction: 100, // реакция
            ScoringFlair: 100, // голевое чутье
            Intellect: 100, // ум
            Rejection: 100, // отбор мяча
            SlideEffect: 100, // игра в подкате
            Header: 100, // игра головой
            Creativity: 100, // креативность
            Dribble: 100, // дрибблинг
            Opening: 100, // открывание под пас
            Charisma: 100, // харизма
            BallTaking: 100, // прием мяча
            FieldVision: 100, // видение поля
            BallWorkTime: 100, // время работы с мячом (передерживает или сразу отдает передачу)
            OneTouchGameAccuracy: 100, // точность игры в одно касание
            OneTouchGameFrequency: 100, // частота игры в одно касание (всегда человек отдает сразу ли редко играет в одно касание),
            PsichologyStability: 100, // психическая устойчивость (чем выше, тем стабильнее и спокойнее человек, чем ниже, тем взрывнее, вспыльчивее)
    },
        CurrentPhisicalForm: 100, // текущая физическая форма
        Injury: {WhenInjuried: new Date(), Comment: ""},
        Amplua: [{
            Id: 0, 
            Amplua: {...ampluaTypes[0] }, //  амплуа 
            KeyValuePercent: 90 // выборка из 100% насколько это моя ключевая позиция (в совокупности все поля не могут превышать 100%)
        }, {Id: 3, Amplua: {...ampluaTypes[1] }, KeyValuePercent: 10}],
        KeyFunctions: [{Id: 2, Name: "Монстр выходов", Comment: "Идеальная игра на выходах"}, 
                        {Id: 8, Name: "Вырвинога", Comment: "Не жалеет соперника, играет всегда до конца"}], // прозвища, характеризующие стиль игры человека, дают другие пользователи, 

    },
]

export const myProfile = {
    myProfile: users[0],
}


export class commonUtils  {

    static deepClone = (obj) => {
        const clObj = {};
        for(const i in obj) {
            if (obj[i] instanceof Object) {
                clObj[i] = this.deepClone(obj[i]);
                continue;
            }
            clObj[i] = obj[i];
        }
        return clObj;
    }

    static copyCity = (city_source) => {
        return city_source;
    }

    static copyAmplua = (amplua_source) => {
        return amplua_source
    }

    static copyKeyFunction = (keyFunction_source) => {
        return keyFunction_source
    }

    static copyUser = (user_source) => {
        if (user_source == undefined || Object.keys(user_source).length === 0)
            return undefined

        return {
            Id: user_source.Id,
            FirstName: user_source.FirstName,
            SurName: user_source.SurName,
            FatherName: user_source.FatherName,
            NickName: user_source.NickName,
            Datebirth: user_source.Datebirth,
            Leg: user_source.Leg, // 0-both, 1-left, 2-right
            CityFrom: { ...this.copyCity(user_source.CityFrom) },
            CityNow: { ...this.copyCity(user_source.CityNow) },
            Level: {...user_source.Level
            },
            CurrentPhisicalForm: user_source.CurrentPhisicalForm, // текущая физическая форма
            Injury: {...user_source.Injury},
            Amplua: [...(user_source.Amplua && user_source.Amplua.length ? user_source.Amplua.map(amp => this.copyAmplua(amp)): [{}] )],
            KeyFunctions: [...(user_source.KeyFunctions && user_source.KeyFunctions.length ? user_source.KeyFunctions.map(keyF => this.copyKeyFunction(keyF)): [{}])], // прозвища, характеризующие стиль игры человека, дают другие пользователи, 
        }
            
    }

    static copyOwner = (owner_source) => {
        return {...owner_source}
    }
    
    static copyAccess = (access_source) => {
        return {...access_source}
    }

    static copyPlace = (place_source) => {
        
        if (place_source == undefined || Object.keys(place_source).length === 0)
            return undefined

        return {
            Id: place_source.Id,
            Name: place_source.Name,
            Owner: {...this.copyOwner(place_source.Owner)},
            City: {...this.copyCity(place_source.City)},
            Address: {...place_source.Address},
            Geo: {...place_source.Geo},
            Photo: [...place_source.Photo],
            Stages: place_source.Stages,
            Parking: place_source.Parking,
            Worktime: {...place_source.Worktime, BreakTimes: [...place_source.Worktime.BreakTimes]},
            DressingRooms: [...place_source.DressingRooms],
            Areas: [...place_source.Areas],
            Price: place_source.Price, // цена за час занятий
            Enabled: place_source.Enabled,
            Access: {...this.copyAccess(place_source.Access)},
        }
    }

    static copyCollect = (collect_source) => {
        
        if (collect_source == undefined || Object.keys(collect_source).length === 0) 
            return undefined

        return {
            Id: collect_source.Id,
            Place: this.copyPlace(collect_source.Place),
            Date: collect_source.Date,
            Hour: collect_source.Hour,
            Minute: collect_source.Minute,
            DurationMinutes: collect_source.DurationMinutes,
            Price: collect_source.Price, // цена за весь период
            Options: [...collect_source.Options],
            FixedByMemberPrice: collect_source.FixedByMemberPrice,
            /*
            описание доступа. выкладывается список доступных ролей на сборе. они описаны в usersGroups

            */
        UsersGroups: [...collect_source.UsersGroups.map(uGroup => {
            return {
                Id: uGroup.Id,
                Amplua: {...this.copyAmplua(uGroup.Amplua)},
                NumberOf: uGroup.NumberOf,  // количество участников 
                Access: {...this.copyAccess(uGroup.Access)}, // доступ на 
                Players: [...(uGroup.Players && uGroup.Players.length ? uGroup.Players.map(user => 
                    {
                        return {User: {...this.copyUser(user.User)}, Payment: {}}
                    }): 
                [{}])],
                Price: uGroup.Price,
                OrganizatorIsMember: uGroup.OrganizatorIsMember,
            }
        })],
            UsersInvited: [
                ...collect_source.UsersInvited.map(uInvited => {
                    
                    return {
                        Id: uInvited.Id,
                        ToBe: {...this.copyAmplua(uInvited.ToBe)}, 
                        User: {...this.copyUser(uInvited.User)},
                    }
                })
            ],
            UsersWantsToParticipate: [
                ...collect_source.UsersWantsToParticipate.map(uWP => {
                    
                    return {
                        
                        Id: uWP.Id,
                        ToBe: {...this.copyAmplua(uWP.ToBe)}, 
                        User: {...this.copyUser(uWP.User)},
                    }
                })
            ],
            Access: { ...this.copyAccess(collect_source.Access) },
            Permanent: collect_source.Permanent,
            OrganizatorIsMember: collect_source.OrganizatorIsMember,
            AcceptedByPlaceOwner: collect_source.AcceptedByPlaceOwner, // сбор подтвержден арендодателем и занесен в расписание. на это время больше нельзя бронировать. 
            Organizer: {...this.copyUser(collect_source.Organizer)}
        }
    }

}