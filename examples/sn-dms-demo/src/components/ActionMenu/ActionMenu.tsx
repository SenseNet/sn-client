import Drawer from '@material-ui/core/Drawer'
import Fade from '@material-ui/core/Fade'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { IActionModel } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import { Actions } from '@sensenet/redux'
import { compile } from 'path-to-regexp'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { v1 } from 'uuid'
import * as DMSActions from '../../Actions'
import { downloadFile } from '../../assets/helpers'
import { icons } from '../../assets/icons'
import { resources } from '../../assets/resources'
import { select } from '../../store/documentlibrary/actions'
import { closePicker, loadPickerItems, openPicker, setBackLink, setPickerParent } from '../../store/picker/actions'
import { rootStateType } from '../../store/rootReducer'
import ApproveorRejectDialog from '../Dialogs/ApproveorRejectDialog'
import CopyToConfirmDialog from '../Dialogs/CopyToConfirmDialog'
import DeleteDialog from '../Dialogs/DeleteDialog'
import EditPropertiesDialog from '../Dialogs/EditPropertiesDialog'
import MoveToConfirmDialog from '../Dialogs/MoveToConfirmDialog'
import ShareDialog from '../Dialogs/ShareDialog'
import VersionsDialog from '../Dialogs/VersionsDialog'
import PathPicker from '../Pickers/PathPicker'
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
    }
}

const mapDispatchToProps = {
    setEdited: DMSActions.setEditedContentId,
    clearSelection: Actions.clearSelection,
    deleteBatch: Actions.deleteBatch,
    closeActionMenu: DMSActions.closeActionMenu,
    openViewer: DMSActions.openViewer,
    logout: Actions.userLogout,
    openDialog: DMSActions.openDialog,
    closeDialog: DMSActions.closeDialog,
    openPicker,
    closePicker,
    setBackLink,
    loadContent: Actions.loadContent,
    fetchContent: Actions.requestContent,
    checkoutContent: Actions.checkOut,
    checkinContent: Actions.checkIn,
    publishContent: Actions.publish,
    undoCheckout: Actions.undoCheckout,
    forceundoCheckout: Actions.forceUndoCheckout,
    setPickerParent,
    loadPickerItems,
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
        marginRight: 14,
    },
}

interface ActionMenuProps extends RouteComponentProps<any> {
    id: number,
}

interface ActionMenuState {
    hovered: string,
    selectedIndex: number,
    anchorEl: HTMLElement | null
}

