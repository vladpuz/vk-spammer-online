import React from 'react'
import s from './Header.module.css'
import logo from '../../assets/images/logo.png'
import { NavLink } from 'react-router-dom'

function Header () {
  return (
    <header className={s.header}>
      <div className={s.inner}>

        <div className={s.logo}>
          <NavLink to="/">
            <img className={s.logo__image} src={logo} alt="logo"/>
          </NavLink>
          <div className={s.logo__text}>
            <NavLink to="/">
              <h1 className={s.logo__title}>VK_SPAMER_ONLINE</h1>
            </NavLink>
            <h2 className={s.logo__subtitle}>Бесплатный спамер для вк</h2>
          </div>
        </div>

      </div>
    </header>
  )
}

export default Header
