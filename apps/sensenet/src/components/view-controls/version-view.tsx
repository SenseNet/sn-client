import { PathHelper } from '@sensenet/client-utils/src/path-helper'
import { GenericContent, User } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import {
  Button,
  createStyles,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@material-ui/core'
import HistoryIcon from '@material-ui/icons/History'
import clsx from 'clsx'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import MediaQuery from 'react-responsive'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useDialogActionService, useLocalization, useSelectionService } from '../../hooks'
import { useDialog } from '../dialogs'

const useStyles = makeStyles(() => {
  return createStyles({
    form: {
      margin: '0 auto',
      padding: '22px 22px 0 22px',
      overflowY: 'auto',
      width: '100%',
      height: `calc(100% - ${globals.common.formActionButtonsHeight}px)`,
    },
    formFullPage: {
      height: `calc(100% - ${globals.common.formActionButtonsHeight + globals.common.drawerItemHeight}px)`,
    },
    mainForm: {
      display: 'initial',
      height: `calc(100% - ${globals.common.formTitleHeight}px)`,
    },
    mainFormFullpage: {
      height: `calc(100% - ${globals.common.drawerItemHeight}px)`,
    },
    grid: {
      display: 'flex',
      alignItems: 'center',
      flexFlow: 'column',
      padding: '15px !important',
      height: 'fit-content',
      position: 'relative',
    },
    wrapper: {
      width: '75%',
      position: 'relative',
    },
    wrapperFullWidth: {
      width: '88%',
    },
    actionButtonWrapper: {
      height: '80px',
      width: '100%',
      position: 'absolute',
      padding: '20px',
      bottom: 0,
      textAlign: 'right',
    },
  })
})

export interface VersionViewProps {
  handleCancel?: () => void
  isFullPage?: boolean
}

export const VersionView: React.FC<VersionViewProps> = (props) => {
  const repo = useRepository()
  const localization = useLocalization().versionsDialog
  const formLocalization = useLocalization().forms
  const selectionService = useSelectionService()
  const [content, setContent] = useState(selectionService.activeContent.getValue())
  const { openDialog, closeAllDialogs } = useDialog()
  const logger = useLogger('VersionsDialog')
  const [versions, setVersions] = useState<GenericContent[]>()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const dialogActionService = useDialogActionService()

  useEffect(() => {
    const activeComponentObserve = selectionService.activeContent.subscribe((newActiveComponent) =>
      setContent(newActiveComponent),
    )
    return function cleanup() {
      activeComponentObserve.dispose()
    }
  }, [selectionService.activeContent])

  useEffect(() => {
    async function getVersions() {
      try {
        const result = await repo.versioning.getVersions(content!.Id, {
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
        logger.error({ message: localization.getVersionsError(content!.Name), data: error })
      }
    }
    content && getVersions()
  }, [closeAllDialogs, content, localization, logger, repo.versioning])

  if (content === undefined) {
    return null
  }
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
    <div
      className={clsx(classes.mainForm, {
        [classes.mainFormFullpage]: props.isFullPage,
      })}>
      <div
        className={clsx(classes.form, {
          [classes.formFullPage]: props.isFullPage,
        })}>
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
      </div>
      <div className={classes.actionButtonWrapper}>
        <MediaQuery minDeviceWidth={700}>
          <Button
            color="default"
            className={globalClasses.cancelButton}
            onClick={async () => {
              if (selectionService.activeContent.getValue() !== undefined) {
                const parentContent = await repo.load({
                  idOrPath: PathHelper.getParentPath(selectionService.activeContent.getValue()!.Path),
                })
                selectionService.activeContent.setValue(parentContent.d)
              }
              dialogActionService.activeAction.setValue(undefined)
              props.handleCancel?.()
            }}>
            {formLocalization.cancel}
          </Button>
        </MediaQuery>
      </div>
    </div>
  )
}
