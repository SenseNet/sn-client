import { Button, createStyles, makeStyles, Menu, MenuItem } from '@material-ui/core'
import AccessTime from '@material-ui/icons/AccessTime'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Image from '@material-ui/icons/Image'
import InsertDriveFile from '@material-ui/icons/InsertDriveFile'
import Person from '@material-ui/icons/Person'
import Search from '@material-ui/icons/Search'
import React, { useState } from 'react'
import { useSearch } from '../../../context/search'
import { useLocalization } from '../../../hooks'

export type Filter = (typeof options)[number] | (typeof moreOptions)[number]

const options = [
  {
    name: 'all',
    icon: <Search />,
  },
  {
    name: 'documents',
    icon: <InsertDriveFile />,
    type: 'File',
  },
  {
    name: 'images',
    icon: <Image />,
    type: 'Image',
  },
  {
    name: 'event',
    icon: <AccessTime />,
    type: 'CalendarEvent',
  },
  {
    name: 'user',
    icon: <Person />,
    type: 'User',
  },
]

const moreOptions = [
  {
    name: 'article',
    type: 'Article',
  },
  {
    name: 'workspace',
    type: 'Workspace',
  },
  {
    name: 'folder',
    type: 'Folder',
  },
  {
    name: 'task',
    type: 'Task',
  },
  {
    name: 'memo',
    type: 'Memo',
  },
  {
    name: 'group',
    type: 'Group',
  },
]

export const defaultTypeFilter = options[0]

const useStyles = makeStyles(() => {
  return createStyles({
    filter: {
      marginRight: '1rem',
    },
  })
})

export const TypeFilter = () => {
  const classes = useStyles()
  const localization = useLocalization().search.filters.type
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const searchState = useSearch()

  const [[activeFromMore], othersFromMore] = moreOptions.reduce(
    ([pass, fail], filter) => {
      return filter.name === searchState.filters.type.name ? [[...pass, filter], fail] : [pass, [...fail, filter]]
    },
    [[], [] as Filter[]],
  )

  return (
    <div>
      {options.map((filter) => (
        <Button
          key={filter.name}
          variant="outlined"
          color={filter.name === searchState.filters.type.name ? 'primary' : 'default'}
          startIcon={filter.icon}
          className={classes.filter}
          onClick={() =>
            searchState.setFilters((filters) =>
              filters.type.name === filter.name ? filters : { ...filters, type: filter },
            )
          }>
          {localization[filter.name as keyof typeof localization]}
        </Button>
      ))}

      <Button
        aria-controls="more-type-filter"
        aria-haspopup="true"
        variant="outlined"
        endIcon={<ExpandMore />}
        color={activeFromMore ? 'primary' : 'default'}
        onClick={(event) => {
          setAnchorEl(event.currentTarget)
        }}>
        {activeFromMore ? localization[activeFromMore.name as keyof typeof localization] : localization.more}
      </Button>
      <Menu
        id="more-type-filter"
        keepMounted
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}>
        {(othersFromMore as Filter[]).map((filter) => (
          <MenuItem
            key={filter.name}
            onClick={() => {
              setAnchorEl(null)
              searchState.setFilters((filters) =>
                filters.type.name === filter.name ? filters : { ...filters, type: filter },
              )
            }}>
            {localization[filter.name as keyof typeof localization]}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
