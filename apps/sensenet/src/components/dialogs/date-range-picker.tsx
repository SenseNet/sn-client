import { Button, createStyles, DialogActions, DialogContent, makeStyles, Theme } from '@material-ui/core'
import React, { useState } from 'react'
import DayPicker, { DateUtils, Modifier } from 'react-day-picker'
import { useGlobalStyles } from '../../globalStyles'
import { useDialog } from '.'

import 'react-day-picker/lib/style.css'

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

  const [from, setFrom] = useState<Date | undefined>(props.defaultValue?.from)
  const [to, setTo] = useState<Date | undefined>(props.defaultValue?.to)
  const [enteredTo, setEnteredTo] = useState<Date | undefined>(props.defaultValue?.to)

  const isSelectingFirstDay = (day: Date) => {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from)
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

  const modifiers = { start: from, end: enteredTo }
  const disabledDays: Modifier = from ? { before: from } : undefined
  const selectedDays: Modifier[] = from && enteredTo ? [from, { from, to: enteredTo }] : from ? [from] : []

  return (
    <>
      <DialogContent>
        <DayPicker
          className={classes.root}
          firstDayOfWeek={1}
          fixedWeeks
          numberOfMonths={2}
          fromMonth={from}
          toMonth={new Date()}
          selectedDays={selectedDays}
          disabledDays={disabledDays}
          modifiers={modifiers}
          onDayClick={handleDayClick}
          onDayMouseEnter={handleDayMouseEnter}
        />
        <div>
          {!from && !to && 'Please select the first day.'}
          {from && !to && 'Please select the last day.'}
          {from &&
            to &&
            `Selected from ${from.toLocaleDateString()} to
                ${to.toLocaleDateString()}`}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          aria-label={'Reset'}
          disabled={!from || !to}
          color="secondary"
          variant="contained"
          onClick={handleResetClick}>
          Reset
        </Button>
        <Button
          aria-label={'Submit'}
          color="primary"
          variant="contained"
          onClick={() => props.handleSubmit({ from, to })}>
          Submit
        </Button>
        <Button aria-label={'Cancel'} className={globalClasses.cancelButton} onClick={() => closeLastDialog()}>
          Cancel
        </Button>
      </DialogActions>
    </>
  )
}

export default DateRangePicker
