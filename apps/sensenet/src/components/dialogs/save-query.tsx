import { Button, DialogActions, DialogContent, TextField } from '@material-ui/core'
import { ODataResponse } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React, { useState } from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { createSearchQuery } from '../../services/search-query-builder'
import { SearchFilters } from '../search'
import { DialogTitle, useDialog } from '.'

export type SaveQueryProps = {
  saveName?: string
  filters: SearchFilters
}

export function SaveQuery(props: SaveQueryProps) {
  const repo = useRepository()
  const localization = useLocalization().search
  const { closeLastDialog } = useDialog()
  const logger = useLogger('Search')
  const [saveName, setSaveName] = useState(props.saveName)
  const globalClasses = useGlobalStyles()

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
          query: createSearchQuery(props.filters).toString(),
          displayName: saveName,
          queryType: 'Public',
          uiFilters: JSON.stringify(props.filters),
        },
      })
      logger.information({
        message: `Query '${result.d.DisplayName || result.d.Name}' saved`,
        data: { relatedContent: result.d, relatedRepository: repo.configuration.repositoryUrl, details: { result } },
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
          defaultValue={localization.saveInputPlaceholder(props.filters.term)}
          onChange={(ev) => setSaveName(ev.currentTarget.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button aria-label={localization.cancel} className={globalClasses.cancelButton} onClick={closeLastDialog}>
          {localization.cancel}
        </Button>
        <Button aria-label={localization.save} color="primary" variant="contained" onClick={onClick}>
          {localization.save}
        </Button>
      </DialogActions>
    </>
  )
}

export default SaveQuery
