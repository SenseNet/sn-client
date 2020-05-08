import { useRepository } from '@sensenet/hooks-react'
import clsx from 'clsx'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { applicationPaths, resolvePathParams } from '../application-paths'
import { useGlobalStyles } from '../globalStyles'
import { useLocalization, useSelectionService } from '../hooks'
import { useDialogActionService } from '../hooks/use-dialogaction-service'
import { getPrimaryActionUrl } from '../services'
import { SimpleList } from './content/Simple'

export default function Localization() {
  const globalClasses = useGlobalStyles()
  const repository = useRepository()
  const localizationDrawerTitles = useLocalization().drawer.titles
  const history = useHistory()
  const dialogActionService = useDialogActionService()
  const selectionService = useSelectionService()

  useEffect(() => {
    const activeDialogActionObserve = dialogActionService.activeAction.subscribe(
      (newDialogAction) =>
        selectionService.activeContent.getValue() &&
        (newDialogAction === 'edit'
          ? history.push(
              resolvePathParams({
                path: applicationPaths.editProperties,
                params: { contentId: selectionService.activeContent.getValue()!.Id },
              }),
            )
          : newDialogAction === 'browse' &&
            history.push(
              resolvePathParams({
                path: applicationPaths.browseProperties,
                params: { contentId: selectionService.activeContent.getValue()!.Id },
              }),
            )),
    )

    return function cleanup() {
      activeDialogActionObserve.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogActionService.activeAction])

  return (
    <div className={globalClasses.contentWrapper}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)}>
        <span style={{ fontSize: '20px' }}>{localizationDrawerTitles.Localization}</span>
      </div>
      <SimpleList
        parent="/Root/Localization"
        rootPath="/Root/Localization"
        contentListProps={{
          enableBreadcrumbs: false,
          parentIdOrPath: '/Root/Localization',
          onActivateItem: (p) => {
            history.push(getPrimaryActionUrl(p, repository))
          },
        }}
      />
    </div>
  )
}
