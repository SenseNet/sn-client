import {
  Button,
  createStyles,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined'
import { UploadProgressInfo, UploadResponse } from '@sensenet/client-core'
import { ObservableValue, PathHelper } from '@sensenet/client-utils'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { clsx } from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { Prompt } from 'react-router'
import { useLocalization } from '../../../hooks'
import { DropFileArea } from '../../DropFileArea'
import { useDialog } from '../dialog-provider'
import { FileList } from './file-list'
import { FileWithFullPath, getFilesFromDragEvent } from './helper'
import { getProgressPercentage } from './progress-bar'
import UploadConflictDialog, { ResolveConflictType } from './upload-conflict-dialog'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      padding: theme.spacing(2.5, 3, 1.5),
    },
    titleText: {
      paddingRight: theme.spacing(5),
      fontWeight: 600,
    },
    subtitle: {
      paddingRight: theme.spacing(5),
      marginTop: theme.spacing(0.5),
      color: theme.palette.text.secondary,
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1.5),
      top: theme.spacing(1.5),
      color: theme.palette.text.secondary,
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      height: '65vh',
      maxHeight: 'calc(100vh - 220px)',
      minHeight: 320,
      padding: theme.spacing(1.5, 3, 1),
      overflow: 'hidden',
    },
    dropZone: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 88,
      padding: theme.spacing(2),
      border: `1px dashed ${theme.palette.primary.main}`,
      borderRadius: theme.shape.borderRadius * 2,
      outline: 0,
      cursor: 'pointer',
      backgroundColor: theme.palette.type === 'dark' ? 'rgba(3, 169, 244, 0.08)' : 'rgba(3, 169, 244, 0.04)',
      transition: 'background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
      '&:hover': {
        backgroundColor: theme.palette.type === 'dark' ? 'rgba(3, 169, 244, 0.14)' : 'rgba(3, 169, 244, 0.08)',
      },
      '&:focus-visible': {
        boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
      },
    },
    dropZoneDisabled: {
      cursor: 'default',
      opacity: 0.6,
      '&:hover': {
        backgroundColor: theme.palette.type === 'dark' ? 'rgba(3, 169, 244, 0.08)' : 'rgba(3, 169, 244, 0.04)',
      },
    },
    dropZoneIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 48,
      height: 48,
      marginRight: theme.spacing(2),
      flexShrink: 0,
      borderRadius: '50%',
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.type === 'dark' ? 'rgba(3, 169, 244, 0.18)' : 'rgba(3, 169, 244, 0.12)',
    },
    dropZoneTitle: {
      fontWeight: 500,
    },
    dropZoneHint: {
      display: 'block',
      marginTop: theme.spacing(0.25),
      color: theme.palette.text.secondary,
    },
    filesSection: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      minHeight: 0,
      marginTop: theme.spacing(2),
    },
    summary: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
    summaryTitle: {
      fontWeight: 500,
    },
    summaryDetails: {
      color: theme.palette.text.secondary,
      textAlign: 'right',
    },
    overallTrack: {
      height: 4,
      marginBottom: theme.spacing(1.5),
      overflow: 'hidden',
      borderRadius: 2,
      backgroundColor: theme.palette.action.disabledBackground,
    },
    overallBar: {
      height: '100%',
      borderRadius: 2,
      backgroundColor: theme.palette.primary.main,
      transition: 'width 200ms ease-out',
    },
    overallBarWithErrors: {
      backgroundColor: theme.palette.error.main,
    },
    fileList: {
      flex: 1,
      minHeight: 96,
      paddingRight: theme.spacing(0.5),
      overflowY: 'auto',
    },
    actions: {
      padding: theme.spacing(1.5, 3, 2.5),
    },
  }),
)

export type UploadDialogProps = {
  files?: File[]
  uploadPath: string
  disableMultiUpload?: boolean
  customUploadFunction?: (files: FileWithFullPath[] | undefined, progressObservable: any) => any
}

export interface UploadingState {
  remainingFiles?: FileWithFullPath[]
  skippedFiles?: FileWithFullPath[]
  applyActionToAllFile?: boolean
  resolveConflict?: ResolveConflictType
  currentFile?: FileWithFullPath
  showConflictDialog: boolean
}

