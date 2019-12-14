import Add from '@material-ui/icons/Add'
import CloudUpload from '@material-ui/icons/CloudUpload'
import { GenericContent, Schema } from '@sensenet/default-content-types'
import React, { useContext, useEffect, useState } from 'react'
import { CurrentContentContext, useLogger, useRepository } from '@sensenet/hooks-react'
import { Button, Fab, SwipeableDrawer, Tooltip, Typography } from '@material-ui/core'
import { useLocalization } from '../hooks'
import { Icon } from './Icon'
import { useDialog } from './dialogs'

export interface AddButtonProps {
  parent?: GenericContent
  allowedTypes?: string[]
  isOpened?: boolean
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
  const [isAvailable, setAvailable] = useState(false)

  useEffect(() => {
    props.parent && setParent(props.parent)
  }, [props.parent])

  useEffect(() => {
    !props.parent && setParent(parentContext)
  }, [parentContext, props.parent])

  useEffect(() => {
    props.parent
      ? repo
          .getActions({ idOrPath: parent.Id })
          .then(actions =>
            actions.d.Actions.findIndex((action: { Name: string }) => action.Name === 'Add') === -1
              ? setAvailable(false)
              : setAvailable(true),
          )
          .catch(error => {
            logger.error({
              message: localization.errorGettingActions,
              data: {
                details: { error },
              },
            })
          })
      : setAvailable(false)
  }, [isAvailable, localization.errorGettingActions, logger, parent, props.parent, repo])

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
  }, [
    isAvailable,
    localization.errorGettingAllowedContentTypes,
    logger,
    parent.Id,
    parentContext.Path,
    props.allowedTypes,
    repo,
    showSelectType,
  ])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '0.5rem 0.5rem',
        position: 'relative',
      }}>
      {!props.isOpened ? (
        <Tooltip title={localization.tooltip} placement="right">
          <Fab
            style={{ width: '32px', height: '32px', minHeight: 0 }}
            color="primary"
            onClick={() => setShowSelectType(true)}
            disabled={!isAvailable}>
            <Add />
          </Fab>
        </Tooltip>
      ) : (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <Fab
            style={{ width: '32px', height: '32px', minHeight: 0 }}
            color="primary"
            onClick={() => setShowSelectType(true)}
            disabled={!isAvailable}>
            <Add />
          </Fab>
          <Typography>Add new</Typography>
        </div>
      )}
      <SwipeableDrawer
        anchor="bottom"
        onClose={() => setShowSelectType(false)}
        onOpen={() => {
          /** */
        }}
        open={showSelectType}>
        <Typography variant="subtitle1" style={{ margin: '0.8em' }}>
          {localization.new}
        </Typography>
        <div
          style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', maxHeight: '512px', overflow: 'auto' }}>
          <Button
            key="Upload"
            onClick={() => {
              setShowSelectType(false)
              openDialog({
                name: 'upload',
                props: { uploadPath: parent.Path },
                dialogProps: { open: true, fullScreen: true },
              })
            }}>
            <div
              style={{
                width: 90,
              }}>
              <CloudUpload style={{ height: 38, width: 38 }} />
              <Typography variant="body1">{localization.upload}</Typography>
            </div>
          </Button>
          {allowedChildTypes.map(childType => (
            <Button
              key={childType.ContentTypeName}
              onClick={() => {
                setShowSelectType(false)
                openDialog({ name: 'add', props: { schema: childType, parent } })
              }}>
              <div
                style={{
                  width: 90,
                }}>
                <Icon style={{ height: 38, width: 38 }} item={childType} />
                <Typography variant="body1">{childType.DisplayName}</Typography>
              </div>
            </Button>
          ))}
        </div>
      </SwipeableDrawer>
    </div>
  )
}
