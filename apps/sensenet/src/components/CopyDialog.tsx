import Button from '@material-ui/core/Button'
import Dialog, { DialogProps } from '@material-ui/core/Dialog/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { ListPickerComponent } from '@sensenet/pickers-react'
import React, { useContext, useState } from 'react'
import { CurrentContentContext, LocalizationContext, RepositoryContext } from '../context'
import { Icon } from './Icon'

export const CopyDialog: React.FunctionComponent<{
  content: GenericContent[]
  dialogProps: DialogProps
}> = props => {
  const localization = useContext(LocalizationContext).values.copyContentDialog
  const currentcontent = useContext(CurrentContentContext)

  const [selection, setSelection] = useState<GenericContent | undefined>(undefined)
  const repo = useContext(RepositoryContext)
  return (
    <Dialog
      fullWidth={true}
      {...props.dialogProps}
      onClick={ev => ev.stopPropagation()}
      onDoubleClick={ev => ev.stopPropagation()}>
      <DialogTitle>
        {localization.title} - {selection && selection.Path}
      </DialogTitle>
      <DialogContent>
        <ListPickerComponent
          parentId={currentcontent.ParentId}
          currentPath={PathHelper.getParentPath(currentcontent.Path)}
          repository={repo}
          parentODataOptions={{ filter: `isOf('Folder')` }}
          onSelectionChanged={sel => setSelection(sel)}
          renderItem={node => (
            <ListItem button={true} selected={selection && node.Id === selection.Id}>
              <ListItemIcon>
                <Icon item={node} />
              </ListItemIcon>
              <ListItemText primary={node.DisplayName} />
            </ListItem>
          )}
        />
      </DialogContent>
      <DialogActions>
        <Typography>
          {selection &&
            localization.details.replace('{0}', props.content.length.toString()).replace('{1}', selection.Path)}
        </Typography>
        <Button onClick={ev => props.dialogProps.onClose && props.dialogProps.onClose(ev)}>
          {localization.cancelButton}
        </Button>
        <Button onClick={ev => props.dialogProps.onClose && props.dialogProps.onClose(ev)}>
          {localization.copyButton}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
