import React from 'react'
import s from './Main.module.css'
import { Route, Switch } from 'react-router-dom'
import routes from '../../../config/routes'

function Main () {
  return (
    <main className={s.main}>
      <Switch>
        <Route path={routes.spamer.subroutes.accounts.path} component={routes.spamer.subroutes.accounts.component}/>
        <Route path={routes.spamer.path} component={routes.spamer.component}/>
      </Switch>
    </main>
  )
}

export default Main
