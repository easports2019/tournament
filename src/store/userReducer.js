import { users } from "./constants/commonConstants";

const ANY_ACTION_TYPE = "ANY_ACTION_TYPE";


const initState = {
    users: [
        users[0],
        users[1],
    ]
}


let userReducer = (state = initState, action) => 
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


export default userReducer;