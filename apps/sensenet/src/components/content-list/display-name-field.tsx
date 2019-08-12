import { GenericContent } from '@sensenet/default-content-types'
import { TableCell } from '@material-ui/core'
import React from 'react'
import { CurrentContentContext, ResponsivePlatforms } from '../../context'
import { SecondaryActionsMenu } from '../SecondaryActionsMenu'

export const DisplayNameComponent: React.FunctionComponent<{
  content: GenericContent
  device: ResponsivePlatforms
  isActive: boolean
}> = ({ content, device, isActive }) => {
  return (
    <TableCell padding={'none'}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {content.DisplayName || content.Name}
        {device === 'mobile' && isActive ? (
          <CurrentContentContext.Provider value={content}>
            <SecondaryActionsMenu style={{ float: 'right' }} />
          </CurrentContentContext.Provider>
        ) : null}
      </div>
    </TableCell>
  )
}
