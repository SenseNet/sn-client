import Avatar from '@material-ui/core/Avatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { ODataParams, Repository } from '@sensenet/client-core'
import { Folder, GenericContent, User } from '@sensenet/default-content-types'
import { ListPickerComponent } from '@sensenet/pickers-react'
import React, { Component } from 'react'
import { renderIconDefault } from '../icon'

const DEFAULT_AVATAR_PATH = '/Root/Sites/Default_Site/demoavatars/Admin.png'

interface ReferencePickerProps {
  change?: () => void
  select: (content: GenericContent) => void
  repository: Repository
  path: string
  allowedTypes?: string[]
  selected: any[]
  renderIcon?: (name: string) => JSX.Element
}
interface ReferencePickerState {
  path: string
}

export class ReferencePicker extends Component<ReferencePickerProps, ReferencePickerState> {
  public state: ReferencePickerState = {
    path: this.props.path,
  }

  public onNavigation = (path: string) => {
    this.props.change && this.props.change()
    this.setState({ path })
  }

  public onSelectionChanged = (content: GenericContent) => {
    if (this.props.allowedTypes && this.props.allowedTypes.indexOf(content.Type) > -1) {
      this.props.select(content)
    }
  }

  public createTypeFilterString = (allowedTypes: string[]) => {
    let filterString = "(isOf('Folder') and not isOf('SystemFolder'))"
    allowedTypes.map((typeName: string) => {
      if (typeName !== 'Folder') {
        filterString += ` or isOf('${typeName}')`
      }
    })
    return filterString
  }

  private pickerItemOptions: ODataParams<Folder> = {
    select: ['DisplayName', 'Path', 'Id', 'Children/IsFolder', 'IsFolder', 'Avatar', 'Icon'] as any,
    expand: ['Children'] as any,
    filter: this.props.allowedTypes
      ? this.createTypeFilterString(this.props.allowedTypes)
      : "(isOf('Folder') and not isOf('SystemFolder'))",
    metadata: 'no',
    orderby: 'DisplayName',
  }

  public iconName = (isFolder?: boolean) => {
    if (isFolder == null) {
      return 'arrow_upward'
    }
    return isFolder ? 'folder' : 'insert_drive_file'
  }

  public renderItem = (node: GenericContent) => (
    <ListItem button={true} selected={this.props.selected.findIndex(content => node.Id === content.Id) > -1}>
      <ListItemIcon style={{ margin: 0 }}>
        {node.Type === 'User' ? (
          <Avatar
            alt={node.DisplayName}
            src={
              (node as User).Avatar
                ? `${this.props.repository.configuration.repositoryUrl}${(node as User).Avatar!.Url}`
                : DEFAULT_AVATAR_PATH
            }
          />
        ) : this.props.renderIcon ? (
          this.props.renderIcon(this.iconName(node.IsFolder))
        ) : (
          renderIconDefault(this.iconName(node.IsFolder))
        )}
      </ListItemIcon>
      <ListItemText primary={node.DisplayName} />
    </ListItem>
  )

  public render() {
    return (
      <ListPickerComponent
        onSelectionChanged={this.onSelectionChanged}
        onNavigation={this.onNavigation}
        repository={this.props.repository}
        currentPath={this.state.path}
        itemsODataOptions={this.pickerItemOptions}
        renderItem={this.renderItem}
      />
    )
  }
}
