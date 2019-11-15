import React, { useEffect, useState } from 'react'
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
import { GenericContent, User } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import moment from 'moment'
import HistoryIcon from '@material-ui/icons/History'
import { useDialog } from './dialog-provider'

export type VersionsProps = {
  content: GenericContent
}

export function Versions({ content }: VersionsProps) {
  const repo = useRepository()
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
        logger.error({ message: `Couldn't get versions for content: ${content.Name}` })
      }
    }
    getVersions()
  }, [content.Id, content.Name, logger, repo.versioning])

  const restoreVersion = (selectedVersion: GenericContent) => {
    const name = selectedVersion.DisplayName ?? selectedVersion.Name
    openDialog({
      name: 'are-you-sure',
      props: {
        submitText: 'Restore',
        bodyText: `Are you sure you want to restore version <strong>${selectedVersion.Version}</strong> of <strong>${name}</strong>`,
        callBack: async () => {
          try {
            await repo.versioning.restoreVersion(selectedVersion.Id, selectedVersion.Version)
            logger.information({ message: `${name} restored to version ${selectedVersion.Version}` })
            closeAllDialogs()
          } catch (error) {
            logger.error({
              message: `Couldn't restore version to  ${selectedVersion.Version} for content: ${selectedVersion.Name}`,
            })
          }
        },
      },
    })
  }

  return (
    <>
      <DialogTitle>Versions</DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Version</TableCell>
              <TableCell>Modified by</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Reject reason</TableCell>
              <TableCell>Restore to version</TableCell>
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
                    <IconButton onClick={() => restoreVersion(version)} title="Restore version">
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
