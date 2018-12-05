import Typography from '@material-ui/core/Typography'
import * as React from 'react'

import { ContentListDemo } from './ContentListDemo'

export const WelcomePage: React.StatelessComponent = () => (
  <div style={{ padding: '2em' }}>
    <Typography variant="headline">
      Welcome to the <strong>@sensenet/list-controls-react</strong> ShowCase app
    </Typography>
    <Typography variant="body1">This control is designed to display sensenet content in a list or grid view</Typography>
    <Typography variant="body1">
      You can install it right from <a href="https://www.npmjs.com/package/@sensenet/list-controls-react">npm</a>
    </Typography>
    <ContentListDemo />
  </div>
)
