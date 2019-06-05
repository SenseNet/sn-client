import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useContext } from 'react'
import { ResponsiveContext } from '../../context'
import { useLocalization } from '../../hooks'

export const ContentInfoDialog: React.FunctionComponent<{
  dialogProps: DialogProps
  content: GenericContent
}> = props => {
  const device = useContext(ResponsiveContext)
  const itemStyle: React.CSSProperties = { padding: '0.3em' }

  const localization = useLocalization().contentInfoDialog

  const dialogContent = (
    <>
      <div
        style={{
          border: 'none',
          borderRight: `1px solid rgba(128,128,128,0.3)`,
          paddingRight: '1em',
        }}>
        <Typography style={itemStyle}>{localization.type}</Typography>
        <Typography style={itemStyle}>{localization.owner}</Typography>
        <Typography style={itemStyle}>{localization.path}</Typography>
        <Typography style={itemStyle}>{localization.created}</Typography>
      </div>
      <div style={{ paddingLeft: '1em' }}>
        <Typography style={itemStyle}>{props.content.Type}</Typography>
        <Typography style={itemStyle}>
          {(props.content.Owner &&
            ((typeof props.content.Owner === 'object' && (props.content.Owner as GenericContent).DisplayName) ||
              (props.content.Owner as GenericContent).Name)) ||
            localization.unknownOwner}
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
      <DialogTitle>
        {localization.dialogTitle.replace('{0}', props.content.DisplayName || props.content.Name)}
      </DialogTitle>
      <DialogContent style={{ display: 'flex', justifyContent: 'flex-start' }}>{dialogContent}</DialogContent>
    </Dialog>
  )
}
