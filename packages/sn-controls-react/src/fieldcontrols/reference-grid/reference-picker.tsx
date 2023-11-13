import { Avatar, DialogActions, DialogContent, LinearProgress } from '@material-ui/core'
import { ODataParams, Repository } from '@sensenet/client-core'
import { Folder, ReferenceFieldSetting, User } from '@sensenet/default-content-types'
import { GenericContentWithIsParent, Picker, PickerProps, TReferemceSelectionHelperPath } from '@sensenet/pickers-react'
import React, { useMemo } from 'react'
import { renderIconDefault } from '../icon'

interface ReferencePickerProps<T>
  extends Pick<PickerProps<T>, 'handleSubmit' | 'handleCancel' | 'localization' | 'defaultValue' | 'classes'> {
  repository: Repository
  path: string
  contextPath?: string
  renderIcon?: (name: T) => JSX.Element
  fieldSettings: ReferenceFieldSetting
  helperPaths?: string[]
  getReferencePickerHelperData?: () => Promise<TReferemceSelectionHelperPath[]>
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

  const renderIcon = (item: GenericContentWithIsParent | User) =>
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
      props.renderIcon(item)
    ) : (
      renderIconDefault(iconName(item.IsFolder))
    )

  return (
    <Picker
      defaultValue={props.defaultValue}
      repository={props.repository}
      getReferencePickerHelperData={props.getReferencePickerHelperData}
      currentPath={props.path}
      contextPath={props.contextPath}
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
