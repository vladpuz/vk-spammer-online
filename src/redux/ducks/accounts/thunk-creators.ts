import storage from 'store2'
import ApiError from '../../../api/ApiError'
import {
  addAccount,
  removeAccount,
  setAccountRepeated,
  setAuthInProgress,
  setCodeIsIncorrect,
  setCodeIsRequired,
  setIsSuccessLogin
} from './action-creators'
import { auth, getProfileInfo } from '../../../api/auth'
import { ThunkAction } from 'redux-thunk'
import { StateType } from '../../store'
import { ActionsType } from './accounts-reducer'
import { AuthAppType } from '../../../types/types'

type ThunkType = ThunkAction<Promise<void>, StateType, unknown, ActionsType>

export const login = (username: string, password: string, opt?: { app?: AuthAppType, code?: number }): ThunkType => {
  return async (dispatch, getState) => {
    dispatch(setAuthInProgress(true))

    try {
      const response = await auth(username, password, { app: opt?.app, code: opt?.code })

      const { access_token: token, user_id: userId } = response
      const profile = await getProfileInfo(token)

      if (getState().accountsReducer.accounts.some(account => account.profile.id === userId)) {
        dispatch(setAccountRepeated(true))
        dispatch(removeAccount(userId))
      }

      dispatch(setIsSuccessLogin(true))
      dispatch(setCodeIsRequired(false))
      dispatch(addAccount({
        profile,
        token,
        currentSender: false,
        isEnabled: true,
        error: null
      }))

      storage.local.set('accounts', getState().accountsReducer.accounts)
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.response.data.error === 'need_validation') {
          dispatch(setCodeIsRequired(true))
        } else if (
          err.response.data.error_description === 'Вы ввели неправильный код' ||
          err.response.data.error_description === 'Вы ввели неверный код'
        ) {
          dispatch(setCodeIsIncorrect(true))
        } else if (err.response.data.error_description === 'Неправильный логин или пароль') {
          dispatch(setIsSuccessLogin(false))
        }
      }
    } finally {
      dispatch(setAuthInProgress(false))
    }
  }
}
