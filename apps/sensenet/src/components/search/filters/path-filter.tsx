import { GenericContent } from '@sensenet/default-content-types'
import { Button, Tooltip } from '@material-ui/core'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Person from '@material-ui/icons/Person'
import React from 'react'
import { useSearch } from '../../../context/search'
import { useGlobalStyles } from '../../../globalStyles'
import { useDialog } from '../../dialogs'

export const PathFilter = () => {
  const searchState = useSearch()
  const { openDialog } = useDialog()
  const globalClasses = useGlobalStyles()

  return (
    <Tooltip title={searchState.filters.path?.Path ?? ''}>
      <Button
        aria-controls="reference-filter"
        aria-haspopup="true"
        startIcon={<Person />}
        endIcon={<ExpandMore />}
        onClick={() => {
          openDialog({
            name: 'content-picker',
            props: {
              currentPath: '/Root',
              defaultValue: searchState.filters.path,
              handleSubmit: (path: GenericContent) => searchState.setFilters((filters) => ({ ...filters, path })),
            },
            dialogProps: { disableBackdropClick: true, open: true, classes: { paper: globalClasses.pickerDialog } },
          })
        }}>
        {searchState.filters.path ? searchState.filters.path.DisplayName || searchState.filters.path.Name : 'anywhere'}
      </Button>
    </Tooltip>
  )
}
