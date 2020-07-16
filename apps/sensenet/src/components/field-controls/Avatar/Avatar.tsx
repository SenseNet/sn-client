import { changeJScriptValue } from '@sensenet/controls-react'
import { ReferenceFieldSetting, User } from '@sensenet/default-content-types'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import React from 'react'
import { useDialog } from '../../dialogs'
import { ReactClientFieldSetting } from '../ClientFieldSetting'
import { renderIconDefault } from '../icon'
import { DefaultAvatarTemplate } from './DefaultAvatarTemplate'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    dialog: {
      padding: 20,
      minWidth: 250,
      '& .MuiDialogActions-root': {
        backgroundColor: theme.palette.type === 'light' ? '#FFFFFF' : '#121212',
      },
    },
    listContainer: {
      display: 'block',
      padding: 0,
    },
    closeButton: {
      position: 'absolute',
      right: 0,
    },
    icon: {
      marginRight: 0,
    },
    centeredVertical: {
      display: 'flex',
      flexFlow: 'column',
      alignItems: 'center',
    },
    cancelButton: {
      border: '2px solid #505050',
    },
  })
})

export const Avatar: React.FunctionComponent<ReactClientFieldSetting<ReferenceFieldSetting, User>> = (props) => {
  const classes = useStyles()

  const { openDialog } = useDialog()

  const [fieldValue] = React.useState(
    (props.fieldValue && (props.fieldValue as any).Url) || changeJScriptValue(props.settings.DefaultValue) || '',
  )

  const addItem = () => {
    openDialog({
      name: 'upload',
      props: {
        uploadPath: props.content?.Path || '',
        uploadAvatar: true,
        fileName: props.content?.Name,
      },
      dialogProps: { open: true, fullScreen: false },
    })
  }

  return (
    <>
      {props.actionName === 'new' || props.actionName === 'edit' ? (
        <FormControl
          className={classes.root}
          key={props.settings.Name}
          component={'fieldset' as 'div'}
          required={props.settings.Compulsory}>
          <List dense={true} className={classes.listContainer}>
            <DefaultAvatarTemplate
              repositoryUrl={props.repository && props.repository.configuration.repositoryUrl}
              add={() => addItem()}
              actionName={props.actionName}
              readOnly={props.settings.ReadOnly}
              url={fieldValue}
              renderIcon={props.renderIcon ? props.renderIcon : renderIconDefault}
            />
          </List>
        </FormControl>
      ) : props.fieldValue ? (
        <div className={classes.centeredVertical}>
          <List dense={true} className={classes.listContainer}>
            <DefaultAvatarTemplate
              repositoryUrl={props.repository && props.repository.configuration.repositoryUrl}
              url={(props.fieldValue as any).Url}
              actionName="browse"
              renderIcon={props.renderIcon ? props.renderIcon : renderIconDefault}
            />
          </List>
          <InputLabel shrink={true} htmlFor={props.settings.Name} style={{ paddingTop: '9px' }}>
            {props.settings.DisplayName}
          </InputLabel>
        </div>
      ) : (
        <InputLabel shrink={true} htmlFor={props.settings.Name} style={{ paddingTop: '9px' }}>
          {props.settings.DisplayName}
        </InputLabel>
      )}
    </>
  )
}
