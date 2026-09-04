import { makeStyles } from '@material-ui/core'
import { AppsOutlined, PhotoLibraryOutlined, ViewHeadlineOutlined, ViewListOutlined } from '@material-ui/icons'
import { useInjector } from '@sensenet/hooks-react'
import React from 'react'
import { useLocalization, usePersonalSettings } from '../../hooks'
import { ContentIconSize, ContentIconSizes, ContentViewMode, PersonalSettings } from '../../services/PersonalSettings'

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    flexShrink: 0,
    gap: theme.spacing(1),
    padding: theme.spacing(0.75, 1.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.paper,
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 0,
    borderBottom: '2px solid transparent',
    borderRadius: 0,
    background: 'transparent',
    color: theme.palette.text.secondary,
    fontFamily: 'inherit',
    fontSize: 12,
    lineHeight: '20px',
    padding: theme.spacing(0.5, 1),
    minWidth: 36,
    gap: theme.spacing(0.75),
    cursor: 'pointer',
    '&:hover': { background: theme.palette.action.hover, color: theme.palette.text.primary },
    '&:focus-visible': { outline: `1px solid ${theme.palette.primary.main}`, outlineOffset: 2 },
  },
  active: {
    color: theme.palette.primary.main,
    background: theme.palette.action.selected,
    borderBottomColor: theme.palette.primary.main,
  },
  viewButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  label: {
    [theme.breakpoints.down('xs')]: { display: 'none' },
  },
  size: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontSize: 12,
    maxWidth: '100%',
  },
  select: {
    boxSizing: 'border-box',
    maxWidth: '100%',
    minWidth: 105,
    height: 30,
    padding: '3px 6px',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 0,
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    fontFamily: 'inherit',
    fontSize: 12,
    colorScheme: theme.palette.type,
    cursor: 'pointer',
    '&:hover': { borderColor: theme.palette.text.secondary },
    '&:focus-visible': { outline: `1px solid ${theme.palette.primary.main}`, outlineOffset: 1 },
  },
}))

const modes: Array<{ value: ContentViewMode; icon: typeof ViewListOutlined }> = [
  { value: 'details', icon: ViewListOutlined },
  { value: 'list', icon: ViewHeadlineOutlined },
  { value: 'icons', icon: AppsOutlined },
  { value: 'thumbnails', icon: PhotoLibraryOutlined },
]

export const ContentViewToolbar = ({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ContentViewMode
  onViewModeChange: (mode: ContentViewMode) => void
}) => {
  const classes = useStyles()
  const localization = useLocalization().contentViews
  const settings = usePersonalSettings()
  const settingsService = useInjector().getInstance(PersonalSettings)

  return (
    <div className={classes.toolbar} data-test="content-view-toolbar">
      <div className={classes.viewButtons} role="group" aria-label={localization.view}>
        {modes.map(({ value, icon: ViewIcon }) => (
          <button
            key={value}
            type="button"
            title={localization[value]}
            className={`${classes.button} ${viewMode === value ? classes.active : ''}`}
            aria-label={localization[value]}
            aria-pressed={viewMode === value}
            data-test={`content-view-${value}`}
            onClick={() => onViewModeChange(value)}>
            <ViewIcon fontSize="small" />
            <span className={classes.label}>{localization[value]}</span>
          </button>
        ))}
      </div>
      {viewMode === 'icons' || viewMode === 'thumbnails' ? (
        <label htmlFor="content-icon-size" className={classes.size}>
          <span>{localization.iconSize}</span>
          <select
            id="content-icon-size"
            data-test="content-icon-size"
            className={classes.select}
            value={settings.contentIconSize}
            onChange={(event) => {
              settingsService.setPersonalSettingsValue({
                ...settingsService.userValue.getValue(),
                contentIconSize: event.target.value as ContentIconSize,
              })
            }}>
            {ContentIconSizes.map((size) => (
              <option key={size} value={size}>
                {localization[size]}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  )
}
