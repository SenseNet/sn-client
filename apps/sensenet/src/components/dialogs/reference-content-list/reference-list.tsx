import {
  Avatar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import { reactControlMapper } from '@sensenet/controls-react'
import { GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React, { createElement, ReactNode, useState } from 'react'
import { useGlobalStyles } from '../../../globalStyles'
import { useLocalization, usePagination } from '../../../hooks'
import { Icon } from '../../Icon'

type ReferenceListProps = {
  canEdit: boolean
  parent: GenericContent
  fieldName: string
  items: GenericContent[]
  renderButton?: (newRef: GenericContent | undefined) => ReactNode
  formStyle?: React.CSSProperties
  listStyle?: React.CSSProperties
}

export const ReferenceList: React.FC<ReferenceListProps> = (props) => {
  const globalClasses = useGlobalStyles()
  const repository = useRepository()
  const controlMapper = reactControlMapper(repository)
  const logger = useLogger('ReferenceContentList')
  const localization = useLocalization()
  const schema = controlMapper.getFullSchemaForContentType(props.parent.Type, 'new')
  const field = schema.fieldMappings.find((fieldMap) => fieldMap.fieldSettings.Name === props.fieldName)
  const [references, setReferences] = useState(props.items)
  const [newReference, setNewReference] = useState<GenericContent>()
  const [requestClearToken, setRequestClearToken] = useState<number>()
  const pagination = usePagination({ items: references, color: 'primary' })

  const fieldControl = field
    ? createElement(controlMapper.getControlForContentField(props.parent.Type, props.fieldName, 'edit'), {
        repository,
        settings: field.fieldSettings,
        content: props.parent,
        actionName: 'edit',
        fieldOnChange: (_, value: GenericContent) => {
          setNewReference(value)
        },
        triggerClear: requestClearToken,
      })
    : null

  const handleAddReference = async (event: React.FormEvent<HTMLFormElement>) => {
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
      logger.warning({
        message: localization.referenceContentListDialog.errorAlreadyInList,
        data: {
          relatedContent: newReference,
          relatedRepository: repository.configuration.repositoryUrl,
        },
      })
    }
    setNewReference(undefined)
    setRequestClearToken(new Date().getUTCMilliseconds())
    pagination.setCurrentPage(1)
  }

  return (
    <>
      {props.canEdit && fieldControl && (
        <form
          className={globalClasses.centeredVertical}
          style={{
            ...props.formStyle,
          }}
          onSubmit={handleAddReference}>
          {fieldControl}
          {props.renderButton ? (
            props.renderButton(newReference)
          ) : (
            <Button
              data-test="reference-add-button"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              style={{ marginLeft: '0.5rem' }}
              disabled={!newReference}
              type="submit">
              Add
            </Button>
          )}
        </form>
      )}
      <div
        style={{
          ...props.listStyle,
        }}>
        {pagination.currentItems.length ? (
          <>
            <List data-test={'reference-list'}>
              {pagination.currentItems.map((item) => (
                <ListItem key={item.Id}>
                  <ListItemAvatar>
                    <Avatar>
                      <Icon item={item} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.DisplayName}
                    data-test={`reference-item-${item.DisplayName?.replace(/\s+/g, '-').toLowerCase()}`}
                  />
                  {props.canEdit && fieldControl && (
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        data-test={`reference-item-remove-${item.DisplayName?.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={async () => {
                          const remainedReferences = references.filter((content) => item.Id !== content.Id)
                          try {
                            await repository.patch({
                              idOrPath: props.parent.Id,
                              content: { [props.fieldName]: remainedReferences.map((content) => content.Id) },
                              forceRefresh: true,
                            })
                            setReferences(remainedReferences)
                          } catch (error) {
                            logger.error({
                              message: error.message,
                              data: {
                                error,
                              },
                            })
                          }
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
      </div>
    </>
  )
}
