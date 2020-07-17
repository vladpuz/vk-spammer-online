import accountsReducer, { accountsReducerState } from './accounts-reducer'
import * as actions from './action-creators'
import { AccountType } from '../../../types/types'

describe('accountsReducer', () => {
  test('setAccounts', () => {
    // Arrange
    const accounts: AccountType[] = [
      {
        profile: {
          id: 1,
          first_name: 'test1',
          last_name: 'test1',
          is_closed: false,
          can_access_closed: false,
          photo_50: 'photoStr'
        },
        token: 'tokenStr',
        currentSender: false,
        isEnabled: true,
        error: null
      }
    ]
    const action = actions.setAccounts(accounts)

    // Act
    const state = accountsReducer(accountsReducerState, action)

    // Assert
    expect(state.accounts).toEqual(accounts)
  })

  test('addAccount', () => {
    // Arrange
    const account: AccountType = {
      profile: {
        id: 1,
        first_name: 'test1',
        last_name: 'test1',
        is_closed: false,
        can_access_closed: false,
        photo_50: 'photoStr'
      },
      token: 'tokenStr',
      currentSender: false,
      isEnabled: true,
      error: null
    }
    const action = actions.addAccount(account)

    // Act
    const state = accountsReducer(accountsReducerState, action)

    // Assert
    expect(state.accounts).toEqual([account])
  })
})
