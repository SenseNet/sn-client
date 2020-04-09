import MaterialTextField, { TextFieldProps as MaterialTextFieldProps } from '@material-ui/core/TextField'
import { GenericContent } from '@sensenet/default-content-types'
import { Query } from '@sensenet/query'
import React from 'react'
import { TextFieldProps } from './TextField'

/**
 * Props object for the TextField Component
 */
export interface NestedTextFieldProps<T> extends TextFieldProps<T> {
  /**
   * Name of the field on the refernced content
   */
  nestedFieldName: string
}

/**
 * Component for searching simple text fragments in a specified field
 * @param props
 */
// tslint:disable-next-line:variable-name
export const NestedTextField = <T extends GenericContent>(props: NestedTextFieldProps<T> & MaterialTextFieldProps) => {
  const displayName = (props.fieldSetting && props.fieldSetting.DisplayName) || props.label
  const description = (props.fieldSetting && props.fieldSetting.Description) || ''
  const { fieldName, onQueryChange, fieldSetting, fieldKey, nestedFieldName, ...materialProps } = { ...props }
  return (
    <MaterialTextField
      type="text"
      onChange={(ev) => {
        const { value } = ev.currentTarget
        const query = new Query((q) => (value ? q.equalsNested(props.fieldName, props.nestedFieldName, value) : q))
        return props.onQueryChange(props.fieldKey || props.fieldName, query, value)
      }}
      label={displayName}
      placeholder={description}
      title={props.fieldSetting && props.fieldSetting.Description}
      {...materialProps}
    />
  )
}
