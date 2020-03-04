import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import withStyles from '@material-ui/core/styles/withStyles'
import { Workspace } from '@sensenet/default-content-types'
import { Actions } from '@sensenet/redux'
import { compile } from 'path-to-regexp'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { rootStateType } from '../../store/rootReducer'

const styles = {
  listItem: {
    listStyleType: 'none',
    borderTop: 'solid 1px #2080aa',
    padding: '12px',
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
}

interface WorkspaceListItemProps extends RouteComponentProps<any> {
  workspace: Workspace
  userName: string
  closeDropDown: (open: boolean) => void
}

const mapStateToProps = (state: rootStateType) => {
  return {
    userName: state.sensenet.session.user.userName,
    options: state.sensenet.currentitems.options,
  }
}

const mapDispatchToProps = {
  loadContent: Actions.loadContent,
  fetchContent: Actions.requestContent,
}

class WorkspaceListItem extends React.Component<
  { classes: any } & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & WorkspaceListItemProps
> {
  constructor(props: WorkspaceListItem['props']) {
    super(props)

    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }
  public handleClick = (path: string) => {
    const doclibPath = `${path}/Document_Library`
    const newPath = compile(this.props.match.path)({ folderPath: btoa(doclibPath) })
    this.props.history.push(newPath)
    this.props.closeDropDown(true)
  }
  public handleMouseOver = (e: any) => (e.currentTarget.style.backgroundColor = '#01A1EA')
  public handleMouseLeave = (e: any) => (e.currentTarget.style.backgroundColor = 'transparent')
  public render() {
    const { classes, workspace } = this.props
    return (
      <MenuItem
        onMouseOver={e => this.handleMouseOver(e)}
        onMouseLeave={e => this.handleMouseLeave(e)}
        style={styles.listItem}>
        <ListItemText
          classes={{ primary: classes.primary, root: classes.listItemRoot }}
          primary={workspace.DisplayName}
          onClick={() => this.handleClick(workspace.Path)}
        />
      </MenuItem>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(WorkspaceListItem)))
