import { createStyles, makeStyles } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { CurrentContentProvider } from '@sensenet/hooks-react'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useSelectionService } from '../../hooks'
import { useDialogActionService } from '../../hooks/use-dialogaction-service'
import { useQuery } from '../../hooks/use-query'
import { NewView } from '../view-controls/new-view'

const useStyles = makeStyles(() => {
  return createStyles({
    editWrapper: {
      padding: '0',
      overflow: 'auto',
    },
    breadcrumbsWrapper: {
      height: globals.common.drawerItemHeight,
      boxSizing: 'border-box',
    },
  })
})

export default function NewProperties() {
  const query = useQuery()
  const selectionService = useSelectionService()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const [currentContent, setCurrentContent] = useState<GenericContent | undefined>(undefined)
  const dialogActionService = useDialogActionService()
  const history = useHistory()

  const handleCancel = async () => {
    if (selectionService.activeContent.getValue() !== undefined) {
      selectionService.activeContent.setValue(undefined)
    }
    dialogActionService.activeAction.setValue(undefined)
    dialogActionService.contentTypeNameForNewContent.setValue(undefined)
    history.goBack()
  }

  return (
    <div className={clsx(globalClasses.full, classes.editWrapper)}>
      <CurrentContentProvider
        idOrPath={query.get('path')!}
        onContentLoaded={(c) => {
          selectionService.activeContent.setValue(c)
          setCurrentContent(c)
        }}
        oDataOptions={{ select: 'all' }}>
        <div
          className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)}
          style={{ marginLeft: '30px' }}>
          <span style={{ fontSize: '20px' }}>New {dialogActionService.contentTypeNameForNewContent.getValue()}</span>
        </div>
        {dialogActionService.contentTypeNameForNewContent.getValue() && (
          <NewView
            contentTypeName={dialogActionService.contentTypeNameForNewContent.getValue()!}
            currentContent={currentContent}
            uploadFolderpath="/Root/Content/demoavatars"
            handleCancel={handleCancel}
            isFullPage={true}
            submitCallback={() => {
              dialogActionService.activeAction.setValue(undefined)
              dialogActionService.contentTypeNameForNewContent.setValue(undefined)
              history.goBack()
            }}
          />
        )}
      </CurrentContentProvider>
    </div>
  )
}
