import { Schema } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import {
  createStyles,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Popover,
  Tooltip,
} from '@material-ui/core'
import { CloudUploadOutlined } from '@material-ui/icons'
import Add from '@material-ui/icons/Add'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { globals, useGlobalStyles } from '../globalStyles'
import { useLocalization, usePersonalSettings, useQuery, useSnRoute } from '../hooks'
import { navigateToAction } from '../services'
import { useDialog } from './dialogs'
import { Icon } from './Icon'

const useStyles = makeStyles(() => {
  return createStyles({
    addButtonDisabled: {
      backgroundColor: '#CCCCCC !important',
      '& svg': {
        color: '#8C8C8C',
      },
    },
    listItem: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      height: globals.common.drawerItemHeight,
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
}

export const AddButton: React.FunctionComponent<AddButtonProps> = (props) => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const repo = useRepository()
  const history = useHistory()
  const { openDialog } = useDialog()
  const [showSelectType, setShowSelectType] = useState(false)
  const [allowedChildTypes, setAllowedChildTypes] = useState<Schema[]>([])
  const localization = useLocalization().addButton
  const logger = useLogger('AddButton')
  const [isAvailable, setAvailable] = useState(true)
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const [hasUpload, setHasUpload] = useState(false)
  const personalSettings = usePersonalSettings()

  const snRoute = useSnRoute()
  const pathQuery = useQuery().get('path')
  const currentPath = `${snRoute.path ?? ''}${pathQuery ?? ''}`
  const activeAction = snRoute.match?.params.action

  useEffect(() => {
    const getActions = async () => {
      try {
        const actions = await repo.getActions({ idOrPath: currentPath })
        const isActionFound = actions.d.results.some((action) => action.Name === 'Add' || action.Name === 'Upload')
        setAvailable(isActionFound && !activeAction)
      } catch (error) {
        logger.error({
          message: localization.errorGettingActions,
          data: {
            details: { error },
          },
        })
      }
    }

    if (currentPath) {
      getActions()
    } else {
      setAvailable(false)
    }
  }, [localization.errorGettingActions, logger, repo, currentPath, activeAction])

  useEffect(() => {
    const getAllowedChildTypes = async () => {
      try {
        const allowedChildTypesFromRepo = await repo.allowedChildTypes.get({
          idOrPath: currentPath,
        })

        const filteredTypes = allowedChildTypesFromRepo.d.results
          .filter((type) => repo.schemas.getSchemaByName(type.Name).ContentTypeName === type.Name)
          .map((type) => repo.schemas.getSchemaByName(type.Name))

        const tempHasUpload = filteredTypes.some((type) => personalSettings.uploadHandlers.includes(type.HandlerName))

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
      currentPath ? getAllowedChildTypes() : setAllowedChildTypes([])
    }
  }, [
    localization.errorGettingAllowedContentTypes,
    logger,
    personalSettings.uploadHandlers,
    repo,
    showSelectType,
    currentPath,
  ])

  return (
    <div className={clsx(globalClasses.centered, globalClasses.relative)}>
      {!props.isOpened ? (
        <div className={globalClasses.drawerIconButtonWrapper}>
          {isAvailable ? (
            <Tooltip title={localization.addNew} placement="right">
              <span>
                <IconButton
                  className={globalClasses.drawerButton}
                  onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                    setAnchorEl(event.currentTarget)
                    setShowSelectType(true)
                  }}>
                  <Add className={globalClasses.drawerButtonIcon} />
                </IconButton>
              </span>
            </Tooltip>
          ) : (
            <span>
              <IconButton
                className={clsx(globalClasses.drawerButton, {
                  [classes.addButtonDisabled]: !isAvailable,
                })}
                onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                  setAnchorEl(event.currentTarget)
                  setShowSelectType(true)
                }}
                disabled={true}>
                <Add className={globalClasses.drawerButtonIcon} />
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
          <ListItemIcon className={globalClasses.centeredHorizontal}>
            <Tooltip title={localization.addNew} placement="right">
              <span>
                <IconButton
                  className={clsx(globalClasses.drawerButtonExpanded, {
                    [classes.addButtonDisabled]: !isAvailable,
                  })}
                  disabled={!isAvailable}>
                  <Add className={globalClasses.drawerButtonIcon} />
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
                    props: { uploadPath: currentPath },
                    dialogProps: { open: true, fullScreen: true },
                  })
                }}>
                <ListItemIcon style={{ minWidth: '36px' }}>
                  <CloudUploadOutlined />
                </ListItemIcon>
                <ListItemText primary={localization.upload} className={classes.listItemTextDropdown} />
              </ListItem>
            </Tooltip>
          ) : null}

          {allowedChildTypes.map((childType) => (
            <Tooltip key={childType.ContentTypeName} title={childType.DisplayName} placement="right">
              <ListItem
                button={true}
                style={{ padding: '10px 0 10px 10px' }}
                onClick={async () => {
                  setShowSelectType(false)
                  navigateToAction({
                    history,
                    routeMatch: snRoute.match,
                    action: 'new',
                    queryParams: { 'content-type': childType.ContentTypeName },
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
