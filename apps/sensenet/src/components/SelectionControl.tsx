import Checkbox from '@material-ui/core/Checkbox'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { Icon } from './Icon'

export const SelectionControl: React.FunctionComponent<{ isSelected: boolean; content: GenericContent }> = ({
  isSelected,
  content,
}) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {isSelected ? <Checkbox checked={true} /> : <Icon item={content} />}
  </div>
)
