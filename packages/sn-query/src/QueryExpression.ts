import { Query, QueryBuilder } from './Query'
import { QueryOperators } from './QueryOperators'
import { QuerySegment } from './QuerySegment'

/**
 * Represents a sensenet Content Query expression
 */
export class QueryExpression<TReturns> extends QuerySegment<TReturns> {
  /**
   * Represents an internal query instance. Used for sub-queries or NOT expressions
   */
  public subQuery?: Query<TReturns>

  /**
   * A plain string as Query term
   * @param {string} term The Query term
   * @returns { QueryOperator<TReturns> } The Next query operator (fluent)
   */
  public term(term: string) {
    this.stringValue = term
    this.segmentType = 'term'
    return this.finialize()
  }

  /**
   * Adds an InTree content query expression
   * @param {string | Content } path The path string or content that will be used as a root
   * @returns { QueryOperator<TReturns> } The Next query operator (fluent)
   */
  public inTree(path: string) {
    const pathValue = this.escapeValue(path)
    this.stringValue = `InTree:"${pathValue}"`
    this.segmentType = 'inTree'
    return this.finialize()
  }

  /**
   * Adds an InFolder content query expression
   * @param {string | Content } path The path string or content that will be used as a root
   * @returns { QueryOperator<TReturns> } The Next query operator (fluent)
   */
  public inFolder(path: string) {
    const pathValue = this.escapeValue(path)
    this.stringValue = `InFolder:"${pathValue}"`
    this.segmentType = 'inFolder'
    return this.finialize()
  }

  /**
   * Adds a Type content query expression and casts the rest of the expression to a new type
   * @param { new (...args: any[]) => TNewType } newTypeAssertion The path string or content that will be used as a root
   * @returns { QueryOperator<TNewType> } The Next query operator (fluent)
   */

  public type<TNewType>(newTypeAssertion: new (...args: any[]) => TNewType | { name: string }) {
    this.stringValue = `Type:${newTypeAssertion.name}`
    this.segmentType = 'type'
    return this.finialize<TNewType>()
  }

  /**
   * Adds a TypeIs content query expression and casts the rest of the expression to a new type
   * @param { new (...args: any[]) => TNewType } newTypeAssertion The path string or content that will be used as a root
   * @returns { QueryOperator<TNewType> } The Next query operator (fluent)
   */
  public typeIs<TNewType>(newTypeAssertion: new (...args: any[]) => TNewType) {
    this.stringValue = `TypeIs:${newTypeAssertion.name}`
    this.segmentType = 'typeIs'
    return this.finialize<TNewType>()
  }

  /**
   * Field equality check content query expression (e.g. +FieldName:'value')
   * @param { K } FieldName The name of the Field to be checked
   * @param { TReturns[K] } value The value that will be checked. You can use '?' and '*' wildcards
   * @returns { QueryOperator<TReturns> } The Next query operator (fluent)
   */
  public equals<K extends keyof TReturns>(fieldName: K | '_Text', value: TReturns[K]) {
    this.stringValue = `${fieldName}:'${this.escapeValue(value.toString())}'`
    this.segmentType = 'equals'
    return this.finialize()
  }

  /**
   * Field equality and NOT operator combination. (e.g. +NOT(FieldName:'value'))
   * @param { K } FieldName The name of the Field to be checked
   * @param { TReturns[K] } value The value that will be checked. You can use '?' and '*' wildcards
   * @returns { QueryOperator<TReturns> } The Next query operator (fluent)
   */

  public notEquals<K extends keyof TReturns>(fieldName: K, value: TReturns[K]) {
    this.stringValue = `NOT(${fieldName}:'${this.escapeValue(value.toString())}')`
    this.segmentType = 'notEquals'
    return this.finialize()
  }

  /**
   * Range search query expression
   * @param { K } fieldName he name of the Field to be checked
   * @param { TReturns[K] } minValue The minimum allowed value
   * @param { TReturns[K] } maxValue The maximum allowed value
   * @param { boolean } minimumInclusive Lower limit will be inclusive / exclusive
   * @param { boolean } maximumInclusive Upper limit will be inclusive / exclusive
   */
  public between<K extends keyof TReturns>(
    fieldName: K,
    minValue: TReturns[K],
    maxValue: TReturns[K],
    minimumInclusive: boolean = false,
    maximumInclusive: boolean = false,
  ) {
    this.stringValue = `${fieldName}:${minimumInclusive ? '[' : '{'}'${this.escapeValue(
      minValue.toString(),
    )}' TO '${this.escapeValue(maxValue.toString())}'${maximumInclusive ? ']' : '}'}`
    this.segmentType = 'between'
    return this.finialize()
  }

  /**
   * Greather than query expression (+FieldName:>'value')
   * @param { K } fieldName he name of the Field to be checked
   * @param { TReturns[K] } minValue The minimum allowed value
   * @param { boolean } minimumInclusive Lower limit will be inclusive / exclusive
   */
  public greatherThan<K extends keyof TReturns>(
    fieldName: K,
    minValue: TReturns[K],
    minimumInclusive: boolean = false,
  ) {
    this.stringValue = `${fieldName}:>${minimumInclusive ? '=' : ''}'${this.escapeValue(minValue.toString())}'`
    this.segmentType = 'greatherThan'
    return this.finialize()
  }

  /**
   * Less than query expression (+FieldName:<'value')
   * @param { K } fieldName he name of the Field to be checked
   * @param { TReturns[K] } maxValue The maximum allowed value
   * @param { boolean } maximumInclusive Upper limit will be inclusive / exclusive
   */
  public lessThan<K extends keyof TReturns>(fieldName: K, maxValue: TReturns[K], maximumInclusive: boolean = false) {
    this.stringValue = `${fieldName}:<${maximumInclusive ? '=' : ''}'${this.escapeValue(maxValue.toString())}'`
    this.segmentType = 'lessThan'
    return this.finialize()
  }

  /**
   * A Nested query expression
   * @param {(first: QueryExpression<TReturns>) => QuerySegment<TReturns>)} build The Expression builder method
   */
  public query(build: QueryBuilder<TReturns, TReturns> | Query<TReturns>) {
    this.subQuery = build instanceof Query ? build : new Query(build)
    this.stringValue = `(${this.subQuery.toString()})`

    this.segmentType = 'query'
    return this.finialize()
  }

  /**
   * A Nested NOT query expression
   * @param {(first: QueryExpression<TReturns>) => QuerySegment<TReturns>)} build The Expression builder method
   */
  public not(build: Query<any> | QueryBuilder<TReturns, TReturns>) {
    this.subQuery = build instanceof Query ? build : new Query(build)
    this.stringValue = `NOT(${this.subQuery.toString()})`
    this.segmentType = 'not'
    return this.finialize()
  }

  /**
   * Finializes the Query expression
   */
  protected finialize<TReturnsExtended = TReturns>(): QueryOperators<TReturnsExtended> {
    this.queryRef.addSegment(this)
    return new QueryOperators<TReturnsExtended>(this.queryRef as Query<TReturnsExtended>)
  }
}
