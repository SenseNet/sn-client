import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { GenericContent } from '@sensenet/default-content-types'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import React from 'react'

/**
 * Parses a full text based on a search term and returns the corresponding list of JSX.Elements
 * @param text The full text to be parsed
 * @param term The search term
 */
export const getMatchParts = (text: string, term: string) => {
  const matchValue = match(term, text)
  const parseValue = parse(term, matchValue)

  return parseValue.map((part, index) =>
    part.highlight ? <strong key={String(index)}>{part.text}</strong> : <span key={String(index)}>{part.text}</span>,
  )
}
/**
 * Default Suggsetion component for Reference Field
 * @param props
 */
export const ReferenceFieldSuggestion: React.FunctionComponent<{
  item: GenericContent
  query: string
  isHighlighted: boolean
}> = props => {
  const primary = getMatchParts(props.query, props.item.DisplayName || props.item.Name)
  const secondary = getMatchParts(props.query, props.item.Path)
  return (
    <ListItem key={props.item.Id} selected={props.isHighlighted} component="div" value={props.item.Id}>
      <ListItemText primary={primary} secondary={secondary} />
    </ListItem>
  )
}
