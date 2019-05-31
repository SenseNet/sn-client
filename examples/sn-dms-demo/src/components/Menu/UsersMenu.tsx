import { ListItemIcon } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import withStyles, { StyleRulesCallback } from '@material-ui/core/styles/withStyles'
import { Icon, iconType } from '@sensenet/icons-react'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import * as DMSActions from '../../Actions'
import { resources } from '../../assets/resources'
import { rootStateType } from '../../store/rootReducer'
import AddNewDialog from '../Dialogs/AddNewDialog'
import { AddNewButton } from './AddNewButton'

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
  open: {
    display: 'block',
  },
  closed: {
    display: 'none',
  },
})

interface UsersMenuProps extends RouteComponentProps<any> {
  active: boolean
  classes: any
  item: any
  chooseMenuItem: (title: string) => void
  chooseSubmenuItem: (title: string) => void
  matches: boolean
}

const mapStateToProps = (state: rootStateType) => {
  return {
    currentContent: state.dms.usersAndGroups.user.parent,
    allowedTypes: state.dms.usersAndGroups.allowedTypes,
  }
}

const mapDispatchToProps = {
  openDialog: DMSActions.openDialog,
  closeDialog: DMSActions.closeDialog,
  handleDrawerMenu: DMSActions.handleDrawerMenu,
}

class UsersMenu extends Component<UsersMenuProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, {}> {
  public handleMenuItemClick = (title: string) => {
    this.props.history.push('/users')
    this.props.chooseMenuItem(title)
    this.props.handleDrawerMenu(false)
  }
  public handleSubmenuItemClick = (title: string) => {
    this.props.history.push(`/users/${title}`)
    this.props.chooseSubmenuItem(title)
    this.props.handleDrawerMenu(false)
  }
  public handleButtonClick = (_e: React.MouseEvent) => {
    const { closeDialog, currentContent, openDialog } = this.props
    openDialog(
      <AddNewDialog
        parentPath={currentContent ? currentContent.Path : ''}
        contentTypeName="User"
        title={resources.USER}
      />,
      resources.ADD_NEW,
      closeDialog,
    )
  }
  public render() {
    const { active, allowedTypes, classes, item, matches } = this.props
    return (
      <div>
        <ListItem
          button={true}
          selected={active}
          classes={
            matches
              ? { root: classes.root, selected: classes.selected }
              : { root: classes.rootMobile, selected: classes.selectedMobile }
          }
          onClick={_e => this.handleMenuItemClick('users')}>
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
        <div
          className={active && allowedTypes.findIndex(ctd => ctd.Name === 'User') > -1 ? classes.open : classes.closed}>
          <Divider />
          <AddNewButton contentType="User" onClick={e => this.handleButtonClick(e)} />
        </div>
      </div>
    )
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withStyles(styles)(UsersMenu)),
)
