import React from 'react'
import s from './Spamer.module.css'
import Sidebar from './Sidebar/Sidebar'
import Main from './Main/Main'

function Spamer () {
  return (
    <div className={s.flex}>
      <Sidebar/>
      <Main/>
    </div>
  )
}

export default Spamer
