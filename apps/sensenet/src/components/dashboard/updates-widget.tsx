import React from 'react'
import { Typography } from '@material-ui/core'
import { Widget } from '../../services/PersonalSettings'
import { useStringReplace, useVersionInfo } from '../../hooks'

export const UpdatesWidget: React.FunctionComponent<Widget<undefined>> = props => {
  const replacedTitle = useStringReplace(props.title)
  const { hasUpdates } = useVersionInfo()

  return (
    <div>
      <Typography
        variant="h5"
        title={props.title}
        gutterBottom={true}
        style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {replacedTitle}
      </Typography>
      <div style={{ overflow: 'auto' }}>{hasUpdates ? <div>Updates</div> : <div>sunshine</div>}</div>
    </div>
  )
}
