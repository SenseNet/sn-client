import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelectionService } from '../../hooks'
import { DrawerItem } from '../../hooks/use-drawer-items'
import { ExpandItemsContext } from '../tree/Contexts/ExpandedItemsProvider'
import './app-navigation.css'

export interface PermanentDrawerItemProps {
  item: DrawerItem
  opened: boolean
  onNavigate?: () => void
}

export const PermanentDrawerItem: React.FunctionComponent<PermanentDrawerItemProps> = ({
  item,
  opened,
  onNavigate,
}) => {
  const selectionService = useSelectionService()
  const expandContext = useContext(ExpandItemsContext)
  if (!expandContext) throw new Error('Must be used inside ExpandItemsProvider')
  const [, setExpandItems] = expandContext

  return (
    <NavLink
      aria-label={item.primaryText}
      title={opened ? item.secondaryText || item.primaryText : item.primaryText}
      to={item.url}
      className="sn-app-navigation__link"
      activeClassName="sn-app-navigation__link--active Mui-selected"
      data-test={`drawer-menu-item-${item.primaryText.replace(/\s+/g, '-').toLowerCase()}`}
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        selectionService.activeContent.setValue(undefined)
        setExpandItems(new Set())
        onNavigate?.()
      }}>
      <span className="sn-app-navigation__icon" aria-hidden="true">
        {item.icon}
      </span>
      {opened && <span className="sn-app-navigation__label">{item.primaryText}</span>}
    </NavLink>
  )
}
