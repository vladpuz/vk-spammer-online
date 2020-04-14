import { ThunkAction } from 'redux-thunk'
import { RootReducerType } from './store'
import { AuthAppType, IAccount } from '../types/types'
import { auth } from '../api/auth'
import { getProfileInfo } from '../api/getProfileInfo'
import shuffle from '../utils/shuffle'
import bs from '../utils/BrowserStorage'

/* Action types */
const SET_ACCOUNTS = 'vk_spamer_online/accounts/SET_ACCOUNTS'
const ADD_ACCOUNT = 'vk_spamer_online/accounts/ADD_ACCOUNT'
const REMOVE_ACCOUNT = 'vk_spamer_online/accounts/REMOVE_ACCOUNT'
const SHUFFLE_ACCOUNTS = 'vk_spamer_online/accounts/SHUFFLE_ACCOUNTS'
const CLEAR_ACCOUNTS = 'vk_spamer_online/accounts/CLEAR_ACCOUNTS'
const SET_IS_ENABLED = 'vk_spamer_online/accounts/SET_IS_ENABLED'
const SET_IS_ENABLED_ALL = 'vk_spamer_online/accounts/SET_IS_ENABLED_ALL'
const SET_CURRENT_SENDER = 'vk_spamer_online/accounts/SET_CURRENT_SENDER'
const CLEAR_CURRENT_SENDER = 'vk_spamer_online/accounts/CLEAR_CURRENT_SENDER'
const SET_AUTH_IN_PROGRESS = 'vk_spamer_online/accounts/SET_AUTH_IN_PROGRESS'
const SET_CODE_IS_REQUIRED = 'vk_spamer_online/accounts/SET_CODE_IS_REQUIRED'
const SET_CODE_IS_INCORRECT = 'vk_spamer_online/accounts/SET_CODE_IS_INCORRECT'
const SET_IS_SUCCESS_LOGIN = 'vk_spamer_online/accounts/SET_IS_SUCCESS_LOGIN'
const SET_ACCOUNT_IS_REPEATED = 'vk_spamer_online/accounts/SET_ACCOUNT_IS_REPEATED'

const initialState = {
  // accounts: (bs.local.get('accounts') || []) as Array<IAccount>,
  accounts: [
    {
      currentSender: false,
      error: null as null | string,
      isEnabled: true,
      profileInfo: {
        can_access_closed: true,
        first_name: 'Владислав',
        id: 2178496891,
        is_closed: false,
        last_name: 'Пузырёв',
        photo_50: 'https://sun9-8.userapi.com/c849220/v849220169/4cbbc/dT0q8opI1_A.jpg?ava=1',
      },
      token: 'cd632956eac2a795185b3f08d5ba7f7433cd69563cc50db01cfc71bbd88c77b1d31d5387175803870ea41',
    },
    {
      currentSender: false,
      error: null as null | string,
      isEnabled: true,
      profileInfo: {
        can_access_closed: true,
        first_name: 'Дмитрий',
        id: 217849689,
        is_closed: false,
        last_name: 'Кузюбирдин',
        photo_50: 'https://sun9-8.userapi.com/c849220/v849220169/4cbbc/dT0q8opI1_A.jpg?ava=1',
      },
      token: 'cd632956eac2a795185b3f08d5ba7f7433cd69563cc50db01cfc71bbd88c77b1d31d5387175803870ea41',
    }],
  authWorkflow: {
    authInProgress: false,
    codeIsRequired: false,
    codeIsIncorrect: false,
    isSuccessLogin: undefined as boolean | undefined,
    accountIsRepeated: false,
  },
}

type ActionTypes =
  setAccountsType |
  addAccountType |
  removeAccountType |
  shuffleAccountsType |
  clearAccountsType |
  setIsEnabledType |
  setIsEnabledAllType |
  setCurrentSenderType |
  clearCurrentSenderType |
  setAuthInProgressType |
  setCodeIsRequiredType |
  setCodeIsIncorrectType |
  setIsSuccessLoginType |
  setAccountIsRepeatedType

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

    case SET_IS_SUCCESS_LOGIN:
      return {
        ...state,
        authWorkflow: {
          ...state.authWorkflow,
          isSuccessLogin: action.isSuccess,
        },
      }

    case SET_ACCOUNT_IS_REPEATED:
      return {
        ...state,
        authWorkflow: {
          ...state.authWorkflow,
          accountIsRepeated: action.isRepeated,
        },
      }

    default:
      return state
  }
}

/* Action creators */
type setAccountsType = { type: typeof SET_ACCOUNTS, accounts: Array<IAccount> }
export const setAccounts = (accounts: Array<IAccount>): setAccountsType => ({
  type: SET_ACCOUNTS,
  accounts,
})

