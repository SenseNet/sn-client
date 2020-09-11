import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { Button, createStyles, Link, makeStyles, TableCell, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import React, { FunctionComponent, useContext } from 'react'
import { useHistory } from 'react-router'
import { ResponsivePersonalSettings } from '../../context'
import { useGlobalStyles } from '../../globalStyles'
import { getUrlForContent } from '../../services'
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
  const uiSettings = useContext(ResponsivePersonalSettings)
  const history = useHistory()

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
              const canEdit = actions.d.results.some((action) => action.Name === 'Edit')

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
          {content.Type === 'User' ? <Icon item={content} /> : null}
          <Tooltip title={`Open ${content.DisplayName || content.Name} for edit`}>
            <Link
              style={{ marginLeft: '1em', color: '#ffffff' }}
              component="button"
              onClick={async () => {
                history.push(
                  getUrlForContent({
                    content,
                    uiSettings,
                    location: history.location,
                    action: 'edit',
                  }),
                )
              }}>
              {content.DisplayName || content.Name}
            </Link>
          </Tooltip>
        </div>
      ) : null}
    </TableCell>
  )
}
