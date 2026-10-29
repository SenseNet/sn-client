import { FormHelperText } from '@material-ui/core'
import React from 'react'

interface CustomLabelProps {
  name: string
  displayName?: string
  highlighted?: boolean
  description?: string
  showDescription?: boolean
}

const CustomLabel: React.FC<CustomLabelProps> = ({ name, displayName, highlighted, description, showDescription }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <label htmlFor={name} style={{ fontSize: '15px' }}>
        {highlighted ? (
          <strong style={{ fontSize: '17px' }}>{displayName}</strong>
        ) : (
          <span style={{ fontSize: '17px' }}>{displayName}</span>
        )}{' '}
        ({name})
      </label>
      {showDescription && description && <FormHelperText>{description}</FormHelperText>}
    </div>
  )
}

export default CustomLabel
