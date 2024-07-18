import { Editor, IAllProps } from '@tinymce/tinymce-react'
import React, { FC, useRef } from 'react'
import { Editor as TinyMCEEditor } from 'tinymce'

export interface TinymceEditorProps {
  onChange?: IAllProps['onEditorChange']
  initvalue?: string
}

export const TinymceEditor: FC<TinymceEditorProps> = (props) => {
  const editorRef = useRef<TinyMCEEditor | null>(null)
  return (
    <>
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={(_evt, editor) => (editorRef.current = editor)}
        initialValue={props.initvalue}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'preview',
            'help',
            'wordcount',
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
        onEditorChange={(e, editor) => {
          if (props.onChange) {
            props.onChange(e, editor)
          }
        }}
      />
    </>
  )
}
