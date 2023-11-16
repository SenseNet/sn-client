import { Button, createStyles, makeStyles, Menu, MenuItem } from '@material-ui/core'
import AccessTime from '@material-ui/icons/AccessTime'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Image from '@material-ui/icons/Image'
import InsertDriveFile from '@material-ui/icons/InsertDriveFile'
import Person from '@material-ui/icons/Person'
import Search from '@material-ui/icons/Search'
import { ConstantContent } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { useEffect, useState } from 'react'
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

type moreOptionsItem = {
  name: string
  type: string
}

export const TypeFilter = () => {
  const repo = useRepository()
  const classes = useStyles()
  const localization = useLocalization().search.filters.type
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const searchState = useSearch()
  const [otherContentTypes, setOtherContentTypes] = useState<moreOptionsItem[]>([])

  useEffect(() => {
    const ac = new AbortController()
    const categoryField = repo.schemas.getFieldTypeByName('Categories')
    const fetchData = async () => {
      try {
        if (categoryField) {
          const response = await repo.loadCollection<GenericContent>({
            path: ConstantContent.PORTAL_ROOT.Path,
            oDataOptions: {
              query: "-Categories:'*HideByDefault*' +TypeIs:'ContentType' .AUTOFILTERS:OFF",
              select: ['Type', 'DisplayName'],
            },
            requestInit: { signal: ac.signal },
          })
          const items: moreOptionsItem[] = response.d.results.map((item) => ({
            name: item.DisplayName ?? item.Name,
            type: item.Name,
          }))
          setOtherContentTypes(items)
        } else {
          setOtherContentTypes(moreOptions)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()

    return () => {
      ac.abort()
    }
  }, [repo])

  const [[activeFromMore], othersFromMore] = otherContentTypes.reduce(
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
        data-test="more-type-filter-button"
        aria-controls="more-type-filter"
        aria-haspopup="true"
        variant="outlined"
        endIcon={<ExpandMore />}
        color={activeFromMore ? 'primary' : 'default'}
        onClick={(event) => {
          setAnchorEl(event.currentTarget)
        }}>
        {activeFromMore ? activeFromMore.name : localization.more}
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
            data-test={`more-menu-item-${filter.name.toLowerCase()}`}
            onClick={() => {
              setAnchorEl(null)
              searchState.setFilters((filters) =>
                filters.type.name === filter.name ? filters : { ...filters, type: filter },
              )
            }}>
            {filter.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
