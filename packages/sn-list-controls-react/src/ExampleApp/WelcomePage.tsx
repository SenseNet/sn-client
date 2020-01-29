import Typography from '@material-ui/core/Typography'
import React from 'react'

export const WelcomePage: React.StatelessComponent = () => (
  <div style={{ padding: '2em' }}>
    <Typography variant="h5">
      Welcome to the <strong>@sensenet/list-controls-react</strong> ShowCase app
    </Typography>
    <Typography variant="body1">This control is designed to display sensenet content in a list or grid view</Typography>
    <Typography variant="body1">
      You can install it right from <a href="https://www.npmjs.com/package/@sensenet/list-controls-react">npm</a>
    </Typography>
  </div>
)