export function UploadDialog(props: UploadDialogProps) {
  const classes = useStyles()
  const logger = useLogger('upload')
  const { closeLastDialog } = useDialog()
  const repository = useRepository()
  const localization = useLocalization().uploadProgress
  const inputFile = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<FileWithFullPath[] | undefined>(props.files)
  const [isUploadInProgress, setIsUploadInProgress] = useState(false)
  const [uploadingState, setUploadingState] = useState<UploadingState>({
    applyActionToAllFile: false,
    showConflictDialog: false,
  })
  const progressObservable = useRef(new ObservableValue<UploadProgressInfo>())
  const abortController = useRef(new AbortController())

  const isFileSkipped = (file: FileWithFullPath) =>
    (uploadingState.skippedFiles ?? []).some((skippedFile) => skippedFile === file)

  const uploadStats = (files ?? []).reduce(
    (stats, file) => {
      if (file.progress?.completed) stats.completed += 1
      else if (file.progress?.error) stats.failed += 1
      else if (isFileSkipped(file)) stats.skipped += 1
      return stats
    },
    { completed: 0, failed: 0, skipped: 0 },
  )
  const terminalFileCount = uploadStats.completed + uploadStats.failed + uploadStats.skipped
  const isFileAdded = Boolean(files?.length)
  const isUploadFinished = Boolean(files?.length && terminalFileCount === files.length)
  const uploadableFiles = (files ?? []).filter((file) => !file.progress?.completed && !isFileSkipped(file))
  const retryingOnlyFailedFiles =
    uploadableFiles.length > 0 && uploadableFiles.every((file) => Boolean(file.progress?.error))
  const overallProgress = files?.length
    ? Math.round(
        (files.reduce((sum, file) => {
          if (file.progress?.completed || file.progress?.error || isFileSkipped(file)) return sum + 100
          return sum + (file.progress ? getProgressPercentage(file.progress) : 0)
        }, 0) / files.length) as number,
      )
    : 0
  const isDropZoneDisabled = isUploadInProgress || Boolean(props.disableMultiUpload && files && files.length > 0)

  useEffect(() => {
    const disposable = progressObservable.current.subscribe((progressInfo) => {
      setFiles((currentFiles) => {
        if (!currentFiles) return undefined

        return currentFiles.map((file) => {
          if (file === progressInfo.file) {
            Object.assign(file, { progress: progressInfo })
          }
          return file
        })
      })
    })
    return () => disposable.dispose()
  }, [])

  useEffect(() => {
    const handleBeforeunload = (event: BeforeUnloadEvent) => {
      if (isUploadInProgress) {
        event.preventDefault()
        event.returnValue = localization.blockNavigation
        return event
      }
      abortController.current.abort()
    }

    window.addEventListener('beforeunload', handleBeforeunload)
    return () => window.removeEventListener('beforeunload', handleBeforeunload)
  }, [isUploadInProgress, localization])

  const removeItem = (file: File) => {
    setFiles((currentFiles) => currentFiles?.filter((currentFile) => currentFile !== file))
    setUploadingState((currentState) => ({
      ...currentState,
      remainingFiles: currentState.remainingFiles?.filter((remainingFile) => remainingFile !== file),
      skippedFiles: currentState.skippedFiles?.filter((skippedFile) => skippedFile !== file),
    }))

    // Allow selecting the same file after removing it.
    if (inputFile.current) inputFile.current.value = ''
  }

  const addFiles = (fileList: FileWithFullPath[]) => {
    setFiles((currentFiles) => {
      if (props.disableMultiUpload) {
        return currentFiles?.length ? currentFiles : fileList.slice(0, 1)
      }
      return currentFiles?.length ? [...currentFiles, ...fileList] : fileList
    })
  }

  const openFilePicker = () => {
    if (!isDropZoneDisabled) inputFile.current?.click()
  }

  const onDrop = async (event: React.DragEvent) => {
    if (isDropZoneDisabled) return
    const result = await getFilesFromDragEvent(event)
    addFiles(result)
  }

  const isResolveConflict = (type: ResolveConflictType) => uploadingState.resolveConflict === type

  const onSkipFile = (skippedFile: FileWithFullPath) => {
    setUploadingState((currentState) => {
      const [currentFile, ...remainingFiles] = currentState.remainingFiles ?? []
      return {
        ...currentState,
        currentFile,
        remainingFiles,
        skippedFiles: [...(currentState.skippedFiles ?? []), skippedFile],
      }
    })
  }

  const uploadFile = async (file: FileWithFullPath, overwrite = false): Promise<UploadResponse | undefined> => {
    const uploadMode = repository.upload.isChunkedUploadNeeded(file) ? 'chunked' : 'single'
    file.uploadAttempt = {
      method: 'POST',
      requestUrl: PathHelper.joinPaths(
        repository.configuration.repositoryUrl,
        repository.configuration.oDataToken,
        PathHelper.getContentUrl(props.uploadPath),
        'upload',
      ),
      destinationPath: props.uploadPath,
      fileName: file.fullPath || file.name,
      fileSize: file.size,
      contentType: file.type,
      binaryPropertyName: 'Binary',
      overwrite,
      uploadMode,
      chunkSize: uploadMode === 'chunked' ? repository.configuration.chunkSize : undefined,
      startedAt: new Date().toISOString(),
    }

    try {
      return await repository.upload.file({
        parentPath: props.uploadPath,
        file,
        binaryPropertyName: 'Binary',
        overwrite,
        progressObservable: progressObservable.current,
        requestInit: { signal: abortController.current.signal },
      })
    } catch (error) {
      logger.error({ message: 'Upload failed', data: { error, fileName: file.name } })
      return undefined
    }
  }

  const uploadFileAndShift = () => {
    const file = uploadingState.currentFile
    if (!file) return

    uploadFile(file, isResolveConflict('REPLACE')).then(() => {
      setUploadingState((currentState) => {
        const [currentFile, ...remainingFiles] = currentState.remainingFiles ?? []
        return { ...currentState, currentFile, remainingFiles }
      })
    })
  }

  useEffect(() => {
    if (!uploadingState.showConflictDialog && uploadingState.currentFile) {
      if (isResolveConflict('SKIP')) onSkipFile(uploadingState.currentFile)
      else uploadFileAndShift()
    }
    // This effect continues the queue after the conflict dialog is resolved.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadingState.showConflictDialog])

  useEffect(() => {
    if (!uploadingState.currentFile) {
      setIsUploadInProgress(false)
      return
    }

    setIsUploadInProgress(true)
    repository
      .load({
        idOrPath: `${props.uploadPath}/${uploadingState.currentFile.name}`,
        oDataOptions: { select: ['Id'] },
      })
      .then(() => {
        if (uploadingState.applyActionToAllFile) {
          if (isResolveConflict('SKIP')) onSkipFile(uploadingState.currentFile!)
          else uploadFileAndShift()
        } else {
          setIsUploadInProgress(false)
          setUploadingState((currentState) => ({ ...currentState, showConflictDialog: true }))
        }
      })
      .catch(() => uploadFileAndShift())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadingState.currentFile])

  const upload = async () => {
    if (!files?.length) return

    if (props.customUploadFunction) {
      setIsUploadInProgress(true)
      try {
        await props.customUploadFunction(files, progressObservable)
      } finally {
        setIsUploadInProgress(false)
      }
      return
    }

    const remainingFiles = files.filter((file) => !file.progress?.completed && !isFileSkipped(file))
    remainingFiles.forEach((file) => {
      if (file.progress?.error) delete file.progress
    })
    setFiles([...files])

    const [currentFile, ...queuedFiles] = remainingFiles
    if (currentFile) setIsUploadInProgress(true)
    setUploadingState((currentState) => ({
      ...currentState,
      resolveConflict: undefined,
      applyActionToAllFile: false,
      remainingFiles: queuedFiles,
      skippedFiles: currentState.skippedFiles ?? [],
      currentFile,
    }))
  }

  const uploadActionLabel = isUploadInProgress
    ? localization.uploading
    : retryingOnlyFailedFiles
    ? localization.retryFailed
    : localization.uploadButton

  return (
    <>
      {uploadingState.showConflictDialog && (
        <UploadConflictDialog
          fileName={uploadingState.currentFile!.name}
          onSelectAction={(resolveConflict: ResolveConflictType) => {
            setUploadingState((currentState) => ({
              ...currentState,
              resolveConflict,
              showConflictDialog: false,
            }))
          }}
          onApplyAllChange={(applyActionToAllFile: boolean) => {
            setUploadingState((currentState) => ({ ...currentState, applyActionToAllFile }))
          }}
        />
      )}

      <DialogTitle disableTypography className={classes.title}>
        <Typography variant="h6" className={classes.titleText}>
          {localization.title}
        </Typography>
        <Typography variant="body2" className={classes.subtitle}>
          {localization.subtitle}
        </Typography>
        <IconButton
          disabled={isUploadInProgress}
          aria-label="close"
          data-test="dialog-close"
          className={classes.closeButton}
          onClick={closeLastDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className={classes.content}>
        <DropFileArea onDrop={onDrop} style={{ display: 'flex', flex: 1, flexDirection: 'column', minHeight: 0 }}>
          <div
            role="button"
            tabIndex={isDropZoneDisabled ? -1 : 0}
            aria-disabled={isDropZoneDisabled}
            className={clsx(classes.dropZone, { [classes.dropZoneDisabled]: isDropZoneDisabled })}
            onClick={openFilePicker}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                openFilePicker()
              }
            }}>
            <div className={classes.dropZoneIcon}>
              <CloudUploadOutlinedIcon />
            </div>
            <div>
              <Typography className={classes.dropZoneTitle}>{localization.dropZoneTitle}</Typography>
              <Typography variant="caption" className={classes.dropZoneHint}>
                {isFileAdded ? localization.addMoreFiles : localization.dropZoneHint}
              </Typography>
            </div>
          </div>

          {isFileAdded && (
            <section className={classes.filesSection} aria-label={localization.selectedFiles(files!.length)}>
              <div className={classes.summary}>
                <Typography className={classes.summaryTitle}>{localization.selectedFiles(files!.length)}</Typography>
                <Typography variant="caption" className={classes.summaryDetails}>
                  {localization.uploadSummary(
                    uploadStats.completed,
                    uploadStats.failed,
                    uploadStats.skipped,
                    files!.length,
                  )}
                </Typography>
              </div>
              {(isUploadInProgress || terminalFileCount > 0) && (
                <div className={classes.overallTrack} aria-hidden="true">
                  <div
                    className={clsx(classes.overallBar, {
                      [classes.overallBarWithErrors]: uploadStats.failed > 0 && !isUploadInProgress,
                    })}
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              )}
              <div className={classes.fileList}>
                <FileList
                  files={files!}
                  removeItem={removeItem}
                  isUploadInProgress={isUploadInProgress}
                  skippedFiles={uploadingState.skippedFiles}
                />
              </div>
            </section>
          )}
        </DropFileArea>
      </DialogContent>

      <DialogActions className={classes.actions}>
        {!isUploadFinished || uploadStats.failed > 0 ? (
          <Button disabled={isUploadInProgress} onClick={closeLastDialog}>
            {localization.cancel}
          </Button>
        ) : null}
        {isUploadFinished && uploadStats.failed === 0 ? (
          <Button color="primary" variant="contained" onClick={closeLastDialog}>
            {localization.done}
          </Button>
        ) : (
          <Button
            data-test="btn-upload"
            aria-label={uploadActionLabel}
            color="primary"
            disabled={isUploadInProgress || uploadableFiles.length === 0}
            variant="contained"
            onClick={upload}>
            {uploadActionLabel}
          </Button>
        )}
      </DialogActions>

      <input
        onChange={(event) => event.target.files && addFiles([...event.target.files])}
        style={{ display: 'none' }}
        disabled={isDropZoneDisabled}
        ref={inputFile}
        type="file"
        data-test="input-file"
        multiple={!props.disableMultiUpload}
      />
      <Prompt when={isUploadInProgress} message={localization.blockNavigation} />
    </>
  )
}

export default UploadDialog
