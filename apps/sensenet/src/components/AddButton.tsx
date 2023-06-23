import {
  CircularProgress,
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
import { CloudUploadOutlined } from '@material-ui/icons'
import Add from '@material-ui/icons/Add'
import { Schema } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { clsx } from 'clsx'
import React, { FunctionComponent, MouseEvent, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { globals, useGlobalStyles } from '../globalStyles'
import { useLocalization, usePersonalSettings, useQuery, useSnRoute } from '../hooks'
import { navigateToAction } from '../services'
import { useDialog } from './dialogs'
import { Icon } from './Icon'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    addWrapper: {
      position: 'relative',
    },
    addListLoader: {
      color: theme.palette.secondary.main,
      position: 'absolute',
      top: 4,
      left: 4,
      zIndex: 1,
    },
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
      minWidth: '245px',
      maxHeight: '548px',
    },
    listItemTextDropdown: {
      margin: 0,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
    disabled: {
      cursor: 'not-allowed',
    },
  })
})
export interface AddButtonProps {
  isOpened?: boolean
}

export const AddButton: FunctionComponent<AddButtonProps> = (props) => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const repo = useRepository()
  const history = useHistory()
  const { openDialog } = useDialog()
  const [showSelectType, setShowSelectType] = useState(false)
  const [allowedChildTypes, setAllowedChildTypes] = useState<Schema[]>([])
  const localization = useLocalization().addButton
  const logger = useLogger('AddButton')
  const [isLoading, setIsLoading] = useState(false)
  const [isAvailable, setAvailable] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
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
            error,
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
        setIsLoading(true)
        const allowedChildTypesFromRepo = await repo.allowedChildTypes.get({
          idOrPath: currentPath,
        })

        //sort the allowed types by display name
        const filteredTypes = allowedChildTypesFromRepo.d.results
          .filter((type) => repo.schemas.getSchemaByName(type.Name).ContentTypeName === type.Name)
          .map((type) => repo.schemas.getSchemaByName(type.Name))
          .sort((a, b) => a.DisplayName.localeCompare(b.DisplayName))

        const tempHasUpload = filteredTypes.some((type) => personalSettings.uploadHandlers.includes(type.HandlerName))

        setAllowedChildTypes(filteredTypes)
        setHasUpload(tempHasUpload)
      } catch (error) {
        logger.error({
          message: localization.errorGettingAllowedContentTypes,
          data: {
            error,
          },
        })
      } finally {
        setIsLoading(false)
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
            <div className={classes.addWrapper}>
              <Tooltip title={localization.addNew} placement="right">
                <IconButton
                  className={globalClasses.drawerButton}
                  onClick={(event: MouseEvent<HTMLElement>) => {
                    if (isLoading) return
                    setAnchorEl(event.currentTarget)
                    setShowSelectType(true)
                  }}
                  data-test="add-button">
                  <Add className={globalClasses.drawerButtonIcon} />
                </IconButton>
              </Tooltip>
              {isLoading && <CircularProgress size={40} className={classes.addListLoader} />}
            </div>
          ) : (
            <IconButton
              className={clsx(globalClasses.drawerButton, {
                [classes.addButtonDisabled]: !isAvailable,
              })}
              data-test="add-button"
              disabled={true}>
              <Add className={globalClasses.drawerButtonIcon} />
            </IconButton>
          )}
        </div>
      ) : (
        <ListItem
          className={classes.listItem}
          button={true}
          onClick={(event: MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget)
            setShowSelectType(true)
          }}
          disabled={!isAvailable}>
          <ListItemIcon className={globalClasses.centeredHorizontal}>
            <Tooltip title={localization.addNew} placement="right" data-test="add-button">
              <IconButton
                className={clsx(globalClasses.drawerButtonExpanded, {
                  [classes.addButtonDisabled]: !isAvailable,
                })}
                disabled={!isAvailable}
                data-test="add-button">
                <Add className={globalClasses.drawerButtonIcon} />
              </IconButton>
            </Tooltip>
          </ListItemIcon>
          <ListItemText primary={localization.addNew} />
        </ListItem>
      )}
      {!isLoading && (
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
          <List className={classes.listDropdown} data-test="list-items">
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
                      dialogProps: { open: true, fullScreen: false },
                    })
                  }}>
                  <ListItemIcon style={{ minWidth: '36px' }}>
                    <CloudUploadOutlined />
                  </ListItemIcon>
                  <ListItemText primary={localization.upload} className={classes.listItemTextDropdown} />
                </ListItem>
              </Tooltip>
            ) : null}

            {allowedChildTypes.length === 0 && !hasUpload ? (
              <div>{localization.noItems}</div>
            ) : (
              allowedChildTypes.map((childType) => (
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
                    }}
                    data-test={`listitem-${childType.DisplayName.replace(/\s+/g, '-').toLowerCase()}`}>
                    <ListItemIcon style={{ minWidth: '36px' }}>
                      <Icon item={childType} />
                    </ListItemIcon>
                    <ListItemText primary={childType.DisplayName} className={classes.listItemTextDropdown} />
                  </ListItem>
                </Tooltip>
              ))
            )}
          </List>
        </Popover>
      )}
    </div>
  )
}
