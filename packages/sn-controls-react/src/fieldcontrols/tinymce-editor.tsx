/**
 * @module FieldControls
 */
import { CircularProgress, createStyles, FormHelperText, InputLabel, makeStyles, Typography } from '@material-ui/core'
import { deepMerge } from '@sensenet/client-utils'
import { renderHtml } from '@sensenet/editor-react'
import React, { lazy, Suspense } from 'react'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './client-field-setting'
import { defaultLocalization } from './localization'
const Editor = lazy(() => import('../editor-wrapper').then((module) => ({ default: module.TinymceEditor })))

const useStyles = makeStyles((theme) =>
  createStyles({
    richTextEditor: {
      padding: '9px',
      borderTopRightRadius: '4px',
      borderTopLeftRadius: '4px',
      borderBottom: theme.palette.type === 'light' ? '1px solid #878787' : '1px solid #bfbfbf',
      backgroundColor: theme.palette.type === 'light' ? '#e8e8e8' : '#272727',
    },
  }),
)

type RichTextEditorClassKey = Partial<ReturnType<typeof useStyles>>

interface ParsedRichTextFieldValue {
  text: string
  editor: string
}

const getFieldValue = (rawValue?: string) => {
  let value

  if (rawValue === undefined || rawValue === null) {
    return undefined
  }

  try {
    value = JSON.parse(rawValue) as ParsedRichTextFieldValue
  } catch (_) {
    return rawValue
  }

  try {
    return value.editor ? JSON.parse(value.editor) : value.text
  } catch (_) {
    return value.text
  }
}

/**
 * Field control that represents a LongText field. Available values will be populated from the FieldSettings.
 */
export const TinymceEditor: React.FC<
  ReactClientFieldSetting & { classes?: RichTextEditorClassKey; fieldValue?: string }
> = (props) => {
  const localization = deepMerge(defaultLocalization.richTextEditor, props.localization?.richTextEditor)

  const initialState =
    getFieldValue(props.fieldValue) ||
    (props.actionName === 'new' && changeTemplatedValue(props.settings.DefaultValue)) ||
    ''
  // const classes = useStyles(props)

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <div>
          <InputLabel htmlFor={props.settings.Name} required={props.settings.Compulsory}>
            {`${props.settings.DisplayName} (${props.settings.Name})`}
          </InputLabel>

          {/* <label htmlFor={props.settings.Name} style={{ fontSize: '15px' }}>
            {`${props.settings.DisplayName} (${props.settings.Name})`}
          </label> */}

          <Suspense
            fallback={
              <div style={{ textAlign: 'center' }}>
                <CircularProgress />
                <div>{localization.loading}</div>
              </div>
            }>
            <Editor
              initvalue={initialState}
              onChange={(content) => {
                props.fieldOnChange?.(props.settings.Name, content)
              }}
              repository={props.repository}
            />
          </Suspense>

          {!props.hideDescription && <FormHelperText>{props.settings.Description}</FormHelperText>}
        </div>
      )
    case 'browse':
    default:
      return (
        <div>
          <Typography variant="caption" gutterBottom={true}>
            {`${props.settings.DisplayName} (${props.settings.Name})`}
          </Typography>
          {initialState ? (
            <div
              dangerouslySetInnerHTML={{
                __html: typeof initialState === 'string' ? initialState : renderHtml(initialState),
              }}
            />
          ) : (
            <Typography variant="body1" gutterBottom={true}>
              {localization.noValue}
            </Typography>
          )}
        </div>
      )
  }
}
