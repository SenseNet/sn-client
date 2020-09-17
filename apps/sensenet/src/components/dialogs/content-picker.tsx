import { ConstantContent } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { useListPicker } from '@sensenet/pickers-react'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import React from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { Icon } from '../Icon'
import { DialogTitle, useDialog } from '.'

export interface ContentPickerDialogProps {
  currentPath: string
  rootPath?: string
  content: GenericContent
  handleSubmit?: (path: string) => void
}

export const ContentPickerDialog: React.FunctionComponent<ContentPickerDialogProps> = (props) => {
  const repository = useRepository()
  const { closeLastDialog } = useDialog()

  const list = useListPicker({
    repository,
    currentPath: props.currentPath,
    rootPath: props.rootPath || ConstantContent.PORTAL_ROOT.Path,
    itemsODataOptions: { filter: '' },
  })
  const localization = useLocalization().contentPickerDialog
  const globalClasses = useGlobalStyles()

  return (
    <>
      <DialogTitle>
        <div className={globalClasses.centeredVertical}>
          <Icon item={props.content} style={{ marginRight: '1em' }} />
          {localization.title.replace('{0}', props.content.DisplayName || props.content.Name).replace('{1}', list.path)}
        </div>
      </DialogTitle>
      <DialogContent>
        <p>{list.path}</p>
        <List>
          {list.items?.map((item) => (
            <ListItem
              key={item.Id}
              button={true}
              selected={list.selectedItem === item}
              onClick={() => list.setSelectedItem(item)}
              onDoubleClick={() => {
                list.navigateTo(item)
                list.reload()
              }}>
              <ListItemIcon>{item.isParent ? <ArrowUpward /> : <Icon item={item} />}</ListItemIcon>
              <ListItemText primary={item.isParent ? '...' : item.DisplayName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          aria-label={localization.cancelButton}
          className={globalClasses.cancelButton}
          onClick={() => closeLastDialog()}>
          {localization.cancelButton}
        </Button>
        <Button
          aria-label={localization.selectButton}
          color="primary"
          variant="contained"
          autoFocus={true}
          onClick={async () => {
            props.handleSubmit?.(list.selectedItem?.Path || list.path)
            closeLastDialog()
          }}>
          {localization.selectButton}
        </Button>
      </DialogActions>
    </>
  )
}

export default ContentPickerDialog
