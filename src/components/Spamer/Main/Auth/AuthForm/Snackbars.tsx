import React from 'react'
import { Snackbar } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { setAccountIsRepeated, setIsSuccessLogin, setCodeIsIncorrect } from '../../../../../redux/accounts-reducer'
import Alert from '@material-ui/lab/Alert'
import { RootReducerType } from '../../../../../redux/store'

function Snackbars () {
  const accountIsRepeated = useSelector((state: RootReducerType) => state.accountsReducer.authWorkflow.accountIsRepeated)
  const isSuccessLogin = useSelector((state: RootReducerType) => state.accountsReducer.authWorkflow.isSuccessLogin)
  const codeIsIncorrect = useSelector((state: RootReducerType) => state.accountsReducer.authWorkflow.codeIsIncorrect)
  const dispatch = useDispatch()

  return (
    <>
      <Snackbar
        open={isSuccessLogin}
        autoHideDuration={2000}
        onClose={() => {dispatch(setIsSuccessLogin(undefined))}}
      >
        <Alert variant="filled" severity="success">
          Успешно добавлен
        </Alert>
      </Snackbar>

      <Snackbar
        open={isSuccessLogin === false}
        autoHideDuration={2000}
        onClose={() => {dispatch(setIsSuccessLogin(undefined))}}
      >
        <Alert variant="filled" severity="error">
          Неверный логин или пароль
        </Alert>
      </Snackbar>

      <Snackbar
        open={accountIsRepeated}
        autoHideDuration={2000}
        onClose={() => {dispatch(setAccountIsRepeated(false))}}
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
