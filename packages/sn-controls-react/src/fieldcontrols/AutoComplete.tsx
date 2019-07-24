import React from 'react'
import { GenericContent, ReferenceFieldSetting } from '@sensenet/default-content-types'
import { ReferenceField } from '@sensenet/search-react'
import { Query, QueryExpression, QueryOperators } from '@sensenet/query'
import Typography from '@material-ui/core/Typography'
import { changeJScriptValue } from '../helpers'
import { ReactClientFieldSetting } from '.'

/**
 * Represents an autocomplete component
 */
export const AutoComplete: React.FC<ReactClientFieldSetting<ReferenceFieldSetting>> = props => {
  const defaultValue =
    (props.fieldValue && (props.fieldValue as any)[0].Id) || changeJScriptValue(props.settings.DefaultValue)
  const fetchItems = async (fetchQuery: Query<GenericContent>) => {
    try {
      if (!props.repository) {
        throw new Error('You must pass a repository to this control')
      }

      new QueryOperators(fetchQuery).and.query(q2 => {
        props.settings.AllowedTypes &&
          props.settings.AllowedTypes.map((allowedType, index, array) => {
            new QueryExpression(q2.queryRef).term(`TypeIs:${allowedType}`)
            if (index < array.length - 1) {
              return new QueryOperators(q2.queryRef).or
            }
          })
        return q2
      })

      new QueryOperators(fetchQuery).and.query(q2 => {
        props.settings.SelectionRoots &&
          props.settings.SelectionRoots.forEach((root, index, array) => {
            new QueryExpression(q2.queryRef).inTree(root)
            if (index < array.length - 1) {
              return new QueryOperators(q2.queryRef).or
            }
          })
        return q2
      })

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
          onChange={item => props.fieldOnChange && props.fieldOnChange(props.settings.Name, item)}
          fetchItems={fetchItems as any}
        />
      )
    case 'browse':
    default: {
      return props.fieldValue ? (
        <div>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            {(props.fieldValue as any)[0].DisplayName}
          </Typography>
        </div>
      ) : null
    }
  }
}
