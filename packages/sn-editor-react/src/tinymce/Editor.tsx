import { Editor, IAllProps } from '@tinymce/tinymce-react'
import React, { FC, useRef } from 'react'
import { type Editor as TinyMCEEditor } from 'tinymce'
// TinyMCE so the global var exists
import 'tinymce/tinymce'
// DOM model
import 'tinymce/models/dom/model'
// Theme
import 'tinymce/themes/silver'
// Toolbar icons
import 'tinymce/icons/default'
// Editor styles
import 'tinymce/skins/ui/oxide/skin'

// importing the plugin js.
// if you use a plugin that is not listed here the editor will fail to load
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/help'
import 'tinymce/plugins/help/js/i18n/keynav/en'
import 'tinymce/plugins/image'
import 'tinymce/plugins/importcss'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/quickbars'
import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/table'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/wordcount'
// importing plugin resources
import 'tinymce/plugins/emoticons/js/emojis'

import { RegisterPlugins } from './plugins'

export interface TinymceEditorProps {
  onChange?: IAllProps['onEditorChange']
  initvalue?: string
}

export const TinymceEditor: FC<TinymceEditorProps> = (props) => {
  const editorRef = useRef<TinyMCEEditor | null>(null)

  return (
    <>
      {/* @ts-ignore*/}
      <Editor
        licenseKey="gpl"
        onInit={(_evt, editor) => {
          editorRef.current = editor
        }}
        initialValue={props.initvalue}
        init={{
          file_picker_types: 'image',
          /* and here's our custom image picker*/
          file_picker_callback: (cb, _value, _meta) => {
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'image/*')

            input.addEventListener('change', (e) => {
              let file: any
              if (e.target !== null) {
                file = (e.target as any).files[0]
              }

              const reader = new FileReader()
              reader.addEventListener('load', () => {
                /*
                  Note: Now we need to register the blob in TinyMCEs image blob
                  registry. In the next release this part hopefully won't be
                  necessary, as we are looking to handle it internally.
                */
                const id = `blobid${new Date().getTime()}`
                const { blobCache } = editorRef.current?.editorUpload || {}
                const base64 = (reader.result as any).split(',')[1]
                const blobInfo = blobCache?.create(id, file, base64)
                blobCache?.add(blobInfo!)

                /* call the callback and populate the Title field with the file name */
                cb(blobInfo?.blobUri() || '', { title: file.name })
              })
              reader.readAsDataURL(file)
            })

            input.click()
          },
          height: 500,
          menubar: true,
          automatic_uploads: true,
          image_title: true,
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
          setup: (editor) => {
            RegisterPlugins({ editor })
          },
          menu: {
            file: {
              title: 'File',
              items:
                'newdocument restoredraft | preview | importword exportpdf exportword | print | deleteallconversations',
            },
            edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
            view: {
              title: 'View',
              items:
                'code revisionhistory | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments',
            },
            insert: {
              title: 'Insert',
              items:
                'InsertAccordion link media addcomment pageembed codesample inserttable | math | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime',
            },
            format: {
              title: 'Format',
              items:
                'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat',
            },
            tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
            table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
            help: { title: 'Help', items: 'help' },
            custom: {
              title: 'test',
              items: 'help',
            },
          },
          toolbar:
            'fontselect | fontsizeselect | forecolor | backcolor | bold | italic | underline | alignleft | aligncenter | alignright | alignjustify | bullist | numlist | outdent | indent | link | image | print | media | code',
          tools: 'inserttable',
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px } .tox .tox-promotion{ display:none!important}',
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
