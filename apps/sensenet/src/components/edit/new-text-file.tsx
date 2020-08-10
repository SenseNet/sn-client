import React, { useState } from 'react'
import { match, useHistory } from 'react-router-dom'
import { navigateToAction } from '../../services'
import { NewFileTextEditor, NewFileTextEditorProps } from './NewFileTextEditor'

export type NewTextFileProps = Pick<NewFileTextEditorProps, 'savePath' | 'loadContent' | 'getFileNameFromText'> & {
  contentTypeName: string
  routeMatch: match<any>
  defaultFileName?: string
  isFileNameEditable?: boolean
}

export const NewTextFile: React.FunctionComponent<NewTextFileProps> = (props) => {
  const history = useHistory()
  const [fileName, setFileName] = useState(props.defaultFileName || '')

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
        loadContent={props.loadContent}
        getFileNameFromText={props.getFileNameFromText}
      />
    </>
  )
}
