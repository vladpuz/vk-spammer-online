import React from 'react'
import { HashRouter } from 'react-router-dom'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import { ThemeProvider } from '@material-ui/core/styles'
import store from '../redux/store'
import { Provider } from 'react-redux'
import s from './App.module.css'
import Instructions from './Instructions/Instructions'
import Header from './Header/Header'
import Spamer from './Spamer/Spamer'

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#81d4fa',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
})

function App () {
  return (
    <Provider store={store}>
      <HashRouter>
        <ThemeProvider theme={darkTheme}>
          <Header/>
          <div className={s.content}>
            <Spamer/>
            <Instructions/>
          </div>
        </ThemeProvider>
      </HashRouter>
    </Provider>
  )
}

export default App
