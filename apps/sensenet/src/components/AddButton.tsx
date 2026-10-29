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
import React, { FunctionComponent, MouseEvent, useEffect, useRef, useState } from 'react'
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
      margin: 0,
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
      height: globals.common.addButtonHeight,
      paddingLeft: '4px',
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
    drawerIconButtonWrapper: {
      height: '40px',
    },
  })
})
export interface AddButtonProps {
  isOpened?: boolean
  isDisabled?: boolean
}

export const AddButton: FunctionComponent<AddButtonProps> = (props) => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const repo = useRepository()
  const history = useHistory()
  const { openDialog } = useDialog()
  const [showSelectType, setShowSelectType] = useState(false)
  const typeMenuPath = useRef('')
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
    const controller = new AbortController()
    let current = true
    setAvailable(false)
    const getActions = async () => {
      try {
        const actions = await repo.getActions({ idOrPath: currentPath, requestInit: { signal: controller.signal } })
        if (!current) return
        const isActionFound = actions.d.results.some(
          (action) => !action.Forbidden && (action.Name === 'Add' || action.Name === 'Upload'),
        )
        setAvailable(isActionFound && !activeAction && !props.isDisabled)
      } catch (error) {
        if (!current) return
        logger.error({
          message: localization.errorGettingActions,
          data: {
            error,
          },
        })
      }
    }

    if (currentPath && currentPath !== '/' && !activeAction && !props.isDisabled) {
      getActions()
    } else {
      setAvailable(false)
    }
    return () => {
      current = false
      controller.abort()
    }
  }, [localization.errorGettingActions, logger, repo, currentPath, activeAction, props.isDisabled])

  useEffect(() => {
    setShowSelectType(false)
    setAnchorEl(null)
  }, [currentPath, activeAction])

  useEffect(() => {
    const controller = new AbortController()
    let current = true
    const getAllowedChildTypes = async () => {
      try {
        setIsLoading(true)
        setAllowedChildTypes([])
        setHasUpload(false)
        const allowedChildTypesFromRepo = await repo.allowedChildTypes.get({
          idOrPath: currentPath,
          requestInit: { signal: controller.signal },
        })
        if (!current) return

        //sort the allowed types by display name
        const filteredTypes = allowedChildTypesFromRepo.d.results
          .filter((type) => repo.schemas.getSchemaByName(type.Name).ContentTypeName === type.Name)
          .map((type) => repo.schemas.getSchemaByName(type.Name))
          .sort((a, b) => (a.DisplayName || a.ContentTypeName).localeCompare(b.DisplayName || b.ContentTypeName))

        const tempHasUpload = filteredTypes.some((type) => personalSettings.uploadHandlers.includes(type.HandlerName))

        setAllowedChildTypes(filteredTypes)
        setHasUpload(tempHasUpload)
      } catch (error) {
        if (!current) return
        logger.error({
          message: localization.errorGettingAllowedContentTypes,
          data: {
            error,
          },
        })
      } finally {
        if (current) setIsLoading(false)
      }
    }

    if (showSelectType && typeMenuPath.current === currentPath) {
      currentPath ? getAllowedChildTypes() : setAllowedChildTypes([])
    } else {
      setIsLoading(false)
    }
    return () => {
      current = false
      controller.abort()
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
    <div className={clsx(globalClasses.relative)}>
      {!props.isOpened ? (
        <div className={classes.drawerIconButtonWrapper}>
          {isAvailable ? (
            <div className={classes.addWrapper}>
              <Tooltip title={localization.addNew} placement="right">
                <IconButton
                  className={globalClasses.drawerButton}
                  style={{ margin: 4 }}
                  onClick={(event: MouseEvent<HTMLElement>) => {
                    if (isLoading) return
                    typeMenuPath.current = currentPath
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
              style={{ margin: 4 }}
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
            typeMenuPath.current = currentPath
            setAnchorEl(event.currentTarget)
            setShowSelectType(true)
          }}
          disabled={!isAvailable}>
          <ListItemIcon>
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
          <ListItemText
            primary={localization.addNew}
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              marginLeft: '3px',
            }}
          />
        </ListItem>
      )}
      {!isLoading && (
        <Popover
          open={showSelectType && typeMenuPath.current === currentPath}
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
                <Tooltip
                  key={childType.ContentTypeName}
                  title={childType.DisplayName || childType.ContentTypeName}
                  placement="right">
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
                    data-test={`listitem-${(childType.DisplayName || childType.ContentTypeName)
                      .replace(/\s+/g, '-')
                      .toLowerCase()}`}>
                    <ListItemIcon style={{ minWidth: '36px' }}>
                      <Icon item={childType} />
                    </ListItemIcon>
                    <ListItemText
                      primary={childType.DisplayName || childType.ContentTypeName}
                      className={classes.listItemTextDropdown}
                    />
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
