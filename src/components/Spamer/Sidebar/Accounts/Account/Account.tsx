import React from 'react'
import s from './Account.module.css'
import cn from 'classnames'
import { IconButton } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import { removeAccount, setIsEnabled } from '../../../../../redux/accounts-reducer'
import { useDispatch, useSelector } from 'react-redux'
import bs from '../../../../../utils/BrowserStorage'
import { IAccount } from '../../../../../types/types'
import { rootReducerType } from '../../../../../redux/store'
import { Draggable } from 'react-beautiful-dnd'

interface IProps {
  userID: number
  avatarURL: string
  fullName: string
  currentSender: boolean
  isEnabled: boolean
  error: null | string
  index: number
}

const Account: React.FC<IProps> = ({ userID, avatarURL, fullName, currentSender, isEnabled, error, index }) => {
  const disabledClassName = isEnabled ? '' : s.accountDisabled
  const isCurrentSenderClassName = currentSender && s.currentSender
  const vkLink = `https://vk.com/id${userID}`
  const dispatch = useDispatch()
  const spamOnPause = useSelector((state: rootReducerType) => state.spamerReducer.spamOnPause)
  const spamOnRun = useSelector((state: rootReducerType) => state.spamerReducer.spamOnRun)

  const remove = () => {
    dispatch(removeAccount(userID))
    const accounts = bs.local.get('accounts')
    bs.local.set('accounts', accounts.filter((account: IAccount) => account.profileInfo.id !== userID))
  }

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    userSelect: 'none',
    background: isDragging ? '#373740' : '',
    ...draggableStyle
  })

  return (
    <Draggable draggableId={String(userID)} index={index}>
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
                    onClick={() => {dispatch(setIsEnabled(userID, false))}}
                  >
                    <RemoveIcon/>
                  </IconButton>
                ) : (
                  <IconButton aria-label="add" onClick={() => {dispatch(setIsEnabled(userID, true))}}>
                    <AddIcon/>
                  </IconButton>
                )
              }
              <IconButton
                disabled={spamOnPause || spamOnRun}
                aria-label="delete"
                onClick={() => {remove()}}
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
