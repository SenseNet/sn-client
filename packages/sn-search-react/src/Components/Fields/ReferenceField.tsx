import { debounce } from '@sensenet/client-utils'
import { GenericContent, ReferenceFieldSetting } from '@sensenet/default-content-types'
import { Query, QueryExpression, QueryOperators } from '@sensenet/query'
import React, { useEffect, useState } from 'react'
import Autosuggest, {
  AutosuggestPropsSingleSection,
  GetSuggestionValue,
  InputProps,
  OnSuggestionSelected,
  RenderSuggestion,
} from 'react-autosuggest'
import { ReferenceFieldContainer } from './ReferenceFieldContainer'
import { ReferenceFieldInput } from './ReferenceFieldInput'
import { ReferenceFieldSuggestion } from './ReferenceFieldSuggestion'

/**
 * Props for the ReferenceField component
 */
export interface ReferenceFieldProps<T> {
  label?: string
  helperText?: string
  fieldName: keyof T
  fieldKey?: string
  fieldSetting: ReferenceFieldSetting
  defaultValueIdOrPath?: string | number
  fetchItems: (fetchQuery: Query<T>) => Promise<T[]>
  onQueryChange?: (key: string, query: Query<T>) => void
  onChange?: (item: T | null) => void
  renderSuggestion?: RenderSuggestion<T>
  autoSuggestProps?: Partial<AutosuggestPropsSingleSection<T>>
  triggerClear?: number
  autoFocus?: boolean
}

/**
 * State object for the ReferenceField component
 */
export interface ReferenceFieldState<T extends GenericContent> {
  inputValue: string
  items: T[]
  selected: T | null
  renderSuggestion: RenderSuggestion<T>
}

/**
 * Reference field picker component
 */
export function ReferenceField<T extends GenericContent>(props: ReferenceFieldProps<T>) {
  const [inputValue, setInputValue] = useState('')
  const [items, setItems] = useState<T[]>([])

  const displayName = props.fieldSetting?.DisplayName ?? props.label
  const description = props.fieldSetting?.Description || ''
  const helperText = props.helperText ?? props.fieldSetting?.Description ?? ''
  const inputProps: InputProps<T> = {
    value: inputValue,
    onChange: (ev) => onChange((ev.target as HTMLInputElement).value),
    id: 'CommandBoxInput',
  }

  useEffect(() => {
    ;(async () => {
      if (props.defaultValueIdOrPath) {
        const fetchedItems = await props.fetchItems(
          new Query((q) =>
            isNaN(props.defaultValueIdOrPath as number)
              ? q.equals('Path', props.defaultValueIdOrPath)
              : q.equals('Id', props.defaultValueIdOrPath),
          ),
        )
        if (fetchedItems.length === 1 && fetchedItems[0]) {
          const [item] = fetchedItems

          setInputValue(item.DisplayName || item.Name)

          props.onQueryChange?.(
            props.fieldKey || props.fieldName.toString(),
            new Query((q) => q.equals(props.fieldName, item.Id)),
          )
        }
      }
    })()
  }, [])

  useEffect(() => {
    if (props.triggerClear) {
      setInputValue('')
    }
  }, [props.triggerClear])

  const onChange = (value: string) => {
    setInputValue(value)
    props.onChange?.(null)
    fetchItems(getQueryFromTerm(`*${value}*`))
  }

  const fetchItems = debounce(async (query: Query<T>) => {
    const fetchedItems = await props.fetchItems(query)
    setItems(fetchedItems)
  }, 500)

  const getSuggestionValue: GetSuggestionValue<T> = (c) => {
    return c.DisplayName || c.Name
  }
  const onSuggestionSelected: OnSuggestionSelected<T> = (_ev, data) => {
    _ev.preventDefault()
    handleSelect(data.suggestion)
  }

  /**
   *
   * @param term AutoComplete field value
   */
  function getQueryFromTerm<TQueryReturns>(term: string) {
    const query = new Query<TQueryReturns>((q) =>
      q.query((q2) => q2.equals('Name', term).or.equals('DisplayName', term).or.equals('Path', term)),
    )

    if (props.fieldSetting.AllowedTypes) {
      new QueryOperators(query).and.query((q2) => {
        ;(props.fieldSetting.AllowedTypes as string[]).forEach((allowedType, index, array) => {
          new QueryExpression(q2.queryRef).term(`TypeIs:${allowedType}`)
          if (index < array.length - 1) {
            return new QueryOperators(q2.queryRef).or
          }
        })
        return q2
      })
    }

    if (props.fieldSetting.SelectionRoots?.length) {
      new QueryOperators(query).and.query((q2) => {
        ;(props.fieldSetting.SelectionRoots as string[]).forEach((root, index, array) => {
          new QueryExpression(q2.queryRef).inTree(root)
          if (index < array.length - 1) {
            return new QueryOperators(q2.queryRef).or
          }
        })
        return q2
      })
    }
    return query
  }

  const handleSelect = (item: T) => {
    props.onChange?.(item)
    setInputValue(item.DisplayName || item.Name)
    props.onQueryChange?.(
      props.fieldKey || props.fieldName.toString(),
      new Query((q) => q.equals(props.fieldName, item.Id)),
    )
  }

  return (
    <Autosuggest
      {...props.autoSuggestProps}
      theme={{
        suggestionsList: {
          listStyle: 'none',
          margin: 0,
          padding: 0,
        },
      }}
      suggestions={items}
      onSuggestionsFetchRequested={async (req) => {
        const query = getQueryFromTerm<T>(`*${req.value}*`)
        const fetchedItems = await props.fetchItems(query)
        setItems(fetchedItems)
      }}
      onSuggestionsClearRequested={() => {
        setItems([])
      }}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={(item, suggestionProps) => (
        <ReferenceFieldSuggestion
          item={item}
          query={suggestionProps.query}
          isHighlighted={suggestionProps.isHighlighted}
        />
      )}
      inputProps={inputProps}
      renderInputComponent={(inputComponentProps) => (
        <ReferenceFieldInput
          displayName={displayName}
          description={description}
          helperText={helperText}
          inputProps={inputComponentProps}
          autoFocus={props.autoFocus}
        />
      )}
      renderSuggestionsContainer={ReferenceFieldContainer}
      onSuggestionSelected={onSuggestionSelected}
    />
  )
}
