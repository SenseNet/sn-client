/**
 * @module FieldControls
 */
import { CircularProgress, createStyles, FormHelperText, makeStyles, Typography } from '@material-ui/core'
import { deepMerge } from '@sensenet/client-utils'
import { renderHtml } from '@sensenet/editor-react'
import React, { lazy, Suspense } from 'react'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './client-field-setting'
import CustomLabel from './label/custom-label'
import { defaultLocalization } from './localization'

const Editor = lazy(() => import('../editor-wrapper'))

const useStyles = makeStyles((theme) =>
  createStyles({
    richTextEditor: {
      border: theme.palette.type === 'light' ? '1px solid #DBDBDB' : '1px solid #2c2c2c',
      borderRadius: '4px 4px 0 0',
      '&:hover': {
        border: '1px solid #666',
      },
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
export const RichTextEditor: React.FC<
  ReactClientFieldSetting & { classes?: RichTextEditorClassKey; fieldValue?: string }
> = (props) => {
  const localization = deepMerge(defaultLocalization.richTextEditor, props.localization?.richTextEditor)

  const initialState =
    getFieldValue(props.fieldValue) ||
    (props.actionName === 'new' && changeTemplatedValue(props.settings.DefaultValue)) ||
    ''

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <>
          <CustomLabel
            name={props.settings.Name}
            displayName={props.settings.DisplayName}
            highlighted={props.settings.Customization?.Highlighted}
          />
          <Suspense
            fallback={
              <div style={{ textAlign: 'center' }}>
                <CircularProgress />
                <div>{localization.loading}</div>
              </div>
            }>
            <Editor
              content={initialState}
              autofocus={props.autoFocus}
              placeholder={props.settings.DisplayName}
              readOnly={props.settings.ReadOnly}
              localization={props.localization?.richTextEditor}
              onChange={({ editor }) => {
                if (props.settings.ControlHint === 'sn:RichText' || props.settings.ControlHint === 'sn:TipTapEditor') {
                  props.fieldOnChange?.(props.settings.Name, editor.getHTML())
                  return
                }

                props.fieldOnChange?.(props.settings.Name, {
                  text: editor.getHTML(),
                  editor: JSON.stringify(editor.getJSON()),
                })
              }}
            />
          </Suspense>

          {!props.hideDescription && <FormHelperText>{props.settings.Description}</FormHelperText>}
        </>
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
