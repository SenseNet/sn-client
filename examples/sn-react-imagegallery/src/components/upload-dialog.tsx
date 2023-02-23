import {
  Button,
  createStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import { AddAPhoto, Close } from '@material-ui/icons'
import { ConstantContent, UploadProgressInfo } from '@sensenet/client-core'
import { ObservableValue } from '@sensenet/client-utils'
import { useRepository } from '@sensenet/hooks-react'
import React, { FunctionComponent, useRef, useState } from 'react'
import { Prompt } from 'react-router'
import { FileList } from './file-list'

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
      height: '300px',
      border: 'dashed',
      borderColor: theme.palette.grey[500],
      color: theme.palette.grey[600],
      marginBottom: theme.spacing(2),
      overflowY: 'auto',
      padding: theme.spacing(4),
    },
    body1: {
      marginTop: '1rem',
      textAlign: 'center',
      fontSize: '1.5rem',
    },
  }),
)

export type FileWithFullPath = File & { fullPath?: string; progress?: UploadProgressInfo }

interface UploadDialogProps {
  open: boolean
  onClose: () => void
  uploadCallback?: () => void
}

export const UploadDialog: FunctionComponent<UploadDialogProps> = (props) => {
  const classes = useStyles()
  const repository = useRepository()
  const inputFile = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<FileWithFullPath[]>()
  const [isUploadInProgress, setIsUploadInProgress] = useState(false)
  const progressObservable = useRef(new ObservableValue<UploadProgressInfo>())
  const abortController = useRef(new AbortController())

  const isFileAdded = !!files?.length

  const addFiles = (fileList: FileWithFullPath[]) => {
    const noDuplicateFiles = files?.length
      ? [...files, ...fileList.filter((file) => !files.some((f2) => f2.size === file.size && f2.name === file.name))]
      : fileList
    setFiles(noDuplicateFiles)
  }

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

  const isUploadCompleted = () => {
    return (
      files?.length &&
      files.every((file) => {
        return file.progress && (file.progress.completed || file.progress.error)
      })
    )
  }

  const upload = async () => {
    if (!files) {
      return
    }
    setIsUploadInProgress(true)

    try {
      await repository.upload.fromFileList({
        parentPath: `${ConstantContent.PORTAL_ROOT.Path}/Content/IT/ImageLibrary`,
        fileList: files as any,
        createFolders: true,
        binaryPropertyName: 'Binary',
        overwrite: false,
        progressObservable: progressObservable.current,
        requestInit: { signal: abortController.current.signal },
      })
      setFiles(undefined)
      props.uploadCallback?.()
    } catch (error) {
      console.error({ message: 'Upload failed', data: { error } })
    } finally {
      setIsUploadInProgress(false)
      handleDialogClose()
    }
  }
  const handleDialogClose = () => {
    props.onClose()
  }

  return (
    <Dialog onClose={handleDialogClose} aria-labelledby="upload-dialog-title" open={props.open}>
      <DialogTitle disableTypography>
        <Typography variant="h6" align="center" id="upload-dialog-title">
          Upload photos
        </Typography>
        <IconButton
          disabled={isUploadInProgress}
          aria-label="close"
          data-test="dialog-close"
          className={classes.closeButton}
          onClick={handleDialogClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
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
              <AddAPhoto className={classes.icon} />
              <Typography variant="body1" className={classes.body1}>
                Select photos to upload
              </Typography>
            </>
          )}
        </Grid>
        <Grid container justify="flex-end">
          {isUploadCompleted() ? null : (
            <Button
              data-test="btn-upload"
              aria-label="Upload"
              color="primary"
              disabled={isUploadInProgress}
              variant="contained"
              onClick={() => upload()}>
              Upload
            </Button>
          )}
        </Grid>
      </DialogContent>
      <input
        onChange={(ev) => {
          ev.target.files && addFiles([...(ev.target.files as any)])
        }}
        style={{ display: 'none' }}
        ref={inputFile}
        type="file"
        accept="image/*"
        data-test="input-file"
        multiple={true}
      />
      <Prompt when={isUploadInProgress} message="Upload is in progress. Do you want to navigate away anyway?" />
    </Dialog>
  )
}
