import React, { lazy, useState } from 'react'
import { PATHS } from '../../application-paths'
import { Switch } from '@sensenet/controls-react'
import { useRepository } from '@sensenet/hooks-react'

const ContentComponent = lazy(() => import(/* webpackChunkName: "content" */ '../content'))

const ContentTypeList: React.FC = () => {
  const repository = useRepository()
  const [showHiddenTypes, setShowHiddenTypes] = useState(false)
  const categoryField = repository.schemas.getFieldTypeByName('Categories')
  const isCategoryFieldAvailable = categoryField !== undefined

  const renderBeforeGrid = () => {
    if (!isCategoryFieldAvailable) {
      return <></>
    }

    return (
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <label htmlFor="showHiddenTypes" style={{ marginRight: '10px' }}>
          Show hidden types
        </label>
        <Switch
          data-test="hidden-type-switch"
          size="medium"
          checked={showHiddenTypes}
          onChange={() => setShowHiddenTypes(!showHiddenTypes)}
        />
      </div>
    )
  }

  const contentTypeQuery =
    "+TypeIs:'ContentType'" +
    (isCategoryFieldAvailable && !showHiddenTypes ? ' -Categories:*HideByDefault*' : '') +
    ' .AUTOFILTERS:OFF'

  return (
    <ContentComponent
      renderBeforeGrid={renderBeforeGrid}
      rootPath={PATHS.contentTypes.snPath}
      fieldsToDisplay={[
        { field: 'DisplayName' },
        { field: 'Name' },
        { field: 'Description' },
        { field: 'ParentTypeName' as any },
        { field: 'ModificationDate' },
        { field: 'ModifiedBy' },
      ]}
      loadChildrenSettings={{
        select: ['DisplayName', 'Name', 'Description', 'ParentTypeName' as any, 'ModificationDate', 'ModifiedBy'],
        query: contentTypeQuery,
        inlinecount: 'allpages',
        top: 1000,
      }}
      hasTree={false}
      alwaysRefreshChildren={true}
    />
  )
}

export default ContentTypeList
