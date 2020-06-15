import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import accountsReducer from './accounts-reducer'
import spamerReducer from './spamer-reducer'

const rootReducer = combineReducers({
  accountsReducer,
  spamerReducer
})

export type RootReducerType = ReturnType<typeof rootReducer>

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware)))

export default store
