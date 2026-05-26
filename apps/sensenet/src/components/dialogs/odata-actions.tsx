import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { useInjector, useLogger, useRepository } from '@sensenet/hooks-react'
import React, { lazy, useEffect, useMemo, useState } from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization, useTheme } from '../../hooks'
import {
  CustomActionCommandProvider,
  OnExecuteActionPayload,
} from '../../services/CommandProviders/CustomActionCommandProvider'
import { executeCustomAction } from '../../services/execute-custom-action'
import { createCustomActionModel } from '../../services/MonacoModels/create-custom-action-model'
import { getMonacoModelUri } from '../editor/text-editor'
import { DialogTitle, useDialog } from '.'

const MonacoEditor = lazy(() => import('react-monaco-editor'))

const EDITOR_INITIAL_VALUE = `{

}`

export type ODataActionsDialogProps = {
  content: GenericContent
}

export function ODataActionsDialog({ content }: ODataActionsDialogProps) {
  const theme = useTheme()
  const { closeLastDialog, openDialog } = useDialog()
  const localization = useLocalization().customActions.oDataActionsDialog
  const customActionService = useInjector().getInstance(CustomActionCommandProvider)
  const logger = useLogger('ODataActions')
  const repo = useRepository()
  const globalClasses = useGlobalStyles()

  const [actions, setActions] = useState<OnExecuteActionPayload[]>([])
  const [selectedActionIndex, setSelectedActionIndex] = useState('')
  const [postBody, setPostBody] = useState(EDITOR_INITIAL_VALUE)
  const [uri, setUri] = useState<import('react-monaco-editor').monaco.Uri>()
  const [isLoading, setIsLoading] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState('')

  const selectedAction = useMemo(() => {
    if (selectedActionIndex === '') {
      return undefined
    }

    return actions[Number(selectedActionIndex)]
  }, [actions, selectedActionIndex])

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    setError('')
    ;(async () => {
      try {
        const oDataActions = await customActionService.getODataActionPayloads(content, repo)

        if (!isMounted) {
          return
        }

        setActions(oDataActions)
        setSelectedActionIndex(oDataActions.length ? '0' : '')
      } catch (loadError) {
        if (!isMounted) {
          return
        }

        setError(loadError instanceof Error ? loadError.message : localization.loadError)
        logger.error({
          message: localization.loadError,
          data: { error: loadError, relatedContent: content, relatedRepository: repo.configuration.repositoryUrl },
        })
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [content, customActionService, localization.loadError, logger, repo])

  useEffect(() => {
    let isMounted = true

    setPostBody(EDITOR_INITIAL_VALUE)
    setError('')
    setUri(undefined)

    if (!selectedAction) {
      return () => {
        isMounted = false
      }
    }

    ;(async () => {
      const nextUri = await getMonacoModelUri(selectedAction.content, repo, selectedAction.action)

      if (isMounted) {
        setUri(nextUri)
      }
    })()

    return () => {
      isMounted = false
    }
  }, [repo, selectedAction])

  useEffect(() => {
    if (uri && selectedAction?.metadata) {
      createCustomActionModel(uri, selectedAction.metadata)
    }
  }, [uri, selectedAction])

  const executeSelectedAction = async () => {
    if (!selectedAction) {
      return
    }

    setIsExecuting(true)
    setError('')

    try {
      const result = await executeCustomAction(repo, selectedAction, postBody)
      const response = JSON.stringify(
        {
          content: {
            Id: selectedAction.content.Id,
            Path: selectedAction.content.Path,
            Name: selectedAction.content.Name,
          },
          action: selectedAction.action.Name,
          response: result,
        },
        undefined,
        3,
      )

      logger.information({
        message: `OData action executed: '${selectedAction.action.DisplayName || selectedAction.action.Name}'`,
        data: {
          relatedContent: selectedAction.content,
          relatedRepository: repo.configuration.repositoryUrl,
          details: { actionValue: selectedAction, result },
        },
      })

      closeLastDialog()
      openDialog({ name: 'custom-action-result', props: { response } })
    } catch (executeError) {
      setError(executeError instanceof Error ? executeError.message : String(executeError))
      logger.error({
        message: `There was an error executing OData action '${
          selectedAction.action.DisplayName || selectedAction.action.Name
        }'`,
        data: {
          isDismissed: true,
          relatedRepository: repo.configuration.repositoryUrl,
          relatedContent: selectedAction.content,
          error: executeError,
          details: { actionValue: selectedAction },
        },
      })
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <>
      <DialogTitle>
        {localization.title.replace('{0}', content.DisplayName || content.Name || content.Path || '')}
      </DialogTitle>
      <DialogContent style={{ overflow: 'hidden' }}>
        {isLoading ? (
          <>
            <Typography>{localization.loadingActions}</Typography>
            <LinearProgress />
          </>
        ) : !actions.length ? (
          <Typography>{error || localization.noActions}</Typography>
        ) : (
          <>
            <FormControl fullWidth style={{ marginBottom: '1.5em' }}>
              <InputLabel id="odata-action-select-label">{localization.actionLabel}</InputLabel>
              <Select
                labelId="odata-action-select-label"
                value={selectedActionIndex}
                onChange={(event) => setSelectedActionIndex(event.target.value as string)}>
                {actions.map((actionValue, index) => (
                  <MenuItem key={actionValue.action.OpId || actionValue.action.Name} value={String(index)}>
                    {actionValue.action.DisplayName || actionValue.action.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {isExecuting ? (
              <>
                <Typography>{localization.executingAction}</Typography>
                <LinearProgress />
              </>
            ) : selectedAction?.metadata?.parameters?.length && uri ? (
              <>
                <Typography style={{ marginBottom: '0.5em' }}>{localization.parameters}</Typography>
                <MonacoEditor
                  key={uri.toString()}
                  height={320}
                  theme={theme.palette.type === 'dark' ? 'vs-dark' : 'vs-light'}
                  width="100%"
                  language="json"
                  value={postBody}
                  onChange={(value) => setPostBody(value)}
                  options={{
                    automaticLayout: true,
                    minimap: { enabled: false },
                    lineNumbers: 'off',
                  }}
                  editorDidMount={(editor, monaco) => {
                    if (!uri) {
                      return
                    }
                    const model = monaco.editor.getModel(uri)
                    if (!model) {
                      const createdModel = monaco.editor.createModel(postBody, 'json', uri)
                      editor.setModel(createdModel)
                    } else {
                      editor.setModel(model)
                      setPostBody(model.getValue())
                    }
                  }}
                />
              </>
            ) : (
              <Typography>{localization.noParameters}</Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <div style={{ flex: 1, marginLeft: '1.5em' }}>
          {error && actions.length ? <Typography color="error">{error}</Typography> : null}
        </div>
        <Button aria-label={localization.cancelButton} className={globalClasses.cancelButton} onClick={closeLastDialog}>
          {localization.cancelButton}
        </Button>
        <Button
          aria-label={localization.executeButton}
          color="primary"
          variant="contained"
          disabled={!selectedAction || isLoading || isExecuting}
          onClick={executeSelectedAction}>
          {localization.executeButton}
        </Button>
      </DialogActions>
    </>
  )
}

export default ODataActionsDialog
