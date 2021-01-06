import { ODataParams, Repository } from '@sensenet/client-core'
import { Folder, ReferenceFieldSetting, User } from '@sensenet/default-content-types'
import { GenericContentWithIsParent, Picker, PickerProps } from '@sensenet/pickers-react'
import Avatar from '@material-ui/core/Avatar'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import LinearProgress from '@material-ui/core/LinearProgress'
import React, { useMemo } from 'react'
import { renderIconDefault } from '../icon'

interface ReferencePickerProps<T>
  extends Pick<PickerProps<T>, 'handleSubmit' | 'handleCancel' | 'localization' | 'defaultValue'> {
  repository: Repository
  path: string
  renderIcon?: (name: string) => JSX.Element
  fieldSettings: ReferenceFieldSetting
}

const createTypeFilterString = (allowedTypes: string[]) => {
  let filterString = "(isOf('Folder') and not isOf('SystemFolder'))"
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
        : "(isOf('GenericContent') and not isOf('SystemFolder'))",
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

  // if (error) {
  //   return <p>{error.message}</p>
  // }

  const renderIcon = (item: GenericContentWithIsParent) =>
    props.repository.schemas.isContentFromType<User>(item, 'User') ? (
      (item as User).Avatar?.Url ? (
        <Avatar
          alt={item.DisplayName}
          src={`${props.repository.configuration.repositoryUrl}${(item as User).Avatar!.Url}`}
        />
      ) : (
        <Avatar alt={item.DisplayName}>
          {item.DisplayName?.split(' ')
            .map((namePart) => namePart[0])
            .join('.')}
        </Avatar>
      )
    ) : props.renderIcon ? (
      props.renderIcon(iconName(item.IsFolder))
    ) : (
      renderIconDefault(iconName(item.IsFolder))
    )

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
    />
  )
}
