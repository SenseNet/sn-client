import { reactControlMapper } from '@sensenet/controls-react'
import { GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import {
  Avatar,
  Button,
  createStyles,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Theme,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import CloseIcon from '@material-ui/icons/Close'
import React, { createElement, useState } from 'react'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization, usePagination } from '../../hooks'
import { Icon } from '../Icon'
import { DialogTitle, useDialog } from '.'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    closeButton: {
      position: 'absolute',
      right: theme.spacing(3),
      top: 0,
      color: globals.common.headerText,

      '&:hover': {
        backgroundColor: '#3c4359',
      },
    },
  })
})

export type ReferenceContentListProps = {
  items: GenericContent[]
  parent: GenericContent
  fieldName: string
  canEdit: boolean
}

export function ReferenceContentList(props: ReferenceContentListProps) {
  const [references, setReferences] = useState(props.items)
  const [newReference, setNewReference] = useState<GenericContent>()
  const [requestClearToken, setRequestClearToken] = useState<number>()

  const { closeLastDialog } = useDialog()
  const globalClasses = useGlobalStyles()
  const classes = useStyles()
  const repository = useRepository()
  const pagination = usePagination({ items: references, color: 'primary' })
  const controlMapper = reactControlMapper(repository)
  const logger = useLogger('ReferenceContentList')
  const localization = useLocalization()

  const schema = controlMapper.getFullSchemaForContentType(props.parent.Type, 'new')
  const field = schema.fieldMappings.find((fieldMap) => fieldMap.fieldSettings.Name === props.fieldName)

  const fieldControl = createElement(
    controlMapper.getControlForContentField(props.parent.Type, props.fieldName, 'new'),
    {
      repository,
      settings: field!.fieldSettings,
      content: props.parent,
      actionName: 'new',
      fieldOnChange: (_, value: GenericContent) => {
        setNewReference(value)
      },
      triggerClear: requestClearToken,
    },
  )

  const handleAddMembers = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!references.find((reference) => reference.Id === newReference?.Id)) {
      const newReferences = [newReference!, ...references]
      await repository.patch({
        idOrPath: props.parent.Id,
        content: { [props.fieldName]: newReferences.map((ref) => ref.Id) },
        forceRefresh: true,
      })
      setReferences(newReferences)
    } else {
      logger.error({
        message: localization.referenceContentListDialog.errorAlreadyInList,
        data: {
          relatedContent: newReference,
        },
      })
    }
    setNewReference(undefined)
    setRequestClearToken(new Date().getUTCMilliseconds())
    pagination.setCurrentPage(1)
  }

  return (
    <>
      <DialogTitle>
        {props.parent.DisplayName}
        <IconButton aria-label="close" className={classes.closeButton} onClick={closeLastDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {props.canEdit && (
          <form className={globalClasses.centeredVertical} onSubmit={handleAddMembers}>
            {fieldControl}
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              style={{ marginLeft: '0.5rem' }}
              disabled={!newReference}
              type="submit">
              Add
            </Button>
          </form>
        )}

        {pagination.currentItems.length ? (
          <>
            <List>
              {pagination.currentItems.map((item) => (
                <ListItem key={item.Id}>
                  <ListItemAvatar>
                    <Avatar>
                      <Icon item={item} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={item.DisplayName} />
                  {props.canEdit && (
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={async () => {
                          const remainedReferences = references.filter((content) => item.Id !== content.Id)
                          await repository.patch({
                            idOrPath: props.parent.Id,
                            content: { [props.fieldName]: remainedReferences.map((content) => content.Id) },
                            forceRefresh: true,
                          })
                          setReferences(remainedReferences)
                        }}>
                        <ClearIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List>
            <div className={globalClasses.centeredHorizontal}>{pagination.render()}</div>
          </>
        ) : (
          <div style={{ margin: '1rem 0' }}>No items</div>
        )}
      </DialogContent>
    </>
  )
}

export default ReferenceContentList
