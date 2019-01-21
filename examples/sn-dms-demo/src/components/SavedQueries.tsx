import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Typography from '@material-ui/core/Typography'
import { ActionModel, Query } from '@sensenet/default-content-types'
import { ContentList } from '@sensenet/list-controls-react'
import { updateContent } from '@sensenet/redux/dist/Actions'
import * as React from 'react'
import { connect } from 'react-redux'
import { closeActionMenu, openActionMenu } from '../Actions'
import { contentListTheme } from '../assets/contentlist'
import { icons } from '../assets/icons'
import { getQueries, select, setActive } from '../store/queries'
import { rootStateType } from '../store/rootReducer'
import ActionMenu from './ActionMenu/ActionMenu'
import { DisplayNameCell } from './ContentList/CellTemplates/DisplayNameCell'
import { RenameCell } from './ContentList/CellTemplates/RenameCell'

const mapStateToProps = (state: rootStateType) => ({
  queries: state.dms.queries.queries,
  selected: state.dms.queries.selected,
  active: state.dms.queries.active,
  docLib: state.dms.documentLibrary.parentIdOrPath,
  hostName: state.sensenet.session.repository ? state.sensenet.session.repository.repositoryUrl : '',
  editedItemId: state.dms.editedItemId,
  profilePath: state.sensenet.session.user.content.ProfilePath,
})

const mapDispatchToProps = {
  getQueries,
  select,
  setActive,
  openActionMenu,
  closeActionMenu,
  updateContent,
}

class SavedQueries extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps> {
  private load(force = false) {
    const docLib = this.props.docLib || this.props.profilePath || '/Root'
    this.props.getQueries(docLib, 'Private', force)
  }

  public render() {
    this.load()
    return (
      <div style={{ padding: '2em' }}>
        <MuiThemeProvider theme={contentListTheme}>
          <Typography variant="h5">Saved Queries</Typography>
          <ContentList<Query>
            schema={{ FieldSettings: [] } as any}
            selected={this.props.selected}
            onRequestSelectionChange={this.props.select}
            active={this.props.active}
            icons={icons}
            items={this.props.queries.map(q => ({ ...q, Icon: 'query' }))}
            fieldsToDisplay={['DisplayName', 'Actions']}
            onRequestActiveItemChange={active => this.props.setActive(active)}
            onRequestActionsMenu={(ev, content) => {
              ev.preventDefault()
              this.props.closeActionMenu()
              this.props.openActionMenu(content.Actions as ActionModel[], content, '', ev.currentTarget.parentElement, {
                top: ev.clientY,
                left: ev.clientX,
              })
            }}
            checkboxProps={{
              color: 'primary',
            }}
            onItemContextMenu={(ev, content) => {
              ev.preventDefault()
              this.props.closeActionMenu()
              this.props.openActionMenu(content.Actions as ActionModel[], content, '', ev.currentTarget.parentElement, {
                top: ev.clientY,
                left: ev.clientX,
              })
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
                          this.props.updateContent<Query>(props.content.Id, { DisplayName: newName })
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

                default:
                  return null
              }
            }}
          />
        </MuiThemeProvider>
        <ActionMenu id={0} />
      </div>
    )
  }
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SavedQueries)
export { connectedComponent as SavedQueries }
