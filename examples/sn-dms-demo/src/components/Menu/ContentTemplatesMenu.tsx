import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import withStyles from '@material-ui/core/styles/withStyles'

import { Icon, iconType } from '@sensenet/icons-react'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import * as DMSActions from '../../Actions'
import { resources } from '../../assets/resources'
import { rootStateType } from '../../store/rootReducer'

export const subMenu = [
  {
    title: resources.BUILTIN_TYPES,
    name: 'builtintypes',
    icon: 'home',
  },
  {
    title: resources.CUSTOM_TYPES,
    name: 'customtypes',
    icon: 'subject',
  },
  {
    title: resources.MY_CUSTOM_TYPES,
    name: 'mycustomtypes',
    icon: 'person',
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

interface ContentTemplatesMenuProps extends RouteComponentProps<any> {
  active: boolean
  classes: any
  item: any
  chooseMenuItem: (title: string) => void
  chooseSubmenuItem: (title: string) => void
}

const mapStateToProps = (state: rootStateType) => {
  return {
    subactive: state.dms.menu.activeSubmenu,
  }
}

const mapDispatchToProps = {
  handleDrawerMenu: DMSActions.handleDrawerMenu,
}

class ContentTemplatesMenu extends React.Component<
  ContentTemplatesMenuProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  {}
> {
  public handleMenuItemClick = (title: string) => {
    this.props.history.push('/contenttemplates')
    this.props.chooseMenuItem(title)
    this.props.handleDrawerMenu(false)
  }
  public handleSubmenuItemClick = (title: string) => {
    this.props.history.push(`/contenttemplates/${title}`)
    this.props.chooseSubmenuItem(title)
  }
  public render() {
    const { active, classes, item } = this.props
    return (
      <ListItem
        button={true}
        selected={active}
        classes={{ root: classes.root, selected: classes.selected }}
        onClick={() => this.handleMenuItemClick('contenttemplates')}>
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
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ContentTemplatesMenu)))
