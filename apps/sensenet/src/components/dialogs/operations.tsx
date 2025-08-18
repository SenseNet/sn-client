import { Button, createStyles, DialogActions, DialogContent, makeStyles, TextField } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository, useSession } from '@sensenet/hooks-react'
import React, { useEffect, useRef, useState } from 'react'
import { useCurrentUser } from '../../context'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { Icon } from '../Icon'
import { DialogTitle, useDialog } from '.'

export interface OperationsDialogProps {
  content: GenericContent
  OperationName: string
}
/*Ezt itt jól ki kell dolgozni!!! nem végleges csak demora van egyszerűsítve
  Valószínüleg nem is itt lesz a végleges helye hanem ott ahol a GenericContent van
*/
type UIDescription = {
  title?: string
  submitTitle?: string
  elements: Array<{
    name?: string
    description?: string
    inputProps: React.HTMLProps<HTMLInputElement>
  }>
}

type OperationResult = {
  ToastMessage?: string
}

const useStyles = makeStyles(() =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      rowGap: '30px',
      '& :is(h3,p)': {
        margin: '0 0',
        fontWeight: 'normal',
      },
      '& input': {
        padding: '0',
      },
      '& .input-container': {
        width: '300px',
      },
    },
  }),
)

export function OperationsDialog(props: OperationsDialogProps) {
  const { closeLastDialog } = useDialog()
  const { currentUser } = useSession()
  const classes = useStyles()
  const logger = useLogger('Operations')
  const formRef = useRef<HTMLFormElement>(null)
  const repository = useRepository()
  const localization = useLocalization().operations
  const globalClasses = useGlobalStyles()

  const [UIDescription, setUIDescription] = useState<UIDescription>()

  useEffect(() => {
    const loadOperation = async () => {
      try {
        const result = await repository.executeAction<any, UIDescription>({
          method: 'POST',
          idOrPath: props.content.Path,
          name: props.OperationName,
        })
        setUIDescription(result)
      } catch (error) {
        logger.error({ message: error.message })
      }
    }

    loadOperation()
  }, [logger, props.OperationName, props.content.Path, repository])

  const submitAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const formJson: Record<string, any> = {}

    formData.forEach((value, key) => {
      formJson[key] = value
    })

    try {
      const result = await repository.executeAction<any, OperationResult>({
        method: 'POST',
        idOrPath: props.content.Path,
        name: props.OperationName,
        body: formJson,
      })

      const success = `: ${result?.ToastMessage}` || ''

      logger.information({ message: `${localization.success}${success}` })

      closeLastDialog()
    } catch (error) {
      logger.error({ message: error.message })
    }
  }

  return (
    <>
      <DialogTitle>
        <div className={globalClasses.centered}>
          <Icon
            style={{
              margin: '0 1em 0 0',
              transition: 'filter linear 1s, opacity linear 1.5s',
            }}
            item={currentUser}
          />
          {UIDescription?.title || localization.title}
        </div>
      </DialogTitle>
      <>
        <DialogContent>
          <form
            ref={formRef}
            className={classes.form}
            id="operation-form"
            onSubmit={(e) => {
              submitAction(e)
            }}>
            {UIDescription?.elements?.map((field, index) => {
              const { inputProps, description, name } = field

              return (
                <div className="input-container" key={index}>
                  <h3>{name}</h3>
                  <p>{description}</p>

                  <TextField
                    name={inputProps.name}
                    required={Boolean(inputProps.required)}
                    fullWidth
                    inputProps={inputProps}
                  />
                </div>
              )
            })}
          </form>
        </DialogContent>
        <DialogActions>
          <Button aria-label={localization.cancel} className={globalClasses.cancelButton} onClick={closeLastDialog}>
            {localization.cancel}
          </Button>
          <Button
            aria-label={localization.submit}
            form="operation-form"
            color="primary"
            variant="contained"
            type="submit"
            autoFocus={true}>
            {UIDescription?.submitTitle || localization.submit}
          </Button>
        </DialogActions>
      </>
    </>
  )
}

export default OperationsDialog
