import { useLogger, useRepository } from '@sensenet/hooks-react'
import { createStyles, makeStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import clsx from 'clsx'
import { Uri } from 'monaco-editor'
import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { Prompt, useHistory } from 'react-router'
import { ResponsiveContext } from '../../context'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization, useTheme } from '../../hooks'
import { getMonacoLanguage } from '../../services/content-context-service'
import { ShortTextInput } from '../field-controls/ShortText'

const useStyles = makeStyles(() => {
  return createStyles({
    actionButtonWrapper: {
      height: '80px',
      width: '100%',
      position: 'absolute',
      padding: '20px',
      bottom: 0,
      textAlign: 'right',
    },
  })
})

export interface NewFileTextEditorProps {
  contentType: string
  savePath: string
  getFileName?: () => string
  loadContent?: () => Promise<string>
  additionalButtons?: JSX.Element
  handleCancel?: () => void
  getFileNameFromText?: (text: string) => string
  fileName: string
  setFileName?: Dispatch<SetStateAction<string>>
  saveCallback?: Function
}

export const NewFileTextEditor: React.FunctionComponent<NewFileTextEditorProps> = (props) => {
  const theme = useTheme()
  const platform = useContext(ResponsiveContext)
  const repo = useRepository()
  const [textValue, setTextValue] = useState('')
  const [savedTextValue, setSavedTextValue] = useState('')
  const [language, setLanguage] = useState(getMonacoLanguage({ Type: props.contentType } as any, repo))
  const localization = useLocalization()
  const uri = Uri.parse(`sensenet://${props.contentType}`)
  const [hasChanges, setHasChanges] = useState(false)
  const logger = useLogger('TextEditor')
  const [error, setError] = useState<Error | undefined>()
  const globalClasses = useGlobalStyles()
  const classes = useStyles()
  const history = useHistory()
  const { loadContent } = props
  const formSubmitButton = useRef<HTMLButtonElement>(null)

  const saveContent = async () => {
    const fileName = props.getFileNameFromText?.(textValue) ?? props.fileName
    try {
      await repo.upload.textAsFile({
        text: textValue,
        parentPath: props.savePath,
        fileName,
        overwrite: false,
        contentTypeName: props.contentType,
        binaryPropertyName: 'Binary',
      })
      logger.information({
        message: localization.textEditor.saveSuccessNotification.replace('{0}', fileName),
        data: {
          relatedRepository: repo.configuration.repositoryUrl,
          compare: {
            old: savedTextValue,
            new: textValue,
          },
        },
      })
      await repo.reloadSchema()
      setSavedTextValue(textValue)
      props.saveCallback?.()
    } catch (err) {
      logger.error({
        message: localization.textEditor.saveFailedNotification.replace('{0}', fileName),
        data: {
          details: { error: err },
        },
      })
    }
  }

  useEffect(() => {
    setHasChanges(textValue !== savedTextValue)
  }, [textValue, savedTextValue])

  useEffect(() => {
    setLanguage(getMonacoLanguage({ Type: props.contentType } as any, repo))
  }, [props.contentType, repo])

  useEffect(() => {
    ;(async () => {
      try {
        if (loadContent) {
          const value = await loadContent()
          setTextValue(value)
          setSavedTextValue(value)
        }
      } catch (err) {
        setError(err)
      }
    })()
  }, [loadContent])

  if (error) {
    logger.information({
      message: localization.textEditor.saveFailedNotification,
      data: error,
    })
    return null
  }

  return (
    <form
      style={{ width: '100%', height: '100%' }}
      onSubmit={(ev) => {
        ev.preventDefault()
        saveContent()
      }}
      onKeyDown={async (ev) => {
        if (ev.key.toLowerCase() === 's' && ev.ctrlKey) {
          try {
            ev.preventDefault()
            formSubmitButton.current?.click()
          } catch {
            /** */
          }
        }
      }}>
      <div
        className={clsx([globalClasses.centeredVertical])}
        style={{
          height: globals.common.drawerItemHeight,
          paddingLeft: '15px',
          justifyContent: 'space-between',
        }}>
        {props.setFileName ? (
          <ShortTextInput
            required={true}
            name={props.contentType}
            fullWidth={true}
            type="text"
            value={props.fileName}
            onChange={(ev) => {
              props.setFileName!(ev.target.value)
            }}
          />
        ) : (
          <div style={{ fontSize: '20px' }}>New {props.contentType}</div>
        )}
        <div
          style={{
            display: 'flex',
            marginRight: '1em',
          }}>
          {props.additionalButtons || null}
          <Button
            aria-label={localization.textEditor.reset}
            disabled={!hasChanges}
            onClick={() => setTextValue(savedTextValue)}>
            {localization.textEditor.reset}
          </Button>
        </div>
      </div>
      <Prompt when={textValue !== savedTextValue} message={localization.textEditor.unsavedChangesWarning} />
      <MonacoEditor
        theme={theme.palette.type === 'dark' ? 'admin-ui-dark' : 'vs-light'}
        width="100%"
        language={language}
        value={textValue}
        onChange={(v) => setTextValue(v)}
        options={{
          readOnly: platform === 'mobile',
          automaticLayout: true,
          minimap: {
            enabled: platform === 'desktop' ? true : false,
          },
        }}
        editorDidMount={(editor, monaco) => {
          if (!monaco.editor.getModel(uri)) {
            const m = monaco.editor.createModel(textValue, language, uri)
            editor.setModel(m)
          } else {
            editor.setModel(monaco.editor.getModel(uri))
            editor.setValue(textValue)
          }
        }}
        editorWillMount={(monaco) => {
          monaco.editor.defineTheme('admin-ui-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
              'editor.background': '#121212',
            },
          })
        }}
      />
      <div className={classes.actionButtonWrapper}>
        <Button
          aria-label={localization.forms.cancel}
          color="default"
          className={globalClasses.cancelButton}
          onClick={props.handleCancel || history.goBack}>
          {localization.forms.cancel}
        </Button>

        <Button
          aria-label={localization.forms.submit}
          variant="contained"
          color="primary"
          type="submit"
          ref={formSubmitButton}
          disabled={!hasChanges}>
          {localization.forms.submit}
        </Button>
      </div>
    </form>
  )
}
