import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { Button, createStyles, makeStyles, TableCell } from '@material-ui/core'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useDialog } from '../dialogs'
import { Icon } from '../Icon'

const useStyles = makeStyles(() => {
  return createStyles({
    fieldCell: {
      '& > div:not(:last-child)': {
        marginRight: '1rem',
      },
    },
    button: {
      marginLeft: '1em',
      textTransform: 'lowercase',
    },
  })
})

interface ReferenceFieldProps {
  content: GenericContent | GenericContent[]
  fieldName: string
  parent: GenericContent
}

export const ReferenceField: FunctionComponent<ReferenceFieldProps> = ({ content, fieldName, parent }) => {
  const globalClasses = useGlobalStyles()
  const classes = useStyles()
  const { openDialog } = useDialog()
  const repository = useRepository()

  return (
    <TableCell
      component="div"
      className={clsx(globalClasses.centeredLeft, globalClasses.virtualizedCellStyle, classes.fieldCell)}>
      {Array.isArray(content) ? (
        <div className={globalClasses.centeredVertical}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            onClick={async (event) => {
              event.stopPropagation()
              const actions = await repository.getActions({ idOrPath: parent.Path })
              const canEdit = actions.d.Actions.some((action) => action.Name === 'Edit')

              openDialog({
                name: 'reference-content-list',
                props: { items: content, parent, fieldName, canEdit },
                dialogProps: { maxWidth: 'sm', classes: { container: globalClasses.centeredRight } },
              })
            }}>
            {content.length} {fieldName}
          </Button>
        </div>
      ) : content.Name !== 'Somebody' ? (
        <div className={globalClasses.centeredVertical}>
          <Icon item={content} />
          <div style={{ marginLeft: '1em' }}>{content.DisplayName || content.Name}</div>
        </div>
      ) : null}
    </TableCell>
  )
}
