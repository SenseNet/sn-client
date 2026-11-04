import List from '@material-ui/core/List'
import Paper from '@material-ui/core/Paper'
import React, { FunctionComponent, useContext } from 'react'
import { RenderSuggestionsContainerParams } from 'react-autosuggest'
import { ResponsiveContext } from '../../context'
import { useLocalization } from '../../hooks'

export const CommandPaletteHitsContainer: FunctionComponent<
  RenderSuggestionsContainerParams & { header?: React.ReactNode }
> = (options) => {
  const device = useContext(ResponsiveContext)
  const localization = useLocalization()

  return (
    <Paper
      square={true}
      style={{
        position: 'absolute',
        zIndex: device === 'mobile' ? 1301 : 1,
        left: device === 'mobile' ? 0 : undefined,
        width: '100%',
      }}>
      <>
        {options.header}
        <List
          aria-label={localization.commandPalette.searchSuggestionList}
          dense={device === 'desktop' ? false : true}
          component="nav"
          data-test="search-suggestion-list"
          {...options.containerProps}
          style={{ padding: 0 }}>
          {options.children}
        </List>
      </>
    </Paper>
  )
}
