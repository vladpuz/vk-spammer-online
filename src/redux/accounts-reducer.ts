import storage from 'store2'
import lodash from 'lodash'
import { ThunkAction } from 'redux-thunk'
import { RootReducerType } from './store'
import { auth } from '../api/auth'
import { getProfileInfo } from '../api/helpers'
import { AuthAppType, IAccount } from '../types/app-types'

/* Action types */
const SET_ACCOUNTS = 'vk-spam-online/accounts/SET_ACCOUNTS' as const
const ADD_ACCOUNT = 'vk-spam-online/accounts/ADD_ACCOUNT' as const
const REMOVE_ACCOUNT = 'vk-spam-online/accounts/REMOVE_ACCOUNT' as const
const SHUFFLE_ACCOUNTS = 'vk-spam-online/accounts/SHUFFLE_ACCOUNTS' as const
const CLEAR_ACCOUNTS = 'vk-spam-online/accounts/CLEAR_ACCOUNTS' as const
const SET_IS_ENABLED = 'vk-spam-online/accounts/SET_IS_ENABLED' as const
const SET_IS_ENABLED_ALL = 'vk-spam-online/accounts/SET_IS_ENABLED_ALL' as const
const SET_CURRENT_SENDER = 'vk-spam-online/accounts/SET_CURRENT_SENDER' as const
const CLEAR_CURRENT_SENDER = 'vk-spam-online/accounts/CLEAR_CURRENT_SENDER' as const
const SET_AUTH_IN_PROGRESS = 'vk-spam-online/accounts/SET_AUTH_IN_PROGRESS' as const
const SET_CODE_IS_REQUIRED = 'vk-spam-online/accounts/SET_CODE_IS_REQUIRED' as const
const SET_CODE_IS_INCORRECT = 'vk-spam-online/accounts/SET_CODE_IS_INCORRECT' as const
const SET_ACCOUNT_REPEATED = 'vk-spam-online/accounts/SET_ACCOUNT_REPEATED' as const
const SET_IS_SUCCESS_LOGIN = 'vk-spam-online/accounts/SET_IS_SUCCESS_LOGIN' as const

const initialState = {
  accounts: (storage.local.get('accounts') || []) as Array<IAccount>,
  authWorkflow: {
    authInProgress: false,
    codeIsRequired: false,
    codeIsIncorrect: false,
    accountRepeated: false,
    isSuccessLogin: null as boolean | null
  }
}

type ActionTypes =
  ReturnType<typeof setAccounts> |
  ReturnType<typeof addAccount> |
  ReturnType<typeof removeAccount> |
  ReturnType<typeof shuffleAccounts> |
  ReturnType<typeof clearAccounts> |
  ReturnType<typeof setIsEnabled> |
  ReturnType<typeof setIsEnabledAll> |
  ReturnType<typeof setCurrentSender> |
  ReturnType<typeof clearCurrentSender> |
  ReturnType<typeof setAuthInProgress> |
  ReturnType<typeof setCodeIsRequired> |
  ReturnType<typeof setCodeIsIncorrect> |
  ReturnType<typeof setIsSuccessLogin> |
  ReturnType<typeof setAccountRepeated>

