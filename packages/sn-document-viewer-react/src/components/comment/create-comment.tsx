import Button from '@material-ui/core/Button/Button'
import FormControl from '@material-ui/core/FormControl/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText'
import IconButton from '@material-ui/core/IconButton/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import createStyles from '@material-ui/core/styles/createStyles'
import makeStyles from '@material-ui/core/styles/makeStyles'
import TextField from '@material-ui/core/TextField/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import React, { useCallback, useState } from 'react'
import { useCommentState, useDocumentData, useDocumentViewerApi, useLocalization, useViewerState } from '../../hooks'
import { PushPinIcon } from '.'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row-reverse',
    },
    form: {
      width: '100%',
      display: 'flex',
    },
    activePin: {
      color: theme.palette.primary.light,
    },
  })
})

/**
 * Represents a comment creator component
 */
export function CreateComment() {
  const classes = useStyles()
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [createCommentValue, setCreateCommentValue] = useState<string>('')
  const localization = useLocalization()
  const commentState = useCommentState()
  const viewerState = useViewerState()
  const api = useDocumentViewerApi()
  const { documentData } = useDocumentData()

  const pageRotation =
    viewerState.rotation?.find((rotation) => rotation.pageNum === viewerState.activePage)?.degree || 0

  const createComment = useCallback(
    (text: string) => {
      if (!commentState.draft) {
        return
      }
      try {
        api.commentActions.addPreviewComment({
          document: documentData,
          comment: { ...commentState.draft, text, page: viewerState.activePage },
          abortController: new AbortController(),
        })
      } catch (error) {
        console.log(error)
      }
    },
    [api.commentActions, commentState.draft, documentData, viewerState],
  )

  const clearState = useCallback(() => {
    commentState.setDraft(undefined)
    viewerState.updateState({
      isPlacingCommentMarker: false,
      isCreateCommentActive: !viewerState.isCreateCommentActive,
    })
    setCreateCommentValue('')
    setErrorMessage(undefined)
  }, [commentState, viewerState])

  const validate = useCallback(() => {
    if (!createCommentValue) {
      return localization.inputRequiredError
    }
    if (!commentState.draft) {
      return localization.markerRequiredError
    }
    return undefined
  }, [commentState.draft, createCommentValue, localization.inputRequiredError, localization.markerRequiredError])

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const errorText = validate()
      if (errorText) {
        setErrorMessage(errorText)
        return
      }
      createComment(createCommentValue)
      clearState()
    },
    [clearState, createComment, createCommentValue, validate],
  )

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateCommentValue(e.target.value)
    setErrorMessage(undefined)
  }

  if (!viewerState.isCreateCommentActive) {
    return (
      <Button
        disabled={pageRotation !== 0}
        color="primary"
        onClick={() => viewerState.updateState({ isCreateCommentActive: !viewerState.isCreateCommentActive })}>
        {localization.addComment}
      </Button>
    )
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <FormControl fullWidth={true} error={!!errorMessage}>
        <TextField
          id="comment-input"
          multiline={true}
          label={localization.commentInputPlaceholder}
          margin="normal"
          variant="filled"
          value={createCommentValue}
          onChange={handleOnChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip placement="top" title={localization.markerTooltip}>
                  <IconButton
                    aria-label="Toggle"
                    onClick={() =>
                      viewerState.updateState({
                        activeShapePlacing: 'none',
                        isPlacingCommentMarker: !viewerState.isPlacingCommentMarker,
                      })
                    }>
                    <PushPinIcon isPlacingMarker={viewerState.isPlacingCommentMarker} viewBox="0 0 100 125" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
        {errorMessage ? <FormHelperText id="component-error-text">{errorMessage}</FormHelperText> : null}
        <div className={classes.buttonContainer}>
          <Button style={{ alignSelf: 'flex-end' }} fullWidth={false} color="primary" variant="text" type="submit">
            {localization.submit}
          </Button>
          <Button onClick={clearState} style={{ alignSelf: 'flex-end' }} fullWidth={false} variant="text">
            {localization.cancelButton}
          </Button>
        </div>
      </FormControl>
    </form>
  )
}
