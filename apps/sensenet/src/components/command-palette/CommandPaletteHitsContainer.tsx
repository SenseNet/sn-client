import List from '@material-ui/core/List'
import Paper from '@material-ui/core/Paper'
import React, { useContext } from 'react'
import { RenderSuggestionsContainerParams } from 'react-autosuggest'
import { ResponsiveContext } from '../../context'
import { useLocalization } from '../../hooks'

export const CommandPaletteHitsContainer: React.FunctionComponent<RenderSuggestionsContainerParams> = (options) => {
  const device = useContext(ResponsiveContext)
  const localization = useLocalization()

  return (
    <Paper
      square={true}
      style={{
        position: 'absolute',
        zIndex: 1,
        left: device === 'mobile' ? '64px' : undefined,
        width: device === 'mobile' ? 'calc(100% - 80px)' : '100%',
      }}>
      <List
        aria-label={localization.commandPalette.searchSuggestionList}
        dense={device === 'desktop' ? false : true}
        component="nav"
        data-test="search-suggestion-list"
        {...options.containerProps}
        style={{ padding: 0 }}>
        {options.children}
      </List>
    </Paper>
  )
}
