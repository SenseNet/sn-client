import Checkbox from '@material-ui/core/Checkbox'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { Icon } from './Icon'

export const SelectionControl: React.FunctionComponent<{ isSelected: boolean; content: GenericContent }> = ({
  isSelected,
  content,
}) => {
  return isSelected ? <Checkbox checked={true} /> : <Icon item={content} style={{ marginLeft: '.4em' }} />
}
