import { Query } from './Query'

/**
 * Represents a query expression segment
 */
export class QuerySegment<TReturns> {
  /**
   * The type of the expression
   */
  public segmentType?: string

  /**
   * Check if value is a template string
   * @param {string} value The String value to be checked
   * @returns {boolean} whether the value is a template string
   */
  protected isTemplateValue(value: string): boolean {
    return new RegExp('^@@.*@@$').test(value)
  }
  /**
   * The String value of the current Query expression
   */
  protected stringValue = ''

  /**
   * A '.SORT' Content Query segment
   * @param {K} field The name of the field
   * @param {boolean} reverse Sort in reverse order, false by default
   */
  public sort<K extends keyof TReturns>(field: K, reverse = false) {
    this.stringValue = ` .${reverse ? 'REVERSESORT' : 'SORT'}:${field}`
    this.segmentType = 'sort'
    return this.finializeSegment()
  }

  /**
   * A '.TOP' Content Query segment
   * @param {number} topCount The TOP item count
   */
  public top(topCount: number) {
    this.stringValue = ` .TOP:${topCount}`
    this.segmentType = 'top'
    return this.finializeSegment()
  }

  /**
   * Adds a '.SKIP' Content Query segment
   * @param {number} skipCount Items to skip
   */

  public skip(skipCount: number) {
    this.stringValue = ` .SKIP:${skipCount}`
    this.segmentType = 'skip'
    return this.finializeSegment()
  }

  /**
   * Adds a '.AUTOFILTERS' Content Query segment
   * @param {string} filterType type of autofilter
   */

  public autofilters(filterType: 'ON' | 'OFF') {
    this.stringValue = ` .AUTOFILTERS:${filterType}`
    this.segmentType = 'autofilters'
    return this.finializeSegment()
  }

  /**
   * Creates a content query segment from a QuerySegment object
   * @returns {string} a segment string value
   */
  public toString() {
    return this.stringValue
  }

  constructor(public readonly queryRef: Query<TReturns>) {}
  /**
   * Finializes the Query segment
   */
  protected finializeSegment(): QuerySegment<TReturns> {
    this.queryRef.addSegment(this)
    return new QuerySegment(this.queryRef)
  }
}
