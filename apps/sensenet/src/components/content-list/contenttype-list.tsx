import React, { lazy, useState } from 'react'
import { PATHS } from '../../application-paths'
import { Switch as MuiSwitch } from '@material-ui/core'

const ContentComponent = lazy(() => import(/* webpackChunkName: "content" */ '../content'))

const ContentTypeList: React.FC = () => {
  const [showHiddenTypes, setShowHiddenTypes] = useState(false)
  const renderBeforeGrid = () => {
    return (
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <label htmlFor="showHiddenTypes">Show hidden types</label>
        <MuiSwitch
          data-test="hidden-type-switch"
          size="small"
          checked={showHiddenTypes}
          onChange={() => setShowHiddenTypes(!showHiddenTypes)}
        />
      </div>
    )
  }

  const contentTypeQuery =
    "+TypeIs:'ContentType'" + (!showHiddenTypes ? ' -Categories:*HideByDefault*' : '') + ' .AUTOFILTERS:OFF'

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
