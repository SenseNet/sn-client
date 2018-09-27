import MaterialTextField, { TextFieldProps as MaterialTextFieldProps } from '@material-ui/core/TextField'
import { FieldSetting, GenericContent } from '@sensenet/default-content-types'
import { Query } from '@sensenet/query'
import React = require('react')

/**
 * Props object for the TextField Component
 */
export interface TextFieldProps<T> extends MaterialTextFieldProps {
    /**
     * Name of the field
     */
    fieldName: string
    /**
     * Callback that will triggered when the query changes
     */
    onQueryChange: (key: string, query: Query<T>) => void
    /**
     * Field settings for setting labels, placeholders and hint texts
     */
    fieldSetting?: Partial<FieldSetting>
    /**
     * Additional key that can be used if you have multiple controls for the same field
     */
    fieldKey?: string
}

/**
 * Component for searching simple text fragments in a specified field
 * @param props
 */
export const TextField = <T extends GenericContent>(props: TextFieldProps<T>) => {
    const displayName = props.fieldSetting && props.fieldSetting.DisplayName || props.label
    const description = props.fieldSetting && props.fieldSetting.Description || ''
    const { fieldName, onQueryChange, fieldSetting, fieldKey, ...materialProps } = { ...props }
    return (<MaterialTextField type="text"
        onChange={(ev) => {
            const query = new Query((q) =>
                ev.currentTarget.value ? q.equals(props.fieldName, `*${ev.currentTarget.value}*`) : q,
            )
            return props.onQueryChange(props.fieldKey || props.fieldName, query)
        }}
        label={displayName}
        placeholder={description}
        title={props.fieldSetting && props.fieldSetting.Description}
        {...materialProps}
    />)
}
