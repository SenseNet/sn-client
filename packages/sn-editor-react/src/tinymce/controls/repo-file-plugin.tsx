import { Repository } from '@sensenet/client-core'
import { ReferencePicker } from '@sensenet/controls-react'
import React, { useEffect, useRef } from 'react'

interface RepoFilePluginControlProps {
  editor: any
  closeDialog: () => void
}

export const RepoFilePluginControl: React.FC<RepoFilePluginControlProps> = ({ editor, closeDialog }) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const handleInsert = (x: any) => {
    console.log('x:', x)
    const content = '<div>Repo file inserted!</div>'
    editor.execCommand('mceInsertContent', false, content)
    dialogRef.current?.close()
    closeDialog()
  }

  useEffect(() => {
    dialogRef.current?.showModal()

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      dialogRef.current?.close()
    }
  }, [])

  return (
    <dialog ref={dialogRef}>
      <ReferencePicker
        handleSubmit={(x) => handleInsert(x)}
        handleCancel={() => {
          dialogRef.current?.close()
          closeDialog()
        }}
        repository={new Repository()}
        classes={undefined}
        defaultValue={undefined}
        localization={undefined}
        path={''}
        fieldSettings={{
          Name: 'Name',
          Type: 'Type',
          FieldClassName: 'FieldClassName',
        }}
      />
    </dialog>
  )
}
