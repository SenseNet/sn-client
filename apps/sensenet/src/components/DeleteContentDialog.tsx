import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import LinearProgress from '@material-ui/core/LinearProgress'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useContext, useState } from 'react'
import { RepositoryContext } from '../context/RepositoryContext'
import { ResponsiveContext } from '../context/ResponsiveContextProvider'
import { Icon } from './Icon'

export const DeleteContentDialog: React.FunctionComponent<{
  content: GenericContent[]
  dialogProps: DialogProps
}> = props => {
  const device = useContext(ResponsiveContext)
  const [isDeleteInProgress, setIsDeleteInProgress] = useState(false)
  const [permanent, setPermanent] = useState(false)
  const repo = useContext(RepositoryContext)

  return (
    <Dialog {...props.dialogProps} onClick={ev => ev.stopPropagation()} onDoubleClick={ev => ev.stopPropagation()}>
      {isDeleteInProgress ? (
        <DialogTitle>Deleting content...</DialogTitle>
      ) : (
        <DialogTitle>Really delete content?</DialogTitle>
      )}
      <DialogContent>
        <Typography>You are going to delete the following content:</Typography>
        <List dense={device === 'mobile'}>
          {props.content.map(c => (
            <ListItem key={c.Id}>
              <ListItemIcon>
                <Icon item={c} />
              </ListItemIcon>
              <ListItemText primary={c.DisplayName || c.Name} secondary={c.Path} />
            </ListItem>
          ))}
        </List>
        {isDeleteInProgress ? <LinearProgress /> : null}
      </DialogContent>
      <DialogActions style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Tooltip title="Don't move to trash, delete immediately">
            <FormControlLabel
              style={{ marginLeft: '1em' }}
              label="Permanently"
              control={<Checkbox disabled={isDeleteInProgress} onChange={ev => setPermanent(ev.target.checked)} />}
            />
          </Tooltip>
        </div>
        <div>
          <Button
            disabled={isDeleteInProgress}
            onClick={ev => props.dialogProps.onClose && props.dialogProps.onClose(ev)}>
            Cancel
          </Button>
          <Button
            disabled={isDeleteInProgress}
            onClick={async ev => {
              try {
                setIsDeleteInProgress(true)
                await repo.delete({
                  idOrPath: props.content.map(c => c.Path),
                  permanent,
                })
              } finally {
                setIsDeleteInProgress(false)
                props.dialogProps.onClose && props.dialogProps.onClose(ev)
              }
            }}>
            Delete
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}
