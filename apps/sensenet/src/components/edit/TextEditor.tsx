import { Repository } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { ActionModel, GenericContent, Settings, File as SnFile } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { createStyles, makeStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import clsx from 'clsx'
import { Uri } from 'monaco-editor'
import React, { useContext, useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { Prompt, useHistory } from 'react-router'
import { ResponsiveContext } from '../../context'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization, useTheme } from '../../hooks'
import { getMonacoLanguage } from '../../services/content-context-service'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'

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

export const getMonacoModelUri = (content: GenericContent, repo: Repository, action?: ActionModel) => {
  if (repo.schemas.isContentFromType<Settings>(content, 'Settings') || content.Type === 'PersonalSettings') {
    return Uri.parse(`sensenet://${content.Type}/${content.Name}`)
  }
  if (repo.schemas.isContentFromType<SnFile>(content, 'File')) {
    if (content.Binary) {
      return Uri.parse(`sensenet://${content.Type}/${content.Binary.__mediaresource.content_type}`)
    }
  }

  if (action) {
    return Uri.parse(`sensenet://${content.Type}/${action.Url}`)
  }

  return Uri.parse(`sensenet://${content.Type}`)
}

export interface TextEditorProps {
  content: SnFile
  loadContent?: (content: SnFile) => Promise<string>
  saveContent?: (content: SnFile, value: string) => Promise<void>
  additionalButtons?: JSX.Element
  showBreadCrumb: boolean
  handleCancel?: () => void
}

export const TextEditor: React.FunctionComponent<TextEditorProps> = (props) => {
  const theme = useTheme()
  const platform = useContext(ResponsiveContext)
  const repo = useRepository()
  const [textValue, setTextValue] = useState('')
  const [savedTextValue, setSavedTextValue] = useState('')
  const [language, setLanguage] = useState(getMonacoLanguage(props.content, repo))
  const localization = useLocalization()
  const [uri, setUri] = useState<any>(getMonacoModelUri(props.content, repo))
  const [hasChanges, setHasChanges] = useState(false)
  const logger = useLogger('TextEditor')
  const [error, setError] = useState<Error | undefined>()
  const globalClasses = useGlobalStyles()
  const classes = useStyles()
  const history = useHistory()

  const saveContent = async () => {
    try {
      if (props.saveContent) {
        await props.saveContent(props.content, textValue)
      } else {
        await repo.upload.textAsFile({
          text: textValue,
          parentPath: PathHelper.getParentPath(props.content.Path),
          fileName: props.content.Name,
          overwrite: true,
          contentTypeName: props.content.Type,
          binaryPropertyName: 'Binary',
        })
      }
      logger.information({
        message: localization.textEditor.saveSuccessNotification.replace(
          '{0}',
          props.content.DisplayName || props.content.Name,
        ),
        data: {
          relatedContent: props.content,
          relatedRepository: repo.configuration.repositoryUrl,
          compare: {
            old: savedTextValue,
            new: textValue,
          },
        },
      })
      await repo.reloadSchema()
      setSavedTextValue(textValue)
    } catch (err) {
      logger.error({
        message: localization.textEditor.saveFailedNotification.replace(
          '{0}',
          props.content.DisplayName || props.content.Name,
        ),
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
    setUri(getMonacoModelUri(props.content, repo))
    setLanguage(getMonacoLanguage(props.content, repo))
  }, [props.content, repo])

  useEffect(() => {
    setUri(getMonacoModelUri(props.content, repo))
    setLanguage(getMonacoLanguage(props.content, repo))
    ;(async () => {
      try {
        if (props.loadContent) {
          const value = await props.loadContent(props.content)
          setTextValue(value)
          setSavedTextValue(value)
        } else {
          const binaryPath = props.content.Binary && props.content.Binary.__mediaresource.media_src
          if (!binaryPath) {
            return
          }
          const textFile = await repo.fetch(PathHelper.joinPaths(repo.configuration.repositoryUrl, binaryPath))
          if (textFile.ok) {
            const text = await textFile.text()
            setTextValue(text)
            setSavedTextValue(text)
          }
        }
      } catch (err) {
        setError(err)
      }
    })()
  }, [props, repo])

  if (error) {
    logger.information({
      message: localization.textEditor.saveFailedNotification,
      data: error,
    })
    return null
  }

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      onKeyDown={async (ev) => {
        if (ev.key.toLowerCase() === 's' && ev.ctrlKey) {
          try {
            ev.preventDefault()
            saveContent()
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
        {props.showBreadCrumb ? <ContentBreadcrumbs /> : <div style={{ fontSize: '20px' }}>{props.content.Name}</div>}

        <div
          style={{
            display: 'flex',
            marginRight: '1em',
          }}>
          {props.additionalButtons ? props.additionalButtons : null}
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
          disabled={!hasChanges}
          onClick={() => {
            saveContent()
          }}>
          {localization.forms.submit}
        </Button>
      </div>
    </div>
  )
}
