import { ConstantContent } from '@sensenet/client-core'
import { Image, User } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { CssBaseline, Slide } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { TransitionProps } from '@material-ui/core/transitions'
import format from 'date-fns/format'
import React, { forwardRef, FunctionComponent, ReactElement, Ref, useEffect, useState } from 'react'
import snLogo from './assets/sensenet_logo_transparent.png'
import { AdvancedGridList } from './components/AdvancedGridList'
import { FullScreenDialog } from './components/FullScreenDialog'
import { SelectedImage } from './Interface'

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'visible',
    backgroundColor: theme.palette.background.paper,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))

// eslint-disable-next-line react/display-name
export const Transition = forwardRef(
  (props: TransitionProps & { children?: ReactElement<any, any> }, ref: Ref<unknown>) => {
    return <Slide direction="up" ref={ref} {...props} />
  },
)

export const App: FunctionComponent = () => {
  const repo = useRepository()
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<Image[]>([])
  const [selectedimage, setSelectedimage] = useState<SelectedImage>({
    imgIndex: 0,
    imgPath: '',
    imgTitle: '',
    imgDescription: '',
    imgAuthor: '',
    imgAuthorAvatar: '',
    imgCreationDate: '',
    imgSize: '',
    imgDownloadUrl: '',
  })

  /**
   * Sets the Selected Image
   * @param {number} imageIndex Seletected number's index.
   * @param {boolean} openInfoTab Should the Detailed view open.
   */
  function getSelectedImage(imageIndex: number, openInfoTab: boolean) {
    const selectedImage = data[imageIndex]
    let avatarUserAvatarUrl = ''
    let imgageAuthorName = ''
    let imgageDisplayName = ''
    let imgageDescription = ''
    let imgageCreationDate = ''
    let imagePath = ''
    let imageSize = ''
    let imageDownloadUrl = ''

    if (selectedImage !== undefined) {
      imgageDisplayName = selectedImage.DisplayName as string
      imgageDescription = selectedImage.Description as string
      const avatarUser = selectedImage.CreatedBy as User
      avatarUserAvatarUrl = avatarUser.Avatar ? avatarUser.Avatar.Url : ''
      imgageAuthorName = (selectedImage.CreatedBy as User).FullName as string
      imagePath = repo.configuration.repositoryUrl + selectedImage.Path
      imgageCreationDate = selectedImage.CreationDate
        ? format(new Date(selectedImage.CreationDate), 'yyyy-MM-dd HH:mm:ss')
        : 'Invalid date'
      imageSize = `${(selectedImage.Size ? selectedImage.Size / 1024 / 1024 : 0).toFixed(2)} MB`
      imageDownloadUrl =
        selectedImage.Binary !== undefined
          ? repo.configuration.repositoryUrl + selectedImage.Binary.__mediaresource.media_src
          : ''
    }
    setSelectedimage({
      imgIndex: imageIndex,
      imgPath: imagePath,
      imgTitle: imgageDisplayName,
      imgDescription: imgageDescription,
      imgAuthor: imgageAuthorName,
      imgAuthorAvatar: avatarUserAvatarUrl as string,
      imgCreationDate: imgageCreationDate,
      imgSize: imageSize,
      imgDownloadUrl: imageDownloadUrl,
    })
    if (openInfoTab) {
      setOpen(true)
    }
  }
  /**
   *  Close the Details View.
   */
  function handleClose() {
    setOpen(false)
  }

  useEffect(() => {
    /**
     * Fetches the images from the repository.
     */
    async function loadImages(): Promise<void> {
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
        },
      })
      setData(result.d.results)
    }
    loadImages()
  }, [repo])
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 'auto',
        flexDirection: 'column',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${snLogo})`,
        backgroundSize: 'auto',
      }}>
      <CssBaseline />
      <AdvancedGridList openFunction={getSelectedImage} imgList={data} />
      <FullScreenDialog
        openedImg={selectedimage}
        steppingFunction={getSelectedImage}
        isopen={open}
        closeFunction={handleClose}
        imgList={data}
      />
    </div>
  )
}
