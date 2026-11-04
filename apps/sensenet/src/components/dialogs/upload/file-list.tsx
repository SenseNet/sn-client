import {
  Button,
  CircularProgress,
  Collapse,
  createStyles,
  Divider,
  IconButton,
  List,
  ListItem,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import CloseIcon from '@material-ui/icons/Close'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined'
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline'
import { clsx } from 'clsx'
import { filesize } from 'filesize'
import React, { useEffect, useState } from 'react'
import { useLocalization } from '../../../hooks'
import { FileWithFullPath } from './helper'
import { ProgressBar } from './progress-bar'

type Props = {
  files: FileWithFullPath[]
  removeItem: (file: File) => void
  isUploadInProgress: boolean
  skippedFiles?: FileWithFullPath[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listRoot: {
      padding: 0,
    },
    listItem: {
      display: 'block',
      width: '100%',
      padding: theme.spacing(1.5, 2),
      marginBottom: theme.spacing(1),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius * 2,
      backgroundColor: theme.palette.background.paper,
      transition: 'border-color 150ms ease, background-color 150ms ease',
    },
    errorItem: {
      borderColor: theme.palette.error.main,
    },
    completedItem: {
      borderColor: theme.palette.success.main,
    },
    fileHeader: {
      display: 'flex',
      alignItems: 'center',
      minWidth: 0,
    },
    statusIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 36,
      height: 36,
      marginRight: theme.spacing(1.5),
      flexShrink: 0,
      borderRadius: theme.shape.borderRadius,
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.action.hover,
    },
    successIcon: {
      color: theme.palette.success.main,
    },
    errorIcon: {
      color: theme.palette.error.main,
    },
    fileMeta: {
      minWidth: 0,
      flex: 1,
    },
    fileName: {
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontWeight: 500,
    },
    fileSize: {
      color: theme.palette.text.secondary,
    },
    pendingStatus: {
      marginLeft: theme.spacing(2),
      color: theme.palette.text.secondary,
      flexShrink: 0,
    },
    removeButton: {
      marginLeft: theme.spacing(0.5),
      flexShrink: 0,
    },
    progress: {
      marginTop: theme.spacing(1.25),
      marginLeft: 36 + theme.spacing(1.5),
    },
    errorActions: {
      marginTop: theme.spacing(0.75),
      marginLeft: 36 + theme.spacing(1.5),
    },
    detailsButton: {
      paddingLeft: 0,
    },
    errorDetails: {
      marginTop: theme.spacing(0.75),
      padding: theme.spacing(1.5),
      borderRadius: theme.shape.borderRadius,
      color: theme.palette.type === 'dark' ? theme.palette.error.light : theme.palette.error.dark,
      backgroundColor: theme.palette.type === 'dark' ? 'rgba(244, 67, 54, 0.12)' : 'rgba(211, 47, 47, 0.08)',
    },
    detailsTitle: {
      display: 'block',
      marginBottom: theme.spacing(1),
      color: 'inherit',
      fontWeight: 600,
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'minmax(110px, max-content) minmax(0, 1fr)',
      gap: theme.spacing(0.75, 1.5),
      color: theme.palette.text.primary,
    },
    detailLabel: {
      color: theme.palette.text.secondary,
    },
    detailValue: {
      minWidth: 0,
      overflowWrap: 'anywhere',
    },
    codeValue: {
      fontFamily: 'monospace',
      fontSize: '0.75rem',
    },
    detailsDivider: {
      margin: theme.spacing(1.5, 0),
    },
    errorMessage: {
      margin: theme.spacing(0.5, 0, 0),
      maxHeight: 180,
      overflow: 'auto',
      whiteSpace: 'pre-wrap',
      overflowWrap: 'anywhere',
      fontFamily: 'monospace',
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
  }),
)

const getNestedMessage = (error: any): string | undefined => {
  const message =
    error?.message?.value ||
    error?.message ||
    error?.error?.message?.value ||
    error?.error?.message ||
    error?.body?.error?.message?.value ||
    error?.body?.error?.message ||
    error?.d?.errors?.[0]?.error?.message?.value

  return typeof message === 'string' ? message : undefined
}

export const getUploadErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error
  }

  const message = getNestedMessage(error)
  if (message) {
    return message
  }

  try {
    const serialized = JSON.stringify(error, null, 2)
    return serialized && serialized !== '{}' ? serialized : String(error)
  } catch {
    return String(error)
  }
}

const getUploadTechnicalDetails = (error: any): string => {
  const message = getUploadErrorMessage(error)
  const name = typeof error?.name === 'string' ? error.name : undefined
  const code = typeof error?.code === 'string' || typeof error?.code === 'number' ? String(error.code) : undefined
  const stack = typeof error?.stack === 'string' ? error.stack : undefined

  const details = stack || [name, message].filter(Boolean).join(': ')
  return code ? `${details}\nCode: ${code}` : details
}

const DetailRow = ({ label, value, code = false }: { label: string; value: React.ReactNode; code?: boolean }) => {
  const classes = useStyles()

  return (
    <>
      <Typography variant="caption" className={classes.detailLabel}>
        {label}
      </Typography>
      <Typography variant="caption" className={clsx(classes.detailValue, { [classes.codeValue]: code })}>
        {value}
      </Typography>
    </>
  )
}

