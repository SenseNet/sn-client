import List from '@material-ui/core/List'
import Paper from '@material-ui/core/Paper'
import React, { useContext } from 'react'
import { RenderSuggestionsContainerParams } from 'react-autosuggest'
import { ResponsiveContext } from '../../context'

export const CommandPaletteHitsContainer: React.FunctionComponent<RenderSuggestionsContainerParams> = (options) => {
  const device = useContext(ResponsiveContext)
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
        dense={device === 'desktop' ? false : true}
        component="nav"
        {...options.containerProps}
        style={{ padding: 0 }}>
        {options.children}
      </List>
    </Paper>
  )
}
