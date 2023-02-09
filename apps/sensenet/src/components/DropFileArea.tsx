import { GenericContent } from '@sensenet/default-content-types'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import CloudUploadTwoTone from '@material-ui/icons/CloudUploadTwoTone'
import { clsx } from 'clsx'
import React, { CSSProperties, DragEvent, FunctionComponent, useState } from 'react'
import { useGlobalStyles } from '../globalStyles'
import { useDialog } from './dialogs'
import { getFilesFromDragEvent } from './dialogs/upload/helper'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    dropArea: {
      position: 'relative',
      filter: undefined,
      opacity: 1,
      transition:
        'opacity 300ms cubic-bezier(0.445, 0.050, 0.550, 0.950), filter 300ms cubic-bezier(0.445, 0.050, 0.550, 0.950)',
    },
    dragOverDropArea: {
      filter: 'blur(1px)',
      opacity: 0.8,
    },
    uploadDialog: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.primary.main,
      opacity: 0,
      zIndex: -1,
      transition: 'opacity 300ms cubic-bezier(0.445, 0.050, 0.550, 0.950)',
    },
    dragOverUploadDialog: {
      opacity: 0.1,
    },
  })
})

type Props = {
  parentContent?: GenericContent
  onDrop?: (event: DragEvent) => void
  style?: CSSProperties
}

export const DropFileArea: FunctionComponent<Props> = (props) => {
  const [isDragOver, setDragOver] = useState(false)
  const { openDialog } = useDialog()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  const onDrop = async (event: DragEvent) => {
    event.stopPropagation()
    event.preventDefault()
    setDragOver(false)
    // onDrop is used in the UploadDialog component
    if (!props.onDrop && props.parentContent) {
      const files = await getFilesFromDragEvent(event)
      openDialog({
        name: 'upload',
        props: { uploadPath: props.parentContent.Path, files },
        dialogProps: { open: true, fullScreen: true },
      })
    } else {
      props.onDrop?.(event)
    }
  }

  return (
    <>
      <div
        className={clsx(classes.dropArea, { [classes.dragOverDropArea]: isDragOver })}
        style={{
          ...props.style,
        }}
        onDragEnter={(ev) => {
          ev.stopPropagation()
          ev.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={(ev) => {
          ev.stopPropagation()
          ev.preventDefault()
          setDragOver(false)
        }}
        onDragOver={(ev) => {
          ev.stopPropagation()
          ev.preventDefault()
          setDragOver(true)
        }}
        onDrop={onDrop}>
        <div className={clsx(classes.uploadDialog, { [classes.dragOverUploadDialog]: isDragOver })}>
          <CloudUploadTwoTone className={globalClasses.full} />
        </div>
        {props.children}
      </div>
    </>
  )
}
