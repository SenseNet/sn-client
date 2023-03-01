import { Button, CssBaseline, Tooltip, Typography } from '@material-ui/core'
import { useOidcAuthentication } from '@sensenet/authentication-oidc-react'
import React from 'react'
import snLogo from './assets/sensenet_logo_transparent.png'

/**
 * The main entry point of your app. You can start h@cking from here ;)
 */
export const App: React.FunctionComponent = () => {
  const { logout, oidcUser } = useOidcAuthentication()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
        flexDirection: 'column',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${snLogo})`,
        backgroundSize: 'auto',
      }}>
      <CssBaseline />
      <Typography variant="h3" gutterBottom>
        Hello, {oidcUser?.profile.name}{' '}
        <span role="img" aria-label="Smiling Face With Sunglasses">
          😎
        </span>
      </Typography>
      <Tooltip title="Return to the Login screen and select another repository">
        <Button variant="outlined" color="primary" onClick={logout}>
          Log out{' '}
          <span role="img" aria-label="Door">
            🚪
          </span>
        </Button>
      </Tooltip>
    </div>
  )
}
