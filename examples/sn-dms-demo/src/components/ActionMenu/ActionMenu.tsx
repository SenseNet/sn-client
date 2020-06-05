import { useOidcAuthentication } from '@sensenet/authentication-oidc-react'
import { ActionModel, Query } from '@sensenet/default-content-types'
import { RepositoryContext } from '@sensenet/hooks-react'
import { Icon, iconType } from '@sensenet/icons-react'
import { Actions } from '@sensenet/redux'
import Drawer from '@material-ui/core/Drawer'
import Fade from '@material-ui/core/Fade'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { compile } from 'path-to-regexp'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { v1 } from 'uuid'
import * as DMSActions from '../../Actions'
import { downloadFile } from '../../assets/helpers'
import { icons } from '../../assets/icons'
import { resources } from '../../assets/resources'
import { select } from '../../store/documentlibrary/actions'
import { closePicker, deselectPickeritem, openPicker } from '../../store/picker/actions'
import { rootStateType } from '../../store/rootReducer'
import { isCallableAction } from '../CallableAction'
import ApproveorRejectDialog from '../Dialogs/ApproveorRejectDialog'
import CopyToConfirmDialog from '../Dialogs/CopyToConfirmDialog'
import DeleteDialog from '../Dialogs/DeleteDialog'
import EditPropertiesDialog from '../Dialogs/EditPropertiesDialog'
import MoveToConfirmDialog from '../Dialogs/MoveToConfirmDialog'
import ShareDialog from '../Dialogs/ShareDialog'
import VersionsDialog from '../Dialogs/VersionsDialog'
import PathPickerDialog from '../Pickers/PathPickerDialog'
import { UPLOAD_FILE_BUTTON_ID, UPLOAD_FOLDER_BUTTON_ID } from '../Upload/UploadButton'

const mapStateToProps = (state: rootStateType) => {
  return {
    actions: state.dms.actionmenu.actions,
    open: state.dms.actionmenu.open,
    anchorElement: state.dms.actionmenu.anchorElement,
    position: state.dms.actionmenu.position,
    hostName: state.sensenet.session.repository ? state.sensenet.session.repository.repositoryUrl : '',
    currentitems: state.sensenet.currentitems,
    userName: state.sensenet.session.user.userName,
    queryOptions: state.sensenet.currentitems.options,
    currentContent: state.dms.actionmenu.content,
    currentParent: state.dms.documentLibrary.parent,
    currentUser: state.sensenet.session.user.content,
  }
}

const mapDispatchToProps = {
  setEdited: DMSActions.setEditedContentId,
  clearSelection: Actions.clearSelection,
  deleteBatch: Actions.deleteBatch,
  closeActionMenu: DMSActions.closeActionMenu,
  openViewer: DMSActions.openViewer,
  userChanged: Actions.userChanged,
  openDialog: DMSActions.openDialog,
  closeDialog: DMSActions.closeDialog,
  openPicker,
  closePicker,
  loadContent: Actions.loadContent,
  fetchContent: Actions.requestContent,
  checkoutContent: Actions.checkOut,
  checkinContent: Actions.checkIn,
  publishContent: Actions.publish,
  undoCheckout: Actions.undoCheckout,
  forceundoCheckout: Actions.forceUndoCheckout,
  deselectPickeritem,
  select,
  uploadFileList: DMSActions.uploadFileList,
  chooseMenuItem: DMSActions.chooseMenuItem,
}

const styles = {
  actionmenuContainer: {
    flex: 1,
  },
  menuIcon: {
    color: '#fff',
    display: 'inline-block',
    verticalAlign: 'middle',
    cursor: 'pointer',
  },
  menuIconMobile: {
    width: 'auto' as any,
    marginLeft: '16px',
  },
  arrowButton: {
    marginLeft: 0,
  },
  menuItem: {
    padding: '6px 15px',
    minHeight: 24,
    fontSize: '0.9rem',
    fontFamily: 'Raleway Medium',
  },
  menuItemMobile: {
    padding: '10px 15px',
    fontSize: '0.9rem',
    fontFamily: 'Raleway Medium',
  },
  avatar: {
    display: 'inline-block',
  },
  actionIcon: {
    color: '#016D9E',
  },
  openInEditorLink: {
    color: '#000',
    textDecoration: 'none' as any,
  },
  openInEditorLinkHovered: {
    color: '#016d9e',
    textDecoration: 'none' as any,
  },
}

interface ActionMenuProps extends RouteComponentProps<any> {
  id: number
}

const ActionMenu: React.FunctionComponent<
  ActionMenuProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps
