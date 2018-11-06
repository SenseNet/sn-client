import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import withStyles, { StyleRulesCallback } from '@material-ui/core/styles/withStyles'

import { Icon, iconType } from '@sensenet/icons-react'
import { Actions } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { rootStateType } from '..'
import * as DMSActions from '../Actions'
import { icons } from '../assets/icons'
import { resources } from '../assets/resources'
import ContentTemplatesMenu from './Menu/ContentTemplatesMenu'
import ContentTypesMenu from './Menu/ContentTypesMenu'
import DocumentsMenu from './Menu/DocumentsMenu'
import GroupsMenu from './Menu/GroupsMenu'
import SettingsMenu from './Menu/SettingsMenu'
import UsersMenu from './Menu/UsersMenu'

const menu: Array<{ title: string, name: string, icon: string, component: any, routeName: string, mobile: boolean }> = [
    {
        title: resources.DOCUMENTS,
        name: 'documents',
        icon: 'folder',
        component: DocumentsMenu,
        routeName: '/documents',
        mobile: true,
    },
    {
        title: resources.USERS,
        name: 'users',
        icon: 'person',
        component: UsersMenu,
        routeName: '/users',
        mobile: true,
    },
    {
        title: resources.GROUPS,
        name: 'groups',
        icon: 'supervised_user_circle',
        component: GroupsMenu,
        routeName: '/groups',
        mobile: true,
    },
    {
        title: resources.CONTENT_TYPES,
        name: 'contenttypes',
        icon: 'edit',
        component: ContentTypesMenu,
        routeName: '/contenttypes',
        mobile: false,
    },
    {
        title: resources.CONTENT_TEMPLATES,
        name: 'contenttemplates',
        icon: 'view_quilt',
        component: ContentTemplatesMenu,
        routeName: '/contenttemplates',
        mobile: false,
    },
    {
        title: resources.SETTINGS,
        name: 'settings',
        icon: 'settings',
        component: SettingsMenu,
        routeName: '/settings',
        mobile: false,
    },
]

const drawerWidth = 185

const styles: StyleRulesCallback = (theme) => ({
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
        padding: '0 10px',
    },
    iconWhite: {
        color: '#fff',
        background: '#666',
        borderRadius: '50%',
        fontSize: '14px',
        padding: 4,
    },
    iconWhiteMobile: {
        color: '#fff',
        background: '#016d9e',
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
    selected: {
        backgroundColor: '#fff !important',
        color: '#016d9e',
        fontWeight: 600,
        paddingLeft: 0,
        paddingRight: 0,
    },
    rootMobile: {
        color: '#666',
        paddingLeft: 20,
        paddingRight: 20,
    },
    selectedMobile: {
        backgroundColor: '#fff !important',
        color: '#016d9e',
        fontWeight: 600,
        paddingLeft: 20,
        paddingRight: 20,
    },
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
})

interface DashboarDrawerProps {
    classes,
    chooseMenuItem,
    chooseSubmenuItem,
    activeItem,
}

const mapStateToProps = (state: rootStateType) => {
    return {
        activeItem: state.dms.menu.active,
        menuIsOpen: state.dms.menuOpen,
        userActions: state.dms.actionmenu.userActions,
    }
}

const mapDispatchToProps = {
    chooseMenuItem: DMSActions.chooseMenuItem,
    chooseSubmenuItem: DMSActions.chooseSubmenuItem,
    handleDrawerMenu: DMSActions.handleDrawerMenu,
    logout: Actions.userLogout,
}

class DashboardDrawer extends React.Component<DashboarDrawerProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, {}> {
    public handleClick = (name) => {
        this.props.chooseMenuItem(name)
    }
    public toggleDrawer = () => {
        this.props.handleDrawerMenu(false)
    }
    public handleMenuItemClick = (e, action) => {
        if ((action as any).Action) {
            (action as any).Action()
        } else {
            switch (action.Name) {
                case 'Logout':
                    this.props.logout()
                    break
                default:
                    console.log(`${action.Name} is clicked`)
                    break
            }
        }
    }
    public render() {
        const { classes, activeItem, chooseMenuItem, chooseSubmenuItem, userActions } = this.props
        return <MediaQuery minDeviceWidth={700}>
            {(matches) => {
                return <Drawer
                    variant={matches ? 'permanent' : 'temporary'}
                    open={matches ? true : this.props.menuIsOpen}
                    classes={{
                        paper: matches ? classes.drawerPaper : null,
                    }}
                    onClose={matches ? null : () => this.toggleDrawer()}
                >
                    {matches ? <div style={{ height: 48 }}></div> : null}

                    <MenuList>
                        {menu.map((item, index) => {
                            return matches ? (
                                <div key={index}>
                                    {
                                        React.createElement(
                                            item.component,
                                            {
                                                active: activeItem === item.name,
                                                item,
                                                chooseMenuItem,
                                                chooseSubmenuItem,
                                                matches,
                                            })
                                    }
                                    <Divider light />
                                </div>
                            ) :
                                item.mobile ? <div key={index}>
                                    {
                                        React.createElement(
                                            item.component,
                                            {
                                                active: activeItem === item.name,
                                                item,
                                                chooseMenuItem,
                                                chooseSubmenuItem,
                                                matches,
                                            })
                                    }
                                    <Divider light />
                                </div> : null
                        })}
                        {userActions.map((action, i) => {
                            const active = activeItem === action.Name
                            return matches ? null : <div key={i}>
                                <MenuItem
                                    selected={active}
                                    classes={matches ? { root: classes.root, selected: classes.selected } : { root: classes.rootMobile, selected: classes.selectedMobile }}
                                    onClick={(event) => this.handleMenuItemClick(event, action)}
                                >
                                    <Icon
                                        type={iconType.materialui}
                                        iconName={icons[action.Icon]}
                                        className={matches ? active ? classes.iconWhiteActive : classes.iconWhite : active ? classes.iconWhiteActive : classes.iconWhiteMobile}
                                        color="primary">
                                    </Icon>
                                    <ListItemText classes={{ primary: active ? classes.primaryActive : classes.primary }} inset primary={action.DisplayName} />
                                </MenuItem>
                                <Divider light />
                            </div>
                        })}
                    </MenuList>
                </Drawer>
            }}
        </MediaQuery>
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DashboardDrawer)))
