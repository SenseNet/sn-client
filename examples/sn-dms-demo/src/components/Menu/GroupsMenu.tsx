import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
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
  icon: {
    color: '#666',
    fontSize: 26,
    marginLeft: -2,
  },
  iconMobile: {
    color: '#016d9e',
    fontSize: 26,
    marginLeft: -2,
  },
  iconActive: {
    color: '#016d9e',
    fontSize: 26,
    marginLeft: -2,
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
  open: {
    display: 'block',
  },
  closed: {
    display: 'none',
  },
})

interface GroupsMenuProps extends RouteComponentProps<any> {
  active: boolean
  classes: any
  item: any
  chooseMenuItem: (title: string) => void
  chooseSubmenuItem: (title: string) => void
  matches: boolean
}

const mapStateToProps = (state: rootStateType) => {
  return {
    currentContent: state.dms.usersAndGroups.group.parent,
    allowedTypes: state.dms.usersAndGroups.allowedTypes,
  }
}

const mapDispatchToProps = {
  openDialog: DMSActions.openDialog,
  closeDialog: DMSActions.closeDialog,
}

class GroupsMenu extends Component<
  GroupsMenuProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  {}
> {
  public handleMenuItemClick = (title: string) => {
    this.props.history.push('/groups')
    this.props.chooseMenuItem(title)
  }
  public handleSubmenuItemClick = (title: string) => {
    this.props.history.push(`/groups/${title}`)
    this.props.chooseSubmenuItem(title)
  }
  public handleButtonClick = (_e: React.MouseEvent) => {
    const { closeDialog, currentContent, openDialog } = this.props
    openDialog(
      <AddNewDialog
        parentPath={currentContent ? currentContent.Path : ''}
        contentTypeName="Group"
        title={resources.GROUP}
      />,
      resources.ADD_NEW,
      closeDialog,
    )
  }
  public render() {
    const { active, classes, item, matches, allowedTypes } = this.props
    return (
      <div>
        <MenuItem
          selected={active}
          classes={
            matches
              ? { root: classes.root, selected: classes.selected }
              : { root: classes.rootMobile, selected: classes.selectedMobile }
          }
          onClick={_e => this.handleMenuItemClick('groups')}>
          <Icon
            className={active ? classes.iconWhiteActive : classes.iconWhite}
            color={active ? 'primary' : 'inherit'}
            type={iconType.materialui}
            iconName={item.icon}
          />
          <ListItemText
            classes={{ primary: active ? classes.primaryActive : classes.primary }}
            inset={true}
            primary={item.title}
          />
        </MenuItem>
        <div
          className={
            active && allowedTypes.findIndex(ctd => ctd.Name === 'Group') > -1 ? classes.open : classes.closed
          }>
          <Divider />
          <AddNewButton contentType="Group" onClick={e => this.handleButtonClick(e)} />
        </div>
      </div>
    )
  }
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withStyles(styles)(GroupsMenu)),
)
