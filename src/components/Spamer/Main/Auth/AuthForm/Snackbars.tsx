import React from 'react'
import { Snackbar } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import {
  setAccountRepeated,
  setIsSuccessLogin,
  setCodeIsIncorrect
} from '../../../../../redux/ducks/accounts/action-creators'
import Alert from '@material-ui/lab/Alert'
import { StateType } from '../../../../../redux/store'

function Snackbars () {
  const accountRepeated = useSelector((state: StateType) => state.accountsReducer.authWorkflow.accountRepeated)
  const isSuccessLogin = useSelector((state: StateType) => state.accountsReducer.authWorkflow.isSuccessLogin)
  const codeIsIncorrect = useSelector((state: StateType) => state.accountsReducer.authWorkflow.codeIsIncorrect)
  const dispatch = useDispatch()

  return (
    <>
      <Snackbar
        open={isSuccessLogin === true}
        autoHideDuration={2000}
        onClose={() => {dispatch(setIsSuccessLogin(null))}}
      >
        <Alert variant="filled" severity="success">
          Успешно добавлен
        </Alert>
      </Snackbar>

      <Snackbar
        open={isSuccessLogin === false}
        autoHideDuration={2000}
        onClose={() => {dispatch(setIsSuccessLogin(null))}}
      >
        <Alert variant="filled" severity="error">
          Неверный логин или пароль
        </Alert>
      </Snackbar>

      <Snackbar
        open={accountRepeated}
        autoHideDuration={2000}
        onClose={() => {dispatch(setAccountRepeated(false))}}
      >
        <Alert variant="filled" severity="warning">
          Аккаунт был заменен
        </Alert>
      </Snackbar>

      <Snackbar
        open={codeIsIncorrect}
        autoHideDuration={2000}
        onClose={() => {dispatch(setCodeIsIncorrect(false))}}
      >
        <Alert variant="filled" severity="error">
          Вы ввели неверный код
        </Alert>
      </Snackbar>
    </>
  )
}

export default Snackbars
