import { SpamModeType } from '../types/types'
import bs from './BrowserStorage'

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
        return bs.local.get('fields.addressees.pm')
      case 'talks':
        return bs.local.get('fields.addressees.talks')
      case 'talksAutoExit':
        return bs.local.get('fields.addressees.talksAutoExit')
      case 'usersWalls':
        return bs.local.get('fields.addressees.usersWalls')
      case 'groupsWalls':
        return bs.local.get('fields.addressees.groupsWalls')
      case 'comments':
        return bs.local.get('fields.addressees.comments')
      case 'discussions':
        return bs.local.get('fields.addressees.discussions')
    }
  },
  setLocalValue (mode: SpamModeType, value: any): void {
    switch (mode) {
      case 'pm':
        bs.local.set('fields.addressees.pm', value)
        break
      case 'talks':
        bs.local.set('fields.addressees.talks', value)
        break
      case 'talksAutoExit':
        bs.local.set('fields.addressees.talksAutoExit', value)
        break
      case 'usersWalls':
        bs.local.set('fields.addressees.usersWalls', value)
        break
      case 'groupsWalls':
        bs.local.set('fields.addressees.groupsWalls', value)
        break
      case 'comments':
        bs.local.set('fields.addressees.comments', value)
        break
      case 'discussions':
        bs.local.set('fields.addressees.discussions', value)
        break
    }
  },
}

export default addresses
