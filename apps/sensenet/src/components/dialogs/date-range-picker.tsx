import { Button, createStyles, DialogActions, DialogContent, makeStyles, Theme } from '@material-ui/core'
import isBefore from 'date-fns/isBefore'
import React, { useState } from 'react'
import { DayPicker, Matcher } from 'react-day-picker'
import { LocalizationObject } from '../../context'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization, usePersonalSettings } from '../../hooks'
import { useDialog } from '.'

import 'react-day-picker/dist/style.css'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      '& .DayPicker-wrapper, & .DayPicker-NavButton': {
        outline: 0,
      },
      '& .DayPicker-Day': {
        borderRadius: '0 !important',
      },
      '& .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside)': {
        backgroundColor: theme.palette.primary.main,
      },
    },
  })
})

export interface DateRangePickerProps {
  defaultValue?: {
    from: Date
    to: Date
  }
  handleSubmit: (range: { from?: Date; to?: Date }) => void
}

export const DateRangePicker: React.FunctionComponent<DateRangePickerProps> = (props) => {
  const { closeLastDialog } = useDialog()
  const globalClasses = useGlobalStyles()
  const classes = useStyles()
  const localization = useLocalization().dateRangePicker
  const personalSettings = usePersonalSettings()
  const langCode = LocalizationObject[personalSettings.language].locale

  const [from, setFrom] = useState<Date | undefined>(props.defaultValue?.from)
  const [to, setTo] = useState<Date | undefined>(props.defaultValue?.to)
  const [enteredTo, setEnteredTo] = useState<Date | undefined>(props.defaultValue?.to)

  const isSelectingFirstDay = (day: Date) => {
    const isBeforeFirstDay = from && isBefore(day, from)
    const isRangeSelected = from && to
    return !from || isBeforeFirstDay || isRangeSelected
  }

  const handleDayClick = (day: Date) => {
    if (from && to && day >= from && day <= to) {
      handleResetClick()
      return
    }
    if (isSelectingFirstDay(day)) {
      setFrom(day)
      setTo(undefined)
      setEnteredTo(undefined)
    } else {
      setTo(day)
      setEnteredTo(day)
    }
  }

  const handleDayMouseEnter = (day: Date) => {
    if (!isSelectingFirstDay(day)) {
      setEnteredTo(day)
    }
  }

  const handleResetClick = () => {
    setFrom(undefined)
    setTo(undefined)
    setEnteredTo(undefined)
  }

  const modifiers = { mods: { from, to: enteredTo } } || undefined
  const disabledDays: Matcher | undefined = from ? { before: from } : undefined
  const selectedDays: Matcher[] = from && enteredTo ? [from, { from, to: enteredTo }] : from ? [from] : []

  return (
    <>
      <DialogContent>
        <DayPicker
          className={classes.root}
          fixedWeeks
          numberOfMonths={2}
          fromMonth={from}
          toMonth={new Date()}
          selected={selectedDays}
          disabled={disabledDays}
          modifiers={modifiers}
          onDayClick={handleDayClick}
          onDayMouseEnter={handleDayMouseEnter}
          locale={langCode}
        />
      </DialogContent>
      <DialogActions>
        <Button
          aria-label={localization.resetButton}
          disabled={!from || !to}
          color="secondary"
          variant="contained"
          onClick={handleResetClick}>
          {localization.resetButton}
        </Button>
        <Button
          aria-label={localization.submitButton}
          color="primary"
          variant="contained"
          onClick={() => props.handleSubmit({ from, to })}>
          {localization.submitButton}
        </Button>
        <Button
          aria-label={localization.cancelButton}
          className={globalClasses.cancelButton}
          onClick={() => closeLastDialog()}>
          {localization.cancelButton}
        </Button>
      </DialogActions>
    </>
  )
}

export default DateRangePicker
