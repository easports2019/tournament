const ANY_ACTION_TYPE = "ANY_ACTION_TYPE";

export const ampluaCathegoryTypes = [
    {id: 0, name: "Вратарь"},
    {id: 1, name: "Защитник"},
    {id: 2, name: "Полузащитник"},
    {id: 3, name: "Нападающий"},
    {id: 4, name: "Тренер"},
    {id: 5, name: "Административный персонал"},
]

export const ampluaTypes = [
    {id: 0, name: "Вратарь", isPlayer: true, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 1, name: "Правый защитник", isPlayer: true, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 2, name: "Левый защитник", isPlayer: true, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 3, name: "Центральный защитник", isPlayer: true, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 4, name: "Передний защитник", isPlayer: true, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 5, name: "Последний защитник", isPlayer: true, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 6, name: "Правый полузащитник", isPlayer: true, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 7, name: "Левый полузащитник", isPlayer: true, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 8, name: "Центральный полузащитник", isPlayer: true, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 9, name: "Атакующий полузащитник", isPlayer: true, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 10, name: "Опорный полузащитник", isPlayer: true, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 11, name: "Левый вингер", isPlayer: true, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 12, name: "Правый вингер", isPlayer: true, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 13, name: "Левый нападающий", isPlayer: true, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 14, name: "Правый нападающий", isPlayer: true, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 15, name: "Центральный нападающий", isPlayer: true, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 16, name: "Игрок под нападающими", isPlayer: true, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 17, name: "Тренер", isPlayer: false, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 18, name: "Помощник тренера", isPlayer: false, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 19, name: "Администратор команды", isPlayer: false, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 20, name: "Организатор сбора", isPlayer: false, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 21, name: "", isPlayer: false, ampluaCathegory: ampluaCathegoryTypes[0]},
    {id: 22, name: "", isPlayer: false, ampluaCathegory: ampluaCathegoryTypes[0]},
]

const initState = {

}


let ampluaReducer = (state = initState, action) => 
{
    switch (action.type){
        case ANY_ACTION_TYPE: {
            return state;
        }
        default: {
            return state;
        }
    }
}


export const anyActionCreator = (val) => {
    return {
        type: ANY_ACTION_TYPE,
        anyVal: val
    }
}


export default ampluaReducer;