import React from 'react'
import { Typography } from '@material-ui/core'
import { Widget } from '../../services/PersonalSettings'
import { useStringReplace } from '../../hooks/use-string-replace'

export const UpdatesWidget: React.FunctionComponent<Widget<undefined>> = props => {
  const replacedTitle = useStringReplace(props.title)
  return (
    <div>
      <Typography
        variant="h5"
        title={props.title}
        gutterBottom={true}
        style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {replacedTitle}
      </Typography>
      <div style={{ overflow: 'auto' }}>...updates content</div>
    </div>
  )
}
