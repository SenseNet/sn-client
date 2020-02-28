import {
  createStyles,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Popover,
  Theme,
  Tooltip,
} from '@material-ui/core'
import { CloudUpload } from '@material-ui/icons'
import Add from '@material-ui/icons/Add'
import { Schema } from '@sensenet/default-content-types'
import { CurrentContentContext, useLogger, useRepository } from '@sensenet/hooks-react'
import clsx from 'clsx'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useLocalization, usePersonalSettings, useSelectionService } from '../hooks'
import { useDialog } from './dialogs'
import { Icon } from './Icon'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    mainDiv: {
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
    },
    addButton: {
      width: '32px',
      height: '32px',
      minHeight: 0,
      padding: 0,
      margin: '0.5rem 0.5rem',
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
      },
    },
    addButtonDisabled: {
      backgroundColor: '#CCCCCC !important',
      '& svg': {
        color: '#8C8C8C',
      },
    },
    addButtonIcon: {
      color: theme.palette.common.white,
    },
    addButtonExpanded: {
      width: '28px',
      height: '28px',
      minHeight: 0,
      padding: 0,
      backgroundColor: theme.palette.primary.main,
    },
    iconButtonWrapper: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
    listItem: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    listDropdown: {
      padding: '10px 0 10px 10px',
      width: '245px',
      maxHeight: '548px',
    },
    listItemTextDropdown: {
      margin: 0,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      maxWidth: '139px',
    },
    disabled: {
      cursor: 'not-allowed',
    },
  })
})
export interface AddButtonProps {
  isOpened?: boolean
  path: string
}

export const AddButton: React.FunctionComponent<AddButtonProps> = props => {
  const selectionService = useSelectionService()
  const classes = useStyles()
  const repo = useRepository()
  const { openDialog } = useDialog()
  const parentContext = useContext(CurrentContentContext)
  const [parent, setParent] = useState(parentContext)
  const [showSelectType, setShowSelectType] = useState(false)
  const [allowedChildTypes, setAllowedChildTypes] = useState<Schema[]>([])
  const localization = useLocalization().addButton
  const logger = useLogger('AddButton')
  const [isAvailable, setAvailable] = useState(true)
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const [hasUpload, setHasUpload] = useState(false)
  const [currentComponent, setCurrentComponent] = useState(selectionService.activeContent.getValue())
  const personalSettings = usePersonalSettings()

  useEffect(() => {
    const activeComponentObserve = selectionService.activeContent.subscribe(newActiveComponent =>
      setCurrentComponent(newActiveComponent),
    )

    return function cleanup() {
      activeComponentObserve.dispose()
    }
  }, [selectionService.activeContent])

  useEffect(() => {
    currentComponent && setParent(currentComponent)
  }, [currentComponent])

  useEffect(() => {
    !currentComponent && setParent(parentContext)
  }, [parentContext, currentComponent])

  useEffect(() => {
    const getActions = async () => {
      try {
        const actions = await repo.getActions({ idOrPath: parent ? parent.Id : props.path })
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

    if (parent || props.path !== '') {
      getActions()
    } else {
      setAvailable(false)
    }
  }, [localization.errorGettingActions, logger, parent, props.path, repo])

  useEffect(() => {
    const getAllowedChildTypes = async () => {
      try {
        const allowedChildTypesFromRepo = await repo.getAllowedChildTypes({
          idOrPath: currentComponent ? parent.Id : props.path,
        })

        const filteredTypes = allowedChildTypesFromRepo.d.results
          .filter(type => repo.schemas.getSchemaByName(type.Name).ContentTypeName === type.Name)
          .map(type => repo.schemas.getSchemaByName(type.Name))

        const tempHasUpload = filteredTypes.some(type => personalSettings.uploadHandlers.includes(type.HandlerName))

        setAllowedChildTypes(filteredTypes)
        setHasUpload(tempHasUpload)
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
      currentComponent || props.path !== '' ? getAllowedChildTypes() : setAllowedChildTypes([])
    }
  }, [
    currentComponent,
    localization.errorGettingAllowedContentTypes,
    logger,
    parent.Id,
    personalSettings.uploadHandlers,
    props.path,
    repo,
    showSelectType,
  ])

  return (
    <div
      className={clsx(classes.mainDiv, {
        [classes.disabled]: !isAvailable,
      })}>
      {!props.isOpened ? (
        <div className={classes.iconButtonWrapper}>
          {isAvailable ? (
            <Tooltip
              title={localization.addNew}
              placement="right"
              className={clsx({
                [classes.disabled]: !isAvailable,
              })}>
              <span>
                <IconButton
                  className={clsx(classes.addButton, {
                    [classes.addButtonDisabled]: !isAvailable,
                  })}
                  onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                    setAnchorEl(event.currentTarget)
                    setShowSelectType(true)
                  }}
                  disabled={!isAvailable}>
                  <Add className={classes.addButtonIcon} />
                </IconButton>
              </span>
            </Tooltip>
          ) : (
            <span>
              <IconButton
                className={clsx(classes.addButton, {
                  [classes.addButtonDisabled]: !isAvailable,
                })}
                onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                  setAnchorEl(event.currentTarget)
                  setShowSelectType(true)
                }}
                disabled={!isAvailable}>
                <Add className={classes.addButtonIcon} />
              </IconButton>
            </span>
          )}
        </div>
      ) : (
        <ListItem
          className={classes.listItem}
          button={true}
          onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
            setAnchorEl(event.currentTarget)
            setShowSelectType(true)
          }}
          disabled={!isAvailable}>
          <ListItemIcon>
            <Tooltip title={localization.addNew} placement="right">
              <span>
                <IconButton
                  className={clsx(classes.addButtonExpanded, {
                    [classes.addButtonDisabled]: !isAvailable,
                  })}
                  disabled={!isAvailable}>
                  <Add className={classes.addButtonIcon} />
                </IconButton>
              </span>
            </Tooltip>
          </ListItemIcon>
          <ListItemText primary={localization.addNew} />
        </ListItem>
      )}
      <Popover
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
        <List className={classes.listDropdown}>
          {hasUpload ? (
            <Tooltip title={localization.upload} placement="right">
              <ListItem
                key="Upload"
                button={true}
                style={{ padding: '10px 0 10px 10px' }}
                onClick={() => {
                  setShowSelectType(false)
                  openDialog({
                    name: 'upload',
                    props: { uploadPath: parent.Path },
                    dialogProps: { open: true, fullScreen: true },
                  })
                }}>
                <ListItemIcon style={{ minWidth: '36px' }}>
                  <CloudUpload />
                </ListItemIcon>
                <ListItemText primary={localization.upload} className={classes.listItemTextDropdown} />
              </ListItem>
            </Tooltip>
          ) : null}

          {allowedChildTypes.map(childType => (
            <Tooltip key={childType.ContentTypeName} title={childType.DisplayName} placement="right">
              <ListItem
                button={true}
                style={{ padding: '10px 0 10px 10px' }}
                onClick={() => {
                  setShowSelectType(false)
                  openDialog({
                    name: 'add',
                    props: { schema: childType, parentPath: currentComponent ? currentComponent.Path : props.path },
                  })
                }}>
                <ListItemIcon style={{ minWidth: '36px' }}>
                  <Icon item={childType} />
                </ListItemIcon>
                <ListItemText primary={childType.DisplayName} className={classes.listItemTextDropdown} />
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Popover>
    </div>
  )
}
