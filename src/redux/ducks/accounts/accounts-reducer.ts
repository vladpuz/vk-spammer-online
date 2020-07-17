import lodash from 'lodash'
import storage from 'store2'
import * as types from './action-types'
import * as actions from './action-creators'
import { GetActionsType } from '../../store'
import { AccountType } from '../../../types/types'

export const accountsReducerState = {
  accounts: (storage.local.get('accounts') || []) as AccountType[],
  authWorkflow: {
    authInProgress: false,
    codeIsRequired: false,
    codeIsIncorrect: false,
    accountRepeated: false,
    isSuccessLogin: null as boolean | null
  }
}

export type ActionsType = ReturnType<GetActionsType<typeof actions>>

const accountsReducer = (state = accountsReducerState, action: ActionsType): typeof accountsReducerState => {
  switch (action.type) {
    case types.SET_ACCOUNTS:
      return {
        ...state,
        accounts: action.accounts
      }

    case types.ADD_ACCOUNT:
      return {
        ...state,
        accounts: [
          ...state.accounts,
          action.account
        ]
      }

    case types.REMOVE_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts.filter(account => account.profile.id !== action.userId)
      }

    case types.SHUFFLE_ACCOUNTS:
      return {
        ...state,
        accounts: lodash.shuffle(state.accounts)
      }

    case types.CLEAR_ACCOUNTS:
      return {
        ...state,
        accounts: state.accounts.filter(account => account.currentSender)
      }

    case types.SET_IS_ENABLED:
      return {
        ...state,
        accounts: state.accounts.map(account => {
          return account.profile.id === action.userId ? { ...account, isEnabled: action.isEnabled } : account
        })
      }

    case types.SET_IS_ENABLED_ALL:
      return {
        ...state,
        accounts: state.accounts.map(account => {
          return account.currentSender ? account : { ...account, isEnabled: action.isEnabled }
        })
      }

    case types.SET_CURRENT_SENDER:
      return {
        ...state,
        accounts: state.accounts.map(account => {
          return account.profile.id === action.userId
            ? { ...account, currentSender: true } : { ...account, currentSender: false }
        })
      }

    case types.CLEAR_CURRENT_SENDER:
      return {
        ...state,
        accounts: state.accounts.map(account => ({ ...account, currentSender: false }))
      }

    case types.SET_AUTH_IN_PROGRESS:
      return {
        ...state,
        authWorkflow: {
          ...state.authWorkflow,
          authInProgress: action.isFetching
        }
      }

    case types.SET_CODE_IS_REQUIRED:
      return {
        ...state,
        authWorkflow: {
          ...state.authWorkflow,
          codeIsRequired: action.isRequired
        }
      }

    case types.SET_CODE_IS_INCORRECT:
      return {
        ...state,
        authWorkflow: {
          ...state.authWorkflow,
          codeIsIncorrect: action.isIncorrect
        }
      }

    case types.SET_ACCOUNT_REPEATED:
      return {
        ...state,
        authWorkflow: {
          ...state.authWorkflow,
          accountRepeated: action.isRepeated
        }
      }

    case types.SET_IS_SUCCESS_LOGIN:
      return {
        ...state,
        authWorkflow: {
          ...state.authWorkflow,
          isSuccessLogin: action.isSuccess
        }
      }

    default:
      return state
  }
}

export default accountsReducer
