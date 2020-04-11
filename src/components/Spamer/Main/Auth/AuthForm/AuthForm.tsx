import React from 'react'
import s from './AuthForm.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { rootReducerType } from '../../../../../redux/store'
import { authAccount, } from '../../../../../redux/accounts-reducer'
import { authAppType } from '../../../../../types/types'
import { Formik, Form } from 'formik'
import * as yup from 'yup'
import MyTextField from '../../../../common/MyTextField/MyTextField'
import Snackbars from './Snackbars/Snackbars'
import StaticFields from './StaticFields/StaticFields'
import AddButton from './AddButton/AddButton'
import { NavLink } from 'react-router-dom'
import { Button } from '@material-ui/core'

function AuthForm () {
  const codeIsRequired = useSelector((state: rootReducerType) => state.accountsReducer.authWorkflow.codeIsRequired)
  const isSuccessLogin = useSelector((state: rootReducerType) => state.accountsReducer.authWorkflow.isSuccessLogin)
  const dispatch = useDispatch()

  return (
    <Formik
      initialValues={{
        app: 'windows' as authAppType,
        login: '',
        password: '',
        code: undefined,
      }}

      validationSchema={yup.object({
        login: yup.string().required('Введите логин'),
        password: yup.string().required('Введите пароль'),
      })}

      onSubmit={(values, { setValues }) => {
        const { app, login, password, code } = values
        // @ts-ignore
        dispatch(authAccount(app, login, password, code)).then(() => {
          setValues({
            app: isSuccessLogin ? 'windows' : app,
            login: isSuccessLogin ? '' : login,
            password: isSuccessLogin ? '' : password,
            code: undefined,
          })
        })
      }}
    >
      <Form>
        <div className={s.col}>
          <StaticFields/>
          {
            codeIsRequired &&
            <MyTextField
              fullWidth
              error
              name="code"
              label="Требуется подтверждение"
              type="text"
              variant="filled"
              helperText="Введите код отправленный Вам по смс или сообщением вк"
            />
          }
          <AddButton/>
          <div className={s.backLink}>
            <Button
              component={NavLink}
              to="/"
              fullWidth
              variant="contained"
              color="primary"
            >
              Вернуться в спамер
            </Button>
          </div>
          <Snackbars/>
        </div>
      </Form>
    </Formik>
  )
}

export default AuthForm
