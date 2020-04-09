import React from 'react'
import s from './Accounts.module.css'
import Account from './Account/Account'
import { useSelector } from 'react-redux'
import { rootReducerType } from '../../../../redux/store'

function Accounts () {
  const accounts = useSelector((state: rootReducerType) => state.accountsReducer.accounts)
  const accountsElements = accounts.map((account) => (
    <Account
      avatarURL={account.profileInfo.photo_50}
      currentSender={account.currentSender}
      error={account.error}
      fullName={`${account.profileInfo.first_name} ${account.profileInfo.last_name}`}
      isEnabled={account.isEnabled}
      userID={account.profileInfo.id}
      key={account.profileInfo.id}
    />
  ))

  return (
    <div className={s.accounts}>
      {accounts.length ? accountsElements : <div className={s.accountsEmpty}>аккаунтов нет, добавьте их!</div>}
    </div>
  )
}

export default Accounts
