import {
  Button,
  Chip,
  DialogActions,
  DialogContent,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from '@material-ui/core'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'
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
import {
  createActionParameterTemplate,
  createCustomActionModel,
  getEnumValues,
  getJsonType,
} from '../../services/MonacoModels/create-custom-action-model'
import { getMonacoModelUri } from '../editor/text-editor'
import { DialogTitle, useDialog } from '.'

const MonacoEditor = lazy(() => import('react-monaco-editor'))

const EDITOR_INITIAL_VALUE = `{

}`

const getActionLabel = ({ action }: OnExecuteActionPayload) => action.DisplayName || action.Name

const actionFilter = createFilterOptions<OnExecuteActionPayload>({
  stringify: ({ action, metadata }) =>
    [
      action.DisplayName,
      action.Name,
      metadata?.title,
      ...(metadata?.parameters?.map((parameter) => parameter.name) || []),
    ]
      .filter(Boolean)
      .join(' '),
})

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

        const sortedActions = [...oDataActions].sort((left, right) =>
          getActionLabel(left).localeCompare(getActionLabel(right), undefined, {
            numeric: true,
            sensitivity: 'base',
          }),
        )

        setActions(sortedActions)
        setSelectedActionIndex(sortedActions.length ? '0' : '')
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

    setPostBody(
      selectedAction?.metadata?.parameters?.length
        ? createActionParameterTemplate(selectedAction.metadata.parameters)
        : EDITOR_INITIAL_VALUE,
    )
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
      <DialogContent style={{ minHeight: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {isLoading ? (
          <>
            <Typography>{localization.loadingActions}</Typography>
            <LinearProgress />
          </>
        ) : !actions.length ? (
          <Typography>{error || localization.noActions}</Typography>
        ) : (
          <div style={{ minHeight: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Autocomplete
              fullWidth
              openOnFocus
              disableClearable
              options={actions}
              value={selectedAction || actions[0]}
              filterOptions={actionFilter}
              getOptionLabel={getActionLabel}
              getOptionSelected={(option, value) =>
                (option.action.OpId || option.action.Name) === (value.action.OpId || value.action.Name)
              }
              noOptionsText={localization.noMatchingActions}
              onChange={(_, actionValue) => {
                const index = actions.indexOf(actionValue)
                setSelectedActionIndex(index >= 0 ? String(index) : '')
              }}
              renderOption={(actionValue) => (
                <div style={{ width: '100%', minWidth: 0 }}>
                  <Typography variant="body2">{getActionLabel(actionValue)}</Typography>
                  {getActionLabel(actionValue) !== actionValue.action.Name ? (
                    <Typography variant="caption" color="textSecondary">
                      {actionValue.action.Name}
                    </Typography>
                  ) : null}
                </div>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={localization.actionLabel}
                  placeholder={localization.searchActions}
                  inputProps={{ ...params.inputProps, 'data-test': 'odata-action-search' }}
                />
              )}
            />

            {isExecuting ? (
              <>
                <Typography>{localization.executingAction}</Typography>
                <LinearProgress />
              </>
            ) : selectedAction?.metadata?.parameters?.length && uri ? (
              <Grid container spacing={2} style={{ minHeight: 0, flex: 1, marginTop: '0.75em' }}>
                <Grid
                  item
                  xs={12}
                  sm={5}
                  style={{ minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                  <Typography>
                    {localization.parameters} ({selectedAction.metadata.parameters.length})
                  </Typography>
                  <Typography variant="caption" color="textSecondary" component="div" style={{ minHeight: 36 }}>
                    {localization.parametersHelp}
                  </Typography>
                  <div
                    role="list"
                    aria-label={localization.parameters}
                    style={{
                      minHeight: 320,
                      flex: 1,
                      marginTop: '0.5em',
                      overflowY: 'auto',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 4,
                    }}>
                    {selectedAction.metadata.parameters.map((parameter) => {
                      const enumValues = getEnumValues(parameter)
                      const isUnresolvedCustomType =
                        !enumValues && getJsonType(parameter.type) === 'string' && parameter.type.includes('.')

                      return (
                        <div
                          role="listitem"
                          key={parameter.name}
                          style={{
                            padding: '0.65em 0.75em',
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                            <Typography variant="body2" style={{ minWidth: 0, flex: 1, overflowWrap: 'anywhere' }}>
                              <code>{parameter.name}</code>
                            </Typography>
                            <Typography
                              variant="caption"
                              style={{
                                color: parameter.required ? theme.palette.error.main : theme.palette.text.secondary,
                                whiteSpace: 'nowrap',
                              }}>
                              {parameter.required ? localization.requiredParameter : localization.optionalParameter}
                            </Typography>
                          </div>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            component="div"
                            style={{ marginTop: 2, overflowWrap: 'anywhere' }}>
                            <code>{parameter.type}</code>
                          </Typography>
                          {enumValues?.length ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 7 }}>
                              {enumValues.map((enumValue) => (
                                <Chip
                                  key={String(enumValue)}
                                  label={enumValue}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              ))}
                            </div>
                          ) : isUnresolvedCustomType ? (
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              component="div"
                              style={{ marginTop: 5 }}>
                              {localization.valuesNotProvided}
                            </Typography>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={7}
                  style={{ minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                  <Typography>{localization.requestBody}</Typography>
                  <Typography variant="caption" color="textSecondary" component="div" style={{ minHeight: 36 }}>
                    {localization.intelliSenseHelp}
                  </Typography>
                  <div
                    style={{
                      minHeight: 320,
                      flex: 1,
                      marginTop: '0.5em',
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                    <div
                      style={{
                        minHeight: 38,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '0 0.65em',
                        color: theme.palette.text.secondary,
                        backgroundColor: theme.palette.action.hover,
                        border: `1px solid ${theme.palette.divider}`,
                        borderBottom: 0,
                        borderRadius: '4px 4px 0 0',
                      }}>
                      <Typography variant="caption" style={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                        {localization.proTip}
                      </Typography>
                      <Typography variant="caption">{localization.press}</Typography>
                      {['Ctrl', 'Space'].map((key, index) => (
                        <React.Fragment key={key}>
                          {index ? <Typography variant="caption">+</Typography> : null}
                          <kbd
                            style={{
                              padding: '1px 5px',
                              fontSize: '0.7rem',
                              color: theme.palette.text.primary,
                              backgroundColor: theme.palette.background.paper,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 3,
                              boxShadow: `0 1px 0 ${theme.palette.divider}`,
                            }}>
                            {key}
                          </kbd>
                        </React.Fragment>
                      ))}
                      <Typography variant="caption">{localization.forSuggestions}</Typography>
                    </div>
                    <div
                      style={{
                        minHeight: 0,
                        flex: 1,
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '0 0 4px 4px',
                      }}>
                      <MonacoEditor
                        key={uri.toString()}
                        height="100%"
                        theme={theme.palette.type === 'dark' ? 'vs-dark' : 'vs-light'}
                        width="100%"
                        language="json"
                        value={postBody}
                        onChange={(value) => setPostBody(value)}
                        options={{
                          automaticLayout: true,
                          minimap: { enabled: false },
                          lineNumbers: 'off',
                          formatOnPaste: true,
                          formatOnType: true,
                          quickSuggestions: { other: true, comments: false, strings: true },
                          suggestOnTriggerCharacters: true,
                          scrollBeyondLastLine: false,
                          wordBasedSuggestions: false,
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
                            model.setValue(postBody)
                            editor.setModel(model)
                          }
                        }}
                      />
                    </div>
                  </div>
                </Grid>
              </Grid>
            ) : (
              <Typography style={{ marginTop: '1.5em' }}>{localization.noParameters}</Typography>
            )}
          </div>
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
