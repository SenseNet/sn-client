import React from 'react'
import { CssBaseline, Typography } from '@material-ui/core'
import { useRepository } from '@sensenet/hooks-react'
import snLogo from './assets/sensenet_logo_transparent.png'

export const App: React.FunctionComponent = () => {
  const repo = useRepository()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${snLogo})`,
        backgroundSize: 'auto',
      }}>
      <CssBaseline />
      <Typography variant="h3" gutterBottom>
        Welcome, on {repo.configuration.repositoryUrl} 😎
      </Typography>
    </div>
  )
}
