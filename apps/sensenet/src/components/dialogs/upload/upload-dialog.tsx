import { UploadProgressInfo, UploadResponse } from '@sensenet/client-core'
import { ObservableValue } from '@sensenet/client-utils'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import {
  Button,
  createStyles,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import NoteAddSharpIcon from '@material-ui/icons/NoteAddSharp'
import React, { useEffect, useRef, useState } from 'react'
import { Prompt } from 'react-router'
import { useLocalization } from '../../../hooks'
import { DropFileArea } from '../../DropFileArea'
import { useDialog } from '../dialog-provider'
import { FileList } from './file-list'
import { FileWithFullPath, getFilesFromDragEvent } from './helper'
import UploadConflictDialog, { ResolveConflictType } from './upload-conflict-dialog'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    icon: {
      fontSize: '4rem',
    },
    grid: {
      height: '65vh',
      border: 'dashed',
      borderColor: theme.palette.grey[500],
      marginBottom: theme.spacing(2),
      overflowY: 'auto',
    },
    body1: {
      fontSize: '2.5rem',
    },
    body2: {
      fontSize: '2rem',
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

  useEffect(() => {
    const disposable = progressObservable.current.subscribe((progressInfo) => {
      setFiles((ffiles) => {
        if (!ffiles) {
          return undefined
        }
        return ffiles.map((f) => {
          if (f === progressInfo.file) {
            const updated = Object.assign(f, { progress: progressInfo })
            return updated
          }
          return f
        })
      })
    })
    return () => {
      disposable.dispose()
    }
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
    return () => {
      window.removeEventListener('beforeunload', handleBeforeunload)
    }
  }, [isUploadInProgress, localization])

  const isFileAdded = files && !!files.length

  const removeItem = (file: File) => {
    if (!files) {
      return
    }
    setFiles(files.filter((f) => f !== file))
    setUploadingState({
      ...uploadingState,
      remainingFiles: uploadingState.remainingFiles?.filter((f) => f !== file),
    })

    // it can access to select the same file again after removal. Check: https://github.com/sensenet/sn-client/issues/491
    if (inputFile.current) {
      inputFile.current.value = ''
    }
  }

  const addFiles = (fileList: FileWithFullPath[]) => {
    const concatFileList = files && files.length ? [...files, ...fileList] : fileList
    setFiles(concatFileList)
  }

  const isUploadCompleted = () => {
    return (
      files &&
      files.length &&
      files.every((file) => {
        return file.progress && (file.progress.completed || file.progress.error)
      })
    )
  }

  const onDrop = async (event: React.DragEvent) => {
    if (isUploadInProgress) {
      return
    }
    const result = await getFilesFromDragEvent(event)
    addFiles(result)
  }

  useEffect(() => {
    if (!uploadingState.showConflictDialog && uploadingState.currentFile) {
      if (!isResolveConflict('SKIP')) uploadFileAndShift()
      else onSkipFile(uploadingState.currentFile)
    }
  }, [uploadingState.showConflictDialog])

  useEffect(() => {
    if (uploadingState.currentFile) {
      setIsUploadInProgress(true)

      repository
        .load({
          idOrPath: `${props.uploadPath}/${uploadingState.currentFile.name}`,
          oDataOptions: {
            select: ['Id'],
          },
        })
        .then(() => {
          if (uploadingState.applyActionToAllFile) {
            if (!isResolveConflict('SKIP')) uploadFileAndShift()
            else onSkipFile(uploadingState.currentFile!)
          } else {
            setIsUploadInProgress(false)
            setUploadingState({
              ...uploadingState,
              showConflictDialog: true,
            })
          }
        })
        .catch(() => {
          uploadFileAndShift()
        })
    } else {
      setIsUploadInProgress(false)
    }
  }, [uploadingState.currentFile])

  const uploadFile = async (file: FileWithFullPath, overwrite = false): Promise<UploadResponse | undefined> => {
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
      logger.error({ message: 'Upload failed', data: { error } })
    }
  }

  const isResolveConflict = (type: ResolveConflictType) => uploadingState.resolveConflict === type

  const onSkipFile = (skippedFile: FileWithFullPath) => {
    setUploadingState({
      ...uploadingState,
      currentFile: uploadingState.remainingFiles!.shift(),
      skippedFiles: [...(uploadingState.skippedFiles ?? []), skippedFile],
    })
  }

  const uploadFileAndShift = () => {
    uploadFile(uploadingState.currentFile!, isResolveConflict('REPLACE')).then(() => {
      setUploadingState({
        ...uploadingState,
        currentFile: uploadingState.remainingFiles!.shift(),
      })
    })
  }

  const upload = async () => {
    if (!files) return

    if (props.customUploadFunction) props.customUploadFunction(files, progressObservable)
    else {
      const remainingFiles = files.filter((f) => !f.progress?.error && !f.progress?.completed)
      setUploadingState({
        ...uploadingState,
        resolveConflict: undefined,
        applyActionToAllFile: false,
        remainingFiles,
        currentFile: remainingFiles.shift(),
      })
    }
  }

  return (
    <>
      {uploadingState.showConflictDialog && (
        <UploadConflictDialog
          fileName={uploadingState.currentFile!.name}
          onSelectAction={(resolveConflict: ResolveConflictType) => {
            setUploadingState({
              ...uploadingState,
              resolveConflict,
              showConflictDialog: false,
            })
          }}
          onApplyAllChange={(applyActionToAllFile: boolean) => {
            setUploadingState({
              ...uploadingState,
              applyActionToAllFile,
            })
          }}
        />
      )}
      <DialogTitle disableTypography>
        <Typography variant="h6" align="center">
          {localization.title}
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
      <DialogContent>
        <DropFileArea onDrop={onDrop}>
          <Grid
            onClick={() => {
              if (isUploadInProgress || isUploadCompleted()) {
                return
              }
              inputFile.current && inputFile.current.click()
            }}
            container
            justify={isFileAdded ? 'flex-start' : 'center'}
            direction="column"
            alignItems={isFileAdded ? 'stretch' : 'center'}
            className={classes.grid}>
            {isFileAdded ? (
              <FileList
                files={files!}
                removeItem={removeItem}
                isUploadInProgress={isUploadInProgress}
                skippedFiles={uploadingState.skippedFiles}
              />
            ) : (
              <>
                <NoteAddSharpIcon className={classes.icon} />
                <Typography variant="body1" className={classes.body1}>
                  {localization.selectFilesToUpload}
                </Typography>
                <Typography variant="body2" className={classes.body2}>
                  {localization.orDragAndDrop}
                </Typography>
              </>
            )}
          </Grid>
        </DropFileArea>
        <Grid container justify="flex-end">
          {isUploadCompleted() ? null : (
            <Button
              data-test="btn-upload"
              aria-label={localization.uploadButton}
              color="primary"
              disabled={isUploadInProgress}
              variant="contained"
              onClick={() => upload()}>
              {localization.uploadButton}
            </Button>
          )}
        </Grid>
      </DialogContent>
      <input
        onChange={(ev) => {
          ev.target.files && addFiles([...ev.target.files])
        }}
        style={{ display: 'none' }}
        disabled={props.disableMultiUpload && files && files.length > 0}
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
