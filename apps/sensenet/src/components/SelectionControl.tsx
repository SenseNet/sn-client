import Checkbox from '@material-ui/core/Checkbox'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { Icon } from './Icon'

export const SelectionControl: React.FunctionComponent<{ isSelected: boolean; content: GenericContent }> = ({
  isSelected,
  content,
}) => (
  <div style={{ textAlign: 'center', margin: '0 1em', width: 40, height: 40 }}>
    {isSelected ? <Checkbox checked={true} /> : <Icon item={content} />}
  </div>
)
