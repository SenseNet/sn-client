import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import { AssessmentOutlined, DescriptionOutlined, GroupOutlined, Update } from '@material-ui/icons'
import React, { useMemo } from 'react'
import type { AuthContextModel } from '../context/auth-provider'
import { useLocalization } from '../hooks'
import { UserAvatar } from './UserAvatar'

interface HomeActivitySummaryProps {
  logs: HomeActivityLog[]
  repositoryUrl: string
  user?: AuthContextModel['user']
}

interface HomeActivityLog {
  ContentId?: number | string
  ContentPath?: string
  LogDate?: string
  Message?: string
  UserName?: string
}

interface ChartItem {
  label: string
  value: number
}

interface UserDetail {
  label: string
  value?: string | number | null
}

interface LoginItem {
  count: number
  lastLogin?: string
  userName: string
}

type HomeLocalization = ReturnType<typeof useLocalization>['home']

type UserWithDomain = {
  Domain?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: '28px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: '16px',
      marginBottom: '16px',
      [theme.breakpoints.down(600)]: {
        flexDirection: 'column',
        gap: '4px',
      },
    },
    title: {
      fontSize: '24px',
      fontWeight: 500,
      color: theme.palette.type === 'light' ? '#333' : '#fff',
      margin: 0,
    },
    caption: {
      color: theme.palette.text.secondary,
      whiteSpace: 'nowrap',
    },
    userPanel: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: '18px',
      alignItems: 'center',
      padding: '20px',
      marginBottom: '16px',
      borderRadius: '8px',
      border: `1px solid ${theme.palette.type === 'light' ? '#e2e8f0' : '#454545'}`,
      backgroundColor: theme.palette.type === 'light' ? '#fff' : '#303030',
      [theme.breakpoints.down(600)]: {
        gridTemplateColumns: '1fr',
      },
    },
    avatar: {
      width: '64px',
      height: '64px',
      fontSize: '28px',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    userName: {
      fontSize: '26px',
      lineHeight: 1.2,
      fontWeight: 600,
      color: theme.palette.type === 'light' ? '#1f2937' : '#fff',
      marginBottom: '10px',
    },
    userDetails: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      gap: '12px',
      [theme.breakpoints.down(1200)]: {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
      [theme.breakpoints.down(600)]: {
        gridTemplateColumns: '1fr',
      },
    },
    userDetailLabel: {
      color: theme.palette.text.secondary,
      fontSize: '12px',
      textTransform: 'uppercase',
      marginBottom: '2px',
    },
    userDetailValue: {
      color: theme.palette.type === 'light' ? '#374151' : '#f5f5f5',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    metricGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      gap: '16px',
      marginBottom: '16px',
      [theme.breakpoints.down(960)]: {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
      [theme.breakpoints.down(600)]: {
        gridTemplateColumns: '1fr',
      },
    },
    metricCard: {
      minHeight: '112px',
      padding: '18px',
      borderRadius: '8px',
      border: `1px solid ${theme.palette.type === 'light' ? '#e2e8f0' : '#454545'}`,
      backgroundColor: theme.palette.type === 'light' ? '#f8fafc' : '#343434',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    metricHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
    },
    metricLabel: {
      color: theme.palette.text.secondary,
      fontSize: '14px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    metricIcon: {
      color: theme.palette.primary.main,
      flexShrink: 0,
    },
    metricValue: {
      fontSize: '34px',
      lineHeight: 1,
      fontWeight: 600,
      color: theme.palette.type === 'light' ? '#1f2937' : '#fff',
      marginTop: '16px',
    },
    chartGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      gap: '16px',
      [theme.breakpoints.down(1200)]: {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
      [theme.breakpoints.down(800)]: {
        gridTemplateColumns: '1fr',
      },
    },
    chartCard: {
      padding: '18px',
      borderRadius: '8px',
      border: `1px solid ${theme.palette.type === 'light' ? '#e2e8f0' : '#454545'}`,
      backgroundColor: theme.palette.type === 'light' ? '#fff' : '#303030',
      minHeight: '220px',
    },
    chartTitle: {
      fontSize: '16px',
      fontWeight: 600,
      marginBottom: '16px',
      color: theme.palette.type === 'light' ? '#333' : '#fff',
    },
    barRow: {
      display: 'grid',
      gridTemplateColumns: 'minmax(96px, 160px) 1fr 44px',
      gap: '12px',
      alignItems: 'center',
      marginBottom: '12px',
      [theme.breakpoints.down(600)]: {
        gridTemplateColumns: '1fr 44px',
      },
    },
    barLabel: {
      color: theme.palette.text.secondary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      [theme.breakpoints.down(600)]: {
        gridColumn: '1 / 2',
      },
    },
    barTrack: {
      height: '10px',
      borderRadius: '999px',
      overflow: 'hidden',
      backgroundColor: theme.palette.type === 'light' ? '#e5e7eb' : '#505050',
      [theme.breakpoints.down(600)]: {
        gridColumn: '1 / 2',
      },
    },
    barFill: {
      height: '100%',
      minWidth: '6px',
      borderRadius: '999px',
      backgroundColor: theme.palette.primary.main,
    },
    barValue: {
      textAlign: 'right',
      fontWeight: 600,
      color: theme.palette.type === 'light' ? '#374151' : '#f5f5f5',
      [theme.breakpoints.down(600)]: {
        gridColumn: '2 / 3',
        gridRow: '1 / 3',
      },
    },
    emptyState: {
      minHeight: '150px',
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.text.secondary,
    },
    loginList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    loginRow: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '12px',
      alignItems: 'center',
      paddingBottom: '12px',
      borderBottom: `1px solid ${theme.palette.type === 'light' ? '#e5e7eb' : '#454545'}`,
      '&:last-child': {
        borderBottom: 0,
        paddingBottom: 0,
      },
    },
    loginUser: {
      color: theme.palette.type === 'light' ? '#374151' : '#f5f5f5',
      fontWeight: 600,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    loginMeta: {
      color: theme.palette.text.secondary,
      fontSize: '13px',
    },
    loginCount: {
      color: theme.palette.text.secondary,
      whiteSpace: 'nowrap',
    },
  }),
)

