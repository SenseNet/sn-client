import { ConstantContent } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useEffect, useState } from 'react'
import {
  CurrentAncestorsProvider,
  CurrentChildrenProvider,
  CurrentContentContext,
  CurrentContentProvider,
  LoadSettingsContextProvider,
} from '../../context'
import { useRepository, useSelectionService } from '../../hooks'
import { AddButton } from '../AddButton'
import { CollectionComponent } from '../content-list'
import { AddDialog, CopyMoveDialog } from '../dialogs'

export const CommanderComponent: React.FunctionComponent<{
  leftParent: number | string
  rightParent: number | string
  onNavigateLeft: (newParent: GenericContent) => void
  onNavigateRight: (newParent: GenericContent) => void
  onActivateItem: (item: GenericContent) => void
}> = props => {
  const repo = useRepository()

  const selectionService = useSelectionService()

  const [_leftPanelRef, setLeftPanelRef] = useState<null | any>(null)
  const [_rightPanelRef, setRightPanelRef] = useState<null | any>(null)

  const [activePanel, setActivePanel] = useState<'left' | 'right'>('left')
  const [activeParent, setActiveParent] = useState<GenericContent>(null as any)

  const [isCopyOpened, setIsCopyOpened] = useState(false)
  const [copyMoveOperation, setCopyMoveOperation] = useState<'copy' | 'move'>('copy')
  const [copySelection, setCopySelection] = useState<GenericContent[]>([ConstantContent.PORTAL_ROOT])
  const [copyParent, setCopyParent] = useState<GenericContent>(ConstantContent.PORTAL_ROOT)
  const [leftParent, setLeftParent] = useState<GenericContent>(ConstantContent.PORTAL_ROOT)
  const [rightParent, setRightParent] = useState<GenericContent>(ConstantContent.PORTAL_ROOT)

  const [leftSelection, setLeftSelection] = useState<GenericContent[]>([])

  const [rightSelection, setRightSelection] = useState<GenericContent[]>([])

  const [isAddDialogOpened, setIsAddDialogOpened] = useState(false)

  useEffect(() => {
    activePanel === 'left' ? setActiveParent(leftParent) : setActiveParent(rightParent)
  }, [leftParent, rightParent, activePanel])

  return (
    <div
      onKeyDown={async ev => {
        if ((ev.key === 'F5' || ev.key === 'F6') && !ev.shiftKey) {
          ev.preventDefault()
          ev.stopPropagation()
          if (activePanel === 'left') {
            setCopySelection(leftSelection)
            setCopyParent(rightParent)
          } else {
            setCopySelection(rightSelection)
            setCopyParent(leftParent)
          }
          if (copySelection && copySelection.length && copyParent) {
            setCopyMoveOperation(ev.key === 'F5' ? 'copy' : 'move')
            setIsCopyOpened(true)
          }
        } else if (ev.key === 'F7') {
          ev.preventDefault()
          ev.stopPropagation()
          setIsAddDialogOpened(true)
        }
      }}
      style={{ display: 'flex', width: '100%', height: '100%' }}>
      <LoadSettingsContextProvider>
        <CurrentContentProvider idOrPath={props.leftParent}>
          <CurrentContentContext.Consumer>
            {lp => {
              setLeftParent(lp)
              return null
            }}
          </CurrentContentContext.Consumer>
          <CurrentChildrenProvider>
            <CurrentAncestorsProvider>
              <CollectionComponent
                onFocus={() => {
                  setActivePanel('left')
                }}
                enableBreadcrumbs={true}
                onActivateItem={props.onActivateItem}
                containerRef={r => setLeftPanelRef(r)}
                style={{ width: '100%', maxHeight: '100%' }}
                parentIdOrPath={props.leftParent}
                onParentChange={props.onNavigateLeft}
                onSelectionChange={sel => {
                  setLeftSelection(sel)
                  selectionService.selection.setValue(sel)
                }}
                onTabRequest={() => _rightPanelRef && _rightPanelRef.focus()}
                onActiveItemChange={item => selectionService.activeContent.setValue(item)}
              />
            </CurrentAncestorsProvider>
          </CurrentChildrenProvider>
        </CurrentContentProvider>
        <CurrentContentProvider idOrPath={props.rightParent}>
          <CurrentContentContext.Consumer>
            {rp => {
              setRightParent(rp)
              return null
            }}
          </CurrentContentContext.Consumer>
          <CurrentChildrenProvider>
            <CurrentAncestorsProvider>
              <CollectionComponent
                enableBreadcrumbs={true}
                onFocus={() => {
                  setActivePanel('right')
                }}
                onActivateItem={props.onActivateItem}
                containerRef={r => setRightPanelRef(r)}
                parentIdOrPath={props.rightParent}
                style={{ width: '100%', borderLeft: '1px solid rgba(255,255,255,0.3)', maxHeight: '100%' }}
                onParentChange={props.onNavigateRight}
                onSelectionChange={sel => {
                  setRightSelection(sel)
                  selectionService.selection.setValue(sel)
                }}
                onTabRequest={() => _leftPanelRef && _leftPanelRef.focus()}
                onActiveItemChange={item => selectionService.activeContent.setValue(item)}
              />
            </CurrentAncestorsProvider>
          </CurrentChildrenProvider>
        </CurrentContentProvider>
      </LoadSettingsContextProvider>
      {isCopyOpened ? (
        <CopyMoveDialog
          dialogProps={{
            open: isCopyOpened,
            onClose: () => setIsCopyOpened(false),
          }}
          operation={copyMoveOperation}
          content={copySelection}
          currentParent={copyParent}
        />
      ) : null}

      {activeParent ? (
        <>
          <AddButton parent={activeParent} />
          <AddDialog
            parent={activeParent}
            schema={repo.schemas.getSchemaByName('Folder')}
            dialogProps={{
              open: isAddDialogOpened,
              onClose: () => setIsAddDialogOpened(false),
            }}
          />
        </>
      ) : null}
    </div>
  )
}

export default CommanderComponent
