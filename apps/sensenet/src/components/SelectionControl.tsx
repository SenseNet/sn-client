import Checkbox from '@material-ui/core/Checkbox'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { Icon } from './Icon'

export const SelectionControl: React.FunctionComponent<{ isSelected: boolean; content: GenericContent }> = ({
  isSelected,
  content,
}) => (
  <div style={{ textAlign: 'center', marginLeft: '1em' }}>
    {isSelected ? (
      <Checkbox checked={true} style={{ margin: 0, padding: 0 }} />
    ) : (
      <Icon item={content} style={{ verticalAlign: 'middle' }} />
    )}
  </div>
)
