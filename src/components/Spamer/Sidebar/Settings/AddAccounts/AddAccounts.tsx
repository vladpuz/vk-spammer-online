import React from 'react'
import { Button } from '@material-ui/core'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import { NavLink } from 'react-router-dom'

function AddAccounts () {
  return (
    <NavLink to="/accounts">
      <Button fullWidth variant="contained" color="default" component="span" startIcon={<SupervisorAccountIcon/>}>
        Добавить аккаунты
      </Button>
    </NavLink>
  )
}

export default AddAccounts
