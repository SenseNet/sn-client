import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import React, { useContext } from 'react'
import { RenderSuggestionParams } from 'react-autosuggest'
import { ResponsiveContext } from '../../context'
import { CommandPaletteItem } from '../../store/CommandPalette'
import { Icon } from '../Icon'

export const getMatchParts = (hits: string[], term: string) => {
  // const matchValue: number[] | number[][] = []
  const matchValueArr = hits
    .filter(h => h.length > 0)
    .map(hit => match(term, hit))
    .reduce((flat, next) => [...flat, ...(next instanceof Array ? next : [next])], [])

  const parseValue = parse(term, matchValueArr as number[] | number[][])

  return parseValue.map((part, index) =>
    part.highlight ? <strong key={String(index)}>{part.text}</strong> : <span key={String(index)}>{part.text}</span>,
  )
}

export const CommandPaletteSuggestion: React.FunctionComponent<{
  suggestion: CommandPaletteItem
  params: RenderSuggestionParams
}> = ({ suggestion, params }) => {
  const device = useContext(ResponsiveContext)
  return (
    <ListItem button={true} selected={params.isHighlighted}>
      {suggestion.content ? (
        <ListItemIcon style={device === 'mobile' ? { margin: '0 3px' } : { margin: '0 8px' }}>
          <Icon
            item={suggestion.content}
            style={device === 'mobile' ? { width: '25px', height: '25px' } : { width: '40px', height: '40px' }}
          />
        </ListItemIcon>
      ) : null}
      <ListItemText
        primary={getMatchParts(suggestion.hits, suggestion.primaryText)}
        secondary={getMatchParts(suggestion.hits, suggestion.secondaryText)}
        secondaryTypographyProps={{
          style: {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          },
        }}
      />
    </ListItem>
  )
}
