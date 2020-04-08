import { createStyles, makeStyles } from '@material-ui/core'
import { GenericContent, Schema } from '@sensenet/default-content-types'
import { CurrentContentProvider } from '@sensenet/hooks-react'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useSelectionService } from '../../hooks'
import { NewView } from '../view-controls/new-view'
import { useQuery } from '../../hooks/use-query'

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
  const history = useHistory<{ schema: Schema }>()
  const query = useQuery()
  const selectionService = useSelectionService()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const [currentContent, setCurrentContent] = useState<GenericContent | undefined>(undefined)
  const contentTypeName = history.location.state.schema.ContentTypeName

  return (
    <div className={clsx(globalClasses.full, classes.editWrapper)}>
      <CurrentContentProvider
        idOrPath={query.get('path')!}
        onContentLoaded={c => {
          selectionService.activeContent.setValue(c)
          setCurrentContent(c)
        }}
        oDataOptions={{ select: 'all' }}>
        <NewView
          contentTypeName={contentTypeName}
          currentContent={currentContent}
          uploadFolderpath="/Root/Content/demoavatars"
        />
      </CurrentContentProvider>
    </div>
  )
}
