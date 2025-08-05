import React from 'react'

interface CustomLabelProps {
  name: string
  displayName?: string
  highlighted?: boolean
}

const CustomLabel: React.FC<CustomLabelProps> = ({ name, displayName, highlighted }) => {
  return (
    <label htmlFor={name} style={{ fontSize: '15px' }}>
      {highlighted ? (
        <strong style={{ fontSize: '17px' }}>{displayName}</strong>
      ) : (
        <span style={{ fontSize: '17px' }}>{displayName}</span>
      )}{' '}
      ({name})
    </label>
  )
}

export default CustomLabel
