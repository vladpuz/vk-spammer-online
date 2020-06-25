import React from 'react'
import s from './Main.module.css'
import { Route, Switch, Redirect } from 'react-router-dom'
import routes from '../../../utils/routes'

function Main () {
  return (
    <main className={s.main}>
      <Switch>
        {
          routes.map((route, index) => {
            return route.redirect ? <Redirect key={index} to={route.redirect}/> : <Route
              key={index}
              path={route.path}
              exact={route.exact}
              render={props => <route.component {...props} routes={route.routes}/>}
            />
          })
        }
      </Switch>
    </main>
  )
}

export default Main
