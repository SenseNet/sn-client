import { Button, Tooltip } from '@material-ui/core'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Person from '@material-ui/icons/Person'
import { ConstantContent } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { useSearch } from '../../../context/search'
import { useGlobalStyles } from '../../../globalStyles'
import { useLocalization } from '../../../hooks'
import { useDialog } from '../../dialogs'

export const PathFilter = () => {
  const searchState = useSearch()
  const { openDialog } = useDialog()
  const localization = useLocalization().search.filters.path
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
              currentPath: ConstantContent.PORTAL_ROOT.Path,
              defaultValue: searchState.filters.path,
              handleSubmit: (selected?: GenericContent) =>
                searchState.setFilters((filters) =>
                  filters.path?.Path === selected?.Path ? filters : { ...filters, path: selected },
                ),
            },
            dialogProps: { disableBackdropClick: true, open: true, classes: { paper: globalClasses.pickerDialog } },
          })
        }}>
        {searchState.filters.path
          ? searchState.filters.path.DisplayName || searchState.filters.path.Name
          : localization.anywhere}
      </Button>
    </Tooltip>
  )
}
