import { ConstantContent } from '@sensenet/client-core'
import { Image } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { makeStyles } from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { AdvancedGridList } from './advanced-grid-list'
import { FullScreenDialog } from './full-screen-dialog'

const ITEM_PER_PAGE = 11

export const useStyles = makeStyles(() => ({
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    margin: '1rem 0',
  },
}))

export const ImageList: FunctionComponent = () => {
  const repo = useRepository()
  const [totalImageCount, setTotalImageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<Image[]>([])
  const [open, setOpen] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)
  const [selectedImage, setSelectedImage] = useState<Image>()
  const classes = useStyles()

  const pageCount = Math.ceil(totalImageCount / ITEM_PER_PAGE)

  useEffect(() => {
    ;(async () => {
      const result = await repo.loadCollection<Image>({
        path: `${ConstantContent.PORTAL_ROOT.Path}/Content/IT/ImageLibrary`,
        oDataOptions: {
          select: [
            'Binary',
            'DisplayName',
            'Description',
            'CreationDate',
            'CreatedBy',
            'Height',
            'ModificationDate',
            'Size',
            'Width',
          ],
          expand: ['CreatedBy'],
          orderby: [['CreationDate', 'desc']],
          top: ITEM_PER_PAGE,
          skip: (currentPage - 1) * ITEM_PER_PAGE,
        },
      })
      setTotalImageCount(result.d.__count)
      setData(result.d.results)
    })()
  }, [repo, currentPage, reloadToken])

  const handleClose = () => {
    setOpen(false)
  }

  const getSelectedImage = (imageIndex: number, openInfoTab: boolean) => {
    setSelectedImage(data[imageIndex])
    if (openInfoTab) {
      setOpen(true)
    }
  }

  return (
    <>
      <AdvancedGridList
        openFunction={getSelectedImage}
        imgList={data}
        requestReload={() => setReloadToken((token) => token + 1)}
      />
      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          onChange={(_, value) => setCurrentPage(value)}
          color="primary"
          className={classes.pagination}
        />
      )}

      {selectedImage && (
        <FullScreenDialog
          openedImage={selectedImage}
          steppingFunction={getSelectedImage}
          open={open}
          closeFunction={handleClose}
          imgList={data}
          handleDelete={() => setReloadToken((token) => token + 1)}
        />
      )}
    </>
  )
}
