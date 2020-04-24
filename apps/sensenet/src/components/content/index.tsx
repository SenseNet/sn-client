import { ConstantContent } from '@sensenet/client-core'
import { tuple } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { ResponsivePersonalSettings } from '../../context'
import { getPrimaryActionUrl } from '../../services'
import Commander from './Commander'
import { Explore } from './Explore'
import { SimpleList } from './Simple'

export const BrowseType = tuple('commander', 'explorer', 'simple')

export interface BrowseData {
  type?: typeof BrowseType[number]
  root?: string
  currentContent?: number | string
  secondaryContent?: number | string // right parent
  fieldsToDisplay?: Array<keyof GenericContent>
}

export const encodeBrowseData = (data: BrowseData) => encodeURIComponent(btoa(JSON.stringify(data)))
export const decodeBrowseData = (encoded: string) => JSON.parse(atob(decodeURIComponent(encoded))) as BrowseData

export const Content = () => {
  const repo = useRepository()
  const match = useRouteMatch<{ browseData: string }>()
  const history = useHistory()
  const settings = useContext(ResponsivePersonalSettings)
  const logger = useLogger('Browse view')
  const [browseData, setBrowseData] = useState<BrowseData>({
    type: settings.content.browseType,
  })

  useEffect(() => {
    try {
      const data = decodeBrowseData(match.params.browseData)
      setBrowseData((previousData) => {
        return { ...previousData, ...data }
      })
    } catch (error) {
      logger.warning({ message: 'Wrong link :(' })
    }
  }, [logger, match.params.browseData])

  const refreshUrl = useCallback(
    (data: BrowseData) => {
      history.push(`/${btoa(repo.configuration.repositoryUrl)}/browse/${encodeBrowseData(data)}`)
    },
    [history, repo.configuration.repositoryUrl],
  )

  const navigate = useCallback(
    (itm: GenericContent) => {
      const newBrowseData = {
        ...browseData,
        currentContent: itm.Id,
      }
      setBrowseData(newBrowseData)
      refreshUrl(newBrowseData)
    },
    [browseData, refreshUrl],
  )

  const navigateSecondary = useCallback(
    (itm: GenericContent) => {
      const newBrowseData = {
        ...browseData,
        secondaryContent: itm.Id,
      }
      setBrowseData(newBrowseData)
      refreshUrl(newBrowseData)
    },
    [browseData, refreshUrl],
  )

  const openItem = useCallback(
    (itm: GenericContent) => {
      history.push(getPrimaryActionUrl(itm, repo))
    },
    [history, repo],
  )

  return (
    <>
      {browseData.type === 'commander' ? (
        <Commander
          rootPath={browseData.root || ConstantContent.PORTAL_ROOT.Path}
          leftParent={browseData.currentContent || browseData.root || ConstantContent.PORTAL_ROOT.Id}
          rightParent={browseData.secondaryContent || browseData.root || ConstantContent.PORTAL_ROOT.Id}
          onActivateItem={openItem}
          onNavigateLeft={navigate}
          onNavigateRight={navigateSecondary}
          fieldsToDisplay={browseData.fieldsToDisplay}
        />
      ) : browseData.type === 'explorer' ? (
        <Explore
          rootPath={browseData.root || ConstantContent.PORTAL_ROOT.Path}
          onNavigate={navigate}
          onActivateItem={openItem}
          parentIdOrPath={browseData.currentContent || browseData.root || ConstantContent.PORTAL_ROOT.Id}
          fieldsToDisplay={browseData.fieldsToDisplay}
        />
      ) : (
        <SimpleList
          rootPath={browseData.root || ConstantContent.PORTAL_ROOT.Path}
          contentListProps={{
            onActivateItem: openItem,
            onParentChange: navigate,
            fieldsToDisplay: browseData.fieldsToDisplay,
            parentIdOrPath: browseData.currentContent || browseData.root || ConstantContent.PORTAL_ROOT.Id,
          }}
          parent={browseData.currentContent || browseData.root || ConstantContent.PORTAL_ROOT.Id}
        />
      )}
    </>
  )
}

export default Content
