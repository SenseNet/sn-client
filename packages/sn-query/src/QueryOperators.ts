import { QueryExpression } from "./QueryExpression";
import { QuerySegment } from "./QuerySegment";

/**
 * Class that represents a Query operator
 */
export class QueryOperators<TReturns> extends QuerySegment<TReturns> {

    /**
     * AND Content Query operator
     */
    public get and() {
        this.stringValue = " AND ";
        return this.finialize();
    }

    /**
     * OR Content Query operator
     */
    public get or() {
        this.stringValue = " OR ";
        return this.finialize();
    }

    /**
     * Finializes a Query operator
     */
    protected finialize() {
        this.queryRef.addSegment(this);
        return new QueryExpression(this.queryRef);
    }

}
