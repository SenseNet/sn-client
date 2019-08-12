import React, { useCallback, useContext, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { GenericContent } from '@sensenet/default-content-types'
import { ConstantContent } from '@sensenet/client-core'
import { ResponsivePersonalSetttings } from '../../context'
import { useContentRouting, useLogger, useRepository } from '../../hooks'
import { tuple } from '../../utils/tuple'
import Commander from './Commander'
import { Explore } from './Explore'
import { SimpleList } from './Simple'

export const BrowseType = tuple('commander', 'explorer', 'simple')

export interface BrowseData {
  type: typeof BrowseType[number]
  root?: string
  currentContent?: number | string
  secondaryContent?: number | string // right parent
  fieldsToDisplay?: Array<keyof GenericContent>
}

export const encodeBrowseData = (data: BrowseData) => encodeURIComponent(btoa(JSON.stringify(data)))
export const decodeBrowseData = (encoded: string) => JSON.parse(atob(decodeURIComponent(encoded))) as BrowseData

export const Content: React.FunctionComponent<RouteComponentProps<{ browseData: string }>> = props => {
  const repo = useRepository()
  const settings = useContext(ResponsivePersonalSetttings)
  const logger = useLogger('Browse view')

  const [browseData, setBrowseData] = useState<BrowseData>({
    type: settings.content.browseType,
  })
  const contentRouter = useContentRouting()

  useEffect(() => {
    try {
      const data = decodeBrowseData(props.match.params.browseData)
      setBrowseData(data)
    } catch (error) {
      logger.warning({ message: 'Wrong link :(' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logger, props.match.params.browseData])

  const refreshUrl = useCallback(
    (data: BrowseData) => {
      props.history.push(`/${btoa(repo.configuration.repositoryUrl)}/browse/${encodeBrowseData(data)}`)
    },
    [props.history, repo.configuration.repositoryUrl],
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
      props.history.push(contentRouter.getPrimaryActionUrl(itm))
    },
    [contentRouter, props.history],
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
          parent={browseData.currentContent || browseData.root || ConstantContent.PORTAL_ROOT.Id}
          fieldsToDisplay={browseData.fieldsToDisplay}
        />
      ) : (
        <SimpleList
          rootPath={browseData.root || ConstantContent.PORTAL_ROOT.Path}
          onNavigate={navigate}
          onActivateItem={openItem}
          parent={browseData.currentContent || browseData.root || ConstantContent.PORTAL_ROOT.Id}
          fieldsToDisplay={browseData.fieldsToDisplay}
        />
      )}
    </>
  )
}

export default Content
