import { RepositoryContext } from '@sensenet/hooks-react'
import React from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import * as DMSActions from '../Actions'
import EditorPage from '../components/wopi/EditorPage'
import { rootStateType } from '../store/rootReducer'

const mapStateToProps = (state: rootStateType) => {
  return {
    loggedinUser: state.sensenet.session.user,
    loginState: state.sensenet.session.loginState,
    userActions: state.dms.actionmenu.actions,
  }
}

const mapDispatchToProps = {
  loadUserActions: DMSActions.loadUserActions,
}

interface DashboardProps extends RouteComponentProps<any> {
  currentId: number
}

export interface DashboardState {
  currentSelection: number[]
  currentScope: string
  currentViewName: string
  currentUserName: string
}

class DashboardComponent extends React.Component<
  DashboardProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  DashboardState
> {
  public state = {
    currentFolderId: undefined,
    currentSelection: [],
    currentViewName: 'edit',
    currentUserName: this.props.loggedinUser.userName || 'Visitor',
    currentScope: 'documents',
  }

  public static getDerivedStateFromProps(
    newProps: DashboardComponent['props'],
    lastState: DashboardComponent['state'],
  ) {
    const currentSelection =
      (newProps.match.params.selection && decodeURIComponent(newProps.match.params.selection)) || []
    const currentViewName = newProps.match.params.action

    if (
      newProps.loggedinUser.userName !== lastState.currentUserName ||
      (newProps.loggedinUser.userName !== 'Visitor' && newProps.userActions.length === 0)
    ) {
      newProps.loadUserActions(newProps.loggedinUser.content.Path, 'UserActions')
    }

    return {
      ...lastState,
      currentSelection,
      currentViewName,
      currentScope: newProps.match.params.scope || 'documents',
      currentUserName: newProps.loggedinUser.userName,
    }
  }
  public render() {
    return (
      <div>
        <Switch>
          <Route
            exact={true}
            path="/wopi/:documentId?"
            component={() => (
              <RepositoryContext.Consumer>
                {(repository) => <EditorPage repository={repository} />}
              </RepositoryContext.Consumer>
            )}
          />
        </Switch>
      </div>
    )
  }
}
const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DashboardComponent)

export default connectedComponent
