import { ConstantContent } from '@sensenet/client-core'
import { Image } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { Button, Container, Link, makeStyles } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import ReactImageGallery from 'react-image-gallery'
import { goToRepoStyles } from '../app'
import { DeleteConfirm } from './delete-confirm'
import { FullScreenDialogProps } from './full-screen-dialog'

import 'react-image-gallery/styles/css/image-gallery.css'

type ImageGalleryProps = Pick<FullScreenDialogProps, 'steppingFunction' | 'handleDelete' | 'openedImage'>

export const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: '80px',

    '& .image-gallery-slide-wrapper': {
      display: 'flex',
      justifyContent: 'space-between',
    },
    '& .image-gallery-icon': {
      position: 'static',
      transform: 'none',
      color: theme.palette.common.black,

      '&:hover': {
        color: theme.palette.primary.main,
      },

      '&:focus': {
        outline: 0,
      },

      '& .image-gallery-svg': {
        height: 60,
        width: 30,
      },
    },
    '& .image-gallery-right-nav': {
      order: 1,
    },
  },
  caption: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    margin: '1rem',

    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
    },
  },
  deleteIcon: {
    color: theme.palette.common.black,
  },
  image: {
    maxHeight: 'calc(100vh - 160px)',
  },
}))

export const ImageGallery: React.FunctionComponent<ImageGalleryProps> = (props) => {
  const classes = useStyles()
  const repository = useRepository()
  const [items, setItems] = useState<Image[]>([])
  const [activeItem, setActiveItem] = useState<Image>(props.openedImage)
  const galleryRef = useRef<ReactImageGallery>(null)
  const goToRepoClasses = goToRepoStyles()

  useEffect(() => {
    ;(async () => {
      const result = await repository.loadCollection<Image>({
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
        },
      })
      setItems(result.d.results)
    })()
  }, [repository])

  if (!items.length || !activeItem) return null

  return (
    <Container component="main" maxWidth="md" className={classes.root}>
      <div className={goToRepoClasses.linkContainer}>
        <Link
          className={goToRepoClasses.link}
          href="https://admin.sensenet.com/content/explorer/?path=%2FIT%2FImageLibrary"
          target="_blank">
          <Button className={goToRepoClasses.button}>Go to connected repository</Button>
        </Link>
      </div>
      <ReactImageGallery
        ref={galleryRef}
        lazyLoad={true}
        showThumbnails={false}
        showFullscreenButton={false}
        onBeforeSlide={(currentIndex) => setActiveItem(items[currentIndex])}
        showPlayButton={false}
        slideDuration={0}
        showIndex={items.length > 1}
        startIndex={items.findIndex((current) => current.Id === props.openedImage.Id)}
        items={items.map((item) => ({
          original: repository.configuration.repositoryUrl + item.Path,
          originalClass: classes.image,
        }))}
      />
      <div className={classes.caption}>
        {activeItem.DisplayName}
        <DeleteConfirm
          tile={activeItem}
          classes={{ icon: classes.deleteIcon }}
          deleteCallback={() => {
            props.handleDelete(activeItem)

            setItems((previous) => {
              const next = previous.filter((current) => activeItem.Id !== current.Id)
              setActiveItem(next[0])
              return next
            })
            galleryRef.current?.slideToIndex(0)
          }}
        />
      </div>
    </Container>
  )
}
