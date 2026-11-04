import Edit from '@material-ui/icons/Edit'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ResponsivePersonalSettings } from '../../../context'
import { useLocalization, useSnRoute } from '../../../hooks'
import { getUrlForContent, supportsFullscreenEdit } from '../../../services'

export function EditBinaryFormatter({ data }: { data?: GenericContent }) {
  const history = useHistory()
  const uiSettings = useContext(ResponsivePersonalSettings)
  const snRoute = useSnRoute()
  const localization = useLocalization()
  if (!data || !supportsFullscreenEdit(data)) return null

  const label = `${localization.settings.fullscreenEdit}: ${data.DisplayName || data.Name}`
  return (
    <button
      type="button"
      className="sn-content-menu-trigger"
      title={label}
      aria-label={label}
      data-test="grid-edit-binary"
      data-content-id={data.Id}
      onMouseDown={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') event.stopPropagation()
      }}
      onClick={(event) => {
        event.stopPropagation()
        history.push(
          getUrlForContent({ content: data, uiSettings, location: history.location, snRoute, action: 'edit-binary' }),
        )
      }}>
      <Edit aria-hidden="true" />
    </button>
  )
}
