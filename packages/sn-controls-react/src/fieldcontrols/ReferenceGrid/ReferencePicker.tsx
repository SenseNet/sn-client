import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { ODataCollectionResponse, ODataParams, Repository } from '@sensenet/client-core'
import { Folder, GenericContent } from '@sensenet/default-content-types'
import { Icon } from '@sensenet/icons-react'
import { ListPickerComponent } from '@sensenet/pickers-react'
import React, { Component } from 'react'

interface ReferencePickerProps {
  change?: () => void
  select: (content: GenericContent) => void
  repository: Repository
  path: string
  allowedTypes?: string[]
  selected: any[]
}
interface ReferencePickerState {
  items: GenericContent[]
}

export class ReferencePicker extends Component<ReferencePickerProps, ReferencePickerState> {
  constructor(props: ReferencePickerProps) {
    super(props)
    this.state = {
      items: [],
    }
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
  public loadItems = async (path: string) => {
    let result: ODataCollectionResponse<Folder>
    const filter = this.props.allowedTypes
      ? this.createTypeFilterString(this.props.allowedTypes)
      : "(isOf('Folder') and not isOf('SystemFolder'))"
    const pickerItemOptions: ODataParams<Folder> = {
      select: ['DisplayName', 'Path', 'Id', 'Children/IsFolder', 'IsFolder'] as any,
      expand: ['Children'] as any,
      filter,
      metadata: 'no',
      orderby: 'DisplayName',
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
  public iconName = (isFolder: boolean | undefined) => {
    switch (isFolder) {
      case true:
        return 'folder'
        break
      case false:
        return 'insert_drive_file'
        break
      default:
        return 'arrow_upward'
        break
    }
  }
  public renderItem = (node: GenericContent) => (
    <ListItem button={true} selected={this.props.selected.findIndex(content => node.Id === content.Id) > -1}>
      <ListItemIcon>
        <Icon iconName={this.iconName(node.IsFolder)} />
      </ListItemIcon>
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
