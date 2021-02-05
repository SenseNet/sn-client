import { Button, Menu, MenuItem } from '@material-ui/core'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Person from '@material-ui/icons/Person'
import React, { useState } from 'react'
import { useSearch } from '../../../context/search'

export type Filter = typeof options[number]

export const options = [
  {
    displayName: 'anybody',
    name: 'anybody',
  },
  {
    displayName: 'created by me',
    name: 'created-by-me',
    query: 'CreatedBy',
  },
  {
    displayName: 'modified by me',
    name: 'modified-by-me',
    query: 'ModifiedBy',
  },
  {
    displayName: 'shared with me',
    name: 'shared-with-me',
    query: 'SharedWith',
  },
  {
    displayName: 'assigned to me',
    name: 'assigned-to-me',
    query: 'AssignedTo',
  },
  {
    displayName: 'owned by me',
    name: 'owned-by-me',
    query: 'Owner',
  },
]

export const defaultReferenceFilter = options[0]

export const ReferenceFilter = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const searchState = useSearch()

  return (
    <>
      <Button
        aria-controls="reference-filter"
        aria-haspopup="true"
        startIcon={<Person />}
        endIcon={<ExpandMore />}
        onClick={(event) => {
          setAnchorEl(event.currentTarget)
        }}>
        {searchState.filters.reference.displayName}
      </Button>
      <Menu
        id="reference-filter"
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
        {options.map((filter) => (
          <MenuItem
            key={filter.name}
            selected={filter.name === searchState.filters.reference.name}
            onClick={() => {
              setAnchorEl(null)
              searchState.setFilters((filters) => ({ ...filters, reference: filter }))
            }}>
            {filter.displayName}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
