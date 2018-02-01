import { QueryExpression } from "./QueryExpression";
import { QuerySegment } from "./QuerySegment";

/**
 * Represents an instance of a Query expression.
 * Usage example:
 * ```ts
 * const query = new Query(q => q.TypeIs(ContentTypes.Task).And.Equals('DisplayName', 'Test'))
 * console.log(query.toString());   // the content query expression
 * ```
 */
export class Query<T> {
    private readonly segments: Array<QuerySegment<T>> = [];

    /**
     * Appends a new QuerySegment to the existing Query
     * @param {QuerySegment<T>} newSegment The Segment to be added
     */
    public addSegment(newSegment: QuerySegment<T> ) {
        this.segments.push(newSegment);
    }

    /**
     * Creates a stringified Content Query from the Query object
     * @returns {String} The Query expression as a sensenet Content Query
     */
    public toString(): string {
        return this.segments.map((s) => s.toString()).join("");
    }

    /**
     * Constructs a Query instance
     * @param build the Query Builder expression
     */
    constructor(build: (first: QueryExpression<any>) => QuerySegment<T>) {
        const firstExpression = new QueryExpression<T>(this);
        build(firstExpression);
    }
}
