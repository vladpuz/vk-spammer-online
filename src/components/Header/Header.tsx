import React from 'react'
import s from './Header.module.css'
import logo from '../../assets/images/logo.png'
import { NavLink } from 'react-router-dom'
import GitHubIcon from '@material-ui/icons/GitHub'
import { IconButton } from '@material-ui/core'

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
              <h1 className={s.logo__title}>VK-SPAMER-ONLINE</h1>
            </NavLink>
            <h2 className={s.logo__subtitle}>Бесплатный спамер для вк</h2>
          </div>
        </div>

        <IconButton href="https://github.com/vladislav-puzyrev/vk-spammer-online" target="_blank" aria-label="github">
          <GitHubIcon fontSize="large"/>
        </IconButton>
      </div>
    </header>
  )
}

export default Header
