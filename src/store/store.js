import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import profileReducer from './profileReducer.js'
import collectReducer from './collectReducer.js'
import userReducer from './userReducer.js'
import hot from './hotReducer.js'
import tournaments from './tournamentsReducer.js'
import ampluaReducer from './ampluaReducer.js'
import placeReducer from './placeReducer.js'
import paymentReducer from './paymentReducer.js'
import mainMenuReducer from './mainMenuReducer.js'
import systemReducer from './systemReducer.js'
import cityReducer from './cityReducer.js'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      name: 'MyApp', actionsBlacklist: ['REDUX_STORAGE_SAVE']
    }) : compose;


let reducers = combineReducers({
    profileEntity: profileReducer,
    collectEntity: collectReducer,
    hotEntity: hot,
    tournamentsEntity: tournaments,
    userEntity: userReducer,
    cityEntity: cityReducer,
    ampluaEntity: ampluaReducer,
    placeEntity: placeReducer,
    paymentEntity: paymentReducer,
    mainMenu: mainMenuReducer,
    system: systemReducer,
})

// const middlewareEnhancer = applyMiddleware(thunkMiddleware)
// const composedEnhancers = compose(middlewareEnhancer, monitorReducerEnhancer)
// composeEnhancers(
//     applyMiddleware(thunk))

//let store = createStore(reducers, composeWithDevTools(applyMiddleware(thunkMiddleware)));
let store = createStore(reducers, composeEnhancers(applyMiddleware(thunkMiddleware)));
window.store = store;

export default store