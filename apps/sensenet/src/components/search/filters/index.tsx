import { Button } from '@material-ui/core'
import FilterList from '@material-ui/icons/FilterList'
import React, { useState } from 'react'
import { useLocalization } from '../../../hooks'
import { MoreFilters } from './more-filters'
import { TypeFilter } from './type-filter'

export const Filters = () => {
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const localization = useLocalization().search.filters

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px' }}>
        <TypeFilter />

        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => setShowMoreFilters((previous) => !previous)}>
          {localization.more}
        </Button>
      </div>

      {showMoreFilters && <MoreFilters />}
    </>
  )
}
