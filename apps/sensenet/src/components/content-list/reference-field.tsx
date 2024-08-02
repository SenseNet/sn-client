import { Button, createStyles, Link, makeStyles, TableCell, Theme, Tooltip } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { clsx } from 'clsx'
import React, { FunctionComponent, useContext } from 'react'
import { useHistory } from 'react-router'
import { ResponsivePersonalSettings } from '../../context'
import { useGlobalStyles } from '../../globalStyles'
import { getUrlForContent } from '../../services'
import { useDialog } from '../dialogs'
import { Icon } from '../Icon'

const useStyles = makeStyles((theme: Theme) => {
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
    link: {
      color: theme.palette.type === 'light' ? '#333333' : '#ffffff',
    },
  })
})

interface ReferenceFieldProps {
  content: GenericContent | GenericContent[]
  fieldName: string
  parent: GenericContent
  showIcon: boolean
}

export const ReferenceField: FunctionComponent<ReferenceFieldProps> = ({ content, fieldName, parent, showIcon }) => {
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
            data-test={`${parent.Name.replace(/\s+/g, '-').toLowerCase()}-${fieldName.toLowerCase()}`}
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
      ) : (
        <div className={globalClasses.centeredVertical}>
          {repository.schemas.isContentFromType(content, 'User') && showIcon ? (
            <Icon item={content} style={{ marginRight: '0.5rem' }} />
          ) : null}
          <Tooltip title={`Open ${content.DisplayName || content.Name} for edit`}>
            {content.Name === 'Somebody' ? (
              <>{content.DisplayName || content.Name}</>
            ) : (
              <Link
                className={classes.link}
                component="button"
                onClick={async () => {
                  history.push(
                    getUrlForContent({
                      content,
                      uiSettings,
                      location: history.location,
                      action: 'edit',
                      removePath: true,
                    }),
                  )
                }}>
                {content.DisplayName || content.Name}
              </Link>
            )}
          </Tooltip>
        </div>
      )}
    </TableCell>
  )
}
