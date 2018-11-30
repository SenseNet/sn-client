import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import Paper from '@material-ui/core/Paper'
import TableCell from '@material-ui/core/TableCell'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'

import { GenericContent, SchemaStore } from '@sensenet/default-content-types'
import * as React from 'react'

import { ContentList, ContentListProps } from '../ContentList'

export interface ContentListDemoState extends ContentListProps<GenericContent> {
  isEditing: boolean
}

export class ContentListDemo extends React.Component<{}, ContentListDemoState> {
  public state: ContentListDemoState = {
    items: [
      { Id: 1, Path: '/Root/Examples/Foo', Type: 'Folder', Name: 'Foo', DisplayName: 'FoOoOo', Icon: 'file' },
      { Id: 2, Path: '/Root/Examples/Bar', Type: 'Folder', Name: 'Bar', DisplayName: 'Bár', Icon: 'Settings' },
      { Id: 3, Path: '/Root/Examples/Baz', Type: 'Folder', Name: 'Baz', DisplayName: 'Z Baz', Icon: 'File' },
    ],
    schema: SchemaStore.filter(s => s.ContentTypeName === 'GenericContent')[0],
    selected: [],
    icons: { file: 'insert_drive_file', settings: 'settings' },
    fieldsToDisplay: ['DisplayName', 'Name', 'Type', 'Id'],
    orderBy: 'Id',
    orderDirection: 'asc',
    isEditing: false,
    fieldComponent: props => {
      switch (props.field) {
        case 'DisplayName':
          if (this.state.isEditing) {
            return (
              <TableCell>
                <TextField
                  defaultValue={props.content[props.field]}
                  onChange={ev => (props.content[props.field] = ev.currentTarget.value)}
                />
              </TableCell>
            )
          }
          break
        case 'Name':
          return (
            <TableCell>
              <Tooltip title={props.content.Path}>
                <span>{props.content[props.field]} </span>
              </Tooltip>
            </TableCell>
          )
      }
      return null
    },
  }

  private handleOrderChange(field: keyof GenericContent, direction: 'asc' | 'desc') {
    const orderedItems = (this.state.items as GenericContent[]).sort((a, b) => {
      const textA = (a[field] || '').toString().toUpperCase()
      const textB = (b[field] || '').toString().toUpperCase()
      return direction === 'asc'
        ? textA < textB
          ? -1
          : textA > textB
          ? 1
          : 0
        : textA > textB
        ? -1
        : textA < textB
        ? 1
        : 0
    })
    this.setState({
      ...this.state,
      orderBy: field,
      items: orderedItems,
      orderDirection: direction,
    })
  }

  private handleSelectionChange(newSelection: GenericContent[]) {
    this.setState({
      ...this.state,
      selected: newSelection,
    })
  }

  private handleActiveItemChange(item: GenericContent) {
    this.setState({
      ...this.state,
      active: item,
    })
  }

  constructor(props: any) {
    super(props)
    this.handleOrderChange = this.handleOrderChange.bind(this)
    this.handleSelectionChange = this.handleSelectionChange.bind(this)
    this.handleEditToggle = this.handleEditToggle.bind(this)
    this.handleActiveItemChange = this.handleActiveItemChange.bind(this)
  }

  private handleEditToggle() {
    this.setState({
      ...this.state,
      isEditing: !this.state.isEditing,
    })
  }

  public render() {
    return (
      <Paper style={{ marginTop: '1em' }}>
        <ContentList<GenericContent>
          {...this.state}
          onRequestOrderChange={this.handleOrderChange}
          onRequestSelectionChange={this.handleSelectionChange}
          onRequestActiveItemChange={this.handleActiveItemChange}
        />
        <FormGroup row={true} style={{ marginLeft: '2em', display: 'flex', flexDirection: 'row-reverse' }}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={this.handleEditToggle}
                checked={this.state.isEditing}
                title={'Toggle display name editing'}
              />
            }
            label="Toggle edit display name"
          />
        </FormGroup>
      </Paper>
    )
  }
}
