import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { ODataParams, Repository } from '@sensenet/client-core'
import { debounce, PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { Created, EventHub } from '@sensenet/repository-events'
import React, { useContext, useEffect, useState } from 'react'
import { rootStateType } from '../../store'
import { DropFileArea } from '../DropFileArea'
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
  const [reloadTimestamp, setReloadTimestamp] = useState(new Date())
  const injector = useContext(InjectorContext)
  const repo = injector.GetInstance(Repository)
  const eventHub = injector.GetInstance(EventHub)
  const update = debounce(() => {
    setReloadTimestamp(new Date())
  }, 100)
  const handleCreate = (c: Created) => {
    if (
      opened &&
      (c.content as GenericContent).IsFolder &&
      PathHelper.getParentPath(c.content.Path) === PathHelper.trimSlashes(props.parentPath)
    ) {
      update()
    }
  }

  useEffect(() => {
    const subscriptions = [
      eventHub.onContentCreated.subscribe(handleCreate),
      eventHub.onContentCopied.subscribe(handleCreate),
      eventHub.onContentMoved.subscribe(handleCreate),
      eventHub.onContentDeleted.subscribe(d => {
        setItems(items.filter(i => i.Id !== d.contentData.Id))
      }),
    ]
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
    return () => subscriptions.forEach(s => s.dispose())
  }, [reloadTimestamp])

  return (
    <div style={props.style}>
      <List dense={true}>
        {items.map(content => {
          const isOpened =
            opened.includes(content.Id) || (props.ancestorPaths && props.ancestorPaths.includes(content.Path))
          return (
            <div key={content.Id}>
              <DropFileArea parent={content}>
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
              </DropFileArea>
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
