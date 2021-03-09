import { deepMerge } from '@sensenet/client-utils'
import { GenericContent, ReferenceFieldSetting } from '@sensenet/default-content-types'
import { Query } from '@sensenet/query'
import { ReferenceField } from '@sensenet/search-react'
import { Typography } from '@material-ui/core'
import React from 'react'
import { changeTemplatedValue } from '../helpers'
import { defaultLocalization } from './localization'
import { ReactClientFieldSetting } from '.'

/**
 * Represents an autocomplete component
 */
export const AutoComplete: React.FC<ReactClientFieldSetting<ReferenceFieldSetting>> = (props) => {
  const localization = deepMerge(defaultLocalization.autoComplete, props.localization?.autoComplete)

  const defaultValue =
    (props.fieldValue && (props.fieldValue as any)[0].Id) || changeTemplatedValue(props.settings.DefaultValue)
  const fetchItems = async (fetchQuery: Query<GenericContent>) => {
    try {
      if (!props.repository) {
        throw new Error('You must pass a repository to this control')
      }

      const result = await props.repository.loadCollection<GenericContent>({
        path: '/Root',
        oDataOptions: {
          query: fetchQuery.toString(),
          select: 'all',
        },
      })
      return result.d.results
    } catch (error) {
      console.error(error.message)
    }
  }

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <ReferenceField
          fieldSetting={props.settings}
          fieldName={props.settings.Name as any}
          defaultValueIdOrPath={defaultValue}
          onChange={(item) => props.fieldOnChange?.(props.settings.Name, item)}
          fetchItems={fetchItems as any}
          triggerClear={props.triggerClear}
          autoFocus={props.autoFocus}
        />
      )
    case 'browse':
    default: {
      return (
        <div>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            {props.fieldValue ? (props.fieldValue as any)[0].DisplayName : localization.noValue}
          </Typography>
        </div>
      )
    }
  }
}
