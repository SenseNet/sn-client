import { UniversalHeader } from '@sensenet/universal-header'
import { Container, CssBaseline, Slide } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { TransitionProps } from '@material-ui/core/transitions'
import React from 'react'
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
  }),
)

// eslint-disable-next-line react/display-name
export const Transition = React.forwardRef(
  (props: TransitionProps & { children?: React.ReactElement<any, any> }, ref: React.Ref<unknown>) => {
    return <Slide direction="up" ref={ref} {...props} />
  },
)

export const App: React.FunctionComponent = () => {
  const headerStyle = useHeaderStyles()
  const hamburgerMenuStyle = useHamburgerMenuStyles()

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
      <UniversalHeader title="Image gallery" classes={headerStyle} hamburgerMenuClasses={hamburgerMenuStyle} />
      <Container maxWidth="md">
        <ImageList />
      </Container>
    </div>
  )
}
