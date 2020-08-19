import { changeJScriptValue } from '@sensenet/controls-react'
import { ReferenceFieldSetting, User } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import React from 'react'
import { FileWithFullPath, useDialog } from '../../dialogs'
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

  const repo = useRepository()
  const logger = useLogger('Avatar')
  const { openDialog } = useDialog()

  const [fieldValue] = React.useState(
    (props.fieldValue as any)?.Url || changeJScriptValue(props.settings.DefaultValue) || '',
  )

  const addItem = () => {
    openDialog({
      name: 'upload',
      props: {
        uploadPath: props.content?.Path || '',
        disableMultiUpload: true,
        customUploadFunction: (files: FileWithFullPath[] | undefined, progressObservable: any) =>
          uploadAvatar(files, progressObservable),
      },
      dialogProps: { open: true, fullScreen: false },
    })
  }

  const uploadAvatar = async (files: FileWithFullPath[] | undefined, progressObservable: { current: any }) => {
    if (!files) {
      return
    }

    try {
      const previousAvatarPath = props.content?.Avatar?.Url!
      //Upload the actual avatar file under the User content
      const response = await repo.upload.file({
        file: files[files.length - 1],
        parentPath: props.content?.Path!,
        fileName: files[files.length - 1].name,
        overwrite: true,
        binaryPropertyName: 'Binary',
        progressObservable: progressObservable.current,
      })
      //Replace the ImageRef field of the user with the new avatar
      await repo.patch<User>({
        idOrPath: props.content?.Id!,
        content: {
          ImageRef: response.Id,
        },
      })
      //Remove the previous avatar image from the User
      if (!props.content?.Avatar?.Url?.startsWith('/binaryhandler')) {
        await repo.delete({
          idOrPath: previousAvatarPath,
          permanent: true,
        })
      }
    } catch (error) {
      logger.error({ message: 'Something went wrong', data: error })
    }
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
