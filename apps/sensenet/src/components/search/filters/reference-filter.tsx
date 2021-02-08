import { Button, Menu, MenuItem } from '@material-ui/core'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Person from '@material-ui/icons/Person'
import React, { useState } from 'react'
import { useSearch } from '../../../context/search'
import { useLocalization } from '../../../hooks'

export type Filter = typeof options[number]

export const options = [
  {
    name: 'anybody',
  },
  {
    name: 'createdByMe',
    query: 'CreatedBy',
  },
  {
    name: 'modifiedByMe',
    query: 'ModifiedBy',
  },
  {
    name: 'sharedWithMe',
    query: 'SharedWith',
  },
  {
    name: 'assignedToMe',
    query: 'AssignedTo',
  },
  {
    name: 'ownedByMe',
    query: 'Owner',
  },
]

export const defaultReferenceFilter = options[0]

export const ReferenceFilter = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const localization = useLocalization().search.filters.reference
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
        {localization[searchState.filters.reference.name as keyof typeof localization]}
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
              searchState.setFilters((filters) =>
                filters.reference.name === filter.name ? filters : { ...filters, reference: filter },
              )
            }}>
            {localization[filter.name as keyof typeof localization]}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