> = (props) => {
  const [hovered, setHovered] = useState<string>('')
  const { logout } = useOidcAuthentication()

  const isHovered = (id: string) => {
    return hovered === id
  }

  const handleMouseEnter = (_e: React.MouseEvent, name: string) => {
    setHovered(name)
  }

  const handleMouseLeave = () => {
    setHovered('')
  }

  const handleClose = () => {
    props.closeActionMenu()
  }

  const handleMenuItemClick = (_e: React.MouseEvent, action: ActionModel) => {
    if (isCallableAction(action)) {
      action.Action()
    } else {
      const content = props.currentContent
      if (!content) {
        return
      }
      switch (action.Name) {
        case 'Rename':
          handleClose()
          props.setEdited(props.currentContent?.Id || 0)
          break
        case 'ClearSelection':
          handleClose()
          props.clearSelection()
          break
        case 'DeleteBatch':
        case 'Delete':
          if (content) {
            handleClose()
            props.clearSelection()
            props.openDialog(<DeleteDialog content={[content]} />, resources.DELETE, props.closeDialog)
          }
          break
        case 'Preview': {
          handleClose()
          const newPath = compile(props.match.path)({
            folderPath: props.match.params.folderPath || btoa(props.id as any),
            otherActions: ['preview', btoa(content?.Id.toString() || '')],
          })
          props.history.push(newPath)
          break
        }
        case 'Logout':
          handleClose()
          logout()
          break
        case 'Browse': {
          handleClose()
          const path = props.currentContent?.Path || ''
          downloadFile(path, props.hostName)
          break
        }
        case 'Versions':
          handleClose()
          props.currentContent &&
            props.openDialog(
              <VersionsDialog currentContent={props.currentContent} />,
              resources.VERSIONS,
              props.closeDialog,
            )
          break
        case 'Share':
          handleClose()
          props.currentContent && props.openDialog(<ShareDialog currentContent={props.currentContent} />)
          break
        case 'Profile': {
          handleClose()
          const user = props.currentUser
          const userPath = compile('/users/:folderPath?/:otherActions*')({
            folderPath: btoa(user?.ParentId?.toString() || ''),
            otherActions: ['user', btoa(user?.Id.toString() || '')],
          })
          props.history.push(userPath)
          props.chooseMenuItem('profile')
          break
        }
        case 'Edit':
          handleClose()
          content &&
            props.openDialog(
              <RepositoryContext.Consumer>
                {(repository) => (
                  <EditPropertiesDialog
                    content={content}
                    contentTypeName={content?.Type || ''}
                    repository={repository}
                  />
                )}
              </RepositoryContext.Consumer>,
              resources.EDIT_PROPERTIES,
              props.closeDialog,
            )
          break
        case 'CheckOut':
          handleClose()
          props.checkoutContent(content?.Id || 0)
          break
        case 'Publish':
          handleClose()
          props.publishContent(content?.Id || 0)
          break
        case 'CheckIn':
          handleClose()
          props.checkinContent(content?.Id || 0)
          break
        case 'UndoCheckOut':
          handleClose()
          props.undoCheckout(content?.Id || 0)
          break
        case 'ForceUndoCheckOut':
          handleClose()
          props.forceundoCheckout(content?.Id || 0)
          break
        case 'Approve':
          handleClose()
          props.openDialog(
            <ApproveorRejectDialog id={content?.Id || 0} fileName={content?.DisplayName || ''} />,
            resources.APPROVE_OR_REJECT,
            props.closeDialog,
          )
          break
        case 'MoveTo':
          handleClose()
          props.openPicker(
            <PathPickerDialog
              mode="Move"
              currentPath={props.currentParent?.Path || ''}
              dialogComponent={<MoveToConfirmDialog />}
              dialogTitle={resources.MOVE}
              dialogCallback={Actions.moveBatch as any}
            />,
            'move',
            () => {
              props.closePicker() && props.deselectPickeritem()
            },
          )
          break
        case 'CopyTo':
          handleClose()
          props.openPicker(
            <PathPickerDialog
              mode="Copy"
              currentPath={props.currentParent?.Path || ''}
              dialogComponent={<CopyToConfirmDialog />}
              dialogTitle={resources.COPY}
              dialogCallback={Actions.copyBatch as any}
            />,
            'copy',
            () => props.closePicker() && props.deselectPickeritem(),
          )
          break
        case 'MoveBatch':
          handleClose()
          props.openPicker(
            <PathPickerDialog
              mode="Move"
              currentPath={props.currentParent?.Path || ''}
              dialogComponent={<MoveToConfirmDialog />}
              dialogTitle={resources.MOVE}
              dialogCallback={Actions.moveBatch as any}
            />,
            'move',
            () => props.closePicker() && props.deselectPickeritem(),
          )
          break
        case 'ExecuteQuery': {
          const query = content as Query
          props.history.replace(`/documents?query=${query.Query}&queryName=${query.DisplayName || query.Name}`)
          props.closeActionMenu()
          break
        }
        case 'OpenInEditor':
          return null
        default:
          console.log(`${action.Name} is clicked`)
          handleClose()
          break
      }
    }
  }

  const handleUpload = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    ev.persist()
    handleClose()
    ev.target.files &&
      (await props.uploadFileList({
        fileList: ev.target.files,
        createFolders: true,
        binaryPropertyName: 'Binary',
        overwrite: false,
        parentPath: props.currentParent?.Path || '',
      }))
  }

  return (
    <MediaQuery minDeviceWidth={700}>
      {(matches) => {
        return matches ? (
          <Menu
            id="actionmenu"
            open={props.open}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={props.position}
            TransitionComponent={Fade}>
            {props.actions
              .filter((action) => action.Name !== 'Browse' && action.Name !== 'SetPermissions')
              .map((action, index) => {
                const displayName = resources[action.DisplayName.replace(/ /g, '').toUpperCase()]
                let iconFileType
                switch (action.Icon) {
                  case 'word':
                  case 'excel':
                  case 'acrobat':
                  case 'powerpoint':
                  case 'office':
                    iconFileType = iconType.flaticon
                    break
                  default:
                    iconFileType = iconType.materialui
                    break
                }
                return props.actions.findIndex((a) => a.Name === 'WopiOpenEdit') > -1 &&
                  action.Name === 'WopiOpenView' ? null : (
                  <MenuItem
                    key={index}
                    onClick={(event) => handleMenuItemClick(event, action)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#016d9e'
                      e.currentTarget.style.fontWeight = 'bold'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#000'
                      e.currentTarget.style.fontWeight = 'normal'
                    }}
                    style={styles.menuItem}
                    title={displayName}>
                    <ListItemIcon style={styles.actionIcon}>
                      <Icon
                        type={iconFileType}
                        color="primary"
                        iconName={
                          action.Icon === 'Application'
                            ? icons[action.Name.toLowerCase() as keyof typeof icons]
                            : icons[action.Icon.toLowerCase() as keyof typeof icons]
                        }>
                        {action.Name === 'MoveTo' ? (
                          <Icon
                            iconName="forward"
                            type={iconType.materialui}
                            style={{ position: 'absolute', left: '1.8em', top: '1.1em', color: '#fff', fontSize: 12 }}
                          />
                        ) : null}
                        {action.Name === 'Rename' ? (
                          <Icon
                            iconName="mode_edit"
                            type={iconType.materialui}
                            style={{
                              position: 'absolute',
                              left: '1.87em',
                              top: '1.38em',
                              color: '#fff',
                              fontSize: 11,
                            }}
                          />
                        ) : null}
                        {action.Name === 'ForceUndoCheckOut' ? (
                          <Icon
                            iconName="warning"
                            type={iconType.materialui}
                            style={{
                              position: 'absolute',
                              left: '1.87em',
                              top: '1.38em',
                              color: '#fff',
                              fontSize: 11,
                            }}
                          />
                        ) : null}
                      </Icon>
                    </ListItemIcon>
                    {action.Name.indexOf('Wopi') > -1 ? (
                      <Link
                        onClick={handleClose}
                        to={`/wopi/${btoa(props.currentContent?.Id.toString() || '')}`}
                        target="_blank"
                        onMouseOver={(e) => handleMouseEnter(e, 'OpenInEditor')}
                        onMouseLeave={handleMouseLeave}
                        style={isHovered('OpenInEditor') ? styles.openInEditorLinkHovered : styles.openInEditorLink}>
                        {displayName}
                      </Link>
                    ) : (
                      displayName
                    )}
                  </MenuItem>
                )
              })}
          </Menu>
        ) : (
          <Drawer anchor="bottom" open={props.open} onClose={handleClose}>
            <List>
              {props.actions
                .filter((action) => action.Name !== 'Browse' && action.Name !== 'SetPermissions')
                .map((action, index) => {
                  const displayName = resources[action.DisplayName.replace(/ /g, '').toUpperCase()]
                  if (action.Name === 'uploadFile') {
                    const uploadFileButtonId = `${UPLOAD_FILE_BUTTON_ID}-${v1()}`
                    return (
                      <label htmlFor={uploadFileButtonId} style={{ outline: 'none' }}>
                        <MenuItem style={styles.menuItem}>
                          <ListItemIcon style={styles.actionIcon}>
                            <div>
                              <Icon iconName="insert_drive_file" type={iconType.materialui} />
                              <Icon
                                iconName="forward"
                                type={iconType.materialui}
                                style={{
                                  color: '#fff',
                                  position: 'absolute',
                                  left: '1.75em',
                                  top: '1em',
                                  fontSize: 12,
                                  transform: 'rotate(-90deg)',
                                }}
                              />
                            </div>
                          </ListItemIcon>
                          {resources.UPLOAD_BUTTON_UPLOAD_FILE_TITLE}
                        </MenuItem>
                        <input
                          multiple={true}
                          id={uploadFileButtonId}
                          type="file"
                          onChange={(ev) => handleUpload(ev)}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )
                  }

                  if (action.Name === 'uploadFolder') {
                    const uploadFolderButtonId = `${UPLOAD_FOLDER_BUTTON_ID}-${v1()}`
                    return (
                      <label htmlFor={uploadFolderButtonId} style={{ outline: 'none' }}>
                        <MenuItem style={styles.menuItem}>
                          <ListItemIcon style={styles.actionIcon}>
                            <div>
                              <Icon iconName="folder" type={iconType.materialui} />
                              <Icon
                                iconName="forward"
                                type={iconType.materialui}
                                style={{
                                  color: '#fff',
                                  position: 'absolute',
                                  left: '1.75em',
                                  top: '0.85em',
                                  fontSize: 12,
                                  transform: 'rotate(-90deg)',
                                }}
                              />
                            </div>
                          </ListItemIcon>
                          {resources.UPLOAD_BUTTON_UPLOAD_FOLDER_TITLE}
                        </MenuItem>
                        <input
                          multiple={true}
                          id={uploadFolderButtonId}
                          type="file"
                          onChange={(ev) => handleUpload(ev)}
                          style={{ display: 'none' }}
                          {...({
                            directory: '',
                            webkitdirectory: '',
                          } as any)}
                        />
                      </label>
                    )
                  }
                  let iconFileType
                  switch (action.Icon) {
                    case 'word':
                    case 'excel':
                    case 'acrobat':
                    case 'powerpoint':
                    case 'office':
                      iconFileType = iconType.flaticon
                      break
                    default:
                      iconFileType = iconType.materialui
                      break
                  }
                  return (
                    <MenuItem
                      key={index}
                      onClick={(event) => handleMenuItemClick(event, action)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#016d9e'
                        e.currentTarget.style.fontWeight = 'bold'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#000'
                        e.currentTarget.style.fontWeight = 'normal'
                      }}
                      style={styles.menuItemMobile}
                      title={displayName}>
                      <ListItemIcon style={styles.actionIcon}>
                        <Icon
                          type={iconFileType}
                          color="primary"
                          iconName={
                            action.Icon === 'Application'
                              ? icons[action.Name.toLowerCase() as keyof typeof icons]
                              : icons[action.Icon.toLowerCase() as keyof typeof icons]
                          }>
                          {action.Icon === 'Application'
                            ? icons[action.Name.toLowerCase() as keyof typeof icons]
                            : icons[action.Icon.toLowerCase() as keyof typeof icons]}
                          {action.Name === 'MoveTo' ? (
                            <Icon
                              iconName="forward"
                              type={iconType.materialui}
                              style={{
                                color: '#fff',
                                position: 'absolute',
                                left: '1.75em',
                                top: '1.4em',
                                fontSize: 12,
                              }}
                            />
                          ) : null}
                          {action.Name === 'Rename' ? (
                            <Icon
                              iconName="mode_edit"
                              type={iconType.materialui}
                              style={{
                                color: '#fff',
                                position: 'absolute',
                                left: '1.87em',
                                top: '1.78em',
                                fontSize: 11,
                              }}
                            />
                          ) : null}
                          {action.Name === 'ForceUndoCheckOut' ? (
                            <Icon
                              iconName="warning"
                              type={iconType.materialui}
                              style={{
                                color: '#fff',
                                position: 'absolute',
                                left: '1.87em',
                                top: '1.38em',
                                fontSize: 11,
                              }}
                            />
                          ) : null}
                          {action.Name === 'uploadFile' ? (
                            <Icon
                              iconName="forward"
                              type={iconType.materialui}
                              style={{
                                color: '#fff',
                                position: 'absolute',
                                left: '0.86em',
                                top: '0.48em',
                                fontSize: 11,
                                transform: 'rotate(-90deg)',
                              }}
                            />
                          ) : null}
                          {action.Name === 'uploadFolder' ? (
                            <Icon
                              iconName="forward"
                              type={iconType.materialui}
                              style={{
                                color: '#fff',
                                position: 'absolute',
                                left: '0.87em',
                                top: '0.42em',
                                fontSize: 11,
                                transform: 'rotate(-90deg)',
                              }}
                            />
                          ) : null}
                        </Icon>
                      </ListItemIcon>
                      {resources[action.Name.toUpperCase()]}
                    </MenuItem>
                  )
                })}
            </List>
          </Drawer>
        )
      }}
    </MediaQuery>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ActionMenu))
