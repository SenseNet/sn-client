import { Collapse, ListItemIcon, ListItemText } from '@material-ui/core'
// @ts-ignore
import { createStyles, Theme, withStyles } from '@material-ui/core/styles'
import { TransitionProps } from '@material-ui/core/transitions'
import TreeItem from '@material-ui/lab/TreeItem'
import { ODataCollectionResponse } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { useCallback, useEffect, useState } from 'react'
import { Icon } from '../Icon'
import StyledTreeItemProps from './Props/StyledTreeItemProps'
function isOpen(prop: any) {
  return prop !== undefined && prop !== false
}
function TransitionComponent(props: TransitionProps) {
  return (
    <div>
      <Collapse in={true} {...props} />
    </div>
  )
}
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
  const repo = useRepository()
  const [innerElements, setInnerElements] = useState<[]>()
  // const [elementsLoaded, setElemetnsLoaded] = useState<boolean>()
  const loadCollectionCB = useCallback(() => {
    function loadCollection(): Promise<ODataCollectionResponse<GenericContent>> {
      return repo.loadCollection<GenericContent>({
        path: props.contentValue.Path,
        oDataOptions: { select: ['Path', 'Name', 'DisplayName', 'Type', 'Actions'] },
      })
    }
    const respRequest = loadCollection()
    respRequest.then((result: any) => {
      //console.log('#tree: loadCollectionCB')
      //const piso = isOpen(props['aria-expanded'])
      //if (!elementsLoaded || (elementsLoaded && piso)) {
      // setElemetnsLoaded(true)
      //console.log('#tree:amottan piso:', piso, props.contentValue.Name)
      const elements = result?.d.results.map((innerChild: GenericContent) => {
        props.addItemToExpanded(innerChild)
        return (
          <StyledTreeItem
            key={innerChild.Id}
            itemID={innerChild.Id.toString()}
            id="1"
            nodeId={innerChild.Path}
            label={innerChild.Name}
            contentValue={innerChild}
            isOpen={true}
            parentIsOpen={true}
            onNavigate={props.onNavigate}
            addItemToExpanded={props.addItemToExpanded}
            //aria-expanded={true}
          />
        )
      })
      setInnerElements(elements)
      //}
    })
  }, [props, repo])

  useEffect(() => {
    //TODO:ha onNavigate van akkor újra tölti az egészet, ezt meg kell akadályozni
    console.log('#tree: 1>', isOpen(props['aria-expanded']), props.contentValue.Name)
    //ha a root element van
    if (props.id !== undefined && props.id === '0') {
      console.log('#tree:root', props.contentValue.Name)
      loadCollectionCB()
    }
    //amikor a treeitem nincs nyitva, de a parent igen
    if (!isOpen(props['aria-expanded']) && props.parentIsOpen) {
      console.log('#tree:ottan2', props.contentValue.Name)
      loadCollectionCB()
    }
  }, [loadCollectionCB, props, props.contentValue.Path, props.isOpen, props.parentIsOpen, repo])
  //Első betöltésre: Ha a parent parentje closed akkor nem töltök be gyerek elemeket
  //On click-re csak contextust kell válltani
  return (
    <TreeItem
      {...props}
      label={
        <>
          <ListItemIcon key={props.contentValue.Id}>
            <Icon item={props.contentValue} />
          </ListItemIcon>
          <ListItemText style={{ fontSize: '11px!important' }} primary={props.contentValue.Name} />
        </>
      }
      id="0"
      TransitionComponent={TransitionComponent}
      onIconClick={() => {
        //console.log('#tree: letöltöm a gyerekeket')
        loadCollectionCB()
      }}
      onLabelClick={() => {
        console.log('#tree:labelclicked')
        props.onNavigate(props.contentValue)
      }}>
      {innerElements}
    </TreeItem>
  )
})
