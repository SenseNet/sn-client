import React from 'react'
import Lock from '@material-ui/icons/Lock'
import { TableCell, Tooltip } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { useSession } from '@sensenet/hooks-react'
import { isUser } from '../../utils/type-guards'

type LockedFieldProps = {
  content: GenericContent
}

export function LockedField({ content }: LockedFieldProps) {
  const session = useSession()

  const lockedByName = () => {
    const checkedOutTo = content?.CheckedOutTo
    if (!isUser(checkedOutTo)) {
      return 'Someone'
    }

    return checkedOutTo.Name === session.currentUser.Name ? 'Me' : checkedOutTo.FullName ?? 'Someone'
  }

  if (!content.Locked) {
    // We need to return an empty TableCell so the Table remains aligned.
    return <TableCell />
  }

  return (
    <TableCell>
      <Tooltip title={`Checked out to ${lockedByName()}`}>
        <Lock />
      </Tooltip>
    </TableCell>
  )
}
