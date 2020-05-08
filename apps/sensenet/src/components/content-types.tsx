import { useRepository } from '@sensenet/hooks-react'
import clsx from 'clsx'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { applicationPaths, resolvePathParams } from '../application-paths'
import { useGlobalStyles } from '../globalStyles'
import { useLocalization, useSelectionService } from '../hooks'
import { useDialogActionService } from '../hooks/use-dialogaction-service'
import { getPrimaryActionUrl } from '../services'
import { SimpleList } from './content/Simple'

const contentTypesPath = '/Root/System/Schema/ContentTypes'
const fieldsToDisplay = ['DisplayName', 'Description', 'ParentTypeName' as any, 'ModificationDate', 'ModifiedBy']

export default function ContentTypes() {
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
        <span style={{ fontSize: '20px' }}>{localizationDrawerTitles.ContentTypes}</span>
      </div>
      <SimpleList
        parent={contentTypesPath}
        rootPath={contentTypesPath}
        loadChildrenSettings={{
          select: fieldsToDisplay,
          query: "+TypeIs:'ContentType' .AUTOFILTERS:OFF",
        }}
        contentListProps={{
          enableBreadcrumbs: false,
          parentIdOrPath: contentTypesPath,
          fieldsToDisplay,
          onActivateItem: (p) => {
            history.push(getPrimaryActionUrl(p, repository))
          },
        }}
      />
    </div>
  )
}
