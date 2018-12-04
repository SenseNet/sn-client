import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import withStyles, { StyleRulesCallback } from '@material-ui/core/styles/withStyles'
import { IContent, IUploadProgressInfo } from '@sensenet/client-core'
import { Icon, iconType } from '@sensenet/icons-react'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { removeUploadItem, uploadFileList } from '../../Actions'
import { updateChildrenOptions } from '../../store/documentlibrary/actions'
import { rootStateType } from '../../store/rootReducer'
import AddNewMenu from '../ActionMenu/AddNewMenu'
import { UploadButton } from '../Upload/UploadButton'

const styles: StyleRulesCallback = () => ({
    primary: {
        color: '#666',
        fontFamily: 'Raleway Semibold',
        fontSize: '14px',
    },
    primaryActive: {
        color: '#016d9e',
        fontFamily: 'Raleway Semibold',
        fontSize: '14px',
    },
    primarySub: {
        color: '#666',
        fontFamily: 'Raleway Semibold',
        fontSize: '13px',
    },
    primarySubActive: {
        color: '#016d9e',
        fontFamily: 'Raleway Semibold',
        fontSize: '13px',
    },
    iconWhite: {
        color: '#fff',
        background: '#666',
        borderRadius: '50%',
        fontSize: '14px',
        padding: 4,
    },
    iconWhiteActive: {
        color: '#fff',
        background: '#016d9e',
        borderRadius: '50%',
        fontSize: '14px',
        padding: 4,
    },
    root: {
        color: '#666',
        paddingLeft: 0,
        paddingRight: 0,
    },
    rootMobile: {
        color: '#666',
        paddingLeft: 20,
        paddingRight: 100,
    },
    selected: {
        backgroundColor: '#fff !important',
        color: '#016d9e',
        fontWeight: 600,
        paddingLeft: 0,
        paddingRight: 0,
    },
    selectedMobile: {
        backgroundColor: '#fff !important',
    },
    open: {
        display: 'block',
    },
    closed: {
        display: 'none',
    },
    submenu: {
        padding: 0,
    },
    submenuItem: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    submenuIcon: {
        color: '#666',
        fontSize: '21px',
        padding: 1.5,
    },
    submenuIconActive: {
        color: '#016d9e',
        fontSize: '21px',
        padding: 1.5,
    },
    submenuItemText: {
        fontSize: '13px',
        fontFamily: 'Raleway Semibold',
    },
    submenuItemMobile: {
        paddingLeft: 20,
        paddingRight: 20,
    },
})

interface DocumentMenuProps extends RouteComponentProps<any> {
    active: boolean,
    subactive: string,
    classes: any,
    item: any,
    uploadItems: IUploadProgressInfo[]
    showUploads: boolean
    hideUploadProgress: () => void,
    removeUploadItem: typeof removeUploadItem,
    chooseMenuItem: (title: string) => void,
    chooseSubmenuItem: (title: string) => void,
}

const mapStateToProps = (state: rootStateType) => {
    return {
        currentContent: state.dms.documentLibrary.parent,
        currentWorkspace: state.sensenet.currentworkspace,
        query: state.dms.documentLibrary.childrenOptions.query,
    }
}

const mapDispatchToProps = {
    uploadFileList,
    updateChildrenOptions,
}

const subMenu = [
    {
        title: 'Shared with me',
        name: 'shared',
        icon: 'group',
    },
    {
        title: 'Saved queries',
        name: 'savedqueries',
        icon: 'cached',
    },
    {
        title: 'Trash',
        icon: 'delete',
        name: 'trash',
    },
]

class DocumentsMenu extends React.Component<DocumentMenuProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, {}> {
    public handleMenuItemClick = (title: string) => {
        this.props.updateChildrenOptions({ query: '' })
        if (this.props.currentWorkspace) {
            this.props.history.push(`/documents/${btoa(this.props.currentWorkspace.Path + '/Document_Library')}`)
        } else {
            this.props.history.push('/documents/')
        }
        this.props.chooseMenuItem(title)
    }
    public handleSubmenuItemClick = (title: string) => {
        this.props.history.push(`/documents/${title}`)
        this.props.chooseSubmenuItem(title)
    }
    public render() {
        const { active, classes, subactive, item } = this.props
        return <MediaQuery minDeviceWidth={700}>
            {(matches) => {
                return <div>
                    <MenuItem
                        selected={active}
                        classes={matches ? { root: classes.root, selected: classes.selected } : { root: classes.rootMobile, selected: classes.selectedMobile }}
                        onClick={(e) => this.handleMenuItemClick('documents')}>
                        <Icon
                            className={active ? classes.iconWhiteActive : classes.iconWhite}
                            color="primary"
                            type={iconType.materialui}
                            iconName={item.icon} />
                        <ListItemText classes={{ primary: active ? classes.primaryActive : classes.primary }} inset primary={item.title} />
                    </MenuItem>
                    <div className={active ? classes.open : classes.closed}>
                        {matches ?
                            !this.props.query ?
                                <div><Divider />
                                    <UploadButton
                                        style={{
                                            width: '100%',
                                            margin: '10px 0 0 0',
                                            fontFamily: 'Raleway Bold',
                                            fontSize: '14px',
                                        }}
                                        multiple={true}
                                        handleUpload={(fileList) => this.props.uploadFileList({
                                            fileList,
                                            createFolders: true,
                                            contentTypeName: 'File',
                                            binaryPropertyName: 'Binary',
                                            overwrite: false,
                                            parentPath: (this.props.currentContent as IContent).Path,
                                        })}
                                    />
                                    <AddNewMenu currentContent={this.props.currentContent} />
                                </div> : null
                            : null}
                        <MenuList className={classes.submenu}>
                            {subMenu.map((menuitem, index) => {
                                return (<MenuItem className={matches ? classes.submenuItem : classes.submenuItemMobile} key={index}
                                    onClick={(e) => this.handleSubmenuItemClick(menuitem.name)}>
                                    <Icon
                                        className={subactive === menuitem.name ? classes.submenuIconActive : classes.submenuIcon}
                                        type={iconType.materialui}
                                        iconName={menuitem.icon} />
                                    <ListItemText
                                        classes={{ primary: subactive === menuitem.name ? classes.primarySubActive : classes.primarySub }}
                                        inset primary={menuitem.title} />
                                </MenuItem>)
                            })}
                        </MenuList>
                    </div>
                </div>
            }}
        </MediaQuery>
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DocumentsMenu)))