const UploadFileListItem = ({
  file,
  removeItem,
  isUploadInProgress,
  isSkipped,
}: {
  file: FileWithFullPath
  removeItem: (file: File) => void
  isUploadInProgress: boolean
  isSkipped: boolean
}) => {
  const classes = useStyles()
  const localization = useLocalization().uploadProgress
  const [showError, setShowError] = useState(false)
  const isError = Boolean(file.progress?.error)
  const isCompleted = Boolean(file.progress?.completed)
  const error = file.progress?.error
  const attempt = file.uploadAttempt
  const response = error?.response
  const responseStatus = response?.status ?? error?.status ?? error?.statusCode
  const responseStatusText = response?.statusText ?? error?.statusText
  const responseUrl = response?.url

  useEffect(() => {
    if (!isError) setShowError(false)
  }, [isError])

  const statusIcon = isError ? (
    <ErrorOutlineIcon className={classes.errorIcon} />
  ) : isCompleted ? (
    <CheckCircleOutlineIcon className={classes.successIcon} />
  ) : isSkipped ? (
    <RemoveCircleOutlineIcon />
  ) : file.progress ? (
    <CircularProgress size={20} thickness={5} />
  ) : (
    <InsertDriveFileOutlinedIcon />
  )

  return (
    <ListItem
      className={clsx(classes.listItem, {
        [classes.errorItem]: isError,
        [classes.completedItem]: isCompleted,
      })}>
      <div className={classes.fileHeader}>
        <div className={classes.statusIcon}>{statusIcon}</div>
        <div className={classes.fileMeta}>
          <Typography className={classes.fileName} title={file.fullPath || file.name}>
            {file.fullPath || file.name}
          </Typography>
          <Typography variant="caption" className={classes.fileSize}>
            {String(filesize(file.size))}
          </Typography>
        </div>
        {!file.progress && (
          <Typography variant="caption" className={classes.pendingStatus}>
            {isSkipped ? localization.skipped : isUploadInProgress ? localization.waiting : localization.readyToUpload}
          </Typography>
        )}
        <IconButton
          className={classes.removeButton}
          disabled={isUploadInProgress}
          edge="end"
          aria-label={`${localization.removeFile}: ${file.name}`}
          onClick={() => removeItem(file)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      {file.progress && (
        <div className={classes.progress}>
          <ProgressBar progress={file.progress} />
        </div>
      )}

      {isError && (
        <div className={classes.errorActions}>
          <Button
            className={classes.detailsButton}
            size="small"
            color="default"
            startIcon={<InfoOutlinedIcon />}
            aria-expanded={showError}
            onClick={() => setShowError((visible) => !visible)}>
            {showError ? localization.hideErrorDetails : localization.showErrorDetails}
          </Button>
          <Collapse in={showError} unmountOnExit>
            <div className={classes.errorDetails} data-test="upload-error-details" role="alert">
              {attempt && (
                <>
                  <Typography variant="caption" className={classes.detailsTitle}>
                    {localization.requestDetails}
                  </Typography>
                  <div className={classes.detailsGrid}>
                    <DetailRow label={localization.requestMethod} value={attempt.method} code />
                    <DetailRow label={localization.requestUrl} value={attempt.requestUrl} code />
                    <DetailRow label={localization.destinationPath} value={attempt.destinationPath} code />
                    <DetailRow label={localization.fileName} value={attempt.fileName} />
                    <DetailRow label={localization.fileSize} value={String(filesize(attempt.fileSize))} />
                    <DetailRow
                      label={localization.contentType}
                      value={attempt.contentType || localization.unknownContentType}
                      code
                    />
                    <DetailRow
                      label={localization.uploadMode}
                      value={
                        attempt.uploadMode === 'chunked'
                          ? `${localization.chunkedUpload} (${localization.chunkSize}: ${String(
                              filesize(attempt.chunkSize || 0),
                            )})`
                          : localization.singleRequestUpload
                      }
                    />
                    <DetailRow label={localization.binaryProperty} value={attempt.binaryPropertyName} code />
                    <DetailRow
                      label={localization.overwrite}
                      value={attempt.overwrite ? localization.yes : localization.no}
                    />
                    <DetailRow label={localization.startedAt} value={new Date(attempt.startedAt).toLocaleString()} />
                  </div>
                  <Divider className={classes.detailsDivider} />
                </>
              )}
              <Typography variant="caption" className={classes.detailsTitle}>
                {localization.responseDetails}
              </Typography>
              <div className={classes.detailsGrid}>
                <DetailRow
                  label={localization.responseStatus}
                  value={
                    responseStatus
                      ? `${responseStatus}${responseStatusText ? ` ${responseStatusText}` : ''}`
                      : localization.noHttpResponse
                  }
                />
                {responseUrl && <DetailRow label={localization.responseUrl} value={responseUrl} code />}
              </div>
              <Divider className={classes.detailsDivider} />
              <Typography variant="caption" className={classes.detailsTitle}>
                {localization.technicalError}
              </Typography>
              <Typography component="pre" className={classes.errorMessage}>
                {getUploadTechnicalDetails(error)}
              </Typography>
            </div>
          </Collapse>
        </div>
      )}
    </ListItem>
  )
}

export const FileList: React.FC<Props> = (props) => {
  const classes = useStyles()
  const isFileSkipped = (file: FileWithFullPath) => (props.skippedFiles ?? []).some((skipped) => skipped === file)

  return (
    <List className={classes.listRoot} aria-label="upload files">
      {props.files.map((file, index) => (
        <UploadFileListItem
          key={`${file.fullPath || file.name}-${file.size}-${file.lastModified}-${index}`}
          file={file}
          removeItem={props.removeItem}
          isUploadInProgress={props.isUploadInProgress}
          isSkipped={isFileSkipped(file)}
        />
      ))}
    </List>
  )
}
