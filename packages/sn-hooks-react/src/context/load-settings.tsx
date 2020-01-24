import { ODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import React, { Dispatch } from 'react'

export interface LoadSettingsContextProps {
  /**
   * OData settings for the Current Content
   */
  loadSettings?: ODataParams<GenericContent>
  /**
   * OData settings for loading the current content's children
   */
  loadChildrenSettings: ODataParams<GenericContent>
  /**
   * OData settings for loading ancestors
   */
  loadAncestorsSettings?: ODataParams<GenericContent>

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
export const LoadSettingsContext = React.createContext<LoadSettingsContextProps | undefined>(undefined)

const initialLoadChildrenSettings: ODataParams<GenericContent> = {
  orderby: [['DisplayName', 'asc']],
  select: 'all',
  expand: ['CreatedBy'],
}
/**
 * Provider for the LoadSettingsContext. Sets up default loading settings.
 */

const setLoadSettingsReducer = (
  state: ODataParams<GenericContent> | undefined,
  value: ODataParams<GenericContent> | undefined,
) => {
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

export const LoadSettingsContextProvider: React.FunctionComponent = props => {
  const [loadSettings, setLoadSettings] = React.useReducer(setLoadSettingsReducer, undefined)
  const [loadChildrenSettings, setLoadChildrenSettings] = React.useReducer(
    setLoadChildrenSettingsReducer,
    initialLoadChildrenSettings,
  )
  const [loadAncestorsSettings, setLoadAncestorsSettings] = React.useReducer(setLoadSettingsReducer, undefined)

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
