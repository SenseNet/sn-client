import React, { useState } from 'react'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core'
import { ODataResponse } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { useLocalization } from '../../hooks'
import { QueryData } from '../search'
import { useDialog } from './dialog-provider'

export type SaveQueryProps = {
  saveName?: string
  queryData: QueryData
}

export function SaveQuery(props: SaveQueryProps) {
  const repo = useRepository()
  const localization = useLocalization().search
  const { closeLastDialog } = useDialog()
  const logger = useLogger('Search')
  const [saveName, setSaveName] = useState(props.saveName)

  const onClick = async () => {
    try {
      const result = await repo.executeAction<any, ODataResponse<GenericContent>>({
        idOrPath: '/Root/Content', //INFO(Zoli): This is hard coded for now. Wont work with repositories that do not have Root/Content.
        name: 'SaveQuery',
        method: 'POST',
        oDataOptions: {
          select: ['DisplayName', 'Query'],
        },
        body: {
          query: props.queryData.term,
          displayName: saveName,
          queryType: 'Public',
        },
      })
      logger.information({
        message: `Query '${result.d.DisplayName || result.d.Name}' saved`,
        data: { relatedContent: result.d, details: result },
      })
    } catch (error) {
      logger.warning({ message: error.message })
    } finally {
      closeLastDialog()
    }
  }

  return (
    <>
      <DialogTitle>{localization.saveQuery}</DialogTitle>
      <DialogContent style={{ minWidth: 450 }}>
        <TextField
          fullWidth={true}
          defaultValue={localization.saveInputPlaceholder(props.queryData.term)}
          onChange={ev => setSaveName(ev.currentTarget.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeLastDialog}>{localization.cancel}</Button>
        <Button onClick={onClick} color="primary">
          {localization.save}
        </Button>
      </DialogActions>
    </>
  )
}

export default SaveQuery
