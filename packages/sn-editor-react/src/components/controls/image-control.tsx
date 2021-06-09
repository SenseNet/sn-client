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
} from '@material-ui/core'
import ImageIcon from '@material-ui/icons/Image'
import { Editor } from '@tiptap/react'
import React, { FC, useRef, useState } from 'react'

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

  const imageToBase64 = async (image: File) => {
    return await new Promise<string>((resolve, reject) => {
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
      <IconButton onClick={handleClickOpen} {...buttonProps}>
        <ImageIcon />
      </IconButton>
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
        <DialogTitle id="form-dialog-title">Image insert</DialogTitle>
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              handleClose()
              addImage()
            }}
            color="primary">
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
