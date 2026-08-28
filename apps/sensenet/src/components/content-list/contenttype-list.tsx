import { Switch } from '@sensenet/controls-react'
import { useRepository } from '@sensenet/hooks-react'
import React, { lazy, useState } from 'react'
import { GridKeyEnum } from '../../../src/components/grid/enums/GridKey.enum'
import { PATHS } from '../../application-paths'
import { contentTypesColumnDefs } from '../grid/Cols/ColumnDefs.'

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
      <div style={{ marginTop: '12px', marginBottom: '12px' }}>
        <label htmlFor="showHiddenTypes" style={{ marginRight: '10px', paddingLeft: '17px', cursor: 'pointer' }}>
          Show hidden types
        </label>
        <Switch
          id="showHiddenTypes"
          data-test="hidden-type-switch"
          size="medium"
          checked={showHiddenTypes}
          onChange={() => setShowHiddenTypes(!showHiddenTypes)}
        />
      </div>
    )
  }

  const contentTypeQuery = `+TypeIs:'ContentType'${
    isCategoryFieldAvailable && !showHiddenTypes ? ' -Categories:*HideByDefault*' : ''
  } .AUTOFILTERS:OFF`

  return (
    <ContentComponent
      renderBeforeGrid={renderBeforeGrid}
      colDef={contentTypesColumnDefs}
      gridKey={GridKeyEnum.CONTENTTYPES}
      rootPath={PATHS.contentTypes.snPath}
      loadChildrenSettings={{
        select: [
          'DisplayName',
          'Name',
          'Type',
          'Description',
          'ParentTypeName' as any,
          'ModificationDate',
          'ModifiedBy',
        ],
        query: contentTypeQuery,
        inlinecount: 'allpages',
        top: 1000,
      }}
      alwaysRefreshChildren={true}
    />
  )
}

export default ContentTypeList
