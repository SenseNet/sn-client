import Avatar from '@material-ui/core/Avatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { ODataCollectionResponse, ODataParams, Repository } from '@sensenet/client-core'
import { Folder, GenericContent, User } from '@sensenet/default-content-types'
import { Icon } from '@sensenet/icons-react'
import { ListPickerComponent } from '@sensenet/pickers-react'
import React, { Component } from 'react'

interface AvatarPickerProps {
  change?: () => void
  select: (content: GenericContent) => void
  repository: Repository
  path: string
  allowedTypes?: string[]
  selected: GenericContent
  repositoryUrl: string
}
interface AvatarPickerState {
  items: GenericContent[]
}

export class AvatarPicker extends Component<AvatarPickerProps, AvatarPickerState> {
  constructor(props: AvatarPickerProps) {
    super(props)
    this.state = {
      items: [],
    }
  }
  public onSelectionChanged = (content: GenericContent) => {
    if (content.Type === 'Image') {
      this.props.select(content)
    }
  }
  public loadItems = async (path: string) => {
    let result: ODataCollectionResponse<Folder>
    const filter = "(isOf('Folder') and not isOf('SystemFolder')) or isOf('Image')"
    const pickerItemOptions: ODataParams<Folder> = {
      select: ['DisplayName', 'Path', 'Id', 'Children/IsFolder', 'IsFolder'] as any,
      expand: ['Children'] as any,
      filter,
      metadata: 'no',
      orderby: [['IsFolder', 'desc'], 'DisplayName'],
    }

    try {
      result = await this.props.repository.loadCollection<Folder>({
        path,
        oDataOptions: pickerItemOptions,
      })
    } catch (error) {
      throw error
    }

    this.setState({ items: result.d.results })
    return result.d.results
  }

  public loadParent = async (id?: number) => {
    const pickerParentOptions: ODataParams<GenericContent> = {
      select: ['DisplayName', 'Path', 'Id', 'ParentId', 'Workspace'],
      expand: ['Workspace'],
      metadata: 'no',
    }
    const result = await this.props.repository.load<GenericContent>({
      idOrPath: id as number,
      oDataOptions: { ...pickerParentOptions },
    })
    return result.d as GenericContent
  }
  public iconName = (node: GenericContent) => {
    switch (node.IsFolder) {
      case true:
        return 'folder'
        break
      default:
        return 'arrow_upward'
        break
    }
  }
  public renderItem = (node: GenericContent | User) => (
    <ListItem button={true} selected={node.Id === this.props.selected.Id}>
      {console.log(node)}
      {console.log(node.IsFolder)}
      {node.IsFolder || node.IsFolder === undefined ? (
        <ListItemIcon>
          <Icon iconName={this.iconName(node)} />
        </ListItemIcon>
      ) : (
        <Avatar src={`${this.props.repositoryUrl}${node.Path}`} />
      )}
      <ListItemText primary={node.DisplayName} />
    </ListItem>
  )
  public render() {
    return (
      <ListPickerComponent
        onSelectionChanged={this.onSelectionChanged}
        onNavigation={this.props.change}
        repository={this.props.repository}
        currentPath={this.props.path}
        loadItems={this.loadItems}
        loadParent={this.loadParent}
        renderItem={this.renderItem}
      />
    )
  }
}
