import { Icon, iconType } from '@sensenet/icons-react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import withStyles from '@material-ui/core/styles/withStyles'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import * as DMSActions from '../../Actions'
import { resources } from '../../assets/resources'
import { rootStateType } from '../../store/rootReducer'

const subMenu = [
  {
    title: resources.COMMON,
    name: 'commonsettings',
    icon: 'settings',
  },
  {
    title: resources.AD_SYNC,
    name: 'adsync',
    icon: 'settings',
  },
  {
    title: resources.PREVIEW,
    name: 'preview',
    icon: 'settings',
  },
]

const styles = () => ({
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
    fontSize: '16px',
    padding: 3,
  },
  iconWhiteMobile: {
    color: '#fff',
    background: '#016d9e',
    borderRadius: '50%',
    fontSize: '16px',
    padding: 3,
  },
  iconWhiteActive: {
    color: '#fff',
    background: '#016d9e',
    borderRadius: '50%',
    fontSize: '16px',
    padding: 3,
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
  open: {
    display: 'block',
  },
  closed: {
    display: 'none',
  },
  submenuItem: {
    borderTop: 'solid 1px rgba(0, 0, 0, 0.08)',
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
})

interface SettingsMenuProps extends RouteComponentProps<any> {
  active: boolean
  classes: any
  item: any
  chooseMenuItem: (title: string) => void
  chooseSubmenuItem: (title: string) => void
  matches: boolean
}

const mapStateToProps = (state: rootStateType) => {
  return {
    subactive: state.dms.menu.activeSubmenu,
  }
}

const mapDispatchToProps = {
  handleDrawerMenu: DMSActions.handleDrawerMenu,
}

class SettingsMenu extends React.Component<
  SettingsMenuProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  {}
> {
  public handleMenuItemClick = (title: string) => {
    this.props.history.push('/settings')
    this.props.chooseMenuItem(title)
    this.props.handleDrawerMenu(false)
  }
  public handleSubmenuItemClick = (title: string) => {
    this.props.history.push(`/settings/${title}`)
    this.props.chooseSubmenuItem(title)
  }
  public render() {
    const { active, subactive, classes, item, matches } = this.props
    return (
      <div>
        <ListItem
          selected={active}
          button={true}
          classes={
            matches
              ? { root: classes.root, selected: classes.selected }
              : { root: classes.rootMobile, selected: classes.selectedMobile }
          }
          onClick={() => this.handleMenuItemClick('settings')}>
          <ListItemIcon>
            <Icon
              className={active ? classes.iconWhiteActive : classes.iconWhite}
              color="primary"
              type={iconType.materialui}
              iconName={item.icon}
            />
          </ListItemIcon>
          <ListItemText classes={{ primary: active ? classes.primaryActive : classes.primary }} primary={item.title} />
        </ListItem>
        <div className={active ? classes.open : classes.closed}>
          <List className={classes.submenu}>
            {subMenu.map((menuItem, index) => {
              return (
                <ListItem
                  className={classes.submenuItem}
                  key={index}
                  onClick={() => this.handleSubmenuItemClick(menuItem.name)}>
                  <ListItemIcon>
                    <Icon
                      className={subactive === menuItem.name ? classes.submenuIconActive : classes.submenuIcon}
                      type={iconType.materialui}
                      iconName={menuItem.icon}
                    />
                  </ListItemIcon>
                  <ListItemText
                    classes={{ primary: subactive === menuItem.name ? classes.primarySubActive : classes.primarySub }}
                    primary={menuItem.title}
                  />
                </ListItem>
              )
            })}
          </List>
        </div>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SettingsMenu)))
