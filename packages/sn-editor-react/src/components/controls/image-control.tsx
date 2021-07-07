import {
  Button,
  CircularProgress,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  IconButtonProps,
  makeStyles,
  Tooltip,
} from '@material-ui/core'
import ImageIcon from '@material-ui/icons/Image'
import { Editor } from '@tiptap/react'
import React, { FC, useRef, useState } from 'react'
import { useLocalization } from '../../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    image: {
      maxWidth: '100%',
      height: 'auto',
    },
    fileName: {
      marginTop: '0.5rem',
      textAlign: 'center',
    },
  })
})

interface ImageControlProps {
  editor: Editor
  buttonProps?: Partial<IconButtonProps>
}

type ImageFile = File & { src?: string }

export const ImageControl: FC<ImageControlProps> = ({ buttonProps, editor }) => {
  const [open, setOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<ImageFile>()
  const [isUploadInProgress, setIsUploadInProgress] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const classes = useStyles()
  const localization = useLocalization()

  const handleClickOpen = () => {
    if (isUploadInProgress) {
      return
    }
    fileInput.current && fileInput.current.click()
  }

  const handleClose = () => {
    setOpen(false)
  }

  const addImage = () => {
    if (uploadedFile?.src) {
      editor.chain().focus().setImage({ src: uploadedFile.src }).run()
    }
  }

  const imageToBase64 = (image: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string)
        } else {
          reject(e)
        }
      }
      reader.readAsDataURL(image)
    })
  }

  const upload = async (fileToUpload: File) => {
    if (!fileToUpload) {
      return
    }

    setIsUploadInProgress(true)

    const imageSrc = await imageToBase64(fileToUpload)
    const image: ImageFile = new File([fileToUpload], fileToUpload.name, { type: fileToUpload.type })
    image.src = imageSrc

    setIsUploadInProgress(false)
    setUploadedFile(image)
  }

  return (
    <>
      <Tooltip title={localization.imageControl.title}>
        <IconButton onClick={handleClickOpen} {...buttonProps}>
          <ImageIcon />
        </IconButton>
      </Tooltip>
      <input
        onChange={(ev) => {
          setOpen(true)

          ev.target.files && upload(ev.target.files[0])
        }}
        style={{ display: 'none' }}
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple={false}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        onExited={() => {
          setUploadedFile(undefined)

          if (fileInput.current) {
            fileInput.current.value = ''
          }
        }}>
        <DialogTitle id="form-dialog-title">{localization.imageControl.title}</DialogTitle>
        <DialogContent>
          {uploadedFile ? (
            <>
              <img src={uploadedFile.src} alt="" className={classes.image} />
              <div className={classes.fileName}>{uploadedFile.name}</div>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <CircularProgress />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{localization.common.cancel}</Button>
          <Button
            onClick={() => {
              handleClose()
              addImage()
            }}
            color="primary">
            {localization.imageControl.submit}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
