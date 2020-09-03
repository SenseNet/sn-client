import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'
import React from 'react'
import { useGlobalStyles } from '../../../globalStyles'
import { Icon } from '../../Icon'

type ReferenceListProps = {
  pagination: {
    render: () => JSX.Element | null
    currentItems: GenericContent[]
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  }
  canEdit: boolean
  references: GenericContent[]
  setReferences: (refs: GenericContent[]) => void
  parent: GenericContent
  fieldName: string
}

export const ReferenceList: React.FC<ReferenceListProps> = (props) => {
  const globalClasses = useGlobalStyles()
  const repository = useRepository()

  return (
    <>
      {props.pagination.currentItems.length ? (
        <>
          <List>
            {props.pagination.currentItems.map((item) => (
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
                        const remainedReferences = props.references.filter((content) => item.Id !== content.Id)
                        await repository.patch({
                          idOrPath: props.parent.Id,
                          content: { [props.fieldName]: remainedReferences.map((content) => content.Id) },
                          forceRefresh: true,
                        })
                        props.setReferences(remainedReferences)
                      }}>
                      <ClearIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
          <div className={globalClasses.centeredHorizontal}>{props.pagination.render()}</div>
        </>
      ) : (
        <div style={{ margin: '1rem 0' }}>No items</div>
      )}
    </>
  )
}
