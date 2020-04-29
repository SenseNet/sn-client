import { AppBar, Button, Container, createStyles, makeStyles, Toolbar, Typography } from '@material-ui/core'
import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/sensenet-icon-32.png'
import { globals, useGlobalStyles } from '../../globalStyles'

const useStyles = makeStyles(() =>
  createStyles({
    appBar: {
      height: globals.common.headerHeight,
      backgroundColor: globals.common.headerBackground,
      boxShadow: 'none',
    },
    toolBar: {
      display: 'flex',
      justifyContent: 'space-between',
      height: '100%',
      paddingRight: 0,
      paddingLeft: '32px',
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
      backgroundColor: globals.common.headerBackground,
      boxShadow: 'none',
    },
  }),
)

export type SessionLostProps = {
  onAuthenticate: () => void
}

export const SessionLostOverride = ({ onAuthenticate }: SessionLostProps) => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <>
      <div className={classes.contentWrapper}>
        <AppBar position="sticky" className={classes.appBar}>
          <Toolbar className={classes.toolBar}>
            <div className={globalClasses.centeredVertical}>
              <NavLink to="/" style={{ display: 'flex', marginRight: '38px' }}>
                <img src={logo} alt="logo" />
              </NavLink>
            </div>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm" className={classes.contentSlot}>
          <Typography variant="h4" className={classes.title}>
            Session timed out
          </Typography>
          <Typography align="center" variant="subtitle1" component="p">
            Your session has expired. Please re-authenticate yourself.
          </Typography>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '1em',
            }}>
            <Button
              variant="contained"
              color="primary"
              style={{ width: '100%', backgroundColor: '#26A69A' }}
              onClick={onAuthenticate}>
              <Typography variant="button">re-authenticate</Typography>
            </Button>
          </div>
        </Container>
      </div>
      <footer className={classes.footer} />
    </>
  )
}
