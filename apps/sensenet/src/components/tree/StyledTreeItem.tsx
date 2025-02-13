import { ListItemIcon, ListItemText } from '@material-ui/core'
// @ts-ignore
import TreeItem from '@material-ui/lab/TreeItem'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Icon } from '../Icon'
import { ExpandItemsContext } from './Contexts/ExpandedItemsProvider'
import StyledTreeItemProps from './Props/StyledTreeItemProps'
// @ts-ignore
export const StyledTreeItem = (props: StyledTreeItemProps) => {
  const [hasChildren, setHasChildren] = useState<boolean>(true)
  const [innerElements, setInnerElements] = useState<React.JSX.Element[]>()
  const expContext = useContext(ExpandItemsContext)
  if (!expContext) {
    throw new Error('MyComponent must be used within a ExpandItemsProvider')
  }
  const [expandItems, setExpandItems, loadChildren] = expContext
  const loadCollectionCB = useCallback(() => {
    const children = loadChildren(props.contentvalue.Path)
    children.then((result: GenericContent[] | undefined) => {
      const elements = result?.map((innerChild: GenericContent) => {
        return (
          <StyledTreeItem
            id="1"
            key={innerChild.Id}
            activeItemPath={props.activeItemPath}
            itemID={innerChild.Id.toString()}
            nodeId={innerChild.Id.toString()}
            label={`${innerChild.Name} ${innerChild.Id}`}
            contentvalue={innerChild}
            isOpen={true}
            parentisopen={true}
            onNavigate={props.onNavigate}
          />
        )
      })
      if (elements !== undefined) {
        setHasChildren(elements.length > 0)
        setInnerElements(elements)
      }
    })
  }, [loadChildren, props.activeItemPath, props.contentvalue.Path, props.onNavigate])
  useEffect(() => {
    if (props.id === '0') {
      loadCollectionCB()
    }
  }, [props.id, loadCollectionCB])
  //console.log('#exptree on render', expandItems, props.contentvalue.Id)
  if (props.activeItemPath.startsWith(props.contentvalue.Path)) {
    console.log('#exptree: treeitem root render', props.contentvalue.Id, props.activeItemPath, props.contentvalue.Path)
    //loadCollectionCB()
    setExpandItems((eItems) => eItems.add(props.contentvalue.Id.toString()))
  }
  return (
    <TreeItem
      {...props}
      label={
        <>
          <ListItemIcon key={props.contentvalue.Id}>
            <Icon item={props.contentvalue} />
          </ListItemIcon>
          <ListItemText style={{ fontSize: '11px!important' }} primary={`${props.contentvalue.Name}`} />
        </>
      }
      id={props.contentvalue.Id.toString()}
      onIconClick={() => {
        //Ha a lenyílóra kattintasz akkor hozzáadjuk hogy őt ki kell nyitni
        if (expandItems.has(props.contentvalue.Id.toString())) {
          const deleteResult = expandItems.delete(props.contentvalue.Id.toString())
          if (deleteResult) {
            setExpandItems((eItems) => eItems)
            console.log('#exptree: close', props.contentvalue.Id, expandItems)
          }
        } else {
          loadCollectionCB()
          setExpandItems((eItems) => eItems.add(props.contentvalue.Id.toString()))
          console.log('#exptree: open', props.contentvalue.Id, expandItems)
        }
      }}
      onLabelClick={() => {
        //On click-re csak contextust kell válltani
        props.onNavigate(props.contentvalue)
      }}
      collapseIcon={!hasChildren && <></>}>
      {innerElements}
      <></>
    </TreeItem>
  )
}
