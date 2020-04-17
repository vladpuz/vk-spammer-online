import { ThunkAction } from 'redux-thunk'
import { RootReducerType } from './store'
import { AuthAppType, IAccount, IAuthNeed2FA, IAuthSuccess } from '../types/types'
import { auth } from '../api/auth'
import { getProfileInfo } from '../api/getProfileInfo'
import shuffle from '../utils/shuffle'
import bs from '../utils/BrowserStorage'

/* Action types */
const SET_ACCOUNTS = 'vk_spamer_online/accounts/SET_ACCOUNTS' as const
const ADD_ACCOUNT = 'vk_spamer_online/accounts/ADD_ACCOUNT' as const
const REMOVE_ACCOUNT = 'vk_spamer_online/accounts/REMOVE_ACCOUNT' as const
const SHUFFLE_ACCOUNTS = 'vk_spamer_online/accounts/SHUFFLE_ACCOUNTS' as const
const CLEAR_ACCOUNTS = 'vk_spamer_online/accounts/CLEAR_ACCOUNTS' as const
const SET_IS_ENABLED = 'vk_spamer_online/accounts/SET_IS_ENABLED' as const
const SET_IS_ENABLED_ALL = 'vk_spamer_online/accounts/SET_IS_ENABLED_ALL' as const
const SET_CURRENT_SENDER = 'vk_spamer_online/accounts/SET_CURRENT_SENDER' as const
const CLEAR_CURRENT_SENDER = 'vk_spamer_online/accounts/CLEAR_CURRENT_SENDER' as const
const SET_AUTH_IN_PROGRESS = 'vk_spamer_online/accounts/SET_AUTH_IN_PROGRESS' as const
const SET_CODE_IS_REQUIRED = 'vk_spamer_online/accounts/SET_CODE_IS_REQUIRED' as const
const SET_CODE_IS_INCORRECT = 'vk_spamer_online/accounts/SET_CODE_IS_INCORRECT' as const
const SET_ACCOUNT_REPEATED = 'vk_spamer_online/accounts/SET_ACCOUNT_REPEATED' as const
const SET_IS_SUCCESS_LOGIN = 'vk_spamer_online/accounts/SET_IS_SUCCESS_LOGIN' as const

const initialState = {
  accounts: (bs.local.get('accounts') || []) as Array<IAccount>,
  authWorkflow: {
    authInProgress: false,
    codeIsRequired: false,
    codeIsIncorrect: false,
    accountRepeated: false,
    isSuccessLogin: null as boolean | null,
  },
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
        accounts: action.accounts,
      }

    case ADD_ACCOUNT:
      return {
        ...state,
        accounts: [
          ...state.accounts,
          action.account,
        ],
      }

    case REMOVE_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts.filter(account => account.profileInfo.id !== action.userID),
      }

    case SHUFFLE_ACCOUNTS:
      return {
        ...state,
        accounts: shuffle(state.accounts),
      }

    case CLEAR_ACCOUNTS:
      return {
        ...state,
        accounts: state.accounts.filter(account => account.currentSender),
      }

    case SET_IS_ENABLED:
      return {
        ...state,
        accounts: state.accounts.map(account => {
          return account.profileInfo.id === action.userID ? { ...account, isEnabled: action.isEnabled } : account
        }),
      }

    case SET_IS_ENABLED_ALL:
      return {
        ...state,
        accounts: state.accounts.map(account => {
          return account.currentSender ? account : { ...account, isEnabled: action.isEnabled }
        }),
      }

    case SET_CURRENT_SENDER:
      return {
        ...state,
        accounts: state.accounts.map(account => {
          return account.profileInfo.id === action.userID ?
            { ...account, currentSender: true } : { ...account, currentSender: false }
        }),
      }

    case CLEAR_CURRENT_SENDER:
      return {
        ...state,
        accounts: state.accounts.map(account => ({ ...account, currentSender: false })),
      }

    case SET_AUTH_IN_PROGRESS:
      return {
        ...state,
        authWorkflow: {
          ...state.authWorkflow,
          authInProgress: action.isFetching,
        },
      }

    case SET_CODE_IS_REQUIRED:
      return {
        ...state,
        authWorkflow: {
          ...state.authWorkflow,
          codeIsRequired: action.isRequired,
        },
      }

    case SET_CODE_IS_INCORRECT:
      return {
        ...state,
        authWorkflow: {
          ...state.authWorkflow,
          codeIsIncorrect: action.isIncorrect,
        },
      }

    case SET_ACCOUNT_REPEATED:
      return {
        ...state,
        authWorkflow: {
          ...state.authWorkflow,
          accountRepeated: action.isRepeated,
        },
      }

    case SET_IS_SUCCESS_LOGIN:
      return {
        ...state,
        authWorkflow: {
          ...state.authWorkflow,
          isSuccessLogin: action.isSuccess,
        },
      }

    default:
      return state
  }
}

