import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { ODataParams, Repository } from '@sensenet/client-core'
import { Folder, GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import { GenericContentWithIsParent, useListPicker } from '@sensenet/pickers-react'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { dmsInjector } from '../../DmsRepository'
import { deselectPickeritem, selectPickerItem } from '../../store/picker/actions'
import { rootStateType } from '../../store/rootReducer'

interface PathPickerProps {
  currentPath: string
}

const mapStateToProps = (state: rootStateType) => {
  return {
    pickerItems: state.dms.picker.items,
  }
}

const mapDispatchToProps = {
  selectPickerItem,
  deselectPickeritem,
}

const pickerItemOptions: ODataParams<Folder> = {
  select: ['DisplayName', 'Path', 'Id', 'Children/IsFolder'] as any,
  expand: ['Children'] as any,
  filter: "(isOf('Folder') and not isOf('SystemFolder'))",
  metadata: 'no',
  orderby: 'DisplayName',
}

function PathPicker(props: PathPickerProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps) {
  const { items, selectedItem, setSelectedItem, navigateTo, reload } = useListPicker<GenericContentWithIsParent>({
    repository: dmsInjector.getInstance(Repository),
    currentPath: props.currentPath,
    itemsODataOptions: pickerItemOptions,
  })

  // Do a reload when a content is created
  useEffect(() => {
    reload()
  }, [props.pickerItems])

  const hasChildren = (node: GenericContent & { Children: Array<{ IsFolder: boolean }> }) => {
    return node.Children && node.Children.some(child => child.IsFolder)
  }

  const onClickHandler = (_e: React.MouseEvent, node: GenericContentWithIsParent) => {
    // Child navigation / selection
    if (!node.isParent) {
      setSelectedItem(node)
      props.selectPickerItem(node)
      return
    }

    if (selectedItem && selectedItem.ParentId !== node.Id) {
      props.deselectPickeritem()
      setSelectedItem(undefined)
    }
  }

  return (
    <List>
      {items &&
        items.map(node => (
          <ListItem
            key={node.Id}
            onClick={e => onClickHandler(e, node)}
            onDoubleClick={() => navigateTo(node)}
            button={true}
            selected={selectedItem && node.Id === selectedItem.Id}>
            <ListItemIcon>
              <Icon type={iconType.materialui} iconName="folder" />
            </ListItemIcon>
            <ListItemText primary={node.isParent ? '..' : node.DisplayName} />
            {hasChildren(node as any) ? <Icon type={iconType.materialui} iconName="keyboard_arrow_right" /> : null}
          </ListItem>
        ))}
    </List>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PathPicker)
