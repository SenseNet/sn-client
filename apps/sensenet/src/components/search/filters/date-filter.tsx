import { Button, Menu, MenuItem } from '@material-ui/core'
import AccessTime from '@material-ui/icons/AccessTime'
import ExpandMore from '@material-ui/icons/ExpandMore'
import React, { useState } from 'react'
import { useSearch } from '../../../context/search'
import { useLocalization } from '../../../hooks'
import { useDialog } from '../../dialogs'

export type Filter = typeof options[number]

const options = [
  {
    name: 'anytime',
  },
  {
    name: 'created',
    disabled: true,
  },
  {
    name: 'createdLastHour',
    query: {
      field: 'CreationDate',
      value: '@@CurrentTime-1hours@@',
    },
  },
  {
    name: 'createdToday',
    query: {
      field: 'CreationDate',
      value: '@@Today@@',
    },
  },
  {
    name: 'createdThisWeek',
    query: {
      field: 'CreationDate',
      value: '@@CurrentWeek@@',
    },
  },
  {
    name: 'createdCustomRange',
    query: {
      field: 'CreationDate',
      from: '',
      to: '',
    },
  },
  {
    name: 'modified',
    disabled: true,
  },
  {
    name: 'modifiedLastHour',
    query: {
      field: 'ModificationDate',
      value: '@@CurrentTime-1hours@@',
    },
  },
  {
    name: 'modifiedToday',
    query: {
      field: 'ModificationDate',
      value: '@@Today@@',
    },
  },
  {
    name: 'modifiedThisWeek',
    query: {
      field: 'ModificationDate',
      value: '@@CurrentWeek@@',
    },
  },
  {
    name: 'modifiedCustomRange',
    query: {
      field: 'ModificationDate',
      from: '',
      to: '',
    },
  },
]

export const defaultDateFilter = options[0]

export const DateFilter = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const { openDialog, closeLastDialog } = useDialog()
  const searchState = useSearch()
  const localization = useLocalization().search.filters.date

  const handleCustomRangePick =
    (filter: any) =>
    ({ from, to }: { from: Date; to: Date }) => {
      const newFilter = { ...filter }

      if (from && to) {
        newFilter.query.from = from.toISOString()
        newFilter.query.to = to.toISOString()

        searchState.setFilters((filters) => ({ ...filters, date: newFilter }))
      } else if (!from && !to) {
        searchState.setFilters((filters) => ({ ...filters, date: defaultDateFilter }))
      } else {
        newFilter.query.value = from.toISOString()
        searchState.setFilters((filters) => ({ ...filters, date: newFilter }))
      }

      closeLastDialog()
    }

  return (
    <>
      <Button
        aria-controls="date-filter"
        aria-haspopup="true"
        startIcon={<AccessTime />}
        endIcon={<ExpandMore />}
        onClick={(event) => {
          setAnchorEl(event.currentTarget)
        }}>
        {localization[searchState.filters.date.name as keyof typeof localization]}
      </Button>
      <Menu
        id="date-filter"
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
            disabled={filter.disabled}
            selected={filter.name === searchState.filters.date.name}
            onClick={() => {
              setAnchorEl(null)
              if (filter.name.includes('CustomRange')) {
                const defaultValue =
                  searchState.filters.date.query?.from && searchState.filters.date.query?.to
                    ? {
                        from: new Date(searchState.filters.date.query.from),
                        to: new Date(searchState.filters.date.query.to),
                      }
                    : undefined

                return openDialog({
                  name: 'date-range-picker',
                  props: { handleSubmit: handleCustomRangePick(filter), defaultValue },
                  dialogProps: { fullWidth: false },
                })
              }
              searchState.setFilters((filters) => ({ ...filters, date: filter }))
            }}>
            {localization[filter.name as keyof typeof localization]}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
