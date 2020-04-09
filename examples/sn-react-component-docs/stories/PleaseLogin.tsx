import React, { useEffect, useState } from 'react'

export const PleaseLogin: React.FunctionComponent = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    async function checkIsLoggedIn() {
      const response = await window.fetch('https://dev.demo.sensenet.com/odata.svc/Root/Content', {
        credentials: 'include',
      })
      setIsLoggedIn(response.ok)
    }
    checkIsLoggedIn()
  })
  if (isLoggedIn) {
    return <>{props.children}</>
  }
  return (
    <div style={{ fontStyle: 'italic', fontSize: 13 }}>
      To see this control in action, please login at{' '}
      <a target="_blank" href="https://admin.sensenet.com/" rel="noopener noreferrer">
        https://admin.sensenet.com/
      </a>{' '}
      to https://dev.demo.sensenet.com with one of the given demo users.
    </div>
  )
}
