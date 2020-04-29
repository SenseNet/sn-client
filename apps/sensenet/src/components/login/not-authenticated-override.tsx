import { AppBar, Container, createStyles, makeStyles, Toolbar, Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/sensenet-icon-32.png'
import { useQuery } from '../../hooks/use-query'
import { globals, useGlobalStyles } from '../../globalStyles'
import { authConfigKey } from '../../context'

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

export const NotAuthenticatedOverride = () => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const message = useQuery().get('message')

  useEffect(() => {
    if (message === 'access_denied') {
      window.localStorage.removeItem(authConfigKey)
      window.location.replace('/')
    }
  }, [message])

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
            Authentication
          </Typography>
          <Typography align="center" variant="subtitle1" component="p">
            You are not authenticated.
          </Typography>
        </Container>
      </div>
      <footer className={classes.footer} />
    </>
  )
}
