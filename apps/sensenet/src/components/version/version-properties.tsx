import { Schema } from '@sensenet/default-content-types'
import { CurrentContentProvider } from '@sensenet/hooks-react'
import { createStyles, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { useGlobalStyles } from '../../globalStyles'
import { useSelectionService } from '../../hooks'
import { VersionView } from '../view-controls'

const useStyles = makeStyles(() => {
  return createStyles({
    versionsWrapper: {
      padding: '0',
      overflow: 'auto',
    },
  })
})

export default function VersionProperties() {
  const match = useRouteMatch<{ contentId: string }>()
  const history = useHistory<{ schema: Schema }>()
  const selectionService = useSelectionService()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <div className={clsx(globalClasses.full, classes.versionsWrapper)}>
      <CurrentContentProvider
        idOrPath={match.params.contentId}
        onContentLoaded={(content) => {
          selectionService.activeContent.setValue(content)
        }}
        oDataOptions={{ select: 'all' }}>
        <VersionView handleCancel={history.goBack} isFullPage={true} />
      </CurrentContentProvider>
    </div>
  )
}
