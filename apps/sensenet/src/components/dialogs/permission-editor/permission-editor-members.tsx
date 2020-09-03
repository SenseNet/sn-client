import { reactControlMapper } from '@sensenet/controls-react'
import { GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core'

import clsx from 'clsx'
import React, { createElement, useState } from 'react'
import { useGlobalStyles } from '../../../globalStyles'
import { useLocalization, usePagination } from '../../../hooks'
import { ReferenceList } from '../reference-content-list/reference-list'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    anchor: {
      fontSize: '14px',
      color: theme.palette.primary.main,
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    form: {
      justifyContent: 'space-between',
      padding: '10px 20px',
    },
    listWrapper: {
      padding: '0 30px',
      minHeight: '270px',
    },
    addNewButton: {
      border: 'none !important',
      textDecoration: 'underline',
      textTransform: 'none',
    },
  })
})

export type PermissionEditorMembersProps = {
  items: GenericContent[]
  parent: GenericContent
  fieldName: string
  canEdit: boolean
}

export function PermissionEditorMembers(props: PermissionEditorMembersProps) {
  const [references, setReferences] = useState(props.items)
  const [newReference, setNewReference] = useState<GenericContent>()
  const [requestClearToken, setRequestClearToken] = useState<number>()

  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const repository = useRepository()
  const pagination = usePagination({ items: references, color: 'primary' })
  const controlMapper = reactControlMapper(repository)
  const logger = useLogger('ReferenceContentList')
  const localization = useLocalization()

  const schema = controlMapper.getFullSchemaForContentType(props.parent.Type, 'new')
  const field = schema.fieldMappings.find((fieldMap) => fieldMap.fieldSettings.Name === props.fieldName)

  const fieldControl = createElement(
    controlMapper.getControlForContentField(props.parent.Type, props.fieldName, 'new'),
    {
      repository,
      settings: field!.fieldSettings,
      content: props.parent,
      actionName: 'new',
      fieldOnChange: (_, value: GenericContent) => {
        setNewReference(value)
      },
      triggerClear: requestClearToken,
    },
  )

  const handleAddMembers = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!references.find((reference) => reference.Id === newReference?.Id)) {
      const newReferences = [newReference!, ...references]
      await repository.patch({
        idOrPath: props.parent.Id,
        content: { [props.fieldName]: newReferences.map((ref) => ref.Id) },
        forceRefresh: true,
      })
      setReferences(newReferences)
    } else {
      logger.error({
        message: localization.referenceContentListDialog.errorAlreadyInList,
        data: {
          relatedContent: newReference,
        },
      })
    }
    setNewReference(undefined)
    setRequestClearToken(new Date().getUTCMilliseconds())
    pagination.setCurrentPage(1)
  }

  return (
    <>
      {props.canEdit && (
        <form className={clsx(globalClasses.centeredVertical, classes.form)} onSubmit={handleAddMembers}>
          {fieldControl}
          <Button
            variant="outlined"
            color="primary"
            disabled={!newReference}
            type="submit"
            className={classes.addNewButton}>
            {localization.permissionEditor.addNewMember}
          </Button>
        </form>
      )}

      <div className={classes.listWrapper}>
        <ReferenceList
          pagination={pagination}
          canEdit={props.canEdit}
          references={references}
          setReferences={(refs) => setReferences(refs)}
          parent={props.parent}
          fieldName={props.fieldName}
        />
      </div>
    </>
  )
}
