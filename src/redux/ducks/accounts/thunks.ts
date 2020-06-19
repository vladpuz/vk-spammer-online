import storage from 'store2'
import { ThunkAction } from 'redux-thunk'
import { auth, getProfileInfo } from '../../../api/auth'
import * as actions from './action-creators'
import { StateType } from '../../store'
import { ActionsType } from './reducer'
import { AuthAppType } from '../../../types/types'

type ThunkType = ThunkAction<Promise<void>, StateType, unknown, ActionsType>

export const login = (app: AuthAppType, username: string, password: string, code?: number): ThunkType => {
  return async (dispatch, getState) => {
    dispatch(actions.setAuthInProgress(true))
    const res = await auth(username, password, { app, code })

    if (!res.error) {
      const { access_token: token, user_id: userId } = res
      const profile = (await getProfileInfo(token)).response[0]

      if (getState().accountsReducer.accounts.some(account => account.profile.id === userId)) {
        dispatch(actions.setAccountRepeated(true))
        dispatch(actions.removeAccount(userId))
      }

      dispatch(actions.setIsSuccessLogin(true))
      dispatch(actions.setCodeIsRequired(false))
      dispatch(actions.addAccount({
        profile,
        token,
        currentSender: false,
        isEnabled: true,
        error: null
      }))

      storage.local.set('accounts', getState().accountsReducer.accounts)
    } else if ((res).error === 'need_validation') {
      dispatch(actions.setCodeIsRequired(true))
    } else if (
      (res).error_description === 'Вы ввели неправильный код' ||
      (res).error_description === 'Вы ввели неверный код'
    ) {
      dispatch(actions.setCodeIsIncorrect(true))
    } else if ((res).error_description === 'Неправильный логин или пароль') {
      dispatch(actions.setIsSuccessLogin(false))
    }

    dispatch(actions.setAuthInProgress(false))
  }
}
