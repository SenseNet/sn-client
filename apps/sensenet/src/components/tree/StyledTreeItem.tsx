import { ListItemIcon, ListItemText } from '@material-ui/core'
// @ts-ignore
import { createStyles, Theme, withStyles } from '@material-ui/core/styles'
import TreeItem from '@material-ui/lab/TreeItem'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Icon } from '../Icon'
import { ExpandItemsContext } from './Contexts/ExpandedItemsProvider'
import StyledTreeItemProps from './Props/StyledTreeItemProps'
// @ts-ignore
export const StyledTreeItem = withStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      '& .close': {
        opacity: 0.3,
      },
    },
    group: {
      marginLeft: 7,
      paddingLeft: 18,
      borderLeft: `1px dashed #cececeff`,
    },
  }),
)((props: StyledTreeItemProps) => {
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
  // const loadCollectionCB = useCallback(() => {
  //   function loadCollection(contentPath: string): Promise<ODataCollectionResponse<GenericContent>> {
  //     return repo.loadCollection<GenericContent>({
  //       path: contentPath,
  //       oDataOptions: {
  //         select: ['Id', 'Path', 'Name', 'DisplayName', 'Type', 'Actions', 'Icon', 'ParentId'],
  //         onlyselectList: true,
  //       },
  //     })
  //   }

  //   setChildrenLoaded(true)
  //   const respRequest = loadCollection(props.contentvalue.Path)
  //   respRequest.then((result: any) => {
  //     const elements = result?.d.results.map((innerChild: GenericContent) => {
  //       return (
  //         <StyledTreeItem
  //           id="1"
  //           key={innerChild.Id}
  //           activeItemPath={props.activeItemPath}
  //           itemID={innerChild.Id.toString()}
  //           nodeId={innerChild.Id.toString()}
  //           label={`${innerChild.Name} ${innerChild.Id}`}
  //           contentvalue={innerChild}
  //           isOpen={true}
  //           parentisopen={true}
  //           onNavigate={props.onNavigate}
  //           // addItemToExpanded={props.addItemToExpanded}
  //           // expandedItems={props.expandedItems}
  //           // getExpandedItems={props.getExpandedItems}
  //         />
  //       )
  //     })
  //     setInnerElements(elements)
  //     //}
  //   })
  // }, [props.activeItemPath, props.contentvalue.Path, props.onNavigate, repo])

  // useEffect(() => {
  //   const childs = loadChildren(props.contentvalue.Path)
  //   const elements = childs?.map((innerChild: GenericContent) => {
  //     return (
  //       <StyledTreeItem
  //         id="1"
  //         key={innerChild.Id}
  //         activeItemPath={props.activeItemPath}
  //         itemID={innerChild.Id.toString()}
  //         nodeId={innerChild.Id.toString()}
  //         label={`${innerChild.Name} ${innerChild.Id}`}
  //         contentvalue={innerChild}
  //         isOpen={true}
  //         parentisopen={true}
  //         onNavigate={props.onNavigate}
  //         // addItemToExpanded={props.addItemToExpanded}
  //         // expandedItems={props.expandedItems}
  //         // getExpandedItems={props.getExpandedItems}
  //       />
  //     )
  //   })
  //   if (elements !== undefined) {
  //     setInnerElements(elements)
  //   }
  // }, [props.activeItemPath, props.contentvalue.Path, props.onNavigate, loadChildren])
  // useEffect(() => {
  //   console.log('#exptree: 2nd 0cb', props.contentvalue.Id, props.activeItemPath, props.contentvalue.Path)
  //   //első gyerekeke letöltése
  //   if (!childrenLoaded && props.id !== undefined && props.id === '0') {
  //     console.log('#exptree: 1st lcb', props.contentvalue.Id)
  //     loadCollectionCB()
  //   }
  //   //A currentpath-t tartalmazó elemeket kinyitjuk
  //   if (props.activeItemPath.startsWith(props.contentvalue.Path)) {
  //     console.log('#exptree: 2nd lcb', props.contentvalue.Id, props.activeItemPath, props.contentvalue.Path)
  //     // loadCollectionCB()
  //     // const { data, fetchData, loading } = useGlobalCacheFetch('https://jsonplaceholder.typicode.com/todos', 60000)
  //     // fetchData().then(() => {
  //     //   console.log('fetchData result', data)
  //     // })
  //     setExpandItems((eItems) => eItems.add(props.contentvalue.Id.toString()))
  //   }

  //   //Első betöltésre: Ha a parent parentje closed akkor nem töltök be gyerek elemeket, amikor a treeitem nincs nyitva, de a parent igen
  //   console.log('#exptree: 3rd lcb', props.contentvalue, expandItems)
  //   let parentIdString = ''
  //   const parentId = props.contentvalue.ParentId?.toString()
  //   if (parentId !== undefined) {
  //     parentIdString = parentId
  //   }
  //   if (expandItems.has(parentIdString)) {
  //     //loadCollectionCB()
  //     console.log('#exptree: parent opened', props.contentvalue, expandItems)
  //   }
  // }, [
  //   props,
  //   childrenLoaded,
  //   loadCollectionCB,
  //   expandItems,
  //   setExpandItems,
  //   props.contentvalue.Path,
  //   props.isOpen,
  //   props.parentisopen,
  //   repo,
  // ])
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
})
