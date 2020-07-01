import { UploadProgressInfo } from '@sensenet/client-core'
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
      height: '85vh',
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
  const progressObservable = useRef(new ObservableValue<UploadProgressInfo>())
  const abortController = useRef(new AbortController())

  useEffect(() => {
    const disposable = progressObservable.current.subscribe((progressInfo) => {
      setFiles((ffiles) => {
        if (!ffiles) {
          return undefined
        }
        return ffiles.map((f) => {
          if (f.lastModified === progressInfo.file.lastModified) {
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
  }, [isUploadInProgress, localization.blockNavigation])

  const isFileAdded = files && !!files.length

  const removeItem = (file: File) => {
    if (!files) {
      return
    }
    setFiles(files.filter((f) => f !== file))

    // it can access to select the same file again after removal. Check: https://github.com/sensenet/sn-client/issues/491
    if (inputFile.current) {
      inputFile.current.value = ''
    }
  }

  const addFiles = (fileList: FileWithFullPath[]) => {
    const noDuplicateFiles =
      files && files.length
        ? [...files, ...fileList.filter((file) => !files.some((f2) => f2.size === file.size && f2.name === file.name))]
        : fileList
    setFiles(noDuplicateFiles)
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
    if (isUploadInProgress || isUploadCompleted()) {
      return
    }
    const result = await getFilesFromDragEvent(event)
    addFiles(result)
  }

  const upload = async () => {
    if (!files) {
      return
    }
    setIsUploadInProgress(true)

    try {
      await repository.upload.fromFileList({
        parentPath: props.uploadPath,
        fileList: files as any,
        createFolders: true,
        binaryPropertyName: 'Binary',
        overwrite: false,
        progressObservable: progressObservable.current,
        requestInit: { signal: abortController.current.signal },
      })
    } catch (error) {
      logger.error({ message: 'Upload failed', data: error })
    } finally {
      setIsUploadInProgress(false)
    }
  }

  return (
    <>
      <DialogTitle disableTypography>
        <Typography variant="h6" align="center">
          {localization.title}
        </Typography>
        <IconButton
          disabled={isUploadInProgress}
          aria-label="close"
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
              <FileList files={files!} removeItem={removeItem} isUploadInProgress={isUploadInProgress} />
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
        ref={inputFile}
        type="file"
        multiple={true}
      />
      <Prompt when={isUploadInProgress} message={localization.blockNavigation} />
    </>
  )
}

export default UploadDialog
