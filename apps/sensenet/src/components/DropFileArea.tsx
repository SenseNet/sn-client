import CloudUploadTwoTone from '@material-ui/icons/CloudUploadTwoTone'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useState } from 'react'
import { Redirect } from 'react-router'
import { useRepository } from '@sensenet/hooks-react'
import { useTheme } from '../hooks'
import { FileWithFullPath, getFilesFromDragEvent } from './dialogs/upload/helper'

type Props = {
  parentContent?: GenericContent
  onDrop?: (event: React.DragEvent) => void
  style?: React.CSSProperties
}

export const DropFileArea: React.FunctionComponent<Props> = props => {
  const [isDragOver, setDragOver] = useState(false)
  const repo = useRepository()
  const [files, setFiles] = useState<FileWithFullPath[]>()
  const theme = useTheme()

  const onDrop = async (event: React.DragEvent) => {
    event.stopPropagation()
    event.preventDefault()
    setDragOver(false)
    !props.onDrop && setFiles(await getFilesFromDragEvent(event))
    props.onDrop && props.onDrop(event)
  }

  if (files && props.parentContent) {
    return (
      <Redirect
        to={{
          state: { files },
          pathname: `/${btoa(repo.configuration.repositoryUrl)}/upload/${encodeURIComponent(props.parentContent.Path)}`,
        }}
      />
    )
  }

  return (
    <>
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
        onDrop={onDrop}>
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
    </>
  )
}
