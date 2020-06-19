import React from 'react'
import s from './Account.module.css'
import cn from 'classnames'
import { IconButton } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import { removeAccount, setIsEnabled } from '../../../../../redux/ducks/accounts/action-creators'
import { useDispatch, useSelector } from 'react-redux'
import { AccountType } from '../../../../../types/types'
import { StateType } from '../../../../../redux/store'
import { Draggable } from 'react-beautiful-dnd'
import storage from 'store2'

type Props = {
  userId: number
  avatarURL: string
  fullName: string
  currentSender: boolean
  isEnabled: boolean
  error: null | string
  index: number
}

const Account: React.FC<Props> = ({
  userId,
  avatarURL,
  fullName,
  currentSender,
  isEnabled,
  error,
  index
}) => {
  const disabledClassName = isEnabled ? '' : s.accountDisabled
  const isCurrentSenderClassName = currentSender && s.currentSender
  const vkLink = `https://vk.com/id${userId}`
  const dispatch = useDispatch()
  const spamOnPause = useSelector((state: StateType) => state.spamerReducer.spamOnPause)
  const spamOnRun = useSelector((state: StateType) => state.spamerReducer.spamOnRun)

  const remove = () => {
    dispatch(removeAccount(userId))
    const accounts = storage.local.get('accounts')
    storage.local.set('accounts', accounts.filter((account: AccountType) => account.profile.id !== userId))
  }

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    userSelect: 'none',
    background: isDragging ? '#373740' : '',
    ...draggableStyle
  })

  return (
    <Draggable isDragDisabled={spamOnPause || spamOnRun} draggableId={String(userId)} index={index}>
      {
        (provided, snapshot) => (
          <div
            className={cn(s.account, disabledClassName)}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
          >
            <div className={s.profileInfo}>
              <a href={vkLink} target="_blank" rel="noopener noreferrer">
                <img className={s.avatar} src={avatarURL} alt="avatar"/>
              </a>
              <a
                className={cn(s.fullName, isCurrentSenderClassName)}
                href={vkLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {fullName}
              </a>
            </div>

            <div>
              {
                isEnabled ? (
                  <IconButton
                    disabled={spamOnPause || spamOnRun || currentSender}
                    aria-label="remove"
                    onClick={() => {
                      const accounts = storage.local.get('accounts').map(
                        (account: AccountType) => account.profile.id === userId ? {
                          ...account,
                          isEnabled: false
                        } : account
                      )
                      storage.local.set('accounts', accounts)
                      dispatch(setIsEnabled(userId, false))
                    }}
                  >
                    <RemoveIcon/>
                  </IconButton>
                ) : (
                  <IconButton aria-label="add" onClick={() => {
                    const accounts = storage.local.get('accounts').map(
                      (account: AccountType) => account.profile.id === userId ? {
                        ...account,
                        isEnabled: true
                      } : account
                    )
                    storage.local.set('accounts', accounts)
                    dispatch(setIsEnabled(userId, true))
                  }}>
                    <AddIcon/>
                  </IconButton>
                )
              }
              <IconButton
                disabled={spamOnPause || spamOnRun}
                aria-label="delete"
                onClick={() => { remove() }}
              >
                <DeleteIcon/>
              </IconButton>
            </div>
          </div>
        )
      }
    </Draggable>
  )
}

export default Account
