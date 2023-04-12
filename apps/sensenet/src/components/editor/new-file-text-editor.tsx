import { createStyles, Input, InputAdornment, makeStyles, Theme } from '@material-ui/core'
import { Help, Info } from '@material-ui/icons'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { PATHS } from '../../application-paths'
import { useLocalization } from '../../hooks'
import { getMonacoLanguage } from '../../services/content-context-service'
import { FullScreenLoader } from '../full-screen-loader'
import { ContentTypePreset } from './content-type-preset'
import { SnMonacoEditor, SnMonacoEditorProps } from './sn-monaco-editor'

export type NewFileTextEditorProps = Pick<SnMonacoEditorProps, 'handleCancel'> & {
  contentType: string
  savePath: string
  getFileName?: () => string
  loadContent?: () => Promise<string>
  getFileNameFromText?: (text: string) => string
  fileName: string
  setFileName?: Dispatch<SetStateAction<string>>
  fileNamePostfix?: string
  saveCallback?: Function
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    editorWrapper: {
      display: 'flex',
      overflow: 'hidden',
      position: 'relative',
      paddingTop: '8px',
    },
    presetsContainer: {
      width: '20%',
      '& .title': {
        fontSize: '1.2rem',
        marginBottom: '8px',
        height: '65px',
        display: 'flex',
        placeContent: 'center',
        flexWrap: 'wrap',
      },
      '& .presets': {
        display: 'flex',
        flexDirection: 'column',
        rowGap: '8px',
        padding: '8px',
      },
    },
    title: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      '& .hint-container': {
        display: 'flex',
        justifyContent: 'flex-end',
        fontSize: '0.8rem',
        opacity: 0.55,
        flex: 1,
        '& .hints': {
          display: 'flex',
          flexDirection: 'column',
          rowGap: '4px',
          alignItems: 'flex-start',
          justifyContent: 'center',
          textAlign: 'center',
          '& > .hint': {
            display: 'flex',
            alignItems: 'flex-end',
            columnGap: '4px',
          },
          '& b': {
            letterSpacing: theme.palette.type === 'light' ? 'initial' : '0.8px',
          },
          '& a': {
            textDecoration: 'underline',
          },
        },
      },
    },
  })
})

export const NewFileTextEditor: React.FunctionComponent<NewFileTextEditorProps> = (props) => {
  const repo = useRepository()
  const [textValue, setTextValue] = useState('')
  const [savedTextValue, setSavedTextValue] = useState('')
  const [language, setLanguage] = useState(getMonacoLanguage({ Type: props.contentType } as any, repo))
  const localization = useLocalization()
  const [uri, setUri] = useState<import('react-monaco-editor').monaco.Uri>()
  const [hasChanges, setHasChanges] = useState(false)
  const logger = useLogger('TextEditor')
  const [error, setError] = useState<Error | undefined>()
  const classes = useStyles()
  const { loadContent } = props
  const contentDisplayName = useMemo(
    () => repo.schemas.getSchemaByName(props.contentType).DisplayName,
    [props.contentType, repo.schemas],
  )

  const saveContent = async () => {
    const fileName = props.getFileNameFromText?.(textValue) ?? props.fileName
    try {
      setHasChanges(false)
      await repo.upload.textAsFile({
        text: textValue,
        parentPath: props.savePath,
        fileName: `${fileName}${props.fileNamePostfix ?? ''}`,
        overwrite: false,
        contentTypeName: props.contentType,
        binaryPropertyName: 'Binary',
      })
      logger.information({
        message: localization.textEditor.saveSuccessNotification.replace('{0}', fileName),
        data: {
          relatedRepository: repo.configuration.repositoryUrl,
          details: {
            text: textValue,
          },
        },
      })
      await repo.reloadSchema()
      setSavedTextValue(textValue)
      props.saveCallback?.()
    } catch (err) {
      setHasChanges(true)
      logger.error({
        message: err.message || localization.textEditor.saveFailedNotification.replace('{0}', fileName),
        data: {
          error: err,
        },
      })
    }
  }

  useEffect(() => {
    setHasChanges(textValue !== savedTextValue)
  }, [textValue, savedTextValue])

  useEffect(() => {
    ;(async () => {
      const { monaco } = await import('react-monaco-editor')
      setUri(monaco.Uri.parse(`sensenet://${props.contentType}`))
    })()
  }, [props.contentType])

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

  if (!uri) {
    return <FullScreenLoader />
  }
  const renderHint = () => {
    if (props.savePath === PATHS.contentTypes.snPath) {
      return (
        <div className="hint-container">
          <div className="hints">
            <div className="hint">
              {<Help fontSize="small" />}
              <div dangerouslySetInnerHTML={{ __html: localization.textEditor.hints.newContentTypeEditHint }} />
            </div>
            <div className="hint">
              {<Info fontSize="small" />}{' '}
              <div dangerouslySetInnerHTML={{ __html: localization.textEditor.hints.contentTypeTutorialrefenceHint }} />
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  //rendering buttons if contentType path
  const renderPresets = () => {
    if (props.savePath === PATHS.contentTypes.snPath) {
      return (
        <div className={classes.presetsContainer}>
          <ContentTypePreset setTextValue={setTextValue} />
        </div>
      )
    }
  }

  return (
    <div data-test="editor-wrapper" className={classes.editorWrapper}>
      <SnMonacoEditor
        language={language}
        textValue={textValue}
        setTextValue={setTextValue}
        savedTextValue={savedTextValue}
        hasChanges={hasChanges}
        uri={uri}
        handleSubmit={saveContent}
        handleCancel={props.handleCancel}
        renderTitle={() =>
          props.setFileName ? (
            <Input
              required={true}
              name={props.contentType}
              // fullWidth={true}
              type="text"
              value={props.fileName}
              onChange={(ev) => {
                props.setFileName!(ev.target.value)
              }}
              endAdornment={
                props.fileNamePostfix ? (
                  <InputAdornment position="end">{props.fileNamePostfix}</InputAdornment>
                ) : undefined
              }
            />
          ) : (
            <div className={classes.title}>
              New {contentDisplayName} {renderHint()}
            </div>
          )
        }
      />
      {renderPresets()}
    </div>
  )
}