/* Action creators */
export const setAccounts = (accounts: Array<IAccount>) => ({
  type: SET_ACCOUNTS,
  accounts,
})

export const addAccount = (account: IAccount) => ({
  type: ADD_ACCOUNT,
  account,
})

export const removeAccount = (userID: number) => ({
  type: REMOVE_ACCOUNT,
  userID,
})

export const shuffleAccounts = () => ({
  type: SHUFFLE_ACCOUNTS,
})

export const clearAccounts = () => ({
  type: CLEAR_ACCOUNTS,
})

export const setIsEnabled = (userID: number, isEnabled: boolean) => ({
  type: SET_IS_ENABLED,
  userID,
  isEnabled,
})

export const setIsEnabledAll = (isEnabled: boolean) => ({
  type: SET_IS_ENABLED_ALL,
  isEnabled,
})

export const setCurrentSender = (userID: number) => ({
  type: SET_CURRENT_SENDER,
  userID,
})

export const clearCurrentSender = () => ({
  type: CLEAR_CURRENT_SENDER,
})

export const setAuthInProgress = (isFetching: boolean) => ({
  type: SET_AUTH_IN_PROGRESS,
  isFetching,
})

export const setCodeIsRequired = (isRequired: boolean) => ({
  type: SET_CODE_IS_REQUIRED,
  isRequired,
})

export const setCodeIsIncorrect = (isIncorrect: boolean) => ({
  type: SET_CODE_IS_INCORRECT,
  isIncorrect,
})

export const setAccountRepeated = (isRepeated: boolean) => ({
  type: SET_ACCOUNT_REPEATED,
  isRepeated,
})

export const setIsSuccessLogin = (isSuccess: boolean | null) => ({
  type: SET_IS_SUCCESS_LOGIN,
  isSuccess,
})

/* Thunk creators */
type ThunkType = ThunkAction<Promise<any>, RootReducerType, unknown, ActionTypes>

export const authAccount = (app: AuthAppType, username: string, password: string, code?: number): ThunkType => {
  return async (dispatch, getState) => {
    dispatch(setAuthInProgress(true))
    const res = await auth(app, username, password, code)

    if (!(res as IAuthNeed2FA).error) {
      const { access_token: token, user_id: userID } = res as IAuthSuccess
      const profileInfo = (await getProfileInfo(token, userID))

      if (getState().accountsReducer.accounts.some(account => account.profileInfo.id === userID)) {
        dispatch(setAccountRepeated(true))
        dispatch(removeAccount(userID))
      }

      dispatch(setIsSuccessLogin(true))
      dispatch(setCodeIsRequired(false))
      dispatch(addAccount({
        profileInfo,
        token,
        currentSender: false,
        isEnabled: true,
        error: null,
      }))

      bs.local.set('accounts', getState().accountsReducer.accounts)
    } else if ((res as IAuthNeed2FA).error === 'need_validation') {
      dispatch(setCodeIsRequired(true))
    } else if (
      (res as IAuthNeed2FA).error_description === 'Вы ввели неправильный код' ||
      (res as IAuthNeed2FA).error_description === 'Вы ввели неверный код'
    ) {
      dispatch(setCodeIsIncorrect(true))
    } else if ((res as IAuthNeed2FA).error_description === 'Неправильный логин или пароль') {
      dispatch(setIsSuccessLogin(false))
    }

    dispatch(setAuthInProgress(false))
  }
}

export default accountsReducer
