/**
 * @module FieldControls
 */
import { deepMerge } from '@sensenet/client-utils'
import { createStyles, FormHelperText, InputLabel, makeStyles, Typography } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { changeTemplatedValue } from '../../helpers'
import { ReactClientFieldSetting } from '../client-field-setting'
import { defaultLocalization } from '../localization'
import { quillRegister } from './quill-register'

const useStyles = makeStyles(() =>
  createStyles({
    richTextEditor: {},
  }),
)

type RichTextEditorClassKey = Partial<ReturnType<typeof useStyles>>

const modules = {
  clipboard: {
    matchVisual: false,
  },
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
    ['image', 'link'],
    ['clean'], // remove formatting button
  ],
  oembed: true,
}

quillRegister()

/**
 * Field control that represents a LongText field. Available values will be populated from the FieldSettings.
 */
export const RichTextEditor: React.FC<ReactClientFieldSetting & { classes?: RichTextEditorClassKey }> = (props) => {
  const localization = deepMerge(defaultLocalization.richTextEditor, props.localization?.richTextEditor)

  const initialState =
    props.fieldValue || (props.actionName === 'new' && changeTemplatedValue(props.settings.DefaultValue)) || ''
  const [value, setValue] = useState(initialState)
  const quillRef = useRef<ReactQuill>(null)
  const classes = useStyles(props)

  const handleChange = (changedValue: string) => {
    setValue(changedValue)
    props.fieldOnChange?.(props.settings.Name, changedValue)
  }

  useEffect(() => {
    props.autoFocus && quillRef.current?.focus()
  }, [props.autoFocus])

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <div className={classes.richTextEditor}>
          <InputLabel shrink htmlFor={props.settings.Name} required={props.settings.Compulsory}>
            {props.settings.DisplayName}
          </InputLabel>
          <ReactQuill
            style={{ background: '#fff', marginTop: 10, color: '#000' }}
            placeholder={props.settings.DisplayName}
            readOnly={props.settings.ReadOnly}
            modules={modules}
            onChange={handleChange}
            value={value}
            theme="snow"
            ref={quillRef}
          />
          {!props.hideDescription && <FormHelperText>{props.settings.Description}</FormHelperText>}
        </div>
      )
    case 'browse':
    default:
      return (
        <div>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          {props.fieldValue ? (
            <div dangerouslySetInnerHTML={{ __html: props.fieldValue }} />
          ) : (
            <Typography variant="body1" gutterBottom={true}>
              {localization.noValue}
            </Typography>
          )}
        </div>
      )
  }
}
