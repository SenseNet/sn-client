import { createStyles, makeStyles } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { clsx } from 'clsx'
import React, { useCallback, useContext, useMemo } from 'react'
import { useHistory } from 'react-router'
import { ResponsivePersonalSettings } from '../../../context'
import { useGlobalStyles } from '../../../globalStyles'
import { useSnRoute } from '../../../hooks'
import { getPrimaryActionUrl, getUrlForContent } from '../../../services'
import { Icon } from '../../Icon'

interface ViewTitleProps {
  title?: string
  titleBold?: string
  content?: GenericContent
  actionName?: string
}

const useStyles = makeStyles(() => {
  return createStyles({
    title: {
      height: '68px',
      fontSize: '20px',
      flexShrink: 0,
      flexDirection: 'column',
      flexWrap: 'nowrap',
    },
    textBolder: {
      fontWeight: 500,
    },
    actionBar: {
      display: 'flex',
    },
    typeinfo: {
      fontSize: '12px',
      color: 'grey',
      marginLeft: '5px',
    },
    actionText: {
      marginRight: '5px',
    },
    viewTitle: {
      '& span': {
        display: 'inline-block',
        verticalAlign: 'middle',
      },
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
      <div data-test="viewtitle" className={classes.viewTitle}>
        <span className={classes.actionText}>{props.title}</span>
        <span className={classes.textBolder}>{props.titleBold}</span>
        <span className={classes.typeinfo}>({props.content!.Type})</span>
      </div>
      <div className={classes.actionBar}>
        {props.actionName === 'browse' && (
          <span
            data-test="viewtitle-edit"
            title={`Open ${contentDisplayName} Edit Page`}
            onClick={async () => {
              history.push(
                getUrlForContent({
                  content: props.content!,
                  uiSettings,
                  location: history.location,
                  action: 'edit',
                  snRoute,
                  removePath: true,
                }),
              )
            }}
            className={globalClasses.centered}>
            <Icon
              style={{
                marginLeft: '4px',
                marginRight: '4px',
                height: '24px',
                width: '24px',
                cursor: 'pointer',
              }}
              item={{ Icon: 'Edit' }}
            />
          </span>
        )}
        {props.actionName === 'edit' && (
          <span
            data-test="viewtitle-details"
            title={`Open ${contentDisplayName} Details Page`}
            onClick={async () => {
              history.push(
                getUrlForContent({
                  content: props.content!,
                  uiSettings,
                  location: history.location,
                  action: 'browse',
                  snRoute,
                  removePath: true,
                }),
              )
            }}
            className={globalClasses.centered}>
            <Icon
              style={{
                marginLeft: '4px',
                marginRight: '4px',
                height: '24px',
                width: '24px',
                cursor: 'pointer',
              }}
              item={{ Icon: 'Details' }}
            />
          </span>
        )}
        {props.content && (
          <span
            title={`Open ${contentDisplayName} CTD`}
            onClick={async () => {
              const content = await getContentTypeId(props.content!.Type)
              const url = getPrimaryActionUrl({
                content,
                repository,
                location: history.location,
                uiSettings,
                snRoute,
                removePath: true,
              })
              window.open(url, '_blank')
            }}
            className={globalClasses.centered}>
            <Icon
              style={{
                marginLeft: '4px',
                marginRight: '4px',
                height: '24px',
                width: '24px',
                cursor: 'pointer',
              }}
              item={{ ContentTypeName: 'ContentType' }}
            />
          </span>
        )}
      </div>
    </div>
  )
}
