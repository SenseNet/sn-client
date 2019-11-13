import { GenericContent } from '@sensenet/default-content-types'
import { TableCell } from '@material-ui/core'
import React from 'react'
import { CurrentContentProvider } from '@sensenet/hooks-react'
import { ResponsivePlatforms } from '../../context'
import { SecondaryActionsMenu } from '../SecondaryActionsMenu'
import { CONTEXT_MENU_SCENARIO } from '../context-menu/content-context-menu'

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
          <CurrentContentProvider
            idOrPath={content.Id}
            oDataOptions={{
              select: ['Actions'],
              metadata: 'full',
              expand: ['Actions'],
              scenario: CONTEXT_MENU_SCENARIO,
            }}>
            <SecondaryActionsMenu style={{ float: 'right' }} />
          </CurrentContentProvider>
        ) : null}
      </div>
    </TableCell>
  )
}
