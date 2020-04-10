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
              <h1 className={s.logo__title}>VK_SPAMER_ONLINE</h1>
            </NavLink>
            <h2 className={s.logo__subtitle}>Бесплатный спамер для вк</h2>
          </div>
        </div>

        <div>
          <a href="https://github.com/vladislav-puzyrev/vk_spamer_online" target="_blank" rel="noopener noreferrer">
            <IconButton aria-label="github">
              <GitHubIcon fontSize="large"/>
            </IconButton>
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
