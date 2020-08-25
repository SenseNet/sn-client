import { Group } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { Container, createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useCurrentUser } from '../../context'
import { globals } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { LearnMoreWidget } from './learn-more-widget'
import { SubscriptionWidget } from './subscription-widget'
import { DashboardData } from './types'
import { UsageWidget } from './usage-widget'
import { YourProjectWidget } from './your-project-widget'

const useStyles = makeStyles(() => {
  return createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      width: '100%',
      height: '100%',
    },
    welcome: {
      flex: '1 1 0',
      textAlign: 'center',
      padding: '3rem 0',
    },
    title: {
      fontSize: '34px',
      fontWeight: 500,
      marginBottom: '20px',
    },
  })
})

export const round = (value: number, precision = 1) => {
  const multiplier = Math.pow(10, precision)
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier
}

export const useWidgetStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      marginBottom: '2rem',
      width: '100%',
    },
    title: {
      marginBottom: '1rem',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      fontSize: '20px',
      fontWeight: 500,
    },
    container: {
      padding: '1.5rem',
      backgroundColor: theme.palette.type === 'light' ? globals.light.drawerBackground : globals.dark.drawerBackground,
      border: theme.palette.type === 'light' ? '1px solid #E2E2E2' : 0,
    },
    subtitle: {
      fontSize: '20px',
      fontWeight: 500,
      marginTop: 0,
    },
  })
})

const Dashboard = () => {
  const classes = useStyles()
  const repository = useRepository()
  const localization = useLocalization().dashboard
  const currentUser = useCurrentUser()
  const [data, setData] = useState<DashboardData>()
  const logger = useLogger('Dashboard')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    ;(async () => {
      const response = await repository.executeAction<any, DashboardData>({
        idOrPath: '/Root',
        name: 'GetDashboardData',
        method: 'GET',
        oDataOptions: {
          select: ['Plan'],
        },
      })

      setData(response)
    })()
  }, [repository])

  useEffect(() => {
    const ac = new AbortController()

    ;(async () => {
      try {
        const result = await repository.load<any>({
          idOrPath: currentUser.Path,
          oDataOptions: {
            select: ['AllRoles'] as any,
            expand: ['AllRoles'] as any,
          },
          requestInit: {
            signal: ac.signal,
          },
        })

        setIsAdmin(result.d.AllRoles.some((role: Group) => role.Path === '/Root/IMS/Public/Administrators'))
      } catch (error) {
        if (!ac.signal.aborted) {
          logger.debug({ message: `Couldn't load current user`, data: error })
        }
      }
    })()
  }, [currentUser, logger, repository])

  if (!data) return null

  return (
    <div style={{ overflow: 'auto' }}>
      <Container fixed className={classes.container}>
        <div className={classes.welcome}>
          <Typography variant="h1" className={classes.title}>
            {localization.title(data.displayName || data.host)}
          </Typography>
          {localization.descriptionFirstLine}
          <br />
          {localization.descriptionSecondLine}
        </div>
        <SubscriptionWidget subscription={data.subscription} version={data.version} isAdmin={isAdmin} />
        {data?.usage?.user === 1 && <YourProjectWidget />}
        <UsageWidget limitations={data.subscription.plan.limitations} used={data.usage} />
        <LearnMoreWidget />
      </Container>
    </div>
  )
}

export default Dashboard
