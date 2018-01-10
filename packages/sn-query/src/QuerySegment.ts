/**
 * @module Query
 */ /** */

import { Query } from "./Query";

/**
 * Represents a query expression segment
 */
export class QuerySegment<TReturns> {

    /**
     * Escapes a String value (except '?' and '*' characters for wildcards)
     * @param {string} value The String value to be escaped
     * @returns {string} The escaped value
     */
    protected escapeValue(value: string): string {
        return value.replace(/([\!\+\&\|\(\)\[\]\{\}\^\~\:\"])/g, "\\$1");
    }

    /**
     * The String value of the current Query expression
     */
    protected stringValue: string;

    /**
     * A '.SORT' Content Query segment
     * @param {K} field The name of the field
     * @param {boolean} reverse Sort in reverse order, false by default
     */
    public sort<K extends keyof TReturns>(field: K, reverse: boolean = false) {
        this.stringValue = ` .${reverse ? "REVERSESORT" : "SORT"}:'${field}'`;
        return this.finializeSegment();
    }

    /**
     * A '.TOP' Content Query segment
     * @param {number} topCount The TOP item count
     */
    public top(topCount: number) {
        this.stringValue = ` .TOP:${topCount}`;
        return this.finializeSegment();
    }

    /**
     * Adds a '.SKIP' Content Query segment
     * @param {number} skipCount Items to skip
     */

    public skip(skipCount: number) {
        this.stringValue = ` .SKIP:${skipCount}`;
        return this.finializeSegment();
    }

    /**
     * Creates a content query segment from a QuerySegment object
     * @returns {string} a segment string value
     */
    public toString() {
        return this.stringValue;
    }

    constructor(protected readonly queryRef: Query<TReturns>) {

    }

    /**
     * Finializes the Query segment
     */
    protected finializeSegment(): QuerySegment<TReturns> {
        this.queryRef.addSegment(this);
        return new QuerySegment(this.queryRef);
    }

}
