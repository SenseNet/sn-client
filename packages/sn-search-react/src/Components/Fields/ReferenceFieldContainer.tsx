import React from 'react'
import { RenderSuggestionsContainerParams } from 'react-autosuggest'
import List from '@material-ui/core/List'
import Paper from '@material-ui/core/Paper'

/**
 * Default container for Reference Field suggestion list
 * @param options
 */
export const ReferenceFieldContainer: React.FunctionComponent<RenderSuggestionsContainerParams> = (options) => (
  <Paper
    square={true}
    style={{
      position: 'fixed',
      zIndex: 1,
    }}>
    <List component="nav" {...options.containerProps} style={{ padding: 0 }}>
      {options.children}
    </List>
  </Paper>
)
