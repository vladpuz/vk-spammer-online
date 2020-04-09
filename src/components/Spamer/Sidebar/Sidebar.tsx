import React from 'react'
import s from './Sidebar.module.css'
import Title from '../../common/Title/Title'
import Accounts from './Accounts/Accounts'
import Settings from './Settings/Settings'
import Donate from './Donate/Donate'

function Sidebar () {
  return (
    <aside className={s.sidebar}>
      <Title>Ваши аккаунты</Title>
      <Accounts/>
      <Settings/>
      <Donate/>
    </aside>
  )
}

export default Sidebar
