import { useRepository } from '@sensenet/hooks-react'
import CloudUploadTwoTone from '@material-ui/icons/CloudUploadTwoTone'
import React, { useState } from 'react'

export const DropFileArea: React.FunctionComponent<{
  uploadPath: string
  uploadsetdata: () => void
  notificationControll: (isOpen: boolean) => void
  setDragOver: (isOver: boolean) => void
  isDragOver: boolean
}> = (props) => {
  const repo = useRepository()
  const [scrollPosition, setScroll] = useState(0)

  return (
    <div
      className="dropfilearea"
      style={{
        display: 'inline-block',
        flexWrap: 'wrap',
        filter: props.isDragOver ? 'blur(1px)' : undefined,
        opacity: props.isDragOver ? 0.8 : 1,
        transition: 'opacity 300ms',
      }}
      onDragEnter={(ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        setScroll(window.pageYOffset)
        props.setDragOver(true)
      }}
      onDragLeave={(ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        props.setDragOver(false)
      }}
      onDragOver={(ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        props.setDragOver(true)
      }}
      onDrop={async (ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        props.setDragOver(false)
        await repo.upload.fromDropEvent({
          event: new DragEvent('drop', { dataTransfer: ev.dataTransfer }),
          binaryPropertyName: 'Binary',
          overwrite: true,
          createFolders: true,
          parentPath: props.uploadPath ? props.uploadPath : '',
          contentTypeName: 'Image',
        })
        props.uploadsetdata()
        props.notificationControll(true)
      }}>
      <div
        style={{
          width: 'auto',
          height: 'auto',
          backgroundColor: 'transparent',
          opacity: props.isDragOver ? 0.5 : 0,
          position: 'relative',
          transition: 'opacity 300ms',
        }}>
        <CloudUploadTwoTone
          style={{ width: '100%', position: 'absolute', marginTop: `${scrollPosition}px`, height: '250px' }}
        />
      </div>
      {props.children}
    </div>
  )
}
