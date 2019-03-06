import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { ODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useContext, useEffect, useState } from 'react'
import { rootStateType } from '../../store'
import { Icon } from '../Icon'
import { InjectorContext } from '../InjectorContext'

export interface TreeProps {
  parentPath: string
  ancestorPaths?: string[]
  onItemClick?: (item: GenericContent) => void
  activeItemId?: number
  loadOptions?: ODataParams<GenericContent>
  style?: React.CSSProperties
}

export const mapStateToProps = (state: rootStateType) => ({
  currentItem: state.commander.left,
})

export const Tree: React.FunctionComponent<TreeProps> = props => {
  const [items, setItems] = useState<GenericContent[]>([])
  const [opened, setOpened] = useState<number[]>([])
  const injector = useContext(InjectorContext)

  const repo = injector.GetInstance(Repository)

  useEffect(() => {
    ;(async () => {
      const children = await repo.loadCollection({
        path: props.parentPath,
        oDataOptions: {
          filter: 'IsFolder eq true',
          ...props.loadOptions,
        },
      })
      setItems(children.d.results)
    })()
  }, [])

  return (
    <div style={props.style}>
      <List dense={true}>
        {items.map(content => {
          const isOpened =
            opened.includes(content.Id) || (props.ancestorPaths && props.ancestorPaths.includes(content.Path))
          return (
            <div key={content.Id}>
              <ListItem
                button={true}
                selected={props.activeItemId === content.Id}
                onClick={() => {
                  props.onItemClick && props.onItemClick(content)
                  setOpened(
                    isOpened ? opened.filter(o => o !== content.Id) : Array.from(new Set([...opened, content.Id])),
                  )
                }}>
                <ListItemIcon>
                  <Icon item={content} />
                </ListItemIcon>
                <ListItemText style={{ padding: 0 }} inset={true} primary={content.DisplayName || content.Name} />
              </ListItem>
              <Collapse style={{ marginLeft: '1em' }} in={isOpened} timeout="auto" unmountOnExit={true}>
                {isOpened ? (
                  <Tree
                    parentPath={content.Path}
                    onItemClick={props.onItemClick}
                    activeItemId={props.activeItemId}
                    ancestorPaths={props.ancestorPaths}
                  />
                ) : null}
              </Collapse>
            </div>
          )
        })}
      </List>
    </div>
  )
}
