import React, { useState } from 'react'
import { match, useHistory } from 'react-router-dom'
import { navigateToAction } from '../../services'
import { NewFileTextEditor, NewFileTextEditorProps } from '../editor/new-file-text-editor'

export type NewTextFileProps = Pick<NewFileTextEditorProps, 'savePath' | 'loadContent' | 'getFileNameFromText'> & {
  contentTypeName: string
  routeMatch: match<any>
  fileExtension?: string
  isFileNameEditable?: boolean
}

export const NewTextFile: React.FunctionComponent<NewTextFileProps> = (props) => {
  const history = useHistory()
  const [fileName, setFileName] = useState('')

  return (
    <>
      <NewFileTextEditor
        contentType={props.contentTypeName}
        savePath={props.savePath}
        saveCallback={() => {
          navigateToAction({ history, routeMatch: props.routeMatch })
        }}
        handleCancel={() => {
          navigateToAction({ history, routeMatch: props.routeMatch })
        }}
        fileName={fileName}
        setFileName={props.isFileNameEditable ? setFileName : undefined}
        fileNamePostfix={props.fileExtension}
        loadContent={props.loadContent}
        getFileNameFromText={props.getFileNameFromText}
      />
    </>
  )
}
