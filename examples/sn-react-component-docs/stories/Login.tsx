import React, { useEffect, useState } from 'react'

export const Login: React.FunctionComponent = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    async function checkIsLoggedIn() {
      const configuration = {
        client_id: 'client',
        client_secret: 'secret',
        grant_type: 'client_credentials',
        scope: encodeURIComponent('sensenet'),
      }

      const requestBody = Object.keys(configuration).reduce((acc, current, idx) => {
        return `${acc}${current}=${configuration[current]}${idx === Object.keys(configuration).length - 1 ? '' : '&'}`
      }, '')

      try {
        const response = await window.fetch('https://is.demo.sensenet.com/connect/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: requestBody,
        })

        const data = await response.json()

        setToken(data.access_token)
        setIsLoggedIn(response.ok)
      } catch (e) {
        setReloadToken((previous) => previous + 1)
      }
    }
    checkIsLoggedIn()
  }, [reloadToken])

  if (isLoggedIn) {
    return <>{React.Children.map(props.children, (child: any) => React.cloneElement(child, { token }))}</>
  }

  return (
    <div style={{ fontStyle: 'italic', fontSize: 13 }}>
      Please wait until the system log you in to https://dev.demo.sensenet.com with the demo user.
    </div>
  )
}
