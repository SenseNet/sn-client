import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import withStyles from '@material-ui/core/styles/withStyles'
import { useOidcAuthentication } from '@sensenet/authentication-oidc-react'
import { ActionModel } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import { compile } from 'path-to-regexp'
import React, { createElement, MouseEvent } from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { RouteComponentProps, withRouter } from 'react-router'
import * as DMSActions from '../Actions'
import { icons } from '../assets/icons'
import { resources } from '../assets/resources'
import { rootStateType } from '../store/rootReducer'
import ContentTemplatesMenu from './Menu/ContentTemplatesMenu'
import ContentTypesMenu from './Menu/ContentTypesMenu'
import DocumentsMenu from './Menu/DocumentsMenu'
import SettingsMenu from './Menu/SettingsMenu'

const menu: Array<{
  title: string
  name: string
  icon: string
  component: any
  routeName: string
  mobile: boolean
  adminOnly: boolean
}> = [
  {
    title: resources.DOCUMENTS,
    name: 'documents',
    icon: 'folder',
    component: DocumentsMenu,
    routeName: '/documents',
    mobile: true,
    adminOnly: false,
  },
  {
    title: resources.CONTENT_TYPES,
    name: 'contenttypes',
    icon: 'edit',
    component: ContentTypesMenu,
    routeName: '/contenttypes',
    mobile: false,
    adminOnly: true,
  },
  {
    title: resources.CONTENT_TEMPLATES,
    name: 'contenttemplates',
    icon: 'view_quilt',
    component: ContentTemplatesMenu,
    routeName: '/contenttemplates',
    mobile: false,
    adminOnly: true,
  },
  {
    title: resources.SETTINGS,
    name: 'settings',
    icon: 'settings',
    component: SettingsMenu,
    routeName: '/settings',
    mobile: false,
    adminOnly: true,
  },
]

const drawerWidth = 185

const styles = () => ({
  drawerPaper: {
    position: 'relative' as const,
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
  },
  selected: {
    backgroundColor: '#fff !important',
    color: '#016d9e',
    fontWeight: 600,
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

interface DashboardDrawerProps extends RouteComponentProps<any> {
  classes: any
  chooseMenuItem: (title: string) => void
  chooseSubmenuItem: (title: string) => void
  activeItem: string
}

const mapStateToProps = (state: rootStateType) => {
  return {
    activeItem: state.dms.menu.active,
    menuIsOpen: state.dms.menuOpen,
    userActions: state.dms.actionmenu.userActions,
    currentUser: state.sensenet.session.user.userName,
    currentContent: state.sensenet.session.user.content,
  }
}

const mapDispatchToProps = {
  chooseMenuItem: DMSActions.chooseMenuItem,
  chooseSubmenuItem: DMSActions.chooseSubmenuItem,
  closeActionMenu: DMSActions.closeActionMenu,
  handleDrawerMenu: DMSActions.handleDrawerMenu,
}

const DashboardDrawer: React.FunctionComponent<
  DashboardDrawerProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> = (props) => {
  const { logout } = useOidcAuthentication()

  const handleMenuItemClick = (_e: MouseEvent, action: ActionModel) => {
    if ((action as any).Action) {
      ;(action as any).Action()
    } else {
      switch (action.Name) {
        case 'Logout':
          logout()
          break
        case 'Profile': {
          const { currentContent } = props
          const userPath = compile('/users/:folderPath?/:otherActions*')({
            folderPath: btoa(currentContent?.ParentId?.toString() || ''),
            otherActions: ['user', btoa(currentContent?.Id.toString() || '')],
          })
          props.history.push(userPath)
          props.chooseMenuItem('profile')
          props.closeActionMenu()
          props.handleDrawerMenu(false)
          break
        }
        default:
          props.handleDrawerMenu(false)
          break
      }
    }
  }

  const { classes, activeItem, chooseMenuItem, chooseSubmenuItem, userActions } = props
  return (
    <MediaQuery minDeviceWidth={700}>
      {(matches) => {
        return (
          <Drawer
            variant={matches ? 'permanent' : 'temporary'}
            open={props.menuIsOpen}
            classes={{
              paper: matches ? classes.drawerPaper : null,
            }}
            style={matches ? { paddingTop: '64px' } : {}}
            PaperProps={{
              style: {
                border: 'none',
              },
            }}>
            <List>
              {menu.map((item, index) => {
                return matches ? (
                  !item.adminOnly ? (
                    <div key={index}>
                      {createElement(item.component, {
                        active: activeItem === item.name,
                        item,
                        chooseMenuItem,
                        chooseSubmenuItem,
                        matches,
                      })}
                      <Divider light={true} />
                    </div>
                  ) : null
                ) : item.mobile ? (
                  !item.adminOnly ? (
                    <div key={index}>
                      {createElement(item.component, {
                        active: activeItem === item.name,
                        item,
                        chooseMenuItem,
                        chooseSubmenuItem,
                        matches,
                      })}
                      <Divider light={true} />
                    </div>
                  ) : null
                ) : null
              })}
              {userActions.map((action, i) => {
                const active = activeItem === action.Name
                return matches ? null : (
                  <div key={i}>
                    <ListItem
                      selected={active}
                      classes={
                        matches
                          ? { root: classes.root, selected: classes.selected }
                          : { root: classes.rootMobile, selected: classes.selectedMobile }
                      }
                      onClick={(event) => handleMenuItemClick(event, action)}>
                      <ListItemIcon>
                        <Icon
                          type={iconType.materialui}
                          iconName={icons[action.Icon]}
                          className={
                            matches
                              ? active
                                ? classes.iconWhiteActive
                                : classes.iconWhite
                              : active
                              ? classes.iconWhiteActive
                              : classes.iconWhiteMobile
                          }
                          color="primary"
                        />
                      </ListItemIcon>
                      <ListItemText
                        classes={{ primary: active ? classes.primaryActive : classes.primary }}
                        primary={action.DisplayName}
                      />
                    </ListItem>
                    <Divider light={true} />
                  </div>
                )
              })}
            </List>
          </Drawer>
        )
      }}
    </MediaQuery>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(DashboardDrawer)))
