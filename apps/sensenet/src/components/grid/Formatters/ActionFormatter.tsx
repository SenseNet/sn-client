import { MoreHoriz } from '@material-ui/icons'
import { Content } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useState } from 'react'
import { useLocalization } from '../../../hooks'
import { ContentContextMenu } from '../../context-menu/content-context-menu'

export function ActionFormatter(props: { data: Content }) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const localization = useLocalization()
  const content = props.data as GenericContent
  const actionLabel = localization.contentViews.actions.replace('{0}', content.DisplayName || content.Name)

  return (
    <>
      <button
        type="button"
        className="sn-content-menu-trigger simpleContextMenu"
        aria-label={actionLabel}
        title={actionLabel}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchorEl)}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setAnchorEl(event.currentTarget)
        }}>
        <MoreHoriz aria-hidden="true" />
      </button>
      <ContentContextMenu
        content={content}
        isOpened={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        menuProps={{ anchorEl }}
      />
    </>
  )
}
