import { ReferenceFieldSetting, User } from '@sensenet/default-content-types'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import createStyles from '@material-ui/core/styles/createStyles'
import makeStyles from '@material-ui/core/styles/makeStyles'
import React from 'react'
import { changeTemplatedValue } from '../../helpers'
import { ReactClientFieldSetting } from '../client-field-setting'
import { renderIconDefault } from '../icon'
import { DefaultAvatarTemplate, DefaultAvatarTemplateProps } from './default-avatar-template'

const useStyles = makeStyles(() => {
  return createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    label: {
      position: 'static',
      marginBottom: '4px',
    },
    listContainer: {
      display: 'block',
      padding: 0,
    },
    centeredVertical: {
      display: 'flex',
      flexFlow: 'column',
      alignItems: 'center',
    },
  })
})

interface AvatarProps extends ReactClientFieldSetting<ReferenceFieldSetting, User> {
  handleAdd: ({ setAvatar }: { setAvatar: React.Dispatch<any> }) => void
  handleRemove?: () => void
  avatarTemplateOverride?: React.FC<DefaultAvatarTemplateProps>
  hideLabel?: boolean
}

export const Avatar: React.FunctionComponent<AvatarProps> = (props) => {
  const classes = useStyles()

  const [fieldValue, setFieldValue] = React.useState(
    (props.fieldValue as any)?.Url ||
      (props.actionName === 'new' && changeTemplatedValue(props.settings.DefaultValue)) ||
      '',
  )

  const AvatarTemplate = props.avatarTemplateOverride || DefaultAvatarTemplate

  return props.actionName === 'new' || props.actionName === 'edit' ? (
    <FormControl
      className={classes.root}
      key={props.settings.Name}
      component={'fieldset' as 'div'}
      required={props.settings.Compulsory}>
      {!props.hideLabel && (
        <InputLabel shrink={true} htmlFor={props.settings.Name} className={classes.label}>
          {props.settings.DisplayName}
        </InputLabel>
      )}

      <List dense={true} className={classes.listContainer}>
        <AvatarTemplate
          repositoryUrl={props.repository?.configuration.repositoryUrl}
          add={() => props.handleAdd({ setAvatar: setFieldValue })}
          remove={props.handleRemove}
          actionName={props.actionName}
          readOnly={props.settings.ReadOnly}
          url={fieldValue}
          content={props.content}
          renderIcon={props.renderIcon ? props.renderIcon : renderIconDefault}
        />
      </List>
      {!props.hideDescription && <FormHelperText>{props.settings.Description}</FormHelperText>}
    </FormControl>
  ) : (
    <div className={classes.centeredVertical}>
      <List dense={true} className={classes.listContainer}>
        <AvatarTemplate
          repositoryUrl={props.repository?.configuration.repositoryUrl}
          url={(props.fieldValue as any)?.Url}
          content={props.content}
          actionName="browse"
          renderIcon={props.renderIcon ? props.renderIcon : renderIconDefault}
        />
      </List>
      <InputLabel
        shrink={true}
        htmlFor={props.settings.Name}
        style={{ paddingTop: '9px', transformOrigin: 'top center' }}>
        {props.settings.DisplayName}
      </InputLabel>
    </div>
  )
}