class ActionMenu extends React.Component<ActionMenuProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, ActionMenuState> {
    constructor(props: ActionMenu['props']) {
        super(props)
        this.state = {
            hovered: '',
            selectedIndex: 1,
            anchorEl: null,
        }
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.handleMenuItemClick = this.handleMenuItemClick.bind(this)
    }
    public componentWillReceiveProps(nextProps: this['props']) {
        if (nextProps.open === false) {
            this.setState({
                anchorEl: null,
            })
        }
    }
    public isHovered(id: string) {
        return this.state.hovered === id
    }
    public handleMouseEnter(e: React.MouseEvent, name: string) {
        this.setState({
            hovered: name,
        })
    }
    public handleMouseLeave() {
        this.setState({
            hovered: '',
        })
    }
    public handleClose = () => {
        this.props.closeActionMenu()
        this.setState({ anchorEl: null })
    }
    public handleMenuItemClick(e: React.MouseEvent, action: IActionModel) {
        if ((action as any).Action) {
            (action as any).Action()
        } else {
            const content = this.props.currentContent
            switch (action.Name) {
                case 'Rename':
                    this.handleClose()
                    this.props.setEdited(this.props.currentContent ? this.props.currentContent.Id : 0)
                    break
                case 'ClearSelection':
                    this.handleClose()
                    this.props.clearSelection()
                    break
                case 'DeleteBatch':
                case 'Delete':
                    this.handleClose()
                    this.props.clearSelection()
                    this.props.openDialog(
                        <DeleteDialog />,
                        resources.DELETE, this.props.closeDialog)
                    break
                case 'Preview':
                    this.handleClose()
                    const newPath = compile(this.props.match.path)({ folderPath: this.props.match.params.folderPath || btoa(this.props.id as any), otherActions: ['preview', btoa(content ? content.Id.toString() : '')] })
                    this.props.history.push(newPath)
                    break
                case 'Logout':
                    this.handleClose()
                    this.props.logout()
                    break
                case 'Browse':
                    this.handleClose()
                    const path = this.props.currentContent ? this.props.currentContent.Path : ''
                    downloadFile(path, this.props.hostName)
                    break
                case 'Versions':
                    this.handleClose()
                    this.props.currentContent && this.props.openDialog(
                        <VersionsDialog currentContent={this.props.currentContent} />,
                        resources.VERSIONS, this.props.closeDialog)
                    break
                case 'ShareContent':
                    this.handleClose()
                    this.props.currentContent && this.props.openDialog(<ShareDialog currentContent={this.props.currentContent} />)
                    break
                case 'Profile':
                    this.handleClose()
                    const userPath = compile('/users/:otherActions*')({ folderPath: btoa(content ? content.Id.toString() : ''), otherActions: ['profile', btoa(content ? content.Id.toString() : '')] })
                    this.props.history.push(userPath)
                    this.props.chooseMenuItem('profile')
                    break
                case 'Edit':
                    this.handleClose()
                    content && this.props.openDialog(
                        <EditPropertiesDialog
                            content={content}
                            contentTypeName={content ? content.Type : ''} />,
                        resources.EDIT_PROPERTIES, this.props.closeDialog)
                    break
                case 'CheckOut':
                    this.handleClose()
                    this.props.checkoutContent(content ? content.Id : 0)
                    break
                case 'Publish':
                    this.handleClose()
                    this.props.publishContent(content ? content.Id : 0)
                    break
                case 'CheckIn':
                    this.handleClose()
                    this.props.checkinContent(content ? content.Id : 0)
                    break
                case 'UndoCheckOut':
                    this.handleClose()
                    this.props.undoCheckout(content ? content.Id : 0)
                    break
                case 'ForceUndoCheckOut':
                    this.handleClose()
                    this.props.forceundoCheckout(content ? content.Id : 0)
                    break
                case 'Approve':
                    this.handleClose()
                    this.props.openDialog(
                        <ApproveorRejectDialog
                            id={content ? content.Id : 0}
                            fileName={content ? content.DisplayName : ''} />,
                        resources.APPROVE_OR_REJECT, this.props.closeDialog)
                    break
                case 'MoveTo':
                    this.handleClose()
                    this.props.select(content ? [content] : [])
                    this.props.setPickerParent(this.props.currentParent ? this.props.currentParent : null)
                    this.props.loadPickerItems(this.props.currentParent ? this.props.currentParent.Path : '')
                    this.props.openPicker(
                        <PathPicker
                            mode="MoveTo"
                            dialogComponent={<MoveToConfirmDialog />}
                            dialogTitle={resources.MOVE}
                            dialogCallback={Actions.moveBatch as any} />,
                        'move',
                        () => { this.props.closePicker() && this.props.setBackLink(true) })
                    break
                case 'CopyTo':
                    this.handleClose()
                    this.props.select(content ? [content] : [])
                    this.props.setPickerParent(this.props.currentParent ? this.props.currentParent : null)
                    this.props.loadPickerItems(this.props.currentParent ? this.props.currentParent.Path : '')
                    this.props.openPicker(
                        <PathPicker
                            mode="CopyTo"
                            dialogComponent={<CopyToConfirmDialog />}
                            dialogTitle={resources.COPY}
                            dialogCallback={Actions.copyBatch as any} />,
                        'copy',
                        () => this.props.closePicker() && this.props.setBackLink(true))
                    break
                case 'MoveBatch':
                    this.handleClose()
                    this.props.setPickerParent(this.props.currentParent ? this.props.currentParent : null)
                    this.props.loadPickerItems(this.props.currentParent ? this.props.currentParent.Path : '')
                    this.props.openPicker(
                        <PathPicker
                            mode="MoveTo"
                            dialogComponent={<MoveToConfirmDialog />}
                            dialogTitle={resources.MOVE}
                            dialogCallback={Actions.moveBatch as any} />,
                        'move',
                        () => this.props.closePicker() && this.props.setBackLink(true))
                    break
                default:
                    console.log(`${action.Name} is clicked`)
                    this.handleClose()
                    break
            }
        }
    }

