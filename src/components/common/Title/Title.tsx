import React from 'react'
import s from './Title.module.css'

type Props = {
  style?: React.CSSProperties
}

const Title: React.FC<Props> = ({ children, style }) => {
  return (
    <h3 style={style} className={s.title}>{children}</h3>
  )
}

export default Title
