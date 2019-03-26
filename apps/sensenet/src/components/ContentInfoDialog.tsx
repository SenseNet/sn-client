import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useContext } from 'react'
import { ResponsiveContext } from '../context/ResponsiveContextProvider'

export const ContentInfoDialog: React.FunctionComponent<{
  dialogProps: DialogProps
  content: GenericContent
}> = props => {
  const device = useContext(ResponsiveContext)
  const itemStyle: React.CSSProperties = { padding: '0.3em' }

  const dialogContent = (
    <>
      <div
        style={{
          border: 'none',
          borderRight: `1px solid rgba(128,128,128,0.3)`,
          paddingRight: '1em',
        }}>
        <Typography style={itemStyle}>Type</Typography>
        <Typography style={itemStyle}>Owner</Typography>
        <Typography style={itemStyle}>Path</Typography>
        <Typography style={itemStyle}>Created</Typography>
      </div>
      <div style={{ paddingLeft: '1em' }}>
        <Typography style={itemStyle}>{props.content.Type}</Typography>
        <Typography style={itemStyle}>
          {(props.content.Owner &&
            ((typeof props.content.Owner === 'object' && (props.content.Owner as GenericContent).DisplayName) ||
              (props.content.Owner as GenericContent).Name)) ||
            'Unknown'}
        </Typography>
        <Typography style={itemStyle}>{props.content.Path}</Typography>
        <Typography style={itemStyle}>{props.content.CreationDate}</Typography>
      </div>
    </>
  )

  if (device === 'mobile') {
    return (
      <Drawer variant="temporary" {...props.dialogProps} anchor="bottom">
        <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '1em' }}>{dialogContent}</div>
      </Drawer>
    )
  }

  return (
    <Dialog {...props.dialogProps}>
      <DialogTitle>Content Info</DialogTitle>
      <DialogContent style={{ display: 'flex', justifyContent: 'flex-start' }}>{dialogContent}</DialogContent>
    </Dialog>
  )
}
