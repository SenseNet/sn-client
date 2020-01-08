import Add from '@material-ui/icons/Add'
import CloudUpload from '@material-ui/icons/CloudUpload'
import { GenericContent, Schema } from '@sensenet/default-content-types'
import React, { useContext, useEffect, useState } from 'react'
import { CurrentContentContext, useLogger, useRepository } from '@sensenet/hooks-react'
import {
  Button,
  createStyles,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  SwipeableDrawer,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { useLocalization } from '../hooks'
import { Icon } from './Icon'
import { useDialog } from './dialogs'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    addButton: {
      width: '32px',
      height: '32px',
      minHeight: 0,
      padding: 0,
      margin: '0.5rem 0.5rem',
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  })
})

export interface AddButtonProps {
  parent?: GenericContent
  isOpened?: boolean
  path: string
}

export const AddButton: React.FunctionComponent<AddButtonProps> = props => {
  const classes = useStyles()
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
    const getActions = async () => {
      try {
        const actions = await repo.getActions({ idOrPath: props.parent ? parent.Id : props.path })
        const isActionFound = actions.d.Actions.some(action => action.Name === 'Add' || action.Name === 'Upload')
        setAvailable(isActionFound)
      } catch (error) {
        logger.error({
          message: localization.errorGettingActions,
          data: {
            details: { error },
          },
        })
      }
    }

    if (props.parent || props.path !== '') {
      getActions()
    } else {
      setAvailable(false)
    }
  }, [localization.errorGettingActions, logger, parent, props.parent, props.path, repo])

  useEffect(() => {
    const getAllowedChildTypes = async () => {
      try {
        const allowedChildTypesFromRepo = await repo.getAllowedChildTypes({
          idOrPath: props.parent ? parent.Id : props.path,
        })

        const tempAllowedChildTypes: Schema[] = []

        allowedChildTypesFromRepo.d.results.forEach(type => {
          if (repo.schemas.getSchemaByName(type.Name).ContentTypeName === type.Name) {
            tempAllowedChildTypes.push(repo.schemas.getSchemaByName(type.Name))
          }
        })
        setAllowedChildTypes(tempAllowedChildTypes)
      } catch (error) {
        logger.error({
          message: localization.errorGettingAllowedContentTypes,
          data: {
            details: { error },
          },
        })
      }
    }

    if (showSelectType) {
      props.parent || props.path !== '' ? getAllowedChildTypes() : setAllowedChildTypes([])
    }
  }, [localization.errorGettingAllowedContentTypes, logger, parent.Id, props.parent, props.path, repo, showSelectType])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
      }}>
      {!props.isOpened ? (
        <Tooltip title={localization.tooltip} placement="right">
          <span>
            <IconButton className={classes.addButton} onClick={() => setShowSelectType(true)} disabled={!isAvailable}>
              <Add />
            </IconButton>
          </span>
        </Tooltip>
      ) : (
        <ListItem
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}
          button={true}
          onClick={() => setShowSelectType(true)}
          disabled={!isAvailable}>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText primary={localization.addNew} />
        </ListItem>
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
            <Tooltip title={childType.DisplayName} key={childType.DisplayName}>
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
                  <Typography variant="body1" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {childType.DisplayName}
                  </Typography>
                </div>
              </Button>
            </Tooltip>
          ))}
        </div>
      </SwipeableDrawer>
    </div>
  )
}