const formatMessage = (message?: string) => (message || '').replace(/([a-z])([A-Z])/g, '$1 $2')

const normalizeLabel = (value?: string) => (value || '').trim().toLocaleLowerCase()

const isContentUpdate = (log: HomeActivityLog) => normalizeLabel(formatMessage(log.Message)) === 'content updated'

const isLoginSuccessful = (log: HomeActivityLog) => normalizeLabel(formatMessage(log.Message)) === 'login successful'

const formatLogDate = (value?: string) => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const getUserDisplayName = (user?: AuthContextModel['user']) => {
  return user?.FullName || user?.DisplayName || user?.Name || user?.LoginName || 'User'
}

const getUserDomain = (user?: AuthContextModel['user']) => {
  return user && 'Domain' in user ? (user as UserWithDomain).Domain : undefined
}

const getUserDetails = (user: AuthContextModel['user'], localization: HomeLocalization) => {
  const details: UserDetail[] = [
    { label: localization.userLoginName, value: user?.LoginName || user?.Name },
    { label: localization.userEmail, value: user?.Email },
    { label: localization.userPath, value: user?.Path },
    { label: localization.userDomain, value: getUserDomain(user) },
  ]

  return details.filter((detail) => detail.value)
}

const getTopItems = (items: Array<string | undefined>, limit = 5): ChartItem[] => {
  const counts = items.reduce<Record<string, ChartItem>>((acc, item) => {
    const key = normalizeLabel(item)
    if (!key) return acc

    if (!acc[key]) {
      acc[key] = { label: item?.trim() || '', value: 0 }
    }
    acc[key].value += 1
    return acc
  }, {})

  return Object.values(counts)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
}

const getRecentLogins = (logs: HomeActivityLog[], limit = 6): LoginItem[] => {
  const logins = logs.filter(isLoginSuccessful)
  const grouped = logins.reduce<Record<string, LoginItem>>((acc, log) => {
    const key = normalizeLabel(log.UserName)
    if (!key) return acc

    if (!acc[key]) {
      acc[key] = {
        count: 0,
        lastLogin: log.LogDate,
        userName: log.UserName || '',
      }
    }

    acc[key].count += 1
    const { lastLogin } = acc[key]
    const currentLastLogin = lastLogin ? new Date(lastLogin).getTime() : 0
    const nextLogin = log.LogDate ? new Date(log.LogDate).getTime() : 0
    if (nextLogin > currentLastLogin) {
      acc[key].lastLogin = log.LogDate
      acc[key].userName = log.UserName || acc[key].userName
    }

    return acc
  }, {})

  return Object.values(grouped)
    .sort((a, b) => new Date(b.lastLogin || '').getTime() - new Date(a.lastLogin || '').getTime())
    .slice(0, limit)
}

const BarChart = ({ items, emptyText }: { items: ChartItem[]; emptyText: string }) => {
  const classes = useStyles()
  const maxValue = Math.max(...items.map((item) => item.value), 1)

  if (!items.length) {
    return <div className={classes.emptyState}>{emptyText}</div>
  }

  return (
    <>
      {items.map((item) => (
        <div className={classes.barRow} key={item.label}>
          <Typography className={classes.barLabel} title={item.label}>
            {item.label}
          </Typography>
          <div className={classes.barTrack}>
            <div className={classes.barFill} style={{ width: `${(item.value / maxValue) * 100}%` }} />
          </div>
          <Typography className={classes.barValue}>{item.value}</Typography>
        </div>
      ))}
    </>
  )
}

