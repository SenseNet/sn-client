import { ODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import React, { Dispatch, useState } from 'react'
export const LoadSettingsContext = React.createContext<{
  loadSettings: ODataParams<GenericContent>
  loadChildrenSettings: ODataParams<GenericContent>
  loadAncestorsSettings: ODataParams<GenericContent>

  setLoadSettings: Dispatch<ODataParams<GenericContent>>
  setLoadChildrenSettings: Dispatch<ODataParams<GenericContent>>
  setLoadAncestorsSettings: Dispatch<ODataParams<GenericContent>>
}>(null as any)

export const LoadSettingsContextProvider: React.FunctionComponent = props => {
  const [loadSettings, setLoadSettings] = useState<ODataParams<GenericContent>>({})
  const [loadChildrenSettings, setLoadChildrenSettings] = useState<ODataParams<GenericContent>>({
    orderby: [['IsFolder', 'desc']],
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
