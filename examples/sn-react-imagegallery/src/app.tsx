import { UniversalHeader } from '@sensenet/universal-header-react'
import { Button, Container, CssBaseline, Link, Slide } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { TransitionProps } from '@material-ui/core/transitions'
import React, { forwardRef, FunctionComponent, ReactElement, Ref } from 'react'
import snLogo from './assets/sensenet_logo_transparent.png'
import { ImageList } from './components/image-list'

const useHeaderStyles = makeStyles((theme) =>
  createStyles({
    appBar: {
      backgroundColor: theme.palette.primary.main,
    },
  }),
)

const useHamburgerMenuStyles = makeStyles(() =>
  createStyles({
    menuIcon: {
      '&:hover': {
        color: '#C8FFF4',
      },
    },
    menuIconActive: {
      color: '#C8FFF4',
    },
    menuItem: {
      '&:hover': {
        color: '#13a5ad',
      },
    },
  }),
)

export const goToRepoStyles = makeStyles(() =>
  createStyles({
    linkContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
    link: {
      '&:hover': {
        textDecoration: 'none',
      },
    },
    button: {
      backgroundColor: '#7169f4',
      color: '#FFFFFF',
      borderRadius: '26px',
      padding: '10px 20px',
      margin: '40px 0',
      height: '44px',
      '&:hover': {
        backgroundColor: '#5e58cc',
      },
      textTransform: 'uppercase',
    },
  }),
)

// eslint-disable-next-line react/display-name
export const Transition = forwardRef(
  (props: TransitionProps & { children?: ReactElement<any, any> }, ref: Ref<unknown>) => {
    return <Slide direction="up" ref={ref} {...props} />
  },
)

export const App: FunctionComponent = () => {
  const headerStyle = useHeaderStyles()
  const hamburgerMenuStyle = useHamburgerMenuStyles()
  const goToRepoClasses = goToRepoStyles()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${snLogo})`,
        backgroundSize: 'auto',
      }}>
      <CssBaseline />
      <UniversalHeader
        title="Image gallery"
        classes={headerStyle}
        hamburgerMenuClasses={hamburgerMenuStyle}
        appName="sn-react-imagegallery"
      />
      <Container maxWidth="md">
        <div className={goToRepoClasses.linkContainer}>
          <Link
            className={goToRepoClasses.link}
            href="https://admin.sensenet.com/content/explorer/?path=%2FIT%2FImageLibrary"
            target="_blank">
            <Button className={goToRepoClasses.button}>Go to connected repository</Button>
          </Link>
        </div>
        <ImageList />
      </Container>
    </div>
  )
}
