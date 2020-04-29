import { AppBar, Container, createStyles, makeStyles, Toolbar, Typography } from '@material-ui/core'
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

export const NotAuthorizedOverride = () => {
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
            Authorization
          </Typography>
          <Typography align="center" variant="subtitle1" component="p">
            You are not authorized to access this resource.
          </Typography>
        </Container>
      </div>
      <footer className={classes.footer} />
    </>
  )
}
