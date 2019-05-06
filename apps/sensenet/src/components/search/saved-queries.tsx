import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'
import { ConstantContent } from '@sensenet/client-core'
import { Query } from '@sensenet/default-content-types'
import React, { useContext, useEffect, useState } from 'react'
import { LocalizationContext, RepositoryContext } from '../../context'

const Search: React.FunctionComponent = () => {
  const repo = useContext(RepositoryContext)
  const localization = useContext(LocalizationContext).values.search

  const [onlyPublic, setOnlyPublic] = useState(false)
  const [queries, setQueries] = useState<Query[]>([])

  console.log(queries)

  useEffect(() => {
    repo
      .executeAction<undefined, { d: { results: Query[] } }>({
        idOrPath: ConstantContent.PORTAL_ROOT.Id,
        name: 'GetQueries',
        method: 'GET',
        oDataOptions: {
          select: ['Query', 'Icon'],
          onlyPublic,
        } as any,
        body: undefined,
      })
      .then(result => setQueries(result.d.results))
  }, [onlyPublic])
  return (
    <div style={{ padding: '1em', margin: '1em', overflow: 'auto' }}>
      <div>
        <Typography variant="h3">{localization.title}</Typography>
        <FormControlLabel
          style={{ marginLeft: '1em' }}
          label={localization.onlyPublic}
          control={<Checkbox onChange={ev => setOnlyPublic(ev.target.checked)} />}
        />
      </div>
      {/* 
      {props.match.params.query ? (
        `Queryke: ${props.match.params.query}`
      ) : (
        <Link to={generatePath(props.match.path, { query: 'alma', repo: repo.configuration.repositoryUrl })}>alma</Link>
      )} */}
    </div>
  )
}

export default Search