function accountsReducer (state = initialState, action: ActionTypes): typeof initialState {
  switch (action.type) {
    case SET_ACCOUNTS:
      return {
        ...state,
        accounts: action.accounts
      }

    case ADD_ACCOUNT:
      return {
        ...state,
        accounts: [
          ...state.accounts,
          action.account
        ]
      }

    case REMOVE_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts.filter(account => account.profileInfo.id !== action.userId)
      }

    case SHUFFLE_ACCOUNTS:
      return {
        ...state,
        accounts: lodash.shuffle(state.accounts)
      }

    case CLEAR_ACCOUNTS:
      return {
        ...state,
        accounts: state.accounts.filter(account => account.currentSender)
      }

    case SET_IS_ENABLED:
      return {
        ...state,
        accounts: state.accounts.map(account => {
          return account.profileInfo.id === action.userId ? { ...account, isEnabled: action.isEnabled } : account
        })
      }

    case SET_IS_ENABLED_ALL:
      return {
        ...state,
        accounts: state.accounts.map(account => {
          return account.currentSender ? account : { ...account, isEnabled: action.isEnabled }
        })
      }

    case SET_CURRENT_SENDER:
      return {
        ...state,
        accounts: state.accounts.map(account => {
          return account.profileInfo.id === action.userId
            ? { ...account, currentSender: true } : { ...account, currentSender: false }
        })
      }

    case CLEAR_CURRENT_SENDER:
      return {
        ...state,
        accounts: state.accounts.map(account => ({ ...account, currentSender: false }))
      }

    case SET_AUTH_IN_PROGRESS:
      return {
        ...state,
        authWorkflow: {
          ...state.authWorkflow,
          authInProgress: action.isFetching
        }
      }

    case SET_CODE_IS_REQUIRED:
      return {
        ...state,
        authWorkflow: {
          ...state.authWorkflow,
          codeIsRequired: action.isRequired
        }
      }

    case SET_CODE_IS_INCORRECT:
      return {
        ...state,
        authWorkflow: {
          ...state.authWorkflow,
          codeIsIncorrect: action.isIncorrect
        }
      }

    case SET_ACCOUNT_REPEATED:
      return {
        ...state,
        authWorkflow: {
          ...state.authWorkflow,
          accountRepeated: action.isRepeated
        }
      }

    case SET_IS_SUCCESS_LOGIN:
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

/* Action creators */
export const setAccounts = (accounts: Array<IAccount>) => ({
  type: SET_ACCOUNTS,
  accounts
})

export const addAccount = (account: IAccount) => ({
  type: ADD_ACCOUNT,
  account
})

export const removeAccount = (userId: number) => ({
  type: REMOVE_ACCOUNT,
  userId
})

export const shuffleAccounts = () => ({
  type: SHUFFLE_ACCOUNTS
})

export const clearAccounts = () => ({
  type: CLEAR_ACCOUNTS
})

export const setIsEnabled = (userId: number, isEnabled: boolean) => ({
  type: SET_IS_ENABLED,
  userId,
  isEnabled
})

export const setIsEnabledAll = (isEnabled: boolean) => ({
  type: SET_IS_ENABLED_ALL,
  isEnabled
})

export const setCurrentSender = (userId: number) => ({
  type: SET_CURRENT_SENDER,
  userId
})

export const clearCurrentSender = () => ({
  type: CLEAR_CURRENT_SENDER
})

export const setAuthInProgress = (isFetching: boolean) => ({
  type: SET_AUTH_IN_PROGRESS,
  isFetching
})

export const setCodeIsRequired = (isRequired: boolean) => ({
  type: SET_CODE_IS_REQUIRED,
  isRequired
})

export const setCodeIsIncorrect = (isIncorrect: boolean) => ({
  type: SET_CODE_IS_INCORRECT,
  isIncorrect
})

export const setAccountRepeated = (isRepeated: boolean) => ({
  type: SET_ACCOUNT_REPEATED,
  isRepeated
})

export const setIsSuccessLogin = (isSuccess: boolean | null) => ({
  type: SET_IS_SUCCESS_LOGIN,
  isSuccess
})

/* Thunk creators */
type ThunkType = ThunkAction<Promise<any>, RootReducerType, unknown, ActionTypes>

export const login = (app: AuthAppType, username: string, password: string, code?: number): ThunkType => {
  return async (dispatch, getState) => {
    dispatch(setAuthInProgress(true))
    const res = await auth(username, password, { app, code })

    if (!res.error) {
      const { access_token: token, user_id: userId } = res
      const profileInfo = (await getProfileInfo(token))

      if (getState().accountsReducer.accounts.some(account => account.profileInfo.id === userId)) {
        dispatch(setAccountRepeated(true))
        dispatch(removeAccount(userId))
      }

      dispatch(setIsSuccessLogin(true))
      dispatch(setCodeIsRequired(false))
      dispatch(addAccount({
        profileInfo,
        token,
        currentSender: false,
        isEnabled: true,
        error: null
      }))

      storage.local.set('accounts', getState().accountsReducer.accounts)
    } else if ((res).error === 'need_validation') {
      dispatch(setCodeIsRequired(true))
    } else if (
      (res).error_description === 'Вы ввели неправильный код' ||
      (res).error_description === 'Вы ввели неверный код'
    ) {
      dispatch(setCodeIsIncorrect(true))
    } else if ((res).error_description === 'Неправильный логин или пароль') {
      dispatch(setIsSuccessLogin(false))
    }

    dispatch(setAuthInProgress(false))
  }
}

export default accountsReducer
