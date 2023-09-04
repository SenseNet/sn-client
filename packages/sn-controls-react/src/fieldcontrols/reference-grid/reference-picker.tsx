import { Avatar, DialogActions, DialogContent, LinearProgress } from '@material-ui/core'
import { ODataParams, Repository } from '@sensenet/client-core'
import { Folder, Image, ReferenceFieldSetting, User } from '@sensenet/default-content-types'
import { GenericContentWithIsParent, Picker, PickerProps } from '@sensenet/pickers-react'
import React, { useMemo } from 'react'
import { renderIconDefault } from '../icon'

interface ReferencePickerProps<T>
  extends Pick<PickerProps<T>, 'handleSubmit' | 'handleCancel' | 'localization' | 'defaultValue' | 'classes'> {
  repository: Repository
  path: string
  renderIcon?: (name: T) => JSX.Element
  fieldSettings: ReferenceFieldSetting
}

const createTypeFilterString = (allowedTypes: string[]) => {
  let filterString = "isOf('Folder')"
  allowedTypes.forEach((typeName: string) => {
    if (typeName !== 'Folder') {
      filterString += ` or isOf('${typeName}')`
    }
  })
  return filterString
}

/**
 * Represents a reference picker component
 */
export const ReferencePicker: React.FC<ReferencePickerProps<GenericContentWithIsParent>> = (props) => {
  const pickerItemOptions: ODataParams<Folder> = useMemo(
    () => ({
      select: ['DisplayName', 'Path', 'Id', 'Children/IsFolder', 'IsFolder', 'Avatar', 'Icon'] as any,
      expand: ['Children'] as any,
      filter: props.fieldSettings.AllowedTypes
        ? createTypeFilterString(props.fieldSettings.AllowedTypes)
        : "isOf('GenericContent')",
      metadata: 'no',
      orderby: 'DisplayName',
    }),
    [props.fieldSettings.AllowedTypes],
  )

  const iconName = (isFolder?: boolean) => {
    if (isFolder == null) {
      return 'arrow_upward'
    }
    return isFolder ? 'folder' : 'insert_drive_file'
  }

  const renderIcon = (item: GenericContentWithIsParent | User | Image) => {
    console.log('item', item)

    if (props.repository.schemas.isContentFromType<User>(item, 'User')) {
      const avatarUrl = item.Avatar?.Url
      if (avatarUrl) {
        return <Avatar alt={item.DisplayName} src={`${props.repository.configuration.repositoryUrl}${avatarUrl}`} />
      }

      return (
        <Avatar alt={item.DisplayName}>
          {item.DisplayName?.split(' ')
            .map((namePart) => namePart[0])
            .join('.')}
        </Avatar>
      )
    }

    if (props.repository.schemas.isContentFromType<Image>(item, 'Image')) {
      return (
        <img
          alt=""
          src={`${props.repository.configuration.repositoryUrl}${item.Path}`}
          style={{ width: '3em', height: '3em', objectFit: 'scale-down' }}
        />
      )
    }

    if (props.renderIcon) {
      return props.renderIcon(item)
    }

    return renderIconDefault(iconName(item.IsFolder))
  }

  return (
    <Picker
      defaultValue={props.defaultValue}
      repository={props.repository}
      currentPath={props.path}
      selectionRoots={props.fieldSettings.SelectionRoots}
      itemsODataOptions={pickerItemOptions}
      renderIcon={renderIcon}
      renderLoading={() => <LinearProgress />}
      allowMultiple={props.fieldSettings.AllowMultiple}
      pickerContainer={DialogContent}
      actionsContainer={DialogActions}
      handleCancel={props.handleCancel}
      handleSubmit={props.handleSubmit}
      classes={props.classes}
    />
  )
}
