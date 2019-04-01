import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import TableCell from '@material-ui/core/TableCell'
import { Content } from '@sensenet/client-core'
import { ActionModel, GenericContent, SchemaStore } from '@sensenet/default-content-types'
import { Icon } from '@sensenet/icons-react'
import { ContentList } from '@sensenet/list-controls-react'
import { compile } from 'path-to-regexp'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import * as DMSActions from '../../../Actions'
import { closeActionMenu, openActionMenu } from '../../../Actions'
import { icons } from '../../../assets/icons'
import { resources } from '../../../assets/resources'
import { customSchema } from '../../../assets/schema'
import { rootStateType } from '../../../store/rootReducer'
import { selectUser, setActive, updateChildrenOptions } from '../../../store/usersandgroups/actions'
import { DescriptionCell } from '../../ContentList/CellTemplates/DescriptionCell'
import { DisplayNameCell } from '../../ContentList/CellTemplates/DisplayNameCell'
import { DisplayNameMobileCell } from '../../ContentList/CellTemplates/DisplayNameMobileCell'
import DeleteDialog from '../../Dialogs/DeleteDialog'

const styles = {
  deleteButton: {
    fontFamily: 'Raleway Medium',
    fontSize: 15,
  },
}

const rootItems = [
  {
    Name: 'IMS',
    DisplayName: 'Users and Groups',
    Path: '/Root/IMS',
    Icon: 'folder',
    Id: 3,
    IsFolder: true,
  } as GenericContent,
  {
    Name: 'Workspaces',
    DisplayName: 'Workspaces',
    Path: '/Root/Sites/Default_Site/workspaces',
    Icon: 'folder',
    Id: 3778,
    IsFolder: true,
  } as GenericContent,
]

interface UserListProps extends RouteComponentProps<any> {
  matchesDesktop: boolean
}

const mapStateToProps = (state: rootStateType) => {
  return {
    user: state.dms.usersAndGroups.user.currentUser,
    items: state.dms.usersAndGroups.user.items,
    childrenOptions: state.dms.usersAndGroups.user.grouplistOptions,
    hostName: state.sensenet.session.repository ? state.sensenet.session.repository.repositoryUrl : '',
    selected: state.dms.usersAndGroups.user.selected,
    parent: state.dms.usersAndGroups.user.parent,
    active: state.dms.usersAndGroups.user.active,
  }
}

const mapDispatchToProps = {
  openActionMenu,
  closeActionMenu,
  selectUser,
  updateChildrenOptions,
  openDialog: DMSActions.openDialog,
  closeDialog: DMSActions.closeDialog,
  setActive,
}

class UserList extends Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & UserListProps, {}> {
  constructor(props: UserList['props']) {
    super(props)

    this.handleRowDoubleClick = this.handleRowDoubleClick.bind(this)
  }

