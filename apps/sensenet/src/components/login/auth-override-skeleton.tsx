import { AppBar, Button, Container, createStyles, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core'
import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../../../../../sn-client/examples/sn-dms-demo/src/assets/sensenet_white.png'
import { globals, useGlobalStyles } from '../../globalStyles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      height: globals.common.headerHeight,
      backgroundColor:
        theme.palette.type === 'dark' ? globals.common.headerBackground : globals.common.headerLightBackground,
      boxShadow: 'none',
    },
    toolBar: {
      display: 'flex',
      justifyContent: 'space-between',
      height: '100%',
      paddingRight: 0,
      paddingLeft: '16px',
      marginTop: '-12px',
    },
    contentWrapper: {
      minHeight: 'calc(100vh - 180px)',
      position: 'relative',
    },
    contentSlot: {
      display: 'flex',
      justifyContent: 'center',
      flexFlow: 'column',
    },
    title: {
      textAlign: 'center',
      marginTop: '20px',
    },
    footer: {
      height: '180px',
      backgroundColor:
        theme.palette.type === 'dark' ? globals.common.headerBackground : globals.common.headerLightBackground,
      boxShadow: 'none',
    },
  }),
)

export const AuthOverrideSkeleton = (props: {
  primaryText: string
  secondaryText: string
  buttonText?: string
  buttonOnClick?: () => void
}) => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <>
      <div className={classes.contentWrapper}>
        <AppBar position="sticky" className={classes.appBar}>
          <Toolbar className={classes.toolBar}>
            <div className={globalClasses.centeredVertical}>
              <NavLink to="/" style={{ display: 'flex', marginRight: '38px' }}>
                <img src={logo} alt="logo" style={{ height: '32px', marginTop: '1px' }} />
              </NavLink>
            </div>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm" className={classes.contentSlot}>
          <Typography variant="h4" className={classes.title}>
            {props.primaryText}
          </Typography>
          <Typography align="center" variant="subtitle1" component="p">
            {props.secondaryText}
          </Typography>
          {props.buttonOnClick && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1em',
              }}>
              <Button
                aria-label={props.buttonText}
                variant="contained"
                color="primary"
                style={{ width: '100%', backgroundColor: '#26A69A' }}
                onClick={() => props.buttonOnClick?.()}>
                <Typography variant="button">{props.buttonText}</Typography>
              </Button>
            </div>
          )}
        </Container>
      </div>
      <footer className={classes.footer} />
    </>
  )
}