    private async handleUpload(ev: React.ChangeEvent<HTMLInputElement>) {
        ev.persist()
        this.handleClose()
        ev.target.files && await this.props.uploadFileList({
            fileList: ev.target.files,
            createFolders: true,
            contentTypeName: 'File',
            binaryPropertyName: 'Binary',
            overwrite: false,
            parentPath: this.props.currentParent ? this.props.currentParent.Path : '',
        })
    }

    public render() {
        const { actions, open, position } = this.props
        return <MediaQuery minDeviceWidth={700}>
            {(matches) => {
                return matches ? <Menu
                    id="actionmenu"
                    open={open}
                    onClose={this.handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={position}
                    TransitionComponent={Fade}
                >
                    {
                        actions.map((action, index) => {
                            let iconFileType
                            switch (action.Icon) {
                                case 'word':
                                case 'excel':
                                case 'acrobat':
                                case 'powerpoint':
                                    iconFileType = iconType.flaticon
                                    break
                                default:
                                    iconFileType = iconType.materialui
                                    break
                            }
                            return <MenuItem
                                key={index}
                                onClick={(event) => this.handleMenuItemClick(event, action)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#016d9e'
                                    e.currentTarget.style.fontWeight = 'bold'
                                }
                                }
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#000'
                                    e.currentTarget.style.fontWeight = 'normal'
                                }}
                                style={styles.menuItem}
                                title={action.DisplayName}>
                                <ListItemIcon style={styles.actionIcon}>
                                    <Icon type={iconFileType} color="primary" iconName={
                                        action.Icon === 'Application' ?
                                            icons[action.Name.toLowerCase() as keyof typeof icons] :
                                            icons[action.Icon.toLowerCase() as keyof typeof icons]
                                    }>
                                        {
                                            action.Name === 'MoveTo' ?
                                                <Icon iconName="forward" type={iconType.materialui} style={{ position: 'absolute', left: '1.8em', top: '1.1em', color: '#fff', fontSize: 12 }} /> : null
                                        }
                                        {
                                            action.Name === 'Rename' ?
                                                <Icon iconName="mode_edit" type={iconType.materialui} style={{ position: 'absolute', left: '1.87em', top: '1.38em', color: '#fff', fontSize: 11 }} /> : null
                                        }
                                        {
                                            action.Name === 'ForceUndoCheckOut' ?
                                                <Icon iconName="warning" type={iconType.materialui} style={{ position: 'absolute', left: '1.87em', top: '1.38em', color: '#fff', fontSize: 11 }} /> : null
                                        }
                                    </Icon>
                                </ListItemIcon>
                                {action.DisplayName}
                            </MenuItem>
                        })
                    }
                </Menu > :
                    <Drawer
                        anchor="bottom"
                        open={open}
                        onClose={this.handleClose}>
                        <List>
                            {actions.map((action, index) => {

                                if (action.Name === 'uploadFile') {
                                    const uploadFileButtonId = `${UPLOAD_FILE_BUTTON_ID}-${v1()}`
                                    return <label htmlFor={uploadFileButtonId} style={{ outline: 'none' }}>
                                        <MenuItem style={styles.menuItem}>
                                            <ListItemIcon style={styles.actionIcon}>
                                                <div>
                                                    <Icon iconName="insert_drive_file" type={iconType.materialui} />
                                                    <Icon iconName="forward" type={iconType.materialui} style={{ color: '#fff', position: 'absolute', left: '1.75em', top: '1em', fontSize: 12, transform: 'rotate(-90deg)' }} />
                                                </div>
                                            </ListItemIcon>
                                            {resources.UPLOAD_BUTTON_UPLOAD_FILE_TITLE}
                                        </MenuItem>
                                        <input
                                            multiple={true}
                                            id={uploadFileButtonId}
                                            type="file"
                                            onChange={(ev) => this.handleUpload(ev)}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                }

                                if (action.Name === 'uploadFolder') {
                                    const uploadFolderButtonId = `${UPLOAD_FOLDER_BUTTON_ID}-${v1()}`
                                    return <label htmlFor={uploadFolderButtonId} style={{ outline: 'none' }}>
                                        <MenuItem style={styles.menuItem}>
                                            <ListItemIcon style={styles.actionIcon}>
                                                <div>
                                                    <Icon iconName="folder" type={iconType.materialui} />
                                                    <Icon iconName="forward" type={iconType.materialui} style={{ color: '#fff', position: 'absolute', left: '1.75em', top: '0.85em', fontSize: 12, transform: 'rotate(-90deg)' }} />
                                                </div>
                                            </ListItemIcon>
                                            {resources.UPLOAD_BUTTON_UPLOAD_FOLDER_TITLE}
                                        </MenuItem>
                                        <input
                                            multiple={true}
                                            id={uploadFolderButtonId}
                                            type="file"
                                            onChange={(ev) => this.handleUpload(ev)}
                                            style={{ display: 'none' }}
                                            {...{
                                                directory: '',
                                                webkitdirectory: '',
                                            } as any
                                            }
                                        />
                                    </label>
                                }
                                let iconFileType
                                switch (action.Icon) {
                                    case 'word':
                                    case 'excel':
                                    case 'acrobat':
                                    case 'powerpoint':
                                        iconFileType = iconType.flaticon
                                        break
                                    default:
                                        iconFileType = iconType.materialui
                                        break
                                }
                                return <MenuItem
                                    key={index}
                                    onClick={(event) => this.handleMenuItemClick(event, action)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#016d9e'
                                        e.currentTarget.style.fontWeight = 'bold'
                                    }
                                    }
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = '#000'
                                        e.currentTarget.style.fontWeight = 'normal'
                                    }}
                                    style={styles.menuItemMobile}
                                    title={action.DisplayName}>
                                    <ListItemIcon style={styles.actionIcon}>
                                        <Icon
                                            type={iconFileType} color="primary" iconName={
                                                action.Icon === 'Application' ?
                                                    icons[action.Name.toLowerCase() as keyof typeof icons] :
                                                    icons[action.Icon.toLowerCase() as keyof typeof icons]
                                            }>{
                                                action.Icon === 'Application' ?
                                                    icons[action.Name.toLowerCase() as keyof typeof icons] :
                                                    icons[action.Icon.toLowerCase() as keyof typeof icons]
                                            }
                                            {
                                                action.Name === 'MoveTo' ? <Icon iconName="forward" type={iconType.materialui} style={{ color: '#fff', position: 'absolute', left: '1.75em', top: '1.4em', fontSize: 12 }} /> : null
                                            }
                                            {
                                                action.Name === 'Rename' ? <Icon iconName="mode_edit" type={iconType.materialui} style={{ color: '#fff', position: 'absolute', left: '1.87em', top: '1.78em', fontSize: 11 }} /> : null
                                            }
                                            {
                                                action.Name === 'ForceUndoCheckOut' ? <Icon iconName="warning" type={iconType.materialui} style={{ color: '#fff', position: 'absolute', left: '1.87em', top: '1.38em', fontSize: 11 }} /> : null
                                            }
                                            {
                                                action.Name === 'uploadFile' ? <Icon iconName="forward" type={iconType.materialui} style={{ color: '#fff', position: 'absolute', left: '0.86em', top: '0.48em', fontSize: 11, transform: 'rotate(-90deg)' }} /> : null
                                            }
                                            {
                                                action.Name === 'uploadFolder' ? <Icon iconName="forward" type={iconType.materialui} style={{ color: '#fff', position: 'absolute', left: '0.87em', top: '0.42em', fontSize: 11, transform: 'rotate(-90deg)' }} /> : null
                                            }
                                        </Icon>
                                    </ListItemIcon>
                                    {action.DisplayName}
                                </MenuItem>
                            })}
                        </List>
                    </Drawer>
            }}
        </MediaQuery>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ActionMenu))
