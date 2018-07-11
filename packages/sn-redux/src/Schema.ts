/**
 * @module  Schema
 * @description This module is for defining Content and Collection schemas to normalize nested JSON response data in redux state store.
 *
 * Normalizr takes JSON and a schema and replaces nested entities with their IDs, gathering all entities in dictionaries.
 * * Entities can be nested inside other entities, objects and arrays;
 * * Combine entity schemas to express any kind of API response;
 * * Entities with same IDs are automatically merged (with a warning if they differ);
 * * Allows using a custom ID attribute (e.g. slug).
 *
 * Read more about normalizr [here](https://github.com/paularmstrong/normalizr)
 *
 * Since everything is a Content in sensenet we're working with Content and collection of Content in most of the cases. So the sn-redux Schemas module defines the two
 * neccessarry main schema, content and arrayofContent to work with. This two schemas help you to normalize your JSON responses so that you can create a pure and flexible
 * client-side datasource.
 *
 * Example of normalizing the JSON response of a SenseNet OData Action for fetching Content as arrayOfContent schema which will create an entities object.
 * ```ts
 * export const requestContent = <T extends IContent = IContent>(path: string, options: IODataParams<T> = {}) => ({
 *  type: 'FETCH_CONTENT',
 *  async payload(repository: Repository) {
 *      const data = await repository.loadCollection({
 *          path,
 *          oDataOptions: options,
 *      })
 *      return normalize(data.d.results, Schemas.arrayOfContent)
 *   },
 * })
 * ```
 */
/**
 */
import { schema } from 'normalizr'

/**
 * Schema of a Content.
 *
 * It represents an item in the entities Object of the sensenet redux store. The items are identified by the attribute 'Id'.
 */
export const contentItem = new schema.Entity('entities', {}, { idAttribute: 'Id' })
/**
 * Schema of a Collection.
 *
 * It represents the ```children``` object of the sensenet redux store. It's a parent element of the Content items so it is defined as array of items with the schema content.
 */
export const arrayOfContent = new schema.Array(contentItem)
