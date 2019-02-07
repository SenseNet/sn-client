import { Tooltip } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import withStyles from '@material-ui/core/styles/withStyles'
import { Group } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import { Actions } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { rootStateType } from '../../../store/rootReducer'
import { selectGroup } from '../../../store/usersandgroups/actions'

const styles = {
  listItem: {
    listStyleType: 'none',
    borderTop: 'solid 1px #2080aa',
    padding: '12px 12px 12px 0px',
  },
  listItemRoot: {
    padding: 0,
  },
  primary: {
    fontFamily: 'Raleway ExtraBold',
    fontSize: 15,
    lineHeight: '24px',
    color: '#fff',
    background: 'none',
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  secondary: {
    color: '#fff',
    fontFamily: 'Raleway SemiBold',
    fontStyle: 'italic',
    fontSize: 11,
  },
  icon: {
    margin: 0,
    color: '#fff',
  },
  iconButton: {
    margin: 0,
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  followedIconButton: {
    margin: 0,
    padding: 0,
    color: '#ffeb3b',
  },
}

interface GroupListItemProps extends RouteComponentProps<any> {
  selected: boolean
  group: Group | null
  userName: string
  closeDropDown: (open: boolean) => void
}

const mapStateToProps = (state: rootStateType) => {
  return {
    userName: state.sensenet.session.user.userName,
    options: state.sensenet.currentitems.options,
    groups: state.dms.usersAndGroups.group.selected,
  }
}

const mapDispatchToProps = {
  selectGroup,
  loadContent: Actions.loadContent,
  fetchContent: Actions.requestContent,
}

interface GroupListItemState {
  selected: boolean
}

class GroupListItem extends React.Component<
  { classes: any } & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & GroupListItemProps,
  GroupListItemState
> {
  public state = {
    selected: this.props.selected,
  }
  constructor(props: GroupListItem['props']) {
    super(props)
  }
  public checkboxClick = (group: Group) => {
    const index = this.props.groups.findIndex(g => g.Id === group.Id)
    index === -1
      ? this.props.selectGroup([...this.props.groups, group])
      : this.props.selectGroup([...this.props.groups.slice(0, index), ...this.props.groups.slice(index + 1)])
    this.setState({
      selected: !this.state.selected,
    })
  }
  public shortenPath = (path: string) => path.replace('/Root/IMS/', '')
  public render() {
    const { classes, group, selected } = this.props
    return (
      <MenuItem style={styles.listItem}>
        <ListItemIcon className={classes.icon}>
          <IconButton
            className={selected ? classes.followedIconButton : classes.iconButton}
            onClick={() => this.checkboxClick(group as Group)}>
            <Icon
              className={selected ? classes.followedIconButton : classes.iconButton}
              type={iconType.materialui}
              iconName={selected ? 'check_box' : 'check_box_outline_blank'}
              style={selected ? { color: '#ffeb3b', margin: '0 10px' } : { color: '#fff', margin: '0 10px' }}
            />
          </IconButton>
        </ListItemIcon>
        <Tooltip title={group ? group.DisplayName : ''} aria-label={group ? group.DisplayName : ''} placement="left">
          <ListItemText
            classes={{ primary: classes.primary, root: classes.listItemRoot, secondary: classes.secondary }}
            primary={group ? group.DisplayName : ''}
            secondary={this.shortenPath(group ? group.Path : '')}
          />
        </Tooltip>
      </MenuItem>
    )
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withStyles(styles)(GroupListItem)),
)
