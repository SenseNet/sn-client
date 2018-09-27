import { FieldSetting, GenericContent, Schema } from '@sensenet/default-content-types'
import { Query, QueryExpression, QueryOperators } from '@sensenet/query'
import * as React from 'react'

/**
 * Callback object for the Advanced Search Fields method
 */
export interface AdvancedSearchOptions<T> {
    /**
     * Updates the aggregated query
     */
    updateQuery: (key: string, query: Query<T>) => void
    /**
     * Returns a field setting based on the provided name
     */
    getFieldSetting: <TFieldSetting extends FieldSetting = FieldSetting>(fieldName: keyof T) => TFieldSetting
    /**
     * Returns the full Schema object
     */
    schema: Schema
}

/**
 * Props object for the Advanced Search component
 */
export interface AdvancedSearchProps<T extends GenericContent> {
    /**
     * Schema that will be used for filling descriptions, placeholders, etc..
     */
    schema: Schema
    /**
     * Callback that will be used to create the Field Components
     */
    fields: (options: AdvancedSearchOptions<T>) => React.ReactElement<any>
    /**
     * Callback that will be triggered when the query changes
     */
    onQueryChanged?: (q: Query<T>) => void
    /**
     * Optional style definitions
     */
    style?: React.CSSProperties
}

/**
 * State object for the Advanced Search component
 */
export interface AdvancedSearchState<T> {
    query: Query<T>
    fieldQueries: Map<string, Query<T>>
}

/**
 * Wrapper component for creating an Advanced Search UI
 */
export class AdvancedSearch<T extends GenericContent = GenericContent> extends React.Component<AdvancedSearchProps<T>, AdvancedSearchState<T>> {

    constructor(props: AdvancedSearchProps<T>) {
        super(props)

        this.updateQuery = this.updateQuery.bind(this)
        this.getFieldSetting = this.getFieldSetting.bind(this)
    }

    /**
     * The Advanced Search State object
     */
    public state = {
        query: new Query((q) => q),
        fieldQueries: new Map<string, Query<T>>(),
    }

    private updateQuery(key: string, newQuery: Query<T>) {
        this.state.fieldQueries.set(key, newQuery)
        const fieldQueryArray = Array.from(this.state.fieldQueries.values())
        const query = new Query((q) => {
            const filteredQueries = fieldQueryArray
                .filter((f) => f.toString().length > 0)

            filteredQueries
                .map((fieldQuery, currentIndex) => {
                    // tslint:disable
                    const queryRef = q['queryRef']
                    new QueryExpression(queryRef).query(fieldQuery)
                    if (currentIndex < filteredQueries.length - 1) {

                        new QueryOperators(queryRef).and
                    }
                    // tslint:enable
                })
            return q
        })
        this.props.onQueryChanged && this.props.onQueryChanged(query)
        this.setState({
            ...this.state,
            query,
        })
    }

    private getFieldSetting<TFieldSetting extends FieldSetting = FieldSetting>(fieldName: keyof T) {
        return this.props.schema.FieldSettings.find((f) => f.Name === fieldName) as TFieldSetting
    }

    /**
     * Creates a derived state from a specified props object
     * @param _newProps The new props
     * @param lastState The last component state
     */
    public static getDerivedStateFromProps<T extends GenericContent>(_newProps: AdvancedSearchProps<T>, lastState: AdvancedSearchState<T>) {
        const query = new Query<T>((q) => q)
        return {
            ...lastState,
            query,
        }
    }

    /**
     * Renders the component
     */
    public render() {
        return <div style={this.props.style}>
            {
                this.props.fields({
                    updateQuery: this.updateQuery,
                    schema: this.props.schema,
                    getFieldSetting: this.getFieldSetting,
                })
            }
        </div>
    }
}
