import { ODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import React, { Dispatch, useState } from 'react'

export interface LoadSettingsContextProps {
  /**
   * OData settings for the Current Content
   */
  loadSettings: ODataParams<GenericContent>
  /**
   * OData settings for loading the current content's children
   */
  loadChildrenSettings: ODataParams<GenericContent>
  /**
   * OData settings for loading ancestors
   */
  loadAncestorsSettings: ODataParams<GenericContent>

  /**
   * Sets the Current Content's load settings
   */
  setLoadSettings: Dispatch<ODataParams<GenericContent>>

  /**
   * Set the current content's childrens load settings
   */
  setLoadChildrenSettings: Dispatch<ODataParams<GenericContent>>

  /**
   * Sets the current content's ancestor's load settings
   */
  setLoadAncestorsSettings: Dispatch<ODataParams<GenericContent>>
}

/**
 * Context that stores load settings for OData requests
 */
export const LoadSettingsContext = React.createContext<LoadSettingsContextProps>({
  setLoadSettings: () => undefined,
  setLoadChildrenSettings: () => undefined,
  setLoadAncestorsSettings: () => undefined,
  loadAncestorsSettings: {},
  loadChildrenSettings: {},
  loadSettings: {},
})

/**
 * Provider for the LoadSettingsContext. Sets up default loading settings.
 */
export const LoadSettingsContextProvider: React.FunctionComponent = props => {
  const [loadSettings, setLoadSettings] = useState<ODataParams<GenericContent>>({})
  const [loadChildrenSettings, setLoadChildrenSettings] = useState<ODataParams<GenericContent>>({
    orderby: [['DisplayName', 'asc']],
    select: 'all',
    expand: 'CreatedBy',
  })
  const [loadAncestorsSettings, setLoadAncestorsSettings] = useState<ODataParams<GenericContent>>({})

  return (
    <LoadSettingsContext.Provider
      value={{
        loadSettings,
        loadChildrenSettings,
        loadAncestorsSettings,
        setLoadSettings,
        setLoadChildrenSettings,
        setLoadAncestorsSettings,
      }}>
      {props.children}
    </LoadSettingsContext.Provider>
  )
}
