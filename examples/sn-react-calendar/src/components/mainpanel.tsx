import { ODataCollectionResponse } from '@sensenet/client-core'
import { useRepository } from '@sensenet/hooks-react'
import { Query } from '@sensenet/query'
import { List, ListItem, ListItemAvatar } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/styles'
import format from 'date-fns/format'
import orderby from 'lodash.orderby'
import React, { useContext, useEffect, useState } from 'react'
import { v1 } from 'uuid'
import { CalendarEvent } from '../CalendarEvent-type'
import { SharedContext } from '../context/shared-context'
import AddNewEvent from './add-new-event'
import EventComponent from './event'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
    },
    dayAvatar: {
      alignSelf: 'flex-start',
      paddingTop: '8px',
    },
    dayname: {
      display: 'block',
      textAlign: 'center',
    },
    daynumber: {
      display: 'block',
      textAlign: 'center',
      fontSize: '20px',
      fontWeight: 400,
    },
    nopadding: {
      padding: '0',
    },
  }),
)

export interface GroupdByAny {
  date: any
  event: CalendarEvent[]
  id: string
}

const groupByDay = function (xs: CalendarEvent[], key: keyof Pick<CalendarEvent, 'StartDate'>) {
  const resultArray: GroupdByAny[] = []
  xs.forEach((event) => {
    const findevent = resultArray.find(
      (c) =>
        format(new Date(c.date), 'yyyy-MM-dd') ===
        format(new Date(event[key] !== undefined ? (event[key] as string) : ''), 'yyyy-MM-dd'),
    )
    if (findevent) {
      findevent.event.push(event)
      findevent.event = orderby(findevent.event, 'AllDay', 'desc')
    } else {
      if (event[key]) {
        resultArray.push({
          id: v1(),
          date: event[key],
          event: [event],
        })
      }
    }
  })
  return resultArray
}

/**
 * Main component
 */
const MainPanel: React.FunctionComponent = () => {
  const classes = useStyles()
  const repo = useRepository()
  const [data, setData] = useState<GroupdByAny[]>([])
  const sharedcontext = useContext(SharedContext)

  useEffect(() => {
    const loadCalendar = async () => {
      const result: ODataCollectionResponse<CalendarEvent> = await repo.loadCollection({
        path: `/Root/Content/IT/Calendar`,
        oDataOptions: {
          select: [
            'DisplayName',
            'Description',
            'CreationDate',
            'CreatedBy',
            'ModifiedBy',
            'ModificationDate',
            'Icon',
            'Type',
            'Id',
            'Path',
            'Name',
            'Size',
            'Location',
            'StartDate',
            'EndDate',
            'Lead',
            'AllDay',
            'EventUrl',
            'OwnerEmail',
          ] as any,
          query: new Query((q) => q.typeIs('CalendarEvent')).toString(),
          orderby: [['StartDate', 'asc']],
          expand: ['CreatedBy', 'ModifiedBy'],
        },
      })

      const groupedby = groupByDay(result.d.results, 'StartDate')
      setData(groupedby)
    }

    // Load calendar datas from Repository
    loadCalendar()
  }, [repo, sharedcontext.refreshcalendar])

  return (
    <>
      {data.map((element) => {
        return (
          <React.Fragment key={element.id}>
            <List className={classes.root} data-month={format(new Date(element.date), 'MMMM')}>
              <ListItem className={classes.nopadding}>
                <ListItemAvatar className={classes.dayAvatar}>
                  <div>
                    <span className={classes.dayname}>{format(new Date(element.date), 'ddd')}</span>
                    <span className={classes.daynumber}>{format(new Date(element.date), 'd')}</span>
                  </div>
                </ListItemAvatar>
                <div>
                  <EventComponent event={element.event} />
                </div>
              </ListItem>
            </List>
          </React.Fragment>
        )
      })}
      <AddNewEvent />
    </>
  )
}

export default MainPanel
