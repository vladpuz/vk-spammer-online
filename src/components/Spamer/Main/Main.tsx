import React from 'react'
import s from './Main.module.css'
import Program from './Program/Program'
import { Route, Switch } from 'react-router-dom'
import Auth from './Auth/Auth'

function Main () {
  return (
    <main className={s.main}>
      <Switch>
        <Route path="/accounts" component={Auth}/>
        <Route path="/" component={Program}/>
      </Switch>
    </main>
  )
}

export default Main
