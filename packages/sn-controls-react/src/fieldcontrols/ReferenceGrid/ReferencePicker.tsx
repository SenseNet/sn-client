import Avatar from '@material-ui/core/Avatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { ODataParams, Repository } from '@sensenet/client-core'
import { Folder, GenericContent, User } from '@sensenet/default-content-types'
import { useListPicker } from '@sensenet/pickers-react'
import React, { useEffect, useState } from 'react'
import List from '@material-ui/core/List'
import Fade from '@material-ui/core/Fade'
import CircularProgress from '@material-ui/core/CircularProgress'
import { renderIconDefault } from '../icon'

const DEFAULT_AVATAR_PATH = '/Root/Sites/Default_Site/demoavatars/Admin.png'
const styles: { [index: string]: React.CSSProperties } = {
  uploadContainer: { minHeight: 50, position: 'relative' },
  loaderContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
}

interface ReferencePickerProps {
  change?: () => void
  select: (content: GenericContent) => void
  repository: Repository
  path: string
  allowedTypes?: string[]
  selected: GenericContent[]
  renderIcon?: (name: string) => JSX.Element
}

const createTypeFilterString = (allowedTypes: string[]) => {
  let filterString = "(isOf('Folder') and not isOf('SystemFolder'))"
  allowedTypes.map((typeName: string) => {
    if (typeName !== 'Folder') {
      filterString += ` or isOf('${typeName}')`
    }
  })
  return filterString
}

/**
 * Represents a reference picker component
 */
export const ReferencePicker: React.FC<ReferencePickerProps> = props => {
  const pickerItemOptions: ODataParams<Folder> = {
    select: ['DisplayName', 'Path', 'Id', 'Children/IsFolder', 'IsFolder', 'Avatar', 'Icon'] as any,
    expand: ['Children'] as any,
    filter: props.allowedTypes
      ? createTypeFilterString(props.allowedTypes)
      : "(isOf('Folder') and not isOf('SystemFolder'))",
    metadata: 'no',
    orderby: 'DisplayName',
  }

  const { items, setSelectedItem, navigateTo, isLoading, error } = useListPicker<GenericContent>({
    repository: props.repository,
    currentPath: props.path,
    itemsODataOptions: pickerItemOptions,
  })
  const [showLoading, setShowLoading] = useState(false)

  const onClickHandler = (_e: React.MouseEvent, node: GenericContent) => {
    setSelectedItem(node)
    if (props.allowedTypes && props.allowedTypes.indexOf(node.Type) > -1) {
      props.select(node)
    }
  }

  // Wait to show spinner to prevent content jumping
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowLoading(isLoading)
    }, 800)
    return () => {
      window.clearTimeout(timer)
    }
  }, [isLoading])

  const iconName = (isFolder?: boolean) => {
    if (isFolder == null) {
      return 'arrow_upward'
    }
    return isFolder ? 'folder' : 'insert_drive_file'
  }

  if (showLoading) {
    return (
      <div style={styles.loaderContainer}>
        <Fade
          in={showLoading}
          style={{
            transitionDelay: showLoading ? '800ms' : '0ms',
          }}
          unmountOnExit={true}>
          <CircularProgress />
        </Fade>
      </div>
    )
  }

  if (error) {
    return <p>{error.message}</p>
  }

  return (
    <List>
      {items &&
        items.map(node => (
          <ListItem
            key={node.Id}
            button={true}
            onClick={e => onClickHandler(e, node)}
            onDoubleClick={() => navigateTo(node)}
            selected={props.selected.some(c => c.Id === node.Id)}>
            <ListItemIcon style={{ margin: 0 }}>
              {node.Type === 'User' ? (
                <Avatar
                  alt={node.DisplayName}
                  src={
                    (node as User).Avatar
                      ? `${props.repository.configuration.repositoryUrl}${(node as User).Avatar!.Url}`
                      : DEFAULT_AVATAR_PATH
                  }
                />
              ) : props.renderIcon ? (
                props.renderIcon(iconName(node.IsFolder))
              ) : (
                renderIconDefault(iconName(node.IsFolder))
              )}
            </ListItemIcon>
            <ListItemText primary={node.DisplayName} />
          </ListItem>
        ))}
    </List>
  )
}
