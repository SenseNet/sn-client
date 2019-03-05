import { ODataCollectionResponse, ODataParams, Repository } from '@sensenet/client-core'
import { Folder, GenericContent } from '@sensenet/default-content-types'
import { ListPickerComponent } from '@sensenet/pickers-react'
import React, { Component } from 'react'

interface ReferencePickerProps {
  change?: () => void
  select: (content: GenericContent) => void
  repository: Repository
  path: string
  allowedTypes?: string[]
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
    this.props.select(content)
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
      select: ['DisplayName', 'Path', 'Id', 'Children/IsFolder'] as any,
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
  public render() {
    return (
      <ListPickerComponent
        onSelectionChanged={this.onSelectionChanged}
        onNavigation={this.props.change}
        repository={this.props.repository}
        currentPath={this.props.path}
        loadItems={this.loadItems}
      />
    )
  }
}
