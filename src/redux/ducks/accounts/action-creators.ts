import * as types from './action-types'
import { AccountType } from '../../../types/types'

export const setAccounts = (accounts: AccountType[]) => ({
  type: types.SET_ACCOUNTS,
  accounts
})

export const addAccount = (account: AccountType) => ({
  type: types.ADD_ACCOUNT,
  account
})

export const removeAccount = (userId: number) => ({
  type: types.REMOVE_ACCOUNT,
  userId
})

export const shuffleAccounts = () => ({
  type: types.SHUFFLE_ACCOUNTS
})

export const clearAccounts = () => ({
  type: types.CLEAR_ACCOUNTS
})

export const setIsEnabled = (userId: number, isEnabled: boolean) => ({
  type: types.SET_IS_ENABLED,
  userId,
  isEnabled
})

export const setIsEnabledAll = (isEnabled: boolean) => ({
  type: types.SET_IS_ENABLED_ALL,
  isEnabled
})

export const setCurrentSender = (userId: number) => ({
  type: types.SET_CURRENT_SENDER,
  userId
})

export const clearCurrentSender = () => ({
  type: types.CLEAR_CURRENT_SENDER
})

export const setAuthInProgress = (isFetching: boolean) => ({
  type: types.SET_AUTH_IN_PROGRESS,
  isFetching
})

export const setCodeIsRequired = (isRequired: boolean) => ({
  type: types.SET_CODE_IS_REQUIRED,
  isRequired
})

export const setCodeIsIncorrect = (isIncorrect: boolean) => ({
  type: types.SET_CODE_IS_INCORRECT,
  isIncorrect
})

export const setAccountRepeated = (isRepeated: boolean) => ({
  type: types.SET_ACCOUNT_REPEATED,
  isRepeated
})

export const setIsSuccessLogin = (isSuccess: boolean | null) => ({
  type: types.SET_IS_SUCCESS_LOGIN,
  isSuccess
})
