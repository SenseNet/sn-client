import Checkbox from '@material-ui/core/Checkbox'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { Icon } from './Icon'

type SelectionControlProps = {
  isSelected: boolean
  content: GenericContent
  onChangeCallback: () => void
}

export const SelectionControl: React.FunctionComponent<SelectionControlProps> = ({
  isSelected,
  content,
  onChangeCallback,
}) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
    <Checkbox
      checked={isSelected}
      style={{ display: isSelected ? undefined : 'none' }}
      onChange={onChangeCallback}
      color="default"
    />
    <Icon item={content} style={{ display: isSelected ? 'none' : undefined }} />
  </div>
)
