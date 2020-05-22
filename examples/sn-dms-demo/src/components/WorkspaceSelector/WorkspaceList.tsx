import { Workspace } from '@sensenet/default-content-types'
import React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import withStyles from '@material-ui/core/styles/withStyles'
import MenuList from '@material-ui/core/MenuList'
import { rootStateType } from '../../store/rootReducer'
import { getWorkspaces, searchWorkspaces } from '../../store/workspaces/actions'
import WorkspaceListItem from './WorkspaceListItem'
import WorkspaceSearch from './WorkspaceSearch'

const styles = () => ({
  workspaceList: {
    padding: 0,
    margin: 0,
    overflowY: 'auto',
  },
  toolbar: {
    padding: 10,
    flexGrow: 1,
    minHeight: 'auto',
  },
  button: {
    fontSize: 15,
    margin: 0,
    padding: 0,
    minWidth: 'auto',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#016d9e',
    },
  },
})

const mapStateToProps = (state: rootStateType) => {
  return {
    workspaces: state.dms.workspaces.all,
    user: state.sensenet.session.user,
    term: state.dms.workspaces.searchTerm,
  }
}

const mapDispatchToProps = {
  getWorkspaces,
  searchWorkspaces,
}

interface WorkspaceListState {
  workspaces: Workspace[]
  top: number
  term: string
}

interface WorkspaceListProps {
  closeDropDown: (open: boolean) => void
  matches: boolean
}

class WorkspaceList extends React.Component<
  { classes: any } & WorkspaceListProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  WorkspaceListState
> {
  public state = {
    workspaces: this.props.workspaces || [],
    top: 0,
    term: '',
  }
  constructor(props: WorkspaceList['props']) {
    super(props)
    this.handleCloseClick = this.handleCloseClick.bind(this)
  }
  public static getDerivedStateFromProps(newProps: WorkspaceList['props'], lastState: WorkspaceList['state']) {
    if (newProps.workspaces.length !== lastState.workspaces.length || lastState.workspaces.length === 0) {
      newProps.getWorkspaces()
    }
    return {
      ...lastState,
      workspaces: newProps.workspaces,
      term: newProps.term,
    }
  }
  public handleSearch = (text: string) => {
    this.props.searchWorkspaces(text)
  }
  public handleCloseClick = () => {
    this.props.closeDropDown(true)
  }
  public render() {
    const { classes, matches } = this.props
    return (
      <div>
        <WorkspaceSearch
          matches={matches}
          handleKeyup={this.handleSearch as any}
          closeDropDown={this.props.closeDropDown}
        />
        <Scrollbars
          style={{ height: matches ? window.innerHeight - 220 : window.innerHeight - 88, width: 'calc(100% - 1px)' }}
          renderThumbVertical={({ style }) => (
            <div style={{ ...style, borderRadius: 2, backgroundColor: '#fff', width: 10, marginLeft: -2 }} />
          )}
          thumbMinSize={180}>
          <MenuList className={classes.workspaceList}>
            {this.props.workspaces.map((workspace: Workspace) => (
              <WorkspaceListItem closeDropDown={this.props.closeDropDown} key={workspace.Id} workspace={workspace} />
            ))}
          </MenuList>
        </Scrollbars>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles as any)(WorkspaceList))
