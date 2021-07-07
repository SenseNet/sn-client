import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { createStyles, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import React, { useCallback, useContext, useMemo } from 'react'
import { useHistory } from 'react-router'
import { ResponsivePersonalSettings } from '../../../context'
import { useGlobalStyles } from '../../../globalStyles'
import { useSnRoute } from '../../../hooks'
import { getPrimaryActionUrl } from '../../../services'
import { Icon } from '../../Icon'

interface ViewTitleProps {
  title: string
  titleBold?: string
  content?: GenericContent
}

const useStyles = makeStyles(() => {
  return createStyles({
    title: {
      height: '68px',
      fontSize: '20px',
      flexShrink: 0,
    },
    textBolder: {
      fontWeight: 500,
    },
  })
})

export const ViewTitle: React.FunctionComponent<ViewTitleProps> = (props) => {
  const globalClasses = useGlobalStyles()
  const history = useHistory()
  const repository = useRepository()
  const classes = useStyles()
  const uiSettings = useContext(ResponsivePersonalSettings)
  const snRoute = useSnRoute()

  const contentDisplayName = useMemo(
    () => props.content && repository.schemas.getSchemaByName(props.content.Type).DisplayName,
    [props.content, repository.schemas],
  )

  const getContentTypeId = useCallback(
    async (contentType: string) => {
      const result = await repository.loadCollection({
        path: '/Root/System/Schema/ContentTypes',
        oDataOptions: {
          query: `+TypeIs:'ContentType' AND Name:${contentType} .AUTOFILTERS:OFF`,
        },
      })
      return result.d.results[0]
    },
    [repository],
  )

  return (
    <div className={clsx(classes.title, globalClasses.centered)}>
      <span data-test="viewtitle">
        {props.title} <span className={classes.textBolder}>{props.titleBold}</span>
      </span>
      {props.content && (
        <span
          title={`Open ${contentDisplayName} CTD`}
          onClick={async () => {
            const content = await getContentTypeId(props.content!.Type)
            history.push(
              getPrimaryActionUrl({
                content,
                repository,
                location: history.location,
                uiSettings,
                snRoute,
                removePath: true,
              }),
            )
          }}
          className={globalClasses.centered}>
          <Icon
            style={{
              marginLeft: '9px',
              height: '24px',
              width: '24px',
              cursor: 'pointer',
            }}
            item={props.content}
          />
        </span>
      )}
    </div>
  )
}
