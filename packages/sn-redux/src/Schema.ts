import { schema } from 'normalizr';

/**
 * This module is for defining Content and Collection schemas to normalize nested JSON response data in redux state store.
 *
 * Normalizr takes JSON and a schema and replaces nested entities with their IDs, gathering all entities in dictionaries.
 ** Entities can be nested inside other entities, objects and arrays;
 ** Combine entity schemas to express any kind of API response;
 ** Entities with same IDs are automatically merged (with a warning if they differ);
 ** Allows using a custom ID attribute (e.g. slug).
 *
 * Read more about normalizr [here](https://github.com/paularmstrong/normalizr)
 *
 * Since everything is a Content in SenseNet we're working with Content and collection of Content in most of the cases. So the sn-redux Schemas module defines the two
 * neccessarry main schema, content and arrayofContent to work with. This two schemas help you to normalize your JSON responses so that you can create a pure and flexible
 * client-side datasource.
 *
 * Example of normalizing the JSON response of a SenseNet OData Action for fetching Content as arrayOfContent schema which will create a collection object.
 * ```ts
 * export const receiveContent = (response: any, filter: string) =>
 *  ({
 *      type: 'FETCH_CONTENT_SUCCESS',
 *      response: normalize(response.d.results, Schemas.arrayOfContent),
 *      filter
 *  })
 * ```
 *
 * ![Normalized collection](http://download.sensenet.com/aniko/sn7/jsapidocs/img/normalized-collection.png)
 *
 * Example of normalizing the JSON response of a SenseNet OData Action for creating Content as content schema.
 * ```ts
 * export const createContentSuccess = (response: any) =>
 *  ({
 *      type: 'CREATE_CONTENT_SUCCESS',
 *      response: normalize(response.response.d, Schemas.content)
 *  });
 * ```
 *
 * ![Normalized content](http://download.sensenet.com/aniko/sn7/jsapidocs/img/normalized-content.png)
*/
export module Schemas {
    /**
     * Schema of a Content.
     *
     * It represents an item in the collection Object of the sn-redux store. The items are identified by the attribute 'Id'.
     */
    export const content = new schema.Entity('collection', {}, { idAttribute: 'Id' });
    /**
     * Schema of a Collection.
     *
     * It represents the top object of the sn-redux store. It's a parent element of the Content items so it is defined as array of items with the schema content.
     */
    export const arrayOfContent = new schema.Array(content);
}