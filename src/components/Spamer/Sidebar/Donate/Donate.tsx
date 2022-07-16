import React from 'react'
import s from './Donate.module.css'
import Title from '../../../common/Title/Title'

function Donate () {
  return (
    <div className={s.donate}>
      <Title>Информация</Title>
      <span>Проект больше не поддерживается, из-за отсутствия интереса</span>
    </div>
  )
}

export default Donate
