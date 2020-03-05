import { MuiThemeProvider } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import { ContentList } from '@sensenet/list-controls-react'
import { updateContent } from '@sensenet/redux'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { closeActionMenu, openActionMenu } from '../Actions'
import { contentListTheme } from '../assets/contentlist'
import { icons } from '../assets/icons'
import { getSharedItems, select, setActive } from '../store/shared'
import { rootStateType } from '../store/rootReducer'
import { resetSearchValues, updateChildrenOptions } from '../store/documentlibrary/actions'
import ActionMenu from './ActionMenu/ActionMenu'
import { DisplayNameCell } from './ContentList/CellTemplates/DisplayNameCell'
import { RenameCell } from './ContentList/CellTemplates/RenameCell'
import { DefaultCell } from './ContentList/CellTemplates/DefaultCell'
import { DateCell } from './ContentList/CellTemplates/DateCell'
import { ReferencedUserCell } from './ContentList/CellTemplates/ReferencedUserCell'

const mapStateToProps = (state: rootStateType) => ({
  sharedItems: state.dms.shared.sharedItems,
  selected: state.dms.shared.selected,
  active: state.dms.shared.active,
  docLib: state.dms.documentLibrary.parentIdOrPath,
  hostName: state.sensenet.session.repository ? state.sensenet.session.repository.repositoryUrl : '',
  editedItemId: state.dms.editedItemId,
  currentUser: state.sensenet.session.user.content,
})

const mapDispatchToProps = {
  getSharedItems,
  select,
  setActive,
  openActionMenu,
  closeActionMenu,
  updateContent,
  resetSearchValues,
  updateChildrenOptions,
}

class Shared extends React.Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps
> {
  private load() {
    const user = this.props.currentUser
    this.props.getSharedItems(user)
  }

  public componentDidMount() {
    this.load()
  }

  private handleOpenItem(content: GenericContent) {
    if (content.IsFolder) {
      const newPath = `${this.props.match.path.substr(0, this.props.match.path.lastIndexOf('/'))}/${btoa(
        content.Path.substr(0, content.Path.lastIndexOf('/')),
      )}`
      this.props.history.push(newPath)
    } else {
      const newPath = `${this.props.match.path.substr(0, this.props.match.path.lastIndexOf('/'))}/${btoa(
        content.Path.substr(0, content.Path.lastIndexOf('/')),
      )}/preview/${btoa(content.Id as any)}`
      this.props.history.push(newPath)
    }
  }

  public render() {
    return (
      <div style={{ padding: '2em' }}>
        <MuiThemeProvider theme={contentListTheme}>
          <Typography variant="h5">Shared</Typography>
          <ContentList
            schema={{ FieldSettings: [] } as any}
            selected={this.props.selected}
            onRequestSelectionChange={this.props.select}
            active={this.props.active}
            icons={icons}
            items={this.props.sharedItems}
            fieldsToDisplay={['DisplayName', 'ModifiedBy', 'ModificationDate']}
            onRequestActiveItemChange={this.props.setActive}
            displayRowCheckbox={false}
            onRequestActionsMenu={(ev, content) => {
              ev.preventDefault()
              this.props.closeActionMenu()
              this.props.openActionMenu(
                [
                  {
                    Name: 'ExecuteQuery',
                    DisplayName: 'Execute Query',
                    Icon: 'queryExecute',
                    ClientAction: true,
                    Forbidden: false,
                    IncludeBackUrl: 0,
                    Index: 3,
                    Url: '',
                    IsODataAction: false,
                  },
                  ...(content.Actions as ActionModel[]).filter(a => a.Name === 'Rename' || a.Name === 'Delete'),
                ],
                content,
                '',
                ev.currentTarget.parentElement,
                {
                  top: ev.clientY,
                  left: ev.clientX,
                },
              )
            }}
            checkboxProps={{
              color: 'primary',
            }}
            onItemContextMenu={(ev, content) => {
              ev.preventDefault()
              this.props.closeActionMenu()
              this.props.openActionMenu(
                [
                  {
                    Name: 'ExecuteQuery',
                    DisplayName: 'Execute Query',
                    Icon: 'queryExecute',
                    ClientAction: true,
                    Forbidden: false,
                    IncludeBackUrl: 1,
                    Index: 1,
                    Url: '',
                    IsODataAction: false,
                  },
                  ...(content.Actions as ActionModel[]).filter(a => a.Name === 'Rename' || a.Name === 'Delete'),
                ],
                content,
                '',
                ev.currentTarget.parentElement,
                {
                  top: ev.clientY,
                  left: ev.clientX,
                },
              )
            }}
            onItemDoubleClick={(_ev, content) => {
              this.handleOpenItem(content)
            }}
            fieldComponent={props => {
              switch (props.field) {
                case 'DisplayName':
                  if (this.props.editedItemId === props.content.Id) {
                    return (
                      <RenameCell
                        icon={props.content.Icon || ''}
                        icons={icons}
                        displayName={props.content.DisplayName || props.content.Name}
                        onFinish={newName => {
                          this.props.updateContent<GenericContent>(props.content, { DisplayName: newName })
                        }}
                      />
                    )
                  }
                  return (
                    <DisplayNameCell
                      content={props.content}
                      isSelected={props.isSelected}
                      icons={icons}
                      hostName={this.props.hostName}
                    />
                  )
                case 'ModifiedBy':
                  return <ReferencedUserCell content={props.content} fieldName={props.field} />
                case 'ModificationDate':
                case 'CreationDate':
                  return <DateCell content={props.content} fieldName={props.field} />
                default:
                  return <DefaultCell content={props.content} fieldName={props.field} />
              }
            }}
          />
        </MuiThemeProvider>
        <ActionMenu id={0} />
      </div>
    )
  }
}

const connectedComponent = withRouter(connect(mapStateToProps, mapDispatchToProps)(Shared))
export { connectedComponent as Shared }
