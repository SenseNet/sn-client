import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import TableCell from '@material-ui/core/TableCell'
import { Content } from '@sensenet/client-core'
import { ActionModel, GenericContent, Group, SchemaStore } from '@sensenet/default-content-types'
import { Icon } from '@sensenet/icons-react'
import { ContentList } from '@sensenet/list-controls-react'
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
import { DisplayNameCell } from '../../ContentList/CellTemplates/DisplayNameCell'
import { DisplayNameMobileCell } from '../../ContentList/CellTemplates/DisplayNameMobileCell'
import RemoveUserFromGroupDialog from '../../Dialogs/RemoveUserFromGroupDialog'

const styles = {
  deleteButton: {
    fontFamily: 'Raleway Medium',
    fontSize: 15,
  },
}

interface MembersListProps extends RouteComponentProps<any> {
  matchesDesktop: boolean
}

const mapStateToProps = (state: rootStateType) => {
  return {
    currentGroup: state.dms.usersAndGroups.group.currentGroup || ({} as Group),
    childrenOptions: state.dms.usersAndGroups.user.grouplistOptions,
    hostName: state.sensenet.session.repository ? state.sensenet.session.repository.repositoryUrl : '',
    selected: state.dms.usersAndGroups.user.selected,
    parent: state.dms.usersAndGroups.group.parent,
    active: state.dms.usersAndGroups.user.active,
    members: state.dms.usersAndGroups.group.members,
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

class MembersList extends Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & MembersListProps,
  {}
> {
  constructor(props: MembersList['props']) {
    super(props)

    // this.handleRowDoubleClick = this.handleRowDoubleClick.bind(this)
  }

  public handleDeleteClick = (content: GenericContent) => {
    this.props.openDialog(
      <RemoveUserFromGroupDialog user={content} groups={[this.props.currentGroup]} />,
      resources.DELETE,
      this.props.closeDialog,
    )
  }
  public isGroupAdmin = (actions: ActionModel[] | undefined) => {
    const editAction = actions ? actions.find((action: ActionModel) => action.Name === 'Edit') : undefined
    return editAction ? !editAction.Forbidden : false
  }
  // public handleRowDoubleClick(_e: React.MouseEvent, content: GenericContent) {
  //     history.push(newPath)
  // }
  public render() {
    const { childrenOptions, hostName, matchesDesktop, selected, members } = this.props
    return (
      <ContentList
        displayRowCheckbox={matchesDesktop ? true : false}
        items={members}
        schema={
          customSchema.find(s => s.ContentTypeName === 'User') ||
          SchemaStore.filter(s => s.ContentTypeName === 'User')[0]
        }
        fieldsToDisplay={matchesDesktop ? (['DisplayName', 'Email', 'Actions'] as any) : ['DisplayName', 'Actions']}
        icons={icons}
        orderBy={childrenOptions.orderby ? childrenOptions.orderby[0][0] : ('Id' as any)}
        orderDirection={childrenOptions.orderby ? childrenOptions.orderby[0][1] : ('asc' as any)}
        onRequestSelectionChange={newSelection => this.props.selectUser(newSelection)}
        onRequestActiveItemChange={active => this.props.setActive(active)}
        onRequestActionsMenu={(ev, content) => {
          ev.preventDefault()
          this.props.closeActionMenu()
          if (content.Actions && (content.Actions as ActionModel[]).length > 0) {
            this.props.openActionMenu(content.Actions as ActionModel[], content, '', ev.currentTarget.parentElement, {
              top: ev.clientY,
              left: ev.clientX,
            })
          }
        }}
        onItemContextMenu={(ev, content) => {
          ev.preventDefault()
          this.props.closeActionMenu()
          if (content.Actions && (content.Actions as ActionModel[]).length > 0) {
            this.props.openActionMenu(content.Actions as ActionModel[], content, '', ev.currentTarget.parentElement, {
              top: ev.clientY,
              left: ev.clientX,
            })
          }
        }}
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
              (this.props.active &&
                (members as GenericContent[]).findIndex(s => s.Id === (this.props.active as Content).Id)) ||
              0
            const clickedIndex = (members as GenericContent[]).findIndex(s => s.Id === content.Id)
            const newSelection = Array.from(
              new Set([
                ...this.props.selected,
                ...(members as GenericContent[]).slice(
                  Math.min(activeIndex, clickedIndex),
                  Math.max(activeIndex, clickedIndex) + 1,
                ),
              ]),
            )
            this.props.selectUser(newSelection)
          } else if (
            !this.props.selected.length ||
            (this.props.selected.length === 1 && this.props.selected[0].Id !== content.Id)
          ) {
            this.props.selectUser([content])
          } else if (this.props.selected.find(s => s.Id === content.Id)) {
            this.props.selectUser(this.props.selected.filter(s => s.Id !== content.Id))
          }
        }}
        // onItemDoubleClick={this.handleRowDoubleClick}
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
                    onActivate={
                      () => {
                        // TODO
                      } // this.handleRowDoubleClick(ev, content)
                    }
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
              if (this.isGroupAdmin(this.props.currentGroup.Actions as ActionModel[])) {
                return (
                  <TableCell padding="checkbox" style={{ width: 260 }}>
                    <Button style={styles.deleteButton} onClick={() => this.handleDeleteClick(props.content)}>
                      <Icon iconName="delete" style={{ fontSize: 19, marginRight: 10 }} />
                      {resources.REMOVE_USER_FROM_GROUP}
                    </Button>
                  </TableCell>
                )
              } else {
                return <TableCell />
              }
            default:
              return null
          }
        }}
        getSelectionControl={(_selected, content) => {
          return (
            <Checkbox
              checked={selected.find((i: GenericContent) => i.Id === content.Id) ? true : false}
              disabled={
                this.isGroupAdmin(this.props.currentGroup.Actions as ActionModel[]) &&
                (content.Type === 'User' || content.Type === 'Group')
                  ? false
                  : true
              }
              style={this.isGroupAdmin(this.props.currentGroup.Actions as ActionModel[]) ? { cursor: 'normal' } : {}}
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
  )(MembersList),
)
