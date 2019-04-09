import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import React, { useState } from 'react'
import { DraftCommentMarker } from '../../models'
import { LocalizationStateType } from '../../store/Localization'
import { StyledForm, StyledSvgIcon } from './style'

/**
 * Localization keys for create comment component
 */
export type CreateCommentLocalization = Pick<
  LocalizationStateType,
  'commentInputPlaceholder' | 'addComment' | 'submit' | 'inputRequiredError' | 'markerRequiredError' | 'markerTooltip'
>

/**
 * Create comment component properties
 */
export interface CreateCommentProps {
  createComment: (text: string) => void
  localization?: CreateCommentLocalization
  isPlacingMarker: boolean
  handlePlaceMarkerClick: () => void
  draftCommentMarker?: DraftCommentMarker
}

const defaultLocalization: CreateCommentLocalization = {
  addComment: 'add a comment',
  commentInputPlaceholder: 'Write a comment',
  submit: 'submit',
  inputRequiredError: 'The comment text is a required field.',
  markerRequiredError: 'You must place the marker first.',
  markerTooltip: 'You can put a marker with this button.',
}

/**
 * Represents a comment creator component
 */
export function CreateComment(props: CreateCommentProps) {
  const [value, setValue] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const localization = { ...defaultLocalization, ...props.localization }

  if (!isActive) {
    return (
      <Button color="primary" onClick={() => setIsActive(!isActive)}>
        {localization.addComment}
      </Button>
    )
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errorText = validate()
    if (errorText) {
      setErrorMessage(errorText)
      return
    }
    props.createComment(value)
    setValue('')
    setErrorMessage(undefined)
    setIsActive(!isActive)
  }

  const validate = () => {
    if (!value) {
      return localization.inputRequiredError
    }
    if (!props.draftCommentMarker) {
      return localization.markerRequiredError
    }
    return undefined
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    setErrorMessage(undefined)
  }

  const hasError = () => {
    return !!errorMessage || (!!errorMessage && !props.draftCommentMarker)
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <FormControl fullWidth={true} error={hasError()}>
        <TextField
          id="comment-input"
          multiline={true}
          label={localization.commentInputPlaceholder}
          margin="normal"
          variant="filled"
          value={value}
          onChange={handleOnChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip placement="top" title={localization.markerTooltip}>
                  <IconButton aria-label="Toggle" onClick={props.handlePlaceMarkerClick}>
                    <StyledSvgIcon isPlacingMarker={props.isPlacingMarker} viewBox="0 0 100 125">
                      <path d="M47.906 86.486L49.798 100h.404l1.892-13.514.901-22.244h-5.99zM77.333 59.566L75.3 50.711a3.154 3.154 0 0 0-.342-.955 1.399 1.399 0 0 0-.209-.317 2.023 2.023 0 0 0-.61-.535c-.132-.073-.261-.154-.392-.229a9.516 9.516 0 0 0-.899-.452 15.693 15.693 0 0 0-1.792-.63c-.235-.07-.471-.135-.709-.197a46.573 46.573 0 0 0-.758-.187c-.321-.075-.646-.134-.969-.198-.503-.106-1-.242-1.499-.365-.136-.034-.276-.07-.414-.107a8.767 8.767 0 0 1-.933-.306 6.262 6.262 0 0 1-1.659-.966 6.75 6.75 0 0 1-.709-.663 6.324 6.324 0 0 1-.609-.755 6.302 6.302 0 0 1-.49-.836 5.86 5.86 0 0 1-.351-.903 7.628 7.628 0 0 1-.222-.963 16.797 16.797 0 0 1-.129-1.001c-.009-.08-.024-.163-.024-.242v.354l-.007-.103-.007-.118c-.001-.05-.005-.099-.008-.149a12.968 12.968 0 0 0-.011-.191l-.014-.242-.017-.302c-.007-.119-.015-.239-.021-.359l-.023-.419c-.011-.158-.018-.314-.026-.474a45.466 45.466 0 0 1-.03-.521 34.99 34.99 0 0 1-.031-.565 102.69 102.69 0 0 1-.034-.599l-.036-.628-.035-.65-.039-.67-.039-.686c-.014-.233-.025-.466-.039-.698-.014-.238-.028-.475-.04-.713-.015-.24-.027-.481-.041-.722l-.041-.733-.042-.741-.044-.749a92.367 92.367 0 0 0-.042-.753c-.014-.251-.029-.502-.041-.753l-.043-.75c-.016-.247-.028-.495-.042-.741-.014-.244-.027-.487-.043-.729-.011-.239-.026-.477-.039-.713-.014-.23-.025-.461-.039-.692l-.036-.665c-.013-.212-.026-.424-.035-.636-.014-.2-.024-.401-.036-.602-.011-.188-.02-.378-.033-.566-.008-.176-.02-.355-.028-.531l-.028-.493c-.01-.152-.017-.305-.026-.456a20.348 20.348 0 0 1-.023-.427l-.023-.396a16.229 16.229 0 0 0-.05-.7 1.43 1.43 0 0 1 .078-.683c.035-.091.065-.197.114-.283.071-.184.15-.366.237-.545a6.15 6.15 0 0 1 .633-1.002c.237-.311.497-.607.777-.882a5.495 5.495 0 0 1 1.506-1.068c.279-.138.558-.266.856-.359.215-.067.433-.14.653-.192.094-.032.187-.061.28-.093.12-.039.24-.082.358-.125.124-.046.24-.105.36-.16.144-.065.287-.13.428-.203.208-.108.411-.239.593-.39.081-.068.159-.144.227-.227.383-.366.638-.903.746-1.521l2.034-8.856A2.042 2.042 0 0 0 68.194 0H31.806a2.038 2.038 0 0 0-2.033 2.032l2.034 8.856c.108.618.363 1.155.746 1.521.067.083.146.159.227.227.182.15.385.281.593.39.141.073.284.138.428.203.12.055.237.114.36.16.118.043.238.086.358.125l.281.093c.219.053.438.125.652.192.298.094.576.222.855.359a5.544 5.544 0 0 1 1.507 1.068c.279.274.539.571.776.882.241.314.457.647.633 1.002.087.179.166.361.237.545.05.086.079.192.114.283.089.226.101.444.078.683-.022.233-.037.466-.05.7-.009.133-.016.265-.023.396-.007.143-.015.284-.024.427-.01.151-.017.304-.026.456l-.027.493c-.01.177-.021.356-.029.531-.013.188-.022.378-.032.566-.013.2-.023.401-.036.602-.01.212-.022.424-.036.636-.011.222-.023.443-.036.665-.014.231-.025.462-.039.692-.013.236-.028.474-.039.713l-.043.729c-.014.246-.026.494-.042.741l-.043.75c-.012.251-.027.502-.041.753l-.042.753-.044.749-.042.741-.041.733c-.014.241-.026.481-.041.722-.012.238-.026.475-.039.713-.015.232-.026.465-.04.698l-.039.686-.039.67c-.011.218-.025.435-.035.65l-.036.628-.033.599-.032.565-.03.521-.025.474c-.009.14-.017.278-.023.419l-.021.359-.017.302-.014.242-.011.191c-.003.05-.007.099-.008.149l-.007.118c-.003.034-.004.068-.006.103v-.354c0 .079-.017.162-.025.242-.035.335-.074.669-.129 1.001a7.628 7.628 0 0 1-.222.963c-.093.31-.21.612-.352.903a6.521 6.521 0 0 1-1.099 1.591 6.432 6.432 0 0 1-1.498 1.209 6.498 6.498 0 0 1-.869.42c-.305.12-.618.221-.934.306-.138.037-.276.073-.414.107-.499.123-.996.259-1.499.365-.323.064-.647.123-.969.198-.254.06-.506.122-.758.187-.237.062-.474.127-.707.197a17.723 17.723 0 0 0-1.255.414c-.182.068-.361.139-.539.216-.159.07-.318.145-.477.224a7.812 7.812 0 0 0-.422.228c-.131.074-.26.155-.392.229a2.023 2.023 0 0 0-.61.535c-.089.104-.157.21-.209.317a3.18 3.18 0 0 0-.342.955l-2.033 8.855a2.04 2.04 0 0 0 2.032 2.034H75.301a2.035 2.035 0 0 0 2.032-2.032z" />
                    </StyledSvgIcon>
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
        {hasError() ? <FormHelperText id="component-error-text">{errorMessage}</FormHelperText> : null}
        <Button style={{ alignSelf: 'flex-end' }} fullWidth={false} color="primary" variant="text" type="submit">
          {localization.submit}
        </Button>
      </FormControl>
    </StyledForm>
  )
}
