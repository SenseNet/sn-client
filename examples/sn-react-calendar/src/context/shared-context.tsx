import Snackbar from '@material-ui/core/Snackbar'
import React, { createContext, Dispatch, SyntheticEvent, useState } from 'react'
import CalendarEvent from '../CalendarEvent-type'
import { EditPropertiesDialog } from '../components/edit-dialog'
import { NewDialog } from '../components/new-dialog'
import CalendarNotification from '../components/notification'
import { DialogComponent } from '../components/view-dialog'

export const SharedContext = createContext<{
  openeditmodal: boolean
  setOpeneditmodal: Dispatch<React.SetStateAction<boolean>>
  opendisplaymodal: boolean
  setOpendisplaymodal: Dispatch<React.SetStateAction<boolean>>
  setEvent: React.Dispatch<React.SetStateAction<CalendarEvent>>
  event: CalendarEvent
  refreshcalendar: boolean
  setRefreshcalendar: Dispatch<React.SetStateAction<boolean>>
  opennewmodal: boolean
  setOpennewmodal: Dispatch<React.SetStateAction<boolean>>
  setOpennoti: Dispatch<React.SetStateAction<boolean>>
}>(null as any)

const SharedProvider: React.FunctionComponent<any> = (props) => {
  const [opennewmodal, setOpennewmodal] = useState(false)
  const [openeditmodal, setOpeneditmodal] = useState(false)
  const [opennoti, setOpennoti] = useState(false)
  const [opendisplaymodal, setOpendisplaymodal] = useState(false)
  const [event, setEvent] = useState<CalendarEvent>(null as any)
  const [refreshcalendar, setRefreshcalendar] = useState(false)

  const handleClose = (_e?: SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpennoti(false)
  }

  return (
    <>
      <SharedContext.Provider
        value={{
          openeditmodal,
          setOpeneditmodal,
          setEvent,
          opendisplaymodal,
          setOpendisplaymodal,
          event,
          refreshcalendar,
          setRefreshcalendar,
          opennewmodal,
          setOpennewmodal,
          setOpennoti,
        }}>
        {props.children}
        {openeditmodal && event != null ? (
          <EditPropertiesDialog
            content={event}
            dialogProps={{
              open: openeditmodal,
              onClose: () => setOpeneditmodal(false),
              keepMounted: false,
            }}
          />
        ) : null}
        {opendisplaymodal && event != null ? (
          <DialogComponent open={opendisplaymodal} content={event} onClose={() => setOpendisplaymodal(false)} />
        ) : null}
        {opennewmodal ? (
          <NewDialog
            parentpath="/Root/Content/IT/Calendar/"
            dialogProps={{
              open: opennewmodal,
              onClose: () => setOpennewmodal(false),
              keepMounted: false,
            }}
          />
        ) : null}
        {opennoti ? (
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={opennoti}
            autoHideDuration={6000}
            onClose={handleClose}>
            <CalendarNotification onClose={handleClose} variant="success" message="Event remove successfully!" />
          </Snackbar>
        ) : null}
      </SharedContext.Provider>
    </>
  )
}
export default SharedProvider
