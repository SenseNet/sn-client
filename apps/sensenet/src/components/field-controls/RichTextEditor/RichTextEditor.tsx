/**
 * @module FieldControls
 */
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import Typography from '@material-ui/core/Typography'
import React, { useState } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { changeJScriptValue } from '@sensenet/controls-react'
import { createStyles, InputLabel, makeStyles, Theme } from '@material-ui/core'
import { ReactClientFieldSetting } from '../ClientFieldSetting'
import QuillOEmbedModule from './QuillOEmbedModule'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    richTextEditor: {
      width: '85%',
      '& .ql-toolbar': {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.common.white : '#1e1e1e',
        borderColor: theme.palette.type === 'light' ? 'rgb(204, 204, 204)' : '#1e1e1e',
      },
      '& .ql-fill': {
        fill: theme.palette.type === 'light' ? '#444' : 'white',
      },
      '& .ql-stroke': {
        stroke: theme.palette.type === 'light' ? '#444' : 'white',
      },
      '& .ql-picker-label': {
        color: theme.palette.type === 'light' ? '#444' : 'white',
      },
      '& .ql-container': {
        minHeight: '124px',
      },
    },
  })
})

const modules = {
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

    ['clean'], // remove formatting button
  ],
  oembed: true,
}

Quill.register('modules/oembed', QuillOEmbedModule)

/**
 * Field control that represents a LongText field. Available values will be populated from the FieldSettings.
 */
export const RichTextEditor: React.FC<ReactClientFieldSetting> = props => {
  const initialState = props.fieldValue || changeJScriptValue(props.settings.DefaultValue) || ''
  const [value, setValue] = useState(initialState)
  const classes = useStyles()

  const handleChange = (changedValue: string) => {
    setValue(changedValue)
    props.fieldOnChange && props.fieldOnChange(props.settings.Name, changedValue)
  }

  switch (props.actionName) {
    case 'edit':
      return (
        <div className={classes.richTextEditor}>
          <InputLabel shrink htmlFor={props.settings.Name} required={props.settings.Compulsory}>
            {props.settings.DisplayName}
          </InputLabel>
          <ReactQuill
            style={{ background: '#fff', marginTop: 10, color: '#000' }}
            defaultValue={changeJScriptValue(props.settings.DefaultValue)}
            placeholder={props.settings.DisplayName}
            readOnly={props.settings.ReadOnly}
            modules={modules}
            onChange={handleChange}
            value={value}
            theme="snow"
          />
        </div>
      )
    case 'new':
      return (
        <FormControl component={'fieldset' as 'div'} fullWidth={true} required={props.settings.Compulsory}>
          <FormLabel component={'legend' as 'label'}>{props.settings.DisplayName}</FormLabel>
          <ReactQuill
            style={{ background: '#fff', marginTop: 10, color: '#000' }}
            defaultValue={changeJScriptValue(props.settings.DefaultValue)}
            placeholder={props.settings.DisplayName}
            readOnly={props.settings.ReadOnly}
            modules={modules}
            onChange={handleChange}
            value={value}
            theme="snow"
          />
        </FormControl>
      )
    case 'browse':
    default:
      return props.fieldValue ? (
        <div>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          <div dangerouslySetInnerHTML={{ __html: props.fieldValue }} />
        </div>
      ) : null
  }
}
