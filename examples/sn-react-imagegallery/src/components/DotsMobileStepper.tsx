import Button from '@material-ui/core/Button'
import MobileStepper from '@material-ui/core/MobileStepper'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import React from 'react'

interface DottedStepperProps {
  imageIndex: number
  steppingFunction: (imageIndex: number, openInfoTab: boolean) => void
  imageListLenght: number
}
/**
 * Fetches the images from the repository.
 */
export const DotsMobileStepper: React.FunctionComponent<DottedStepperProps> = (props) => {
  const useStyles = makeStyles({
    root: {
      maxWidth: '100%',
      flexGrow: 1,
    },
  })
  const classes = useStyles()
  const theme = useTheme()
  const [activeStep, setActiveStep] = React.useState(props.imageIndex)
  const maxSteps = props.imageListLenght
  let imageIndex = 0
  /**
   * Fetches the images from the repository.
   */
  function handleNext() {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1)
    imageIndex = activeStep + 1
    props.steppingFunction(imageIndex, false)
  }
  /**
   * Fetches the images from the repository.
   */
  function handleBack() {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1)
    imageIndex = activeStep - 1
    props.steppingFunction(imageIndex, false)
  }
  return (
    <MobileStepper
      steps={maxSteps}
      position="static"
      variant="text"
      activeStep={activeStep}
      className={classes.root}
      nextButton={
        <Button size="small" onClick={handleNext} disabled={activeStep === props.imageListLenght - 1}>
          Next
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </Button>
      }
      backButton={
        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          Back
        </Button>
      }
    />
  )
}
