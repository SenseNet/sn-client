import { ReactClientFieldSetting, Avatar as SnAvatar } from '@sensenet/controls-react'
import { ReferenceFieldSetting, User } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React from 'react'
import { FileWithFullPath, useDialog } from '../../dialogs'
import { DefaultAvatarTemplate } from './default-avatar-template'

interface AddItemParams {
  setAvatar: React.Dispatch<any>
}

interface UploadAvatarParams extends AddItemParams {
  files: FileWithFullPath[] | undefined
  progressObservable: { current: any }
}

export const Avatar: React.FunctionComponent<ReactClientFieldSetting<ReferenceFieldSetting, User>> = (props) => {
  const repo = useRepository()
  const logger = useLogger('Avatar')
  const { openDialog } = useDialog()

  const add = ({ setAvatar }: AddItemParams) => {
    openDialog({
      name: 'upload',
      props: {
        uploadPath: props.content?.Path || '',
        disableMultiUpload: true,
        customUploadFunction: (files: FileWithFullPath[] | undefined, progressObservable: any) =>
          uploadAvatar({ files, progressObservable, setAvatar }),
      },
      dialogProps: { open: true, fullScreen: false },
    })
  }

  const uploadAvatar = async ({ files, progressObservable, setAvatar }: UploadAvatarParams) => {
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

      setAvatar(response.Url)

      //Remove the previous avatar image from the User
      if (props.content?.Avatar?.Url && !props.content?.Avatar?.Url.startsWith('/binaryhandler')) {
        await repo.delete({
          idOrPath: previousAvatarPath,
          permanent: true,
        })
      }
    } catch (error) {
      logger.error({ message: 'Something went wrong', data: { error } })
    }
  }

  return <SnAvatar handleAdd={add} hideLabel avatarTemplateOverride={DefaultAvatarTemplate} {...props} />
}
