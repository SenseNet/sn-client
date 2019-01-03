import Checkbox from '@material-ui/core/Checkbox'
import Input from '@material-ui/core/Input'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Select, { SelectProps } from '@material-ui/core/Select'
import { SchemaStore } from '@sensenet/client-core/dist/Schemas/SchemaStore'
import { GenericContent, Schema } from '@sensenet/default-content-types'
import { Query, QueryExpression, QueryOperators } from '@sensenet/query'
import React, { Component } from 'react'

/**
 * Props for the Type Field component
 */
export interface TypeFieldProps extends SelectProps {
  types: Array<new (...args: any[]) => GenericContent>
  selectedTypes?: Array<new (...args: any[]) => GenericContent>
  schemaStore: SchemaStore
  onQueryChange: (query: Query<GenericContent>) => void
  getMenuItem?: (schema: Schema, isSelected: boolean) => JSX.Element
}

/**
 * State for the Type Field component
 */
export interface TypeFieldState {
  selected: Array<new (...args: any[]) => GenericContent>
  schemas: Schema[]
  name: string
  query?: Query<any>
  getMenuItem: (schema: Schema, isSelected: boolean) => JSX.Element
}

/**
 * Component that represents a content type filter
 */
export class TypeField extends Component<TypeFieldProps, TypeFieldState> {
  /**
   * State object for the Type Field filter component
   */
  public state: TypeFieldState = {
    name: '',
    selected: this.props.selectedTypes || [],
    schemas: [],
    getMenuItem: (schema: Schema, isSelected: boolean) => (
      <MenuItem key={schema.ContentTypeName} value={schema.ContentTypeName} title={schema.Description}>
        <Checkbox checked={isSelected} />
        <ListItemText primary={schema.ContentTypeName} />
      </MenuItem>
    ),
  }

  constructor(props: TypeFieldProps) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  /**
   * Creates a derived State object form the props
   * @param newProps The new Props object
   * @param lastState The last State object
   */
  public static getDerivedStateFromProps(newProps: TypeFieldProps, lastState: TypeFieldState) {
    return {
      ...lastState,
      getMenuItem: newProps.getMenuItem || lastState.getMenuItem,
      schemas: newProps.types.map(contentType => newProps.schemaStore.getSchemaByName(contentType.name)),
    }
  }

  private handleChange(ev: React.ChangeEvent<HTMLSelectElement>) {
    const values = (ev.target.value as any) as string[]
    const selected = this.props.types.filter(typeName => values.indexOf(typeName.name) > -1)
    const query = new Query(q => {
      selected.map((contentType, currentIndex) => {
        // tslint:disable
        const queryRef = q['queryRef']
        new QueryExpression(queryRef).typeIs(contentType)
        if (currentIndex < selected.length - 1) {
          new QueryOperators(queryRef).or
        }
      })
      return q
    })
    this.props.onQueryChange(query)
    this.setState({
      name: ev.target.value,
      selected,
      query,
    })
  }

  public render() {
    const selectedNames = this.state.selected.map(s => this.props.schemaStore.getSchemaByName(s.name).ContentTypeName)
    const { getMenuItem, onQueryChange, types, schemaStore, ...selectProps } = { ...this.props }

    return (
      <Select
        multiple
        value={selectedNames}
        onChange={this.handleChange}
        input={<Input id="select-multiple-checkbox" />}
        renderValue={() => selectedNames.join(', ')}
        {...selectProps}>
        {this.state.schemas.map(contentSchema =>
          this.state.getMenuItem(contentSchema, selectedNames.indexOf(contentSchema.ContentTypeName) > -1),
        )}
      </Select>
    )
  }
}
