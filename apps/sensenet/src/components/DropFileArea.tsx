import CloudUploadTwoTone from '@material-ui/icons/CloudUploadTwoTone'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useState, useEffect } from 'react'
import { UploadProgressInfo } from '@sensenet/client-core'
import { ObservableValue } from '@sensenet/client-utils'
import { useInjector, useRepository, useTheme } from '../hooks'
import { UploadTracker } from '../services/UploadTracker'

export const DropFileArea: React.FunctionComponent<{ parent: GenericContent; style?: React.CSSProperties }> = props => {
  const [isDragOver, setDragOver] = useState(false)

  const injector = useInjector()
  const repo = useRepository()
  const theme = useTheme()
  const [progressObservable] = useState(new ObservableValue<UploadProgressInfo>())

  useEffect(() => {
    const subscription = progressObservable.subscribe(p =>
      injector.getInstance(UploadTracker).onUploadProgress.setValue({ progress: p, repo }),
    )
    return () => subscription.dispose()
  }, [injector, progressObservable, repo])

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
          progressObservable,
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
