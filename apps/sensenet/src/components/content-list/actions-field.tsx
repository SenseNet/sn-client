import { GenericContent } from '@sensenet/default-content-types'
import { TableCell } from '@material-ui/core'
import React from 'react'
import { CurrentContentContext } from '../../context'
import { SecondaryActionsMenu } from '../SecondaryActionsMenu'

export const ActionsField: React.FC<{ content: GenericContent }> = ({ content }) => {
  return (
    <TableCell style={{ width: '64px' }}>
      <CurrentContentContext.Provider value={content}>
        <SecondaryActionsMenu />
      </CurrentContentContext.Provider>
    </TableCell>
  )
}
