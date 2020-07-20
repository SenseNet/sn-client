import { GenericContent } from '@sensenet/default-content-types'
import MuiPagination, { PaginationProps as MuiPaginationProps } from '@material-ui/lab/Pagination'
import React, { useCallback, useEffect, useState } from 'react'

export type PaginationProps = {
  items: GenericContent[]
  itemsPerPage?: number
} & MuiPaginationProps

const DEFAULT_ITEMS_PER_PAGE = 8

export const usePagination = ({ items, itemsPerPage, ...muiProps }: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = itemsPerPage || DEFAULT_ITEMS_PER_PAGE
  const [currentItems, setCurrentItems] = useState(items.slice(perPage))

  useEffect(() => {
    setCurrentItems(items.slice((currentPage - 1) * perPage, currentPage * perPage))
  }, [items, currentPage, perPage])

  const render = useCallback(
    () => (
      <MuiPagination
        count={Math.ceil(items.length / perPage)}
        page={currentPage}
        onChange={(_, page) => setCurrentPage(page)}
        {...muiProps}
      />
    ),
    [items, perPage, muiProps, currentPage],
  )

  return {
    render,
    currentItems,
    setCurrentPage,
  }
}
