import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import Input, { InputProps } from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import ArrowDropUp from '@material-ui/icons/ArrowDropUp'
import Search from '@material-ui/icons/Search'
import Tune from '@material-ui/icons/Tune'
import React from 'react'
import MediaQuery from 'react-responsive'

const styles = {
  textStyle: {
    background: 'rgba(0,0,0,.050)',
    height: '48px',
    color: 'black',
  },
  openMobile: {
    width: '100%',
  },
  closed: {
    width: 0,
  },
  searchButton: {
    color: '#fff',
    verticalAlign: 'middle' as any,
  },
  icon: {
    width: 40,
    height: 40,
    padding: 5,
    top: 0,
    color: '#fff',
    verticalAlign: 'middle' as any,
  },
}

const quickSearchBox = (props: {
  isOpen: boolean
  onClick: () => void
  inputProps?: InputProps
  containerProps?: React.HTMLAttributes<HTMLDivElement>
  containerRef?: (el: HTMLDivElement) => void
  startAdornmentRef?: (el: HTMLInputElement | null) => void
  isLoading: boolean
}) => {
  return (
    <MediaQuery minDeviceWidth={700}>
      {(matches) => {
        if (matches) {
          return (
            <div ref={props.containerRef} {...(props.containerProps as any)}>
              <Input
                {...props.inputProps}
                name="search"
                style={{ ...styles.textStyle, ...(props.inputProps && props.inputProps.style) }}
                disableUnderline={true}
                disabled={props.isLoading}
                startAdornment={
                  <InputAdornment position="start">
                    <IconButton buttonRef={props.startAdornmentRef} disabled={true}>
                      <Search color="disabled" />
                    </IconButton>
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={props.onClick}>
                      {props.isLoading ? <CircularProgress size={24} style={{ marginRight: '.5em' }} /> : null}
                      <Tune />
                      {props.isOpen ? <ArrowDropUp /> : <ArrowDropDown />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </div>
          )
        } else {
          return (
            <div ref={props.containerRef} {...(props.containerProps as any)}>
              <Input name="search" placeholder="search" style={styles.textStyle} disableUnderline={true} />
            </div>
          )
        }
      }}
    </MediaQuery>
  )
}

export default quickSearchBox
