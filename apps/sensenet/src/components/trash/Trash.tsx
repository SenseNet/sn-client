import React from 'react'
import { TrashBin } from '@sensenet/default-content-types'
import { ODataParams } from '@sensenet/client-core'
import { useLoadContent } from '../../hooks/use-loadContent'
import { useDialog } from '../dialogs'
import { SimpleList } from '../content/Simple'
import { useGlobalStyles } from '../../globalStyles'
import TrashHeader from './TrashHeader'

const oDataOptions: ODataParams<TrashBin> = { select: 'all' }

const Trash = React.memo(() => {
  const { openDialog } = useDialog()
  const { content } = useLoadContent<TrashBin>({ idOrPath: '/Root/Trash', oDataOptions })
  const globalClasses = useGlobalStyles()

  return (
    <div className={globalClasses.contentWrapper}>
      {content ? (
        <TrashHeader
          iconClickHandler={() =>
            openDialog({
              name: 'edit',
              props: { contentId: content.Id },
            })
          }
          trash={content}
        />
      ) : null}
      <SimpleList
        parent="/Root/Trash"
        contentListProps={{
          enableBreadcrumbs: false,
          fieldsToDisplay: ['DisplayName', 'ModificationDate', 'ModifiedBy'],
        }}
      />
    </div>
  )
})

export default Trash
