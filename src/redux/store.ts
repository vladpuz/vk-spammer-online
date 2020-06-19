import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import accountsReducer from './ducks/accounts/reducer'
import spamerReducer from './ducks/spamer/reducer'

const reducers = combineReducers({
  accountsReducer,
  spamerReducer
})

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunkMiddleware)))

export type GetActionsType<T> = T extends { [keys: string]: infer U } ? U : never
export type StateType = ReturnType<typeof reducers>
export default store
