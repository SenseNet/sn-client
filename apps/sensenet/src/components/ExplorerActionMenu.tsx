import { makeStyles, useTheme } from '@material-ui/core'
import { Check, ExpandMore, MoreHoriz } from '@material-ui/icons'
import React, { CSSProperties, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export type ExplorerMenuAction = {
  id: string
  label: string
  icon?: ReactNode
  disabled?: boolean
  onClick: () => void
  danger?: boolean
  checked?: boolean
  groupLabel?: string
}

const useStyles = makeStyles((theme) => ({
  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 32,
    padding: '6px 9px',
    border: '1px solid transparent',
    borderRadius: 7,
    background: 'transparent',
    color: 'var(--sn-explorer-muted, currentColor)',
    font: 'inherit',
    fontSize: 12,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    '& svg': { width: 17, height: 17 },
    '&:hover, &[aria-expanded="true"]': { background: 'var(--sn-explorer-hover, rgba(128,128,128,.12))' },
    '&:focus-visible': { outline: '2px solid var(--sn-explorer-accent, #0078d4)', outlineOffset: 1 },
    '&:disabled': { opacity: 0.4, cursor: 'default' },
  },
  menu: {
    position: 'fixed',
    zIndex: theme.zIndex.modal + 10,
    padding: 5,
    boxSizing: 'border-box',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    border: '1px solid var(--sn-menu-border)',
    borderRadius: 10,
    background: 'var(--sn-menu-surface)',
    color: 'var(--sn-menu-text)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.18)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    minHeight: 36,
    padding: '8px 10px',
    border: 0,
    borderRadius: 5,
    background: 'transparent',
    color: 'inherit',
    font: 'inherit',
    fontSize: 13,
    lineHeight: 1.4,
    textAlign: 'left',
    cursor: 'pointer',
    '&:hover:not(:disabled), &:focus-visible': { background: 'var(--sn-menu-hover)', outline: 'none' },
    '&:disabled': { opacity: 0.4, cursor: 'default' },
    '& svg': { width: 17, height: 17, flexShrink: 0 },
  },
  icon: { display: 'inline-flex', width: 17, flexShrink: 0 },
  danger: { color: 'var(--sn-menu-danger)' },
}))

export const ExplorerActionMenu = ({
  label,
  icon = <MoreHoriz aria-hidden="true" />,
  dropdown = false,
  items,
  testId = 'explorer-more-actions',
}: {
  label: string
  icon?: ReactNode
  dropdown?: boolean
  items: ExplorerMenuAction[]
  testId?: string
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<CSSProperties>({})
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef(items)
  itemsRef.current = items
  const close = (restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus) triggerRef.current?.focus()
  }

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !menuRef.current) return
    const anchor = triggerRef.current.getBoundingClientRect()
    const width = Math.min(260, window.innerWidth - 16)
    const height = Math.min(menuRef.current.scrollHeight + 2, window.innerHeight - 16)
    const ancestor = triggerRef.current.closest('.sn-explorer')
    const colors = ancestor ? getComputedStyle(ancestor) : undefined
    setPosition({
      width,
      maxHeight: window.innerHeight - 16,
      left: Math.max(8, Math.min(anchor.right - width, window.innerWidth - width - 8)),
      top: anchor.bottom + height + 6 <= window.innerHeight ? anchor.bottom + 6 : Math.max(8, anchor.top - height - 6),
      '--sn-menu-surface': colors?.getPropertyValue('--sn-explorer-surface') || theme.palette.background.paper,
      '--sn-menu-border': colors?.getPropertyValue('--sn-explorer-border') || theme.palette.divider,
      '--sn-menu-text': colors?.getPropertyValue('--sn-explorer-text') || theme.palette.text.primary,
      '--sn-menu-hover': colors?.getPropertyValue('--sn-explorer-hover') || theme.palette.action.hover,
      '--sn-menu-danger': theme.palette.type === 'dark' ? '#ffaaa5' : '#b42318',
      colorScheme: theme.palette.type,
    } as CSSProperties)
  }, [open, theme, items])

  useLayoutEffect(() => {
    if (open) menuRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onOutside = (event: Event) => {
      if (!triggerRef.current?.contains(event.target as Node) && !menuRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onResize = () => setOpen(false)
    document.addEventListener('pointerdown', onOutside)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('pointerdown', onOutside)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={classes.trigger}
        title={label}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${testId}-menu` : undefined}
        disabled={!items.some((item) => !item.disabled)}
        data-test={testId}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setOpen(true)
          }
        }}>
        {icon}
        <span>{label}</span>
        {dropdown && <ExpandMore aria-hidden="true" />}
      </button>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            id={`${testId}-menu`}
            role="menu"
            aria-label={label}
            className={classes.menu}
            style={{ width: Math.min(260, window.innerWidth - 16), maxHeight: window.innerHeight - 16, ...position }}
            data-test={`${testId}-menu`}
            onKeyDown={(event) => {
              if (event.key === 'Escape' || event.key === 'Tab') {
                if (event.key === 'Escape') event.preventDefault()
                close()
                return
              }
              const buttons = Array.from(
                menuRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') || [],
              )
              const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
              const positions: Record<string, number> = {
                ArrowDown: (index + 1) % buttons.length,
                ArrowUp: (index - 1 + buttons.length) % buttons.length,
                Home: 0,
                End: buttons.length - 1,
              }
              if (event.key in positions && buttons.length) {
                event.preventDefault()
                buttons[positions[event.key]]?.focus()
              }
            }}>
            {items.map((item) => (
              <React.Fragment key={item.id}>
                {item.groupLabel && (
                  <div
                    role="separator"
                    aria-label={item.groupLabel}
                    style={{
                      padding: '12px 10px 5px',
                      marginTop: 5,
                      borderTop: '1px solid var(--sn-menu-border)',
                      fontSize: 11,
                      opacity: 0.7,
                    }}>
                    {item.groupLabel}
                  </div>
                )}
                <button
                  type="button"
                  role={item.checked === undefined ? 'menuitem' : 'menuitemradio'}
                  aria-checked={item.checked}
                  tabIndex={-1}
                  className={`${classes.item} ${item.danger ? classes.danger : ''}`}
                  disabled={item.disabled}
                  data-test={item.id}
                  onClick={() => {
                    const current = itemsRef.current.find((action) => action.id === item.id)
                    if (!current || current.disabled) return
                    close()
                    current.onClick()
                  }}>
                  {item.icon && (
                    <span className={classes.icon} aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.checked && <Check aria-hidden="true" />}
                </button>
              </React.Fragment>
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}
