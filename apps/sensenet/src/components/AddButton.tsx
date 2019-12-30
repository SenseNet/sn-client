import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import Add from '@material-ui/icons/Add'
import { GenericContent, Schema } from '@sensenet/default-content-types'
import React, { useContext, useEffect, useState } from 'react'
import { CurrentContentContext, useLogger, useRepository } from '@sensenet/hooks-react'
import { List, ListItem, ListItemIcon, ListItemText, Popover } from '@material-ui/core'
import { CloudUpload } from '@material-ui/icons'
import { useLocalization } from '../hooks'
import { useDialog } from './dialogs'
import { Icon } from './Icon'

export interface AddButtonProps {
  parent?: GenericContent
  allowedTypes?: string[]
}

export const AddButton: React.FunctionComponent<AddButtonProps> = props => {
  const repo = useRepository()
  const { openDialog } = useDialog()
  const parentContext = useContext(CurrentContentContext)
  const [parent, setParent] = useState(parentContext)
  const [showSelectType, setShowSelectType] = useState(false)
  const [allowedChildTypes, setAllowedChildTypes] = useState<Schema[]>([])
  const localization = useLocalization().addButton
  const logger = useLogger('AddButton')
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  useEffect(() => {
    props.parent && setParent(props.parent)
  }, [props.parent])

  useEffect(() => {
    !props.parent && setParent(parentContext)
  }, [parentContext, props.parent])

  useEffect(() => {
    if (props.allowedTypes && props.allowedTypes.length > 0) {
      setAllowedChildTypes(props.allowedTypes.map(type => repo.schemas.getSchemaByName(type)))
    } else if (showSelectType) {
      repo
        .getAllowedChildTypes({ idOrPath: parent.Id })
        .then(types => setAllowedChildTypes(types.d.results.map(t => repo.schemas.getSchemaByName(t.Name))))
        .catch(error => {
          logger.error({
            message: localization.errorGettingAllowedContentTypes,
            data: {
              details: { error },
            },
          })
        })
    }
  }, [localization.errorGettingAllowedContentTypes, logger, parent.Id, props.allowedTypes, repo, showSelectType])

  return (
    <div>
      <Tooltip title={localization.tooltip} placement="top-end">
        <Fab
          color="primary"
          style={{ position: 'fixed', bottom: '1em', right: '1em' }}
          onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
            setAnchorEl(event.currentTarget)
            setShowSelectType(true)
          }}>
          <Add />
        </Fab>
      </Tooltip>
      <Popover
        style={{ maxHeight: '85%' }}
        open={showSelectType}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null)
          setShowSelectType(false)
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}>
        <List>
          <ListItem
            key="Upload"
            button={true}
            onClick={() => {
              setShowSelectType(false)
              openDialog({
                name: 'upload',
                props: { uploadPath: parent.Path },
                dialogProps: { open: true, fullScreen: true },
              })
            }}>
            <ListItemIcon>
              <CloudUpload />
            </ListItemIcon>
            <ListItemText primary={localization.upload} />
          </ListItem>

          {allowedChildTypes.map(childType => (
            <ListItem
              key={childType.ContentTypeName}
              button={true}
              onClick={() => {
                setShowSelectType(false)
                openDialog({ name: 'add', props: { schema: childType, parent } })
              }}>
              <ListItemIcon>
                <Icon item={childType} />
              </ListItemIcon>
              <ListItemText primary={childType.DisplayName} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </div>
  )
}
