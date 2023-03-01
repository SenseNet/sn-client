import { TableCell, Tooltip } from '@material-ui/core'
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate'
import Lock from '@material-ui/icons/Lock'
import { GenericContent, User } from '@sensenet/default-content-types'
import { useRepository, useSession } from '@sensenet/hooks-react'
import { clsx } from 'clsx'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'

type LockedFieldProps = {
  content: GenericContent
}

export function LockedField({ content }: LockedFieldProps) {
  const session = useSession()
  const repository = useRepository()
  const localization = useLocalization().lockedCell
  const globalClasses = useGlobalStyles()

  const lockedByName = () => {
    const checkedOutTo = content?.CheckedOutTo
    if (!repository.schemas.isContentFromType<User>(checkedOutTo, 'User')) {
      return 'Someone'
    }

    return checkedOutTo.Name === session.currentUser.Name ? 'Me' : checkedOutTo.FullName ?? 'Someone'
  }

  if (!content.Locked && !content.Approvable) {
    // We need to return an empty TableCell so the Table remains aligned.
    return <TableCell component="div" className={globalClasses.virtualizedCellStyle} />
  }

  return (
    <TableCell
      component="div"
      className={clsx(globalClasses.centered, globalClasses.virtualizedCellStyle)}
      style={{ justifyContent: 'left', paddingLeft: '9px' }}>
      <Tooltip title={content.Approvable ? localization.actionNeeded : localization.checkedOutTo(lockedByName())}>
        {content.Approvable ? <AssignmentLateIcon /> : <Lock />}
      </Tooltip>
    </TableCell>
  )
}
