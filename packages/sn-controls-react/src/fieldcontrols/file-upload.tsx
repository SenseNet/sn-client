/**
 * @module FieldControls
 */
import {
  Button,
  createStyles,
  FormControl,
  Input,
  InputLabel,
  makeStyles,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core'
import CloudDownload from '@material-ui/icons/CloudDownload'
import { Content } from '@sensenet/client-core'
import { deepMerge, PathHelper } from '@sensenet/client-utils'
import { BinaryFieldSetting } from '@sensenet/default-content-types'
import { downloadFile, useRepository } from '@sensenet/hooks-react'
import React, { useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { ReactClientFieldSetting } from './client-field-setting'
import CustomLabel from './label/custom-label'
import { defaultLocalization } from './localization'

const useStyles = makeStyles(() => {
  return createStyles({
    binaryContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    editActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    downloadContainer: {
      cursor: 'pointer',
    },
    downloadButton: {
      minWidth: 'unset',
    },
    downloadIcon: {
      fontSize: '23px',
    },
    textDate: {
      fontSize: '0.66rem',
      letterSpacing: '0.5px',
      marginLeft: '5px',
      verticalAlign: 'middle',
    },
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    label: {
      padding: 0,
      fontSize: '12px',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      lineHeight: 1,
    },
    value: {
      fontStyle: 'italic',
      margin: '5px 0',
    },
    inputLabel: {
      position: 'relative',
      transform: 'none',
    },
    editorContainer: {
      width: '100%',
      height: '420px',
      marginTop: '10px',
    },
  })
})

interface FileName {
  IsValid: boolean
  FullFileName: string
  FileNameWithoutExtension: string
  Extension: string
}

interface Binary {
  IsEmpty: boolean
  IsModified: boolean
  Id: number
  FileId: number
  Size: number
  FileName: FileName
  ContentType: string
  Checksum?: any
  Timestamp: number
  BlobProvider?: any
  BlobProviderData?: any
}

const textBinaryFieldValueMarker = 'sensenet:text-binary-field-value'

export type TextBinaryFieldValue = {
  __type: typeof textBinaryFieldValueMarker
  text: string
  fileName: string
}

export const isTextBinaryFieldValue = (value: unknown): value is TextBinaryFieldValue =>
  typeof value === 'object' &&
  value !== null &&
  (value as Partial<TextBinaryFieldValue>).__type === textBinaryFieldValueMarker

const createTextBinaryFieldValue = (text: string, fileName: string): TextBinaryFieldValue => ({
  __type: textBinaryFieldValueMarker,
  text,
  fileName,
})

export const errorMessages = {
  repository: 'You must pass a repository to this control.',
  contentToFetch: 'There needs to be a content to get the name of the binary field.',
  contentToUpload: 'There needs to be a content to be able to upload.',
}

const getTextBinaryLanguage = (fileName: string, contentType?: string) => {
  switch (contentType) {
    case 'application/json':
      return 'json'
    case 'application/x-javascript':
    case 'text/javascript':
      return 'javascript'
    case 'text/css':
      return 'css'
    case 'text/html':
      return 'html'
    case 'text/xml':
    case 'application/xml':
      return 'xml'
    default:
  }

  const lowerFileName = fileName.toLocaleLowerCase()

  if (lowerFileName.endsWith('.json')) {
    return 'json'
  }
  if (lowerFileName.endsWith('.ts') || lowerFileName.endsWith('.tsx')) {
    return 'typescript'
  }
  if (lowerFileName.endsWith('.js') || lowerFileName.endsWith('.jsx')) {
    return 'javascript'
  }
  if (lowerFileName.endsWith('.css')) {
    return 'css'
  }
  if (lowerFileName.endsWith('.html') || lowerFileName.endsWith('.htm')) {
    return 'html'
  }
  if (lowerFileName.endsWith('.xml') || lowerFileName.endsWith('.contenttype')) {
    return 'xml'
  }

  return 'plaintext'
}

/**
 * Field control that represents a FileUpload field. Available values will be populated from the FieldSettings.
 */
export const FileUpload: React.FC<ReactClientFieldSetting<BinaryFieldSetting>> = (props) => {
  const localization = deepMerge(defaultLocalization.fileUpload, props.localization?.fileUpload)

  const repo = useRepository()
  const activeRepository = props.repository || repo
  const theme = useTheme()
  const binaryFieldValue = props.fieldValue as any
  const mediaResource = binaryFieldValue?.__mediaresource
  const isTextBinary = props.settings.IsText === true || String(props.settings.IsText).toLocaleLowerCase() === 'true'

  const [fileName, setFileName] = useState<string>('')
  const [textValue, setTextValue] = useState<string>('')
  const [isTextLoading, setIsTextLoading] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    const ac = new AbortController()

    ;(async () => {
      try {
        if (!props.repository) {
          throw new Error(errorMessages.repository)
        }
        if (!props.content) {
          throw new Error(errorMessages.contentToFetch)
        }
        const loadPath = PathHelper.joinPaths(PathHelper.getContentUrl(props.content.Path), '/', props.settings.Name)
        const binaryField = await props.repository.load<{ Binary: Binary } & Content>({
          idOrPath: loadPath,
          requestInit: { signal: ac.signal },
        })

        const binaryData = Object.values(binaryField.d)[0] as Binary

        setFileName(binaryData.FileName.FullFileName)
      } catch (error) {
        console.error(error.message)
      }
    })()
    return () => ac.abort()
  }, [props.content, props.repository, props.settings.Name])

  useEffect(() => {
    const ac = new AbortController()

    ;(async () => {
      if (!isTextBinary || props.actionName !== 'edit') {
        return
      }

      const binaryPath = mediaResource?.media_src

      if (!props.repository || !binaryPath) {
        setTextValue('')
        return
      }

      try {
        setIsTextLoading(true)
        const response = await props.repository.fetch(
          PathHelper.joinPaths(props.repository.configuration.repositoryUrl, binaryPath),
          {
            signal: ac.signal,
          },
        )

        if (response.ok) {
          const text = await response.text()

          if (!ac.signal.aborted) {
            setTextValue(text)
          }
        }
      } catch (error) {
        if (!ac.signal.aborted) {
          console.error(error.message)
        }
      } finally {
        if (!ac.signal.aborted) {
          setIsTextLoading(false)
        }
      }
    })()

    return () => ac.abort()
  }, [isTextBinary, mediaResource?.media_src, props.actionName, props.repository])

  /**
   * returns a name from the given path
   */
  const getNameFromPath = (path: string) => path.replace(/^.*[\\/]/, '')

  /**
   * handles change event on the fileupload input
   */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!props.repository) {
        throw new Error(errorMessages.repository)
      }
      if (!props.content) {
        throw new Error(errorMessages.contentToUpload)
      }
      e.persist()
      if (!e.target.files) {
        return
      }
      await props.repository.upload.file({
        parentPath: PathHelper.getParentPath(props.content.Path),
        file: e.target.files[0],
        fileName: props.content.Name,
        overwrite: true,
        contentTypeName: props.content.Type,
        binaryPropertyName: props.settings.Name,
      })

      const newValue = `${getNameFromPath(e.target.value)}?t=${Date.now()}`
      setFileName(newValue)

      if (isTextBinary && e.target.files[0]) {
        const text = await e.target.files[0].text()
        setTextValue(text)
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleTextChange = (value: string) => {
    setTextValue(value)
    props.fieldOnChange?.(
      props.settings.Name,
      createTextBinaryFieldValue(value, fileName || props.content?.Name || props.settings.Name),
    )
  }

  const handleDownload = () => {
    if (!mediaResource?.media_src) {
      return
    }

    downloadFile(
      fileName || props.content?.Name || props.settings.Name,
      mediaResource.media_src,
      activeRepository.configuration.repositoryUrl,
      activeRepository.configuration.token,
    )
  }

  const renderDownloadButton = () => (
    <Tooltip title={mediaResource?.media_src ? fileName : localization.noValue}>
      <span>
        <Button
          data-test="download-button"
          className={classes.downloadButton}
          onClick={handleDownload}
          disabled={!mediaResource?.media_src}
          aria-label={localization.downloadButtonText}
          variant="contained"
          component="span"
          color="primary">
          <CloudDownload className={classes.downloadIcon} />
        </Button>
      </span>
    </Tooltip>
  )

  const language = getTextBinaryLanguage(fileName || props.content?.Name || '', mediaResource?.content_type)

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <FormControl
          className={classes.root}
          key={props.settings.Name}
          component={'fieldset' as 'div'}
          required={props.settings.Compulsory}>
          <CustomLabel
            name={props.settings.Name}
            displayName={props.settings.DisplayName}
            highlighted={props.settings.Customization?.Highlighted}
            description={props.settings.Description}
            showDescription={!props.hideDescription}
          />
          <Typography variant="body1" gutterBottom={true}>
            {fileName}
          </Typography>
          <div className={classes.editActions}>
            <InputLabel className={classes.inputLabel} htmlFor={`raised-button-file-${props.settings.Name}`}>
              <Button aria-label={localization.buttonText} variant="contained" component="span" color="primary">
                {localization.buttonText}
              </Button>
            </InputLabel>
            {renderDownloadButton()}
          </div>
          <Input
            style={{ display: 'none' }}
            id={`raised-button-file-${props.settings.Name}`}
            type="file"
            onChange={handleUpload}
          />
          {isTextBinary && props.actionName === 'edit' ? (
            <div className={classes.editorContainer} data-test="binary-text-editor">
              {isTextLoading ? (
                <Typography variant="caption">{'Loading...'}</Typography>
              ) : (
                <MonacoEditor
                  width="100%"
                  height="100%"
                  language={language}
                  value={textValue}
                  onChange={handleTextChange}
                  theme={theme.palette.type === 'dark' ? 'admin-ui-dark' : 'vs-light'}
                  options={{
                    automaticLayout: true,
                    contextmenu: true,
                    hideCursorInOverviewRuler: true,
                    lineNumbers: 'on',
                    minimap: {
                      enabled: true,
                    },
                    readOnly: props.settings.ReadOnly,
                    scrollBeyondLastLine: false,
                    selectOnLineNumbers: true,
                    wordWrap: 'on',
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
              )}
            </div>
          ) : null}
        </FormControl>
      )
    case 'browse':
    default:
      return (
        <div className={classes.binaryContainer}>
          <Typography variant="caption" gutterBottom={true}>
            {`${props.settings.DisplayName} (${props.settings.Name})`}
          </Typography>

          {mediaResource?.media_src ? (
            renderDownloadButton()
          ) : (
            <Typography variant="caption" gutterBottom={true}>
              {localization.noValue}
            </Typography>
          )}
        </div>
      )
  }
}
