const ACTION_SET_ACTIVE_MENU_ITEM = "football/mainMenu/ACTION_SET_ACTIVE_MENU_ITEM";



const initState = {
    menuItems: [{
        id: 0,
        name: "hot",
        title: "Горячее",
        position: 0,
        enabled: true,
        show: true,
    },{
        id: 1,
        name: "allTournaments",
        title: "Турниры",
        position: 1,
        enabled: true,
        show: true,
    },{
        id: 2,
        name: "profile",
        title: "Профиль",
        position: 3,
        enabled: true,
        show: true,
    },
    {
        id: 3,
        name: "addcollect",
        title: "Новый сбор",
        position: 4,
        enabled: true,
        show: false,
    },
    {
        id: 4,
        name: "viewcollect",
        title: "Сбор",
        position: 5,
        enabled: true,
        show: false,
    },
    {
        id: 5,
        name: "viewuser",
        title: "Игрок",
        position: 6,
        enabled: true,
        show: false,
    },
],
    activeItem: {id: 0, name: "hot", title: "Горячее", position: 0, enabled: true, show: true,},
}


let mainMenuReducer = (state = initState, action) => 
{
    switch (action.type){
        case ACTION_SET_ACTIVE_MENU_ITEM: {
            
            return {...state,
                activeItem: {...state.menuItems.find(it => it.name == action.menuName)}
            };
        }
        default: {
            return state;
        }
    }
}


export const setActiveMenuItem = (menuName) => {
    
    return {
        type: ACTION_SET_ACTIVE_MENU_ITEM,
        menuName
    }
}


export default mainMenuReducer;