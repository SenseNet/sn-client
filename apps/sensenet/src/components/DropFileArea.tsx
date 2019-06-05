import CloudUploadTwoTone from '@material-ui/icons/CloudUploadTwoTone'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useState } from 'react'
import { useInjector, useRepository, useTheme } from '../hooks'
import { UploadTracker } from '../services/UploadTracker'

export const DropFileArea: React.FunctionComponent<{ parent: GenericContent; style?: React.CSSProperties }> = props => {
  const [isDragOver, setDragOver] = useState(false)
  const injector = useInjector()
  const repo = useRepository()
  const theme = useTheme()

  return (
    <div
      style={{
        position: 'relative',
        filter: isDragOver ? 'blur(1px)' : undefined,
        opacity: isDragOver ? 0.8 : 1,
        transition:
          'opacity 300ms cubic-bezier(0.445, 0.050, 0.550, 0.950), filter 300ms cubic-bezier(0.445, 0.050, 0.550, 0.950)',
        ...props.style,
      }}
      onDragEnter={ev => {
        ev.stopPropagation()
        ev.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={ev => {
        ev.stopPropagation()
        ev.preventDefault()
        setDragOver(false)
      }}
      onDragOver={ev => {
        ev.stopPropagation()
        ev.preventDefault()
        setDragOver(true)
      }}
      onDrop={ev => {
        ev.stopPropagation()
        ev.preventDefault()
        setDragOver(false)
        repo.upload.fromDropEvent({
          binaryPropertyName: 'Binary',
          createFolders: true,
          event: new DragEvent('drop', { dataTransfer: ev.dataTransfer }),
          overwrite: false,
          parentPath: props.parent ? props.parent.Path : '',
          progressObservable: injector.getInstance(UploadTracker).onUploadProgress,
        })
      }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: theme.palette.primary.main,
          opacity: isDragOver ? 0.1 : 0,
          position: 'absolute',
          zIndex: -1,
          transition: 'opacity 300ms cubic-bezier(0.445, 0.050, 0.550, 0.950)',
        }}>
        <CloudUploadTwoTone style={{ width: '100%', height: '100%' }} />
      </div>
      {props.children}
    </div>
  )
}
