/**
 * @module ViewControls
 */
import { Button, createStyles, makeStyles } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { ReactElement, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { navigateToAction } from '../../services'

const useStyles = makeStyles(() => {
  return createStyles({
    imageViewContainer: {
      width: 'auto',
      overflow: 'auto',
      margin: '0 24px',
    },
    titleContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '30px',
      marginBottom: '20px',
      alignItems: 'center',
    },
    title: {
      fontSize: '20px',
      paddingRight: '10px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    contentName: {
      fontWeight: 500,
    },
    imageContainer: {
      width: '90%',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      alignItems: 'flex-start',
    },
    image: {
      maxWidth: '100%',
    },
    buttonWrapper: {
      padding: '20px 0',
      width: '90%',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      alignItems: 'flex-end',
    },
  })
})

export interface ImageViewProps {
  renderIcon?: (name: string) => ReactElement
  handleCancel?: () => void
  contentPath: string
}

export const ImageView: React.FC<ImageViewProps> = (props) => {
  const repository = useRepository()
  const formLocalization = useLocalization().forms
  const globalClasses = useGlobalStyles()
  const classes = useStyles()
  const { contentPath } = props
  const [currentContent, setCurrentContent] = useState<GenericContent>()
  const history = useHistory()
  const routeMatch = useRouteMatch<{ browseType: string; action?: string }>()
  const [getBlob, setBlob] = useState<Blob>()
  useEffect(() => {
    async function getCurrentContent() {
      const result = await repository.load({
        idOrPath: props.contentPath,
      })
      setCurrentContent(result.d)
    }
    getCurrentContent()
  }, [props.contentPath, repository])
  useEffect(() => {
    const url = `${repository.configuration.repositoryUrl + contentPath}?t=${Date.now()}`
    const { token } = repository.configuration
    fetch(url, {
      method: 'get',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    })
      .then((response) => response.blob())
      .then((blob) => {
        setBlob(blob)
      })
      .catch((error) => {
        console.error('Error fetching the file:', error)
      })
  }, [contentPath, repository.configuration])
  return (
    <div className={classes.imageViewContainer}>
      <div className={classes.titleContainer}>
        <div className={classes.title}>
          <span data-test={'image-view-title'} className={classes.contentName}>
            {currentContent?.DisplayName}
          </span>
        </div>
      </div>
      <div className={classes.imageContainer}>
        {getBlob && <img className={classes.image} src={URL.createObjectURL(getBlob)} alt="" />}
      </div>
      <div className={classes.buttonWrapper}>
        <Button
          aria-label={formLocalization.close}
          color="default"
          className={globalClasses.cancelButton}
          onClick={() => {
            navigateToAction({ history, routeMatch })
            props.handleCancel?.()
          }}>
          {formLocalization.close}
        </Button>
      </div>
    </div>
  )
}
