import { SchemaStore } from '@sensenet/client-core'
import { GenericContent, Schema } from '@sensenet/default-content-types'
import { Query, QueryExpression, QueryOperators } from '@sensenet/query'
import { Checkbox, Input, ListItemText, MenuItem, Select, SelectProps } from '@material-ui/core'
import React, { ChangeEvent, Component } from 'react'

/**
 * Props for the Type Field component
 */
export interface TypeFieldProps extends SelectProps {
  types: string[]
  selectedTypes?: string[]
  schemaStore: SchemaStore
  onQueryChange: (query: Query<GenericContent>) => void
  getMenuItem?: (schema: Schema, isSelected: boolean) => JSX.Element
}

/**
 * State for the Type Field component
 */
export interface TypeFieldState {
  selected: string[]
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
    getMenuItem: (schema, isSelected) => (
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
      schemas: newProps.types.map((contentType) => newProps.schemaStore.getSchemaByName(contentType)),
    }
  }

  private handleChange(ev: ChangeEvent<HTMLSelectElement>) {
    const values = (ev.target.value as any) as string[]
    const selected = this.props.types.filter((typeName) => values.indexOf(typeName) > -1)
    const query = new Query((q) => {
      selected.forEach((contentType, currentIndex) => {
        const { queryRef } = q
        new QueryExpression(queryRef).typeIs(contentType)
        if (currentIndex < selected.length - 1) {
          return new QueryOperators(queryRef).or
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
    const selectedNames = this.state.selected.map((s) => this.props.schemaStore.getSchemaByName(s).ContentTypeName)
    const { getMenuItem, onQueryChange, types, schemaStore, ...selectProps } = { ...this.props }

    return (
      <Select
        multiple
        value={selectedNames}
        onChange={this.handleChange}
        input={<Input id="select-multiple-checkbox" />}
        renderValue={() => selectedNames.join(', ')}
        {...selectProps}>
        {this.state.schemas.map((contentSchema) =>
          this.state.getMenuItem(contentSchema, selectedNames.indexOf(contentSchema.ContentTypeName) > -1),
        )}
      </Select>
    )
  }
}