  public handleDeleteClick = (content: GenericContent) => {
    this.props.openDialog(<DeleteDialog content={[content]} />, resources.DELETE, this.props.closeDialog)
  }
  public isGroupAdmin = (actions: ActionModel[] | undefined) => {
    const editAction = actions ? actions.find((action: ActionModel) => action.Name === 'Edit') : undefined
    return editAction ? !editAction.Forbidden : false
  }
  public handleRowDoubleClick(_e: React.MouseEvent, content: GenericContent) {
    const { match, history } = this.props
    if (content.IsFolder) {
      const newPath = compile(match.path)({ folderPath: btoa(content.Path) })
      history.push(newPath)
    } else {
      // const newPath = `/group/${btoa(content.Id as any)}`
      const newPath = compile(this.props.match.path)({
        folderPath: this.props.match.params.folderPath || btoa((this.props.user as any).Id),
        otherActions: ['group', btoa(content.Id as any)],
      })
      history.push(newPath)
    }
  }
  public render() {
    const { childrenOptions, hostName, items, matchesDesktop, selected, parent } = this.props
    return (
      <ContentList
        displayRowCheckbox={matchesDesktop ? true : false}
        items={parent && parent.Path !== '/Root' ? items : rootItems}
        schema={
          items.length > 0 && items[0].Type === 'User'
            ? customSchema.find(s => s.ContentTypeName === 'User') ||
              SchemaStore.filter(s => s.ContentTypeName === 'User')[0]
            : customSchema.find(s => s.ContentTypeName === 'GenericContent') ||
              SchemaStore.filter(s => s.ContentTypeName === 'GenericContent')[0]
        }
        fieldsToDisplay={
          matchesDesktop
            ? items.length > 0 && items[0].Type === 'User'
              ? (['FullName', 'Email'] as any)
              : ['DisplayName']
            : ['FullName']
        }
        icons={icons}
        orderBy={childrenOptions.orderby ? childrenOptions.orderby[0][0] : ('Id' as any)}
        orderDirection={childrenOptions.orderby ? childrenOptions.orderby[0][1] : ('asc' as any)}
        onRequestSelectionChange={newSelection => this.props.selectUser(newSelection)}
        onRequestActiveItemChange={active => this.props.setActive(active)}
        onRequestOrderChange={(field, direction) => {
          if (field !== 'Workspace' && field !== 'Actions') {
            this.props.updateChildrenOptions({
              ...childrenOptions,
              orderby: [[field, direction]],
            })
          }
        }}
        selected={selected}
        onItemClick={(ev, content) => {
          if (ev.ctrlKey) {
            if (this.props.selected.find(s => s.Id === content.Id)) {
              this.props.selectUser(this.props.selected.filter(s => s.Id !== content.Id))
            } else {
              this.props.selectUser([...this.props.selected, content])
            }
          } else if (ev.shiftKey) {
            const activeIndex =
              (this.props.active && this.props.items.findIndex(s => s.Id === (this.props.active as Content).Id)) || 0
            const clickedIndex = this.props.items.findIndex(s => s.Id === content.Id)
            const newSelection = Array.from(
              new Set([
                ...this.props.selected,
                ...this.props.items.slice(Math.min(activeIndex, clickedIndex), Math.max(activeIndex, clickedIndex) + 1),
              ]),
            )
            this.props.selectUser(newSelection)
          } else if (
            !this.props.selected.length ||
            (this.props.selected.length === 1 && this.props.selected[0].Id !== content.Id)
          ) {
            this.props.selectUser([content])
          }
        }}
        onItemDoubleClick={this.handleRowDoubleClick}
        fieldComponent={props => {
          switch (props.field) {
            case 'DisplayName':
              if (!matchesDesktop) {
                return (
                  <DisplayNameMobileCell
                    content={props.content}
                    isSelected={props.isSelected}
                    hasSelected={props.selected ? props.selected.length > 0 : false}
                    icons={icons}
                    onActivate={(ev, content) => this.handleRowDoubleClick(ev, content)}
                  />
                )
              } else {
                return (
                  <DisplayNameCell
                    content={props.content}
                    isSelected={props.isSelected}
                    icons={icons}
                    hostName={hostName}
                  />
                )
              }
            case 'FullName' as any:
              if (!matchesDesktop) {
                return (
                  <DisplayNameMobileCell
                    content={props.content}
                    isSelected={props.isSelected}
                    hasSelected={props.selected ? props.selected.length > 0 : false}
                    icons={icons}
                    onActivate={(ev, content) => this.handleRowDoubleClick(ev, content)}
                  />
                )
              } else {
                return (
                  <DisplayNameCell
                    content={props.content}
                    isSelected={props.isSelected}
                    icons={icons}
                    hostName={hostName}
                  />
                )
              }
            case 'Actions':
              // tslint:disable-next-line:no-string-literal
              if (this.isGroupAdmin(props.content.Actions as ActionModel[]) && props.content.Type === 'Group') {
                return (
                  <TableCell padding="checkbox" style={{ width: 160 }}>
                    <Button style={styles.deleteButton} onClick={() => this.handleDeleteClick(props.content)}>
                      <Icon iconName="delete" style={{ fontSize: 19, marginRight: 10 }} />
                      {resources.DELETE_USER}
                    </Button>
                  </TableCell>
                )
              } else {
                return <TableCell />
              }
            case 'Path':
              if (props.content.IsFolder) {
                return <TableCell padding="checkbox">{props.content.Path}</TableCell>
              } else {
                return props.content.Path.indexOf('IMS') > -1 ? (
                  <TableCell padding="checkbox">{resources.GLOBAL}</TableCell>
                ) : (
                  <TableCell padding="checkbox">{resources.LOCAL}</TableCell>
                )
              }
            case 'Description':
              return <DescriptionCell content={props.content} />
            default:
              return null
          }
        }}
        getSelectionControl={(_selected, content) => {
          return (
            <Checkbox
              checked={selected.find((i: GenericContent) => i.Id === content.Id) ? true : false}
              disabled={this.isGroupAdmin(content.Actions as ActionModel[]) && content.Type === 'Group' ? false : true}
              style={this.isGroupAdmin(content.Actions as ActionModel[]) ? { cursor: 'normal' } : {}}
            />
          )
        }}
      />
    )
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(UserList),
)