type addAccountType = { type: typeof ADD_ACCOUNT, account: IAccount }
export const addAccount = (account: IAccount): addAccountType => ({
  type: ADD_ACCOUNT,
  account,
})

type removeAccountType = { type: typeof REMOVE_ACCOUNT, userID: number }
export const removeAccount = (userID: number): removeAccountType => ({
  type: REMOVE_ACCOUNT,
  userID,
})

type shuffleAccountsType = { type: typeof SHUFFLE_ACCOUNTS }
export const shuffleAccounts = (): shuffleAccountsType => ({
  type: SHUFFLE_ACCOUNTS,
})

type clearAccountsType = { type: typeof CLEAR_ACCOUNTS }
export const clearAccounts = (): clearAccountsType => ({
  type: CLEAR_ACCOUNTS,
})

type setIsEnabledType = { type: typeof SET_IS_ENABLED, userID: number, isEnabled: boolean }
export const setIsEnabled = (userID: number, isEnabled: boolean): setIsEnabledType => ({
  type: SET_IS_ENABLED,
  userID,
  isEnabled,
})

type setIsEnabledAllType = { type: typeof SET_IS_ENABLED_ALL, isEnabled: boolean }
export const setIsEnabledAll = (isEnabled: boolean): setIsEnabledAllType => ({
  type: SET_IS_ENABLED_ALL,
  isEnabled,
})

type setCurrentSenderType = { type: typeof SET_CURRENT_SENDER, userID: number }
export const setCurrentSender = (userID: number): setCurrentSenderType => ({
  type: SET_CURRENT_SENDER,
  userID,
})

type clearCurrentSenderType = { type: typeof CLEAR_CURRENT_SENDER }
export const clearCurrentSender = (): clearCurrentSenderType => ({
  type: CLEAR_CURRENT_SENDER,
})

type setAuthInProgressType = { type: typeof SET_AUTH_IN_PROGRESS, isFetching: boolean }
export const setAuthInProgress = (isFetching: boolean): setAuthInProgressType => ({
  type: SET_AUTH_IN_PROGRESS,
  isFetching,
})

type setCodeIsRequiredType = { type: typeof SET_CODE_IS_REQUIRED, isRequired: boolean }
export const setCodeIsRequired = (isRequired: boolean): setCodeIsRequiredType => ({
  type: SET_CODE_IS_REQUIRED,
  isRequired,
})

type setCodeIsIncorrectType = { type: typeof SET_CODE_IS_INCORRECT, isIncorrect: boolean }
export const setCodeIsIncorrect = (isIncorrect: boolean): setCodeIsIncorrectType => ({
  type: SET_CODE_IS_INCORRECT,
  isIncorrect,
})

type setIsSuccessLoginType = { type: typeof SET_IS_SUCCESS_LOGIN, isSuccess: boolean | undefined }
export const setIsSuccessLogin = (isSuccess: boolean | undefined): setIsSuccessLoginType => ({
  type: SET_IS_SUCCESS_LOGIN,
  isSuccess,
})

type setAccountIsRepeatedType = { type: typeof SET_ACCOUNT_IS_REPEATED, isRepeated: boolean }
export const setAccountIsRepeated = (isRepeated: boolean): setAccountIsRepeatedType => ({
  type: SET_ACCOUNT_IS_REPEATED,
  isRepeated,
})

/* Thunk creators */
type ThunkType = ThunkAction<Promise<any>, RootReducerType, unknown, ActionTypes>

export const authAccount = (
  app: AuthAppType,
  username: string,
  password: string,
  code?: number,
): ThunkType => {
  return async (dispatch, getState) => {
    dispatch(setAuthInProgress(true))
    const res = await auth(app, username, password, code)

    if (!res.error) {
      const { access_token: token, user_id: userID } = res
      const profileInfo = (await getProfileInfo(token, userID))

      if (getState().accountsReducer.accounts.some(account => account.profileInfo.id === userID)) {
        dispatch(setAccountIsRepeated(true))
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
    } else if (res.error === 'need_validation') {
      dispatch(setCodeIsRequired(true))
    } else if (
      res.error_description === 'Вы ввели неправильный код' ||
      res.error_description === 'Вы ввели неверный код'
    ) {
      dispatch(setCodeIsIncorrect(true))
    } else if (res.error_description === 'Неправильный логин или пароль') {
      dispatch(setIsSuccessLogin(false))
    }

    dispatch(setAuthInProgress(false))
  }
}

export default accountsReducer