const LoginList = ({ items, localization }: { items: LoginItem[]; localization: HomeLocalization }) => {
  const classes = useStyles()

  if (!items.length) {
    return <div className={classes.emptyState}>{localization.activityNoLogins}</div>
  }

  return (
    <div className={classes.loginList}>
      {items.map((item) => (
        <div className={classes.loginRow} key={normalizeLabel(item.userName)}>
          <div>
            <Typography className={classes.loginUser} title={item.userName}>
              {item.userName}
            </Typography>
            <div className={classes.loginMeta}>
              {localization.activityLastLogin}: {formatLogDate(item.lastLogin)}
            </div>
          </div>
          <div className={classes.loginCount}>{localization.activityLoginCount(item.count)}</div>
        </div>
      ))}
    </div>
  )
}

export const HomeActivitySummary: React.FunctionComponent<HomeActivitySummaryProps> = ({
  logs,
  repositoryUrl,
  user,
}) => {
  const classes = useStyles()
  const localization = useLocalization().home
  const numberFormatter = new Intl.NumberFormat('en-US')
  const userDisplayName = getUserDisplayName(user)
  const userDetails = getUserDetails(user, localization)

  const summary = useMemo(() => {
    const contentIds = new Set<string>()
    const users = new Set<string>()

    logs.forEach((log) => {
      if (log.ContentId || log.ContentPath) {
        contentIds.add(String(log.ContentId || log.ContentPath).toLocaleLowerCase())
      }
      if (log.UserName) users.add(normalizeLabel(log.UserName))
    })

    const contentUpdateLogs = logs.filter(isContentUpdate)
    const operations = getTopItems(logs.map((log) => formatMessage(log.Message)))
    const recentLogins = getRecentLogins(logs)

    return {
      total: logs.length,
      activeUsers: users.size,
      touchedContent: contentIds.size,
      contentUpdates: contentUpdateLogs.length,
      operations,
      editors: getTopItems(contentUpdateLogs.map((log) => log.UserName)),
      recentLogins,
    }
  }, [logs])

  const metrics = [
    {
      label: localization.activityLogEntries,
      value: summary.total,
      icon: <AssessmentOutlined className={classes.metricIcon} />,
    },
    {
      label: localization.activityUsers,
      value: summary.activeUsers,
      icon: <GroupOutlined className={classes.metricIcon} />,
    },
    {
      label: localization.activityContent,
      value: summary.touchedContent,
      icon: <DescriptionOutlined className={classes.metricIcon} />,
    },
    {
      label: localization.activityUpdates,
      value: summary.contentUpdates,
      icon: <Update className={classes.metricIcon} />,
    },
  ]

  return (
    <section className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h2" component="div" className={classes.title}>
          {localization.activityOverview}
        </Typography>
        <Typography className={classes.caption}>{localization.activityWindow}</Typography>
      </div>
      <div className={classes.userPanel}>
        <UserAvatar
          user={user}
          repositoryUrl={repositoryUrl}
          avatarProps={{ className: classes.avatar }}
          style={{ width: 64, height: 64, fontSize: 28 }}
        />
        <div>
          <div className={classes.userName}>{localization.userGreeting(userDisplayName)}</div>
          <div className={classes.userDetails}>
            {userDetails.map((detail) => (
              <div key={detail.label}>
                <div className={classes.userDetailLabel}>{detail.label}</div>
                <Typography className={classes.userDetailValue} title={String(detail.value)}>
                  {detail.value}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={classes.metricGrid}>
        {metrics.map((metric) => (
          <div className={classes.metricCard} key={metric.label}>
            <div className={classes.metricHeader}>
              <Typography className={classes.metricLabel}>{metric.label}</Typography>
              {metric.icon}
            </div>
            <div className={classes.metricValue}>{numberFormatter.format(metric.value)}</div>
          </div>
        ))}
      </div>
      <div className={classes.chartGrid}>
        <div className={classes.chartCard}>
          <div className={classes.chartTitle}>{localization.activityOperations}</div>
          <BarChart items={summary.operations} emptyText={localization.activityNoData} />
        </div>
        <div className={classes.chartCard}>
          <div className={classes.chartTitle}>{localization.activityEditors}</div>
          <BarChart items={summary.editors} emptyText={localization.activityNoData} />
        </div>
        <div className={classes.chartCard}>
          <div className={classes.chartTitle}>{localization.activityLogins}</div>
          <LoginList items={summary.recentLogins} localization={localization} />
        </div>
      </div>
    </section>
  )
}
