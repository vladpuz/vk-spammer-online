import React from 'react'
import s from './Accounts.module.css'
import Account from './Account/Account'
import { useDispatch, useSelector } from 'react-redux'
import { RootReducerType } from '../../../../redux/store'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { setAccounts } from '../../../../redux/accounts-reducer'
import Title from '../../../common/Title/Title'
import storage from 'store2'

function Accounts () {
  const dispatch = useDispatch()
  const accounts = useSelector((state: RootReducerType) => state.accountsReducer.accounts)
  const accountsElements = accounts.map((account, index) => (
    <Account
      key={account.profileInfo.id}
      avatarURL={account.profileInfo.photo_50}
      currentSender={account.currentSender}
      error={account.error}
      fullName={`${account.profileInfo.first_name} ${account.profileInfo.last_name}`}
      isEnabled={account.isEnabled}
      userId={account.profileInfo.id}
      index={index}
    />
  ))

  const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
    const result = [...list]
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const accountsOrdered = reorder(
      accounts,
      result.source.index,
      result.destination.index
    )

    storage.local.set('accounts', accountsOrdered)
    dispatch(setAccounts(accountsOrdered))
  }

  const getListStyle = (isDragging: boolean) => ({
    borderColor: isDragging ? 'white' : ''
  })

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Title>Ваши аккаунты</Title>
      <Droppable droppableId="droppable">
        {
          (provided, snapshot) => (
            <div
              style={getListStyle(snapshot.isDraggingOver)}
              className={s.accounts}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {accounts.length ? accountsElements : <div className={s.accountsEmpty}>аккаунтов нет, добавьте их!</div>}
              {provided.placeholder}
            </div>
          )
        }
      </Droppable>
    </DragDropContext>
  )
}

export default Accounts
