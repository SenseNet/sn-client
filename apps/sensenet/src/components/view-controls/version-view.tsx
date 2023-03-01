import { Button, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@material-ui/core'
import HistoryIcon from '@material-ui/icons/History'
import { GenericContent, User } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React, { useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization, useSelectionService } from '../../hooks'
import { useDateUtils } from '../../hooks/use-date-utils'
import { navigateToAction } from '../../services'
import { useDialog } from '../dialogs'
import { useViewControlStyles } from './common/styles'
import { ViewTitle } from './common/view-title'

export interface VersionViewProps {
  contentPath?: string
  handleCancel?: () => void
  isFullPage?: boolean
}

export const VersionView: React.FC<VersionViewProps> = (props) => {
  const repo = useRepository()
  const localization = useLocalization().versionsDialog
  const formLocalization = useLocalization().forms
  const selectionService = useSelectionService()
  const [content, setContent] = useState<GenericContent>()
  const { openDialog, closeAllDialogs } = useDialog()
  const logger = useLogger('VersionsDialog')
  const [versions, setVersions] = useState<GenericContent[]>()
  const [reloadToken, setReloadToken] = useState(0)
  const classes = useViewControlStyles()
  const globalClasses = useGlobalStyles()
  const history = useHistory()
  const routeMatch = useRouteMatch<{ browseType: string; action?: string }>()
  const dateUtils = useDateUtils()

  useEffect(() => {
    async function getVersions() {
      try {
        const result = await repo.versioning.getVersions(props.contentPath!, {
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
        const orderedVersions = result.d.results.reverse()
        setVersions(orderedVersions)
        setContent(orderedVersions[0])
        selectionService.activeContent.setValue(orderedVersions[0])
        logger.verbose({ message: 'getVersions returned with', data: result })
      } catch (error) {
        logger.error({ message: localization.getVersionsError(props.contentPath!), data: error })
      }
    }
    props.contentPath && getVersions()
  }, [closeAllDialogs, props.contentPath, localization, logger, repo, selectionService.activeContent, reloadToken])

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
            setReloadToken((prevValue) => prevValue + 1)
          } catch (error) {
            logger.error({
              message: localization.restoreVersionError(name, selectedVersion.Version),
              data: { error },
            })
          } finally {
            closeAllDialogs()
          }
        },
      },
    })
  }

  if (content === undefined) {
    return null
  }

  return (
    <>
      <ViewTitle title={'Versions of'} titleBold={content?.DisplayName} content={content} />
      <Grid container={true} spacing={2} className={classes.grid}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell data-test="version-table-header-cell">{localization.versionTableHead}</TableCell>
              <TableCell data-test="version-table-header-cell">{localization.modifiedByTableHead}</TableCell>
              <TableCell data-test="version-table-header-cell">{localization.commentTableHead}</TableCell>
              <TableCell data-test="version-table-header-cell">{localization.rejectReasonTableHead}</TableCell>
              <TableCell data-test="version-table-header-cell">{localization.restoreTableHead}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {versions?.map((version, index) => (
              <TableRow key={index}>
                <TableCell data-test="version-number">{version.Version}</TableCell>
                <TableCell>
                  {version.VersionModificationDate &&
                    dateUtils.formatDistanceFromNow(new Date(version.VersionModificationDate))}
                  {` (${(version.VersionModifiedBy as User).FullName})`}
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
                  {index !== 0 ? (
                    <IconButton onClick={() => restoreVersion(version)} title={localization.restoreButtonTitle}>
                      <HistoryIcon />
                    </IconButton>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
      <div className={classes.actionButtonWrapper}>
        <Button
          aria-label={formLocalization.cancel}
          color="default"
          className={globalClasses.cancelButton}
          onClick={() => {
            navigateToAction({ history, routeMatch })
            props.handleCancel?.()
          }}>
          {formLocalization.cancel}
        </Button>
      </div>
    </>
  )
}
