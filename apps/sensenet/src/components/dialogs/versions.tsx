import { GenericContent, User } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import {
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@material-ui/core'
import HistoryIcon from '@material-ui/icons/History'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useLocalization } from '../../hooks'
import { useDialog } from './dialog-provider'

export type VersionsProps = {
  content: GenericContent
}

export function Versions({ content }: VersionsProps) {
  const repo = useRepository()
  const localization = useLocalization().versionsDialog
  const { openDialog, closeAllDialogs } = useDialog()
  const logger = useLogger('VersionsDialog')
  const [versions, setVersions] = useState<GenericContent[]>()

  useEffect(() => {
    async function getVersions() {
      try {
        const result = await repo.versioning.getVersions(content.Id, {
          select: [
            'Version',
            'VersionModificationDate',
            'CheckInComments',
            'RejectReason',
            'VersionModifiedBy/FullName' as any,
          ],
          expand: ['VersionModifiedBy'],
          metadata: 'no',
        })
        setVersions(result.d.results)
        logger.verbose({ message: 'getVersions returned with', data: result })
      } catch (error) {
        closeAllDialogs()
        logger.error({ message: localization.getVersionsError(content.Name), data: error })
      }
    }
    getVersions()
  }, [closeAllDialogs, content.Id, content.Name, localization, logger, repo.versioning])

  const restoreVersion = (selectedVersion: GenericContent) => {
    const name = selectedVersion.DisplayName ?? selectedVersion.Name
    openDialog({
      name: 'are-you-sure',
      props: {
        submitText: localization.restoreSubmitText,
        bodyText: localization.restoreBodyText(name, selectedVersion.Version),
        callBack: async () => {
          try {
            await repo.versioning.restoreVersion(selectedVersion.Id, selectedVersion.Version)
            logger.information({ message: localization.restoreVersionSuccess(name, selectedVersion.Version) })
            closeAllDialogs()
          } catch (error) {
            closeAllDialogs()
            logger.error({
              message: localization.restoreVersionError(name, selectedVersion.Version),
              data: error,
            })
          }
        },
      },
    })
  }

  return (
    <>
      <DialogTitle>{localization.title}</DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{localization.versionTableHead}</TableCell>
              <TableCell>{localization.modifiedByTableHead}</TableCell>
              <TableCell>{localization.commentTableHead}</TableCell>
              <TableCell>{localization.rejectReasonTableHead}</TableCell>
              <TableCell>{localization.restoreTableHead}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {versions?.map((version, index) => (
              <TableRow key={index}>
                <TableCell>{version.Version}</TableCell>
                <TableCell>
                  {moment(version.VersionModificationDate).fromNow()}
                  {` (${((version.VersionModifiedBy as any) as User).FullName})`}
                </TableCell>
                <TableCell>
                  <Tooltip disableFocusListener={true} title={version.CheckInComments ?? ''}>
                    <span>{version.CheckInComments ?? ''}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip disableFocusListener={true} title={version.RejectReason ?? ''}>
                    <span>{version.RejectReason ?? ''}</span>
                  </Tooltip>
                </TableCell>
                <TableCell padding="none" style={{ width: '5%' }}>
                  {index !== versions.length - 1 ? (
                    <IconButton onClick={() => restoreVersion(version)} title="{localization.restoreButtonTitle}">
                      <HistoryIcon />
                    </IconButton>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </>
  )
}

export default Versions
