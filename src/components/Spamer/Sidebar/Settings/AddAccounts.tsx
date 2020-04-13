import React from 'react'
import { Button } from '@material-ui/core'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import { NavLink } from 'react-router-dom'

function AddAccounts () {
  return (
    <Button
      component={NavLink}
      to="/accounts"
      fullWidth
      variant="contained"
      color="default"
      startIcon={<SupervisorAccountIcon/>}
    >
      Добавить аккаунты
    </Button>
  )
}

export default AddAccounts
