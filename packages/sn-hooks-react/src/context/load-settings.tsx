import { ODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import React, { Dispatch } from 'react'

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
   * Set the current content's children's load settings
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

const initialLoadChildrenSettings: ODataParams<GenericContent> = {
  orderby: [['DisplayName', 'asc']],
  select: 'all',
  expand: ['CreatedBy'],
}
/**
 * Provider for the LoadSettingsContext. Sets up default loading settings.
 */

const setLoadSettingsReducer = (state: ODataParams<GenericContent>, value: ODataParams<GenericContent>) => {
  if (JSON.stringify(value) === JSON.stringify(state)) {
    return state
  }
  return value
}

const setLoadChildrenSettingsReducer = (state: ODataParams<GenericContent>, value: ODataParams<GenericContent>) => {
  if (JSON.stringify(value) === JSON.stringify(state)) {
    return state
  }
  return value
}

export const LoadSettingsContextProvider: React.FunctionComponent<{
  loadChildrenSettings?: ODataParams<GenericContent>
}> = (props) => {
  const [loadSettings, setLoadSettings] = React.useReducer(setLoadSettingsReducer, {})
  const [loadChildrenSettings, setLoadChildrenSettings] = React.useReducer(
    setLoadChildrenSettingsReducer,
    props.loadChildrenSettings ?? initialLoadChildrenSettings,
  )
  const [loadAncestorsSettings, setLoadAncestorsSettings] = React.useReducer(setLoadSettingsReducer, {})

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
