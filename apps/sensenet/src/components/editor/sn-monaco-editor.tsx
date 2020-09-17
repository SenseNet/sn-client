import { Button, createStyles, makeStyles, useTheme } from '@material-ui/core'
import clsx from 'clsx'
import { Uri } from 'monaco-editor'
import React, { useContext, useRef } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { Prompt, useHistory } from 'react-router'
import { ResponsiveContext } from '../../context'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'

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
  uri: Uri
  handleSubmit: Function
  renderTitle: () => JSX.Element
  additionalButtons?: JSX.Element
  handleCancel?: () => void
}

export const SnMonacoEditor: React.FunctionComponent<SnMonacoEditorProps> = (props) => {
  const history = useHistory()
  const localization = useLocalization()
  const theme = useTheme()
  const platform = useContext(ResponsiveContext)
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const formSubmitButton = useRef<HTMLButtonElement>(null)

  return (
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
        <div className={classes.title}>{props.renderTitle()}</div>
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
      <Prompt when={props.textValue !== props.savedTextValue} message={localization.textEditor.unsavedChangesWarning} />
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
          disabled={!props.hasChanges}>
          {localization.forms.submit}
        </Button>
      </div>
    </form>
  )
}
