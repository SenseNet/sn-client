import { Radio, RadioGroup, RadioProps } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Clear, Done, Remove } from '@material-ui/icons'
import { PermissionValues } from '@sensenet/default-content-types'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexDirection: 'row',
      backgroundColor: '#989898',
      borderRadius: '25px',
      '& .MuiButtonBase-root': {
        padding: '5px',
      },
      '& .Mui-checked': {
        backgroundColor: theme.palette.primary.main,
      },
      '& .MuiSvgIcon-root': {
        fontSize: '1rem',
      },
    },
  }),
)

const StyledRadio = (props: RadioProps) => {
  const classes = useStyles()

  return <Radio className={classes.root} checkedIcon={props.icon} disableRipple color="default" {...props} />
}

interface PermissionSelectorProps {
  permissionValue: keyof typeof PermissionValues
  setPermission: (selectedPermission: keyof typeof PermissionValues) => void
  disabled?: boolean
}

export const PermissionSelector = (props: PermissionSelectorProps) => {
  const { permissionValue, setPermission, disabled } = props

  const classes = useStyles()

  const handleRadioClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const option = event.target.value as keyof typeof PermissionValues

    setPermission(option)
  }

  return (
    <RadioGroup className={classes.root} aria-label="permission" value={permissionValue} onChange={handleRadioClick}>
      <StyledRadio disabled={disabled} value="deny" icon={<Clear />} />
      <StyledRadio disabled={disabled} value="undefined" icon={<Remove />} />
      <StyledRadio disabled={disabled} value="allow" icon={<Done />} />
    </RadioGroup>
  )
}
