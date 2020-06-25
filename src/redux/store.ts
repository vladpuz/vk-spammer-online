import { Action, applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunkMiddleware, { ThunkAction } from 'redux-thunk'
import accountsReducer from './ducks/accounts/accounts-reducer'
import spamerReducer from './ducks/spamer/spamer-reducer'

const reducers = combineReducers({
  accountsReducer,
  spamerReducer
})

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunkMiddleware)))

export type ThunkType<R = void, A extends Action = Action> = ThunkAction<Promise<R>, StateType, unknown, A>
export type GetActionsType<T> = T extends { [keys: string]: infer U } ? U : never
export type StateType = ReturnType<typeof reducers>
export default store
