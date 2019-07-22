import React, { useCallback, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { GenericContent } from '@sensenet/default-content-types'
import { ConstantContent, ODataParams } from '@sensenet/client-core'
import { LoadSettingsContext } from '../../context'
import { useContentRouting, useLogger, useRepository } from '../../hooks'
import Commander from './Commander'
import { Explore } from './Explore'
import { SimpleList } from './Simple'

export interface BrowseData {
  type: 'commander' | 'explorer' | 'simple'
  root?: number | string
  currentContent?: number | string
  secondaryContent?: number | string // right parent
  loadChildrenSettings?: ODataParams<GenericContent>
}

export const Content: React.FunctionComponent<RouteComponentProps<{ browseData: string }>> = props => {
  const repo = useRepository()

  const logger = useLogger('Browse view')

  const [browseData, setBrowseData] = useState<BrowseData>({
    type: 'commander',
  })
  const contentRouter = useContentRouting()

  useEffect(() => {
    try {
      const data = JSON.parse(atob(decodeURIComponent(props.match.params.browseData)))
      setBrowseData(data)
    } catch (error) {
      logger.warning({ message: 'Wrong link :(' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logger, props.match.params.browseData])

  const refreshUrl = useCallback((data: BrowseData) => {
    props.history.push(
      `/${btoa(repo.configuration.repositoryUrl)}/browse/${encodeURIComponent(btoa(JSON.stringify(data)))}`,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const navigate = useCallback((itm: GenericContent) => {
    const newBrowseData = {
      ...browseData,
      currentContent: itm.Id,
    }
    setBrowseData(newBrowseData)
    refreshUrl(newBrowseData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openItem = useCallback(
    (itm: GenericContent) => {
      props.history.push(contentRouter.getPrimaryActionUrl(itm))
    },
    [contentRouter, props.history],
  )

  return (
    <LoadSettingsContext.Provider
      value={{
        loadAncestorsSettings: {},
        loadChildrenSettings: browseData.loadChildrenSettings || {},
        loadSettings: {},
        setLoadAncestorsSettings: () => ({}),
        setLoadSettings: () => ({}),
        setLoadChildrenSettings: s => {
          const newBrowseData: BrowseData = { ...browseData, loadChildrenSettings: s }
          setBrowseData(newBrowseData)
          refreshUrl(newBrowseData)
        },
      }}>
      {browseData.type === 'commander' ? (
        <Commander
          leftParent={browseData.currentContent || browseData.root || ConstantContent.PORTAL_ROOT.Id}
          rightParent={browseData.secondaryContent || browseData.root || ConstantContent.PORTAL_ROOT.Id}
          onActivateItem={openItem}
          onNavigateLeft={navigate}
          onNavigateRight={_itm => {
            const newBrowseData = {
              ...browseData,
              secondaryContent: _itm.Id,
            }
            setBrowseData(newBrowseData)
            refreshUrl(newBrowseData)
          }}
        />
      ) : browseData.type === 'explorer' ? (
        <Explore
          onNavigate={navigate}
          onActivateItem={openItem}
          parent={browseData.currentContent || browseData.root || ConstantContent.PORTAL_ROOT.Id}
        />
      ) : (
        <SimpleList
          onNavigate={navigate}
          onActivateItem={openItem}
          parent={browseData.currentContent || browseData.root || ConstantContent.PORTAL_ROOT.Id}
        />
      )}
    </LoadSettingsContext.Provider>
  )
}

export default Content
