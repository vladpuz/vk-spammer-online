import React from 'react'
import s from './Auth.module.css'
import AuthForm from './AuthForm/AuthForm'
import Title from '../../../common/Title/Title'
import Buttons from './Buttons/Buttons'

function Auth () {
  return (
    <>
      <Title>Добавьте аккаунты</Title>
      <div className={s.flex}>
        <AuthForm/>
        <Buttons/>
      </div>
    </>
  )
}

export default Auth
