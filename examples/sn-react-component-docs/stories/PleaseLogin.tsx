import React, { useEffect, useState } from 'react'

export const PleaseLogin: React.FunctionComponent = props => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    async function checkIsLoggedIn() {
      const response = await window.fetch('https://dev.demo.sensenet.com/odata.svc/login', {
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
      <a target="_blank" href="https://dev.demo.sensenet.com/" rel="noopener noreferrer">
        https://dev.demo.sensenet.com/
      </a>
    </div>
  )
}
