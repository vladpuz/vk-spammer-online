import React, { useEffect } from 'react';
import s from './AuthForm.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { StateType } from '../../../../../redux/store'
import { AuthAppType } from '../../../../../types/types'
import { Formik, Form } from 'formik'
import * as yup from 'yup'
import MyTextField from '../../../../common/MyTextField'
import Snackbars from './Snackbars'
import StaticFields from './StaticFields'
import AddButton from './AddButton/AddButton'
import { NavLink } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { login } from '../../../../../redux/ducks/accounts/thunk-creators'

function AuthForm () {
  const codeIsRequired = useSelector((state: StateType) => state.accountsReducer.authWorkflow.codeIsRequired)
  const isSuccessLogin = useSelector((state: StateType) => state.accountsReducer.authWorkflow.isSuccessLogin)
  const dispatch = useDispatch()

  useEffect(() => {
    const form = document.querySelector('#globalForm')
    const docFrag = document.createDocumentFragment()

    if (form) {
      while (form.firstChild) {
        const child = form.removeChild(form.firstChild)
        docFrag.appendChild(child)
      }

      form.parentNode?.replaceChild(docFrag, form)
    }

    return () => location.reload()
  }, [])

  return (
    <Formik
      initialValues={{
        app: 'windows' as AuthAppType,
        username: '',
        password: '',
        code: undefined
      }}

      validationSchema={yup.object({
        username: yup.string().required('Введите логин'),
        password: yup.string().required('Введите пароль')
      })}

      onSubmit={(values, { setValues }) => {
        const { app, username, password, code } = values
        dispatch(login(username, password, { code, app }))
        setValues({
          app: isSuccessLogin ? 'windows' : app,
          username: isSuccessLogin ? '' : username,
          password: isSuccessLogin ? '' : password,
          code: undefined
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
              helperText="Введите проверочный код отправленный Вам по смс"
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
