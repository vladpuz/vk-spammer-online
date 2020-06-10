import { SpamModeType } from '../types/types'
import storage from 'store2'

// Для локального хранения и получения плейсхолдера для списка адресатов в зависимости от режима рассылки
const addresses = {
  getPlaceholder (mode: SpamModeType): string {
    switch (mode) {
      case 'pm':
        return 'vanya_101\nid497257108\nkseniya2015\nи т.д.'
      case 'talks':
        return '345\n101\n239\nи т.д.'
      case 'talksAutoExit':
        return '345\n101\n239\nи т.д.'
      case 'usersWalls':
        return '115858632\n247829289\n27788181\nи т.д.'
      case 'groupsWalls':
        return '115755632\n248849289\n25818121\nи т.д.'
      case 'comments':
        return '157489262_420\n-227257809_3255\n297529259_1203\nи т.д.'
      case 'discussions':
        return '82514921_14544220\n84625170_24736522\n75625033_34796850\nи т.д.'
    }
  },
  getLocalValue (mode: SpamModeType): string {
    switch (mode) {
      case 'pm':
        return storage.local.get('fields')?.addressees?.pm
      case 'talks':
        return storage.local.get('fields')?.addressees?.talks
      case 'talksAutoExit':
        return storage.local.get('fields')?.addressees?.talksAutoExit
      case 'usersWalls':
        return storage.local.get('fields')?.addressees?.usersWalls
      case 'groupsWalls':
        return storage.local.get('fields')?.addressees?.groupsWalls
      case 'comments':
        return storage.local.get('fields')?.addressees?.comments
      case 'discussions':
        return storage.local.get('fields')?.addressees?.discussions
    }
  },
  setLocalValue (mode: SpamModeType, value: any): void {
    switch (mode) {
      case 'pm': {
        const fields = storage.local.get('fields')
        storage.local.set('fields', {
          ...fields,
          addressees: {
            ...fields.addressees,
            pm: value
          }
        })
        break
      }
      case 'talks': {
        const fields = storage.local.get('fields')
        storage.local.set('fields', {
          ...fields,
          addressees: {
            ...fields.addressees,
            talks: value
          }
        })
        break
      }
      case 'talksAutoExit': {
        const fields = storage.local.get('fields')
        storage.local.set('fields', {
          ...fields,
          addressees: {
            ...fields.addressees,
            talksAutoExit: value
          }
        })
        break
      }
      case 'usersWalls': {
        const fields = storage.local.get('fields')
        storage.local.set('fields', {
          ...fields,
          addressees: {
            ...fields.addressees,
            usersWalls: value
          }
        })
        break
      }
      case 'groupsWalls': {
        const fields = storage.local.get('fields')
        storage.local.set('fields', {
          ...fields,
          addressees: {
            ...fields.addressees,
            groupsWalls: value
          }
        })
        break
      }
      case 'comments': {
        const fields = storage.local.get('fields')
        storage.local.set('fields', {
          ...fields,
          addressees: {
            ...fields.addressees,
            comments: value
          }
        })
        break
      }
      case 'discussions': {
        const fields = storage.local.get('fields')
        storage.local.set('fields', {
          ...fields,
          addressees: {
            ...fields.addressees,
            discussions: value
          }
        })
        break
      }
    }
  }
}

export default addresses
