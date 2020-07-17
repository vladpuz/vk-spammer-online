import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import stop from './stop'
import { addLogItem } from '../../../ducks/spamer/action-creators'
import {
  CLEAR_CANCELERS,
  SET_ADDRESSEE_INDEX,
  SET_AUTO_SWITCH_REMAINING,
  SET_SENDER_INDEX,
  SET_SPAM_ON_PAUSE,
  SET_SPAM_ON_RUN
} from '../../../ducks/spamer/action-types'
import { CLEAR_CURRENT_SENDER } from '../../../ducks/accounts/action-types'
import { accountsReducerState } from '../../../ducks/accounts/accounts-reducer'
import { spamerReducerState } from '../../../ducks/spamer/spamer-reducer'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

it('stop thunk', async () => {
  const logItem = addLogItem('test', 'success', 'test')
  const expectedActions = [
    { type: CLEAR_CANCELERS },
    { type: SET_SENDER_INDEX, index: 0 },
    { type: SET_ADDRESSEE_INDEX, index: 0 },
    { type: SET_AUTO_SWITCH_REMAINING, seconds: 10 },
    { type: SET_SPAM_ON_RUN, onRun: false },
    { type: SET_SPAM_ON_PAUSE, onPause: false },
    { type: CLEAR_CURRENT_SENDER },
    logItem
  ]
  const store = mockStore({
    accountsReducer: accountsReducerState,
    spamerReducer: spamerReducerState
  })

  await store.dispatch<any>(stop(
    logItem,
    10
  ))

  expect(store.getActions()).toEqual(expectedActions)
})
