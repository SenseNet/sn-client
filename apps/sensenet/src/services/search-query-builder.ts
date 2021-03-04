import { Query, QueryExpression, QueryOperators } from '@sensenet/query'
import { Filters } from '../context/search'

interface CreateSearchQuery {
  term: string
  filters: Filters
}

export const createSearchQuery = ({ term, filters }: CreateSearchQuery) => {
  const query = new Query((q) => q.query((q2) => q2.equals('Name', `*${term}*`).or.equals('DisplayName', `*${term}*`)))

  if (filters.type.type) {
    new QueryOperators(query).and.query((q2) => {
      new QueryExpression(q2.queryRef).typeIs(filters.type.type!)
      return q2
    })
  }

  if (filters.reference.query) {
    new QueryOperators(query).and.query((q2) => {
      new QueryExpression(q2.queryRef).equals(filters.reference.query!, '@@CurrentUser@@')
      return q2
    })
  }

  if (filters.date.query) {
    if (filters.date.name.includes('CustomRange')) {
      if (filters.date.query.from && filters.date.query.to) {
        new QueryOperators(query).and.query((q2) => {
          new QueryExpression(q2.queryRef).between(
            filters.date.query!.field,
            filters.date.query!.from,
            filters.date.query!.to,
          )
          return q2
        })
      } else {
        new QueryOperators(query).and.query((q2) => {
          new QueryExpression(q2.queryRef).equals(filters.date.query!.field, filters.date.query!.value)
          return q2
        })
      }
    } else {
      new QueryOperators(query).and.query((q2) => {
        new QueryExpression(q2.queryRef).greaterThan(filters.date.query!.field, filters.date.query!.value, true)
        return q2
      })
    }
  }

  if (filters.path) {
    new QueryOperators(query).and.query((q2) => {
      new QueryExpression(q2.queryRef).inTree(filters.path!.Path)
      return q2
    })
  }

  return query
}
