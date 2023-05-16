import { Button, createStyles, makeStyles, useTheme } from '@material-ui/core'
import { clsx } from 'clsx'
import React, { lazy, useContext, useRef } from 'react'
import { Prompt, useHistory } from 'react-router'
import { PATHS } from '../../application-paths'
import { ResponsiveContext } from '../../context'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { ContentTypePreset } from './content-type-preset'
const MonacoEditor = lazy(() => import('react-monaco-editor'))

const useStyles = makeStyles(() => {
  return createStyles({
    editorWrapper: {
      display: 'flex',
      overflow: 'hidden',
      position: 'relative',
      paddingTop: '8px',
      height: '100%',
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
    actionButtonWrapper: {
      height: '80px',
      left: 0,
      position: 'absolute',
      padding: '20px',
      bottom: 0,
      textAlign: 'right',
      right: '7%',
    },
    form: {
      width: '100%',
      height: '100%',
    },
    header: {
      height: globals.common.drawerItemHeight,
      paddingLeft: '15px',
      justifyContent: 'space-between',
    },
    title: {
      flexGrow: 1,
      fontSize: '20px',
    },
    headerButtonWrapper: {
      display: 'flex',
      marginRight: '1em',
    },
  })
})

export interface SnMonacoEditorProps {
  language: string
  textValue: string
  setTextValue: React.Dispatch<React.SetStateAction<string>>
  savedTextValue: string
  hasChanges: boolean
  uri: import('react-monaco-editor').monaco.Uri
  handleSubmit: Function
  renderTitle: () => JSX.Element
  additionalButtons?: JSX.Element
  handleCancel?: () => void
  preset?: string
}

export const SnMonacoEditor: React.FunctionComponent<SnMonacoEditorProps> = (props) => {
  const history = useHistory()
  const localization = useLocalization()
  const theme = useTheme()
  const platform = useContext(ResponsiveContext)
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const formSubmitButton = useRef<HTMLButtonElement>(null)

  const renderPresets = () => {
    if (props.preset?.includes(PATHS.contentTypes.snPath)) {
      return (
        <div className={classes.presetsContainer}>
          <ContentTypePreset setTextValue={props.setTextValue} />
        </div>
      )
    }

    return null
  }

  return (
    <div data-test="editor-wrapper" className={classes.editorWrapper}>
      <form
        className={classes.form}
        onSubmit={(ev) => {
          ev.preventDefault()
          props.handleSubmit()
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
        <div className={clsx([globalClasses.centeredVertical, classes.header])}>
          <div className={classes.title} data-test="editor-title">
            {props.renderTitle()}
          </div>
          <div className={classes.headerButtonWrapper}>
            {props.additionalButtons ? props.additionalButtons : null}
            <Button
              aria-label={localization.textEditor.reset}
              disabled={!props.hasChanges}
              onClick={() => props.setTextValue(props.savedTextValue)}>
              {localization.textEditor.reset}
            </Button>
          </div>
        </div>
        <Prompt when={props.hasChanges} message={localization.textEditor.unsavedChangesWarning} />
        <MonacoEditor
          theme={theme.palette.type === 'dark' ? 'admin-ui-dark' : 'vs-light'}
          width="100%"
          language={props.language}
          value={props.textValue}
          onChange={(v) => props.setTextValue(v)}
          options={{
            readOnly: platform === 'mobile',
            automaticLayout: true,
            minimap: {
              enabled: platform === 'desktop' ? true : false,
            },
          }}
          editorDidMount={(editor, monaco) => {
            if (!monaco.editor.getModel(props.uri)) {
              const m = monaco.editor.createModel(props.textValue, props.language, props.uri)
              m.setEOL(0)
              editor.setModel(m)
            } else {
              editor.setModel(monaco.editor.getModel(props.uri))
              editor.setValue(props.textValue)
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
            data-test="monaco-editor-cancel"
            aria-label={localization.forms.cancel}
            color="default"
            className={globalClasses.cancelButton}
            onClick={props.handleCancel || (() => history.go(-1))}>
            {localization.forms.cancel}
          </Button>

          <Button
            data-test="monaco-editor-submit"
            aria-label={localization.forms.submit}
            variant="contained"
            color="primary"
            type="submit"
            ref={formSubmitButton}
            disabled={!props.hasChanges}>
            {localization.forms.submit}
          </Button>
        </div>
      </form>
      {props.preset ? renderPresets() : null}
    </div>
  )
}
